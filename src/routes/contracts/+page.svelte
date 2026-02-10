<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import { Plus, Search, FileText, ChevronRight } from 'lucide-svelte';
	import { base } from '$app/paths';

	// Local imports
	import { db } from '$lib/db';
	import { categoryGroups, getCategoryGroupName } from '$lib/data/categories';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { t, locale, getLocaleCode } from '$lib/stores/i18n';
	import { formatCurrency } from '$lib/utils/currency';
	import { currency } from '$lib/stores/currency';
	import { globalSearchQuery } from '$lib/stores/search';

	// Types
	import type { Contract } from '$lib/db';

	// State
	let contracts: Contract[] = [];
	let filteredContracts: Contract[] = [];
	let selectedCategoryGroup = 'all';
	let categoryScrollElement: HTMLDivElement | null = null;
	let showCategoryScrollHint = false;

	function withBase(path: string): string {
		if (path === '/') return base || '/';
		return `${base}${path}`;
	}

	// Reactive declarations
	$: currencyValue = $currency; // Subscribe to currency changes
	$: if ($globalSearchQuery || selectedCategoryGroup) {
		filterContracts();
	}

	// Functions
	function filterContracts() {
		filteredContracts = contracts.filter((c) => {
			const matchesSearch =
				$globalSearchQuery === '' ||
				c.name.toLowerCase().includes($globalSearchQuery.toLowerCase()) ||
				c.provider.toLowerCase().includes($globalSearchQuery.toLowerCase());

			const matchesCategory =
				selectedCategoryGroup === 'all' ||
				categoryGroups
					.find((g) => g.id === selectedCategoryGroup)
					?.categories.some((cat) => cat.id === c.category);

			return matchesSearch && matchesCategory;
		});
	}

	function formatDate(date: Date | string): string {
		return new Intl.DateTimeFormat(getLocaleCode($locale), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(new Date(date));
	}

	function updateCategoryScrollHint(): void {
		if (!categoryScrollElement) {
			showCategoryScrollHint = false;
			return;
		}

		const remainingScroll =
			categoryScrollElement.scrollWidth -
			(categoryScrollElement.scrollLeft + categoryScrollElement.clientWidth);
		showCategoryScrollHint = remainingScroll > 2;
	}

	// Lifecycle
	onMount(() => {
		const subscription = liveQuery(() => db.contracts.toArray()).subscribe((result) => {
			contracts = result || [];
			filterContracts();
		});

		const animationFrameId = requestAnimationFrame(updateCategoryScrollHint);
		window.addEventListener('resize', updateCategoryScrollHint);

		return () => {
			subscription.unsubscribe();
			window.removeEventListener('resize', updateCategoryScrollHint);
			cancelAnimationFrame(animationFrameId);
		};
	});

</script>

<div class="p-4 space-y-4">
	<!-- Header -->
	<header class="pt-4">
		<h1 class="text-2xl font-semibold text-foreground">{$t('nav.contracts')}</h1>
		<p class="text-secondary mt-1">{contracts.length} {$t('dashboard.contracts')}</p>
	</header>

	<!-- Search & Filter -->
	<div class="space-y-3">
		<div class="relative md:hidden">
			<Search class="absolute left-4 top-3 text-muted" size={20} />
			<input
				type="text"
				bind:value={$globalSearchQuery}
				placeholder={$t('contract.searchPlaceholder')}
				class="input w-full pl-11"
			/>
		</div>

		<div class="relative">
			<div
				bind:this={categoryScrollElement}
				on:scroll={updateCategoryScrollHint}
				class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 pr-10 md:mx-0 md:px-0 md:pr-10"
			>
				<button
					class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors {selectedCategoryGroup ===
					'all'
						? 'bg-accent text-white'
						: 'bg-slate-100 text-foreground'}"
					on:click={() => (selectedCategoryGroup = 'all')}
				>
					{$t('common.all')}
				</button>
				{#each categoryGroups as group (group.id)}
					<button
						class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors {selectedCategoryGroup ===
						group.id
							? 'bg-accent text-white'
							: 'bg-slate-100 text-foreground'}"
						on:click={() => (selectedCategoryGroup = group.id)}
					>
						{getCategoryGroupName(group.id, $t)}
					</button>
				{/each}
			</div>
			{#if showCategoryScrollHint}
				<div
					class="pointer-events-none absolute right-0 top-0 bottom-2 flex w-12 items-center justify-end bg-gradient-to-l from-slate-100/95 to-transparent pr-2"
					aria-hidden="true"
				>
					<ChevronRight size={16} class="text-muted" />
				</div>
			{/if}
		</div>
	</div>

	<!-- Contracts List -->
	{#if filteredContracts.length > 0}
		<div class="space-y-3 pb-6">
			{#each filteredContracts as contract (contract.id)}
				<a href={withBase(`/contracts/${contract.id}`)} class="card block hover:shadow-lg transition-shadow">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<CategoryIcon category={contract.category} size="lg" />
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-medium text-foreground truncate">{contract.name}</h3>
							<div
								class="mt-1 flex items-center"
								class:gap-2={Boolean(contract.provider?.trim())}
							>
								{#if contract.provider?.trim()}
									<p class="text-sm text-secondary">{contract.provider}</p>
								{/if}
								<StatusBadge status={contract.status || 'aktiv'} size="sm" />
							</div>
							{#if contract.cancellationDate}
								<p class="text-xs text-warning mt-1">
									{$t('contract.cancellationDate')}: {formatDate(contract.cancellationDate)}
								</p>
							{/if}
						</div>
						<div class="text-right flex-shrink-0">
							<div class="font-semibold text-foreground tabular-nums">
								{formatCurrency(contract.billingCost !== undefined ? contract.billingCost : contract.monthlyCost, currencyValue)}
							</div>
							<div class="text-xs text-muted">
								{#if contract.billingPeriod && contract.billingPeriod !== 'monthly'}
									/ {$t(`contract.billingPeriod_${contract.billingPeriod}`)}
								{:else}
									{$t('common.perMonth')}
								{/if}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else if $globalSearchQuery || selectedCategoryGroup !== 'all'}
		<div class="card text-center py-12">
			<div class="flex justify-center mb-4">
				<div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
					<Search size={32} class="text-muted" />
				</div>
			</div>
			<h3 class="font-medium text-foreground mb-2">{$t('contract.noContractsFound')}</h3>
			<p class="text-sm text-secondary">
				{$t('contract.noContractsFoundDesc')}
			</p>
		</div>
	{:else}
		<div class="card text-center py-12 mt-8">
			<div class="flex justify-center mb-6">
				<div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
					<FileText size={40} class="text-muted" />
				</div>
			</div>
			<h3 class="text-xl font-semibold mb-3">{$t('contract.noContracts')}</h3>
			<p class="text-secondary mb-8 max-w-sm mx-auto px-4">
				{$t('contract.noContractsDesc')}
			</p>
			<a href={withBase('/contracts/new')} class="btn-primary inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto">
				<Plus size={20} />
				{$t('contract.add')}
			</a>
		</div>
	{/if}

</div>
