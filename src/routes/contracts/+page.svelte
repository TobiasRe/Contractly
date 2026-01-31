<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import { Plus, Search, FileText } from 'lucide-svelte';

	// Local imports
	import { db } from '$lib/db';
	import { categoryGroups, getCategoryGroupName } from '$lib/data/categories';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { t, locale, getLocaleCode } from '$lib/stores/i18n';
	import { formatCurrency } from '$lib/utils/currency';
	import { currency } from '$lib/stores/currency';

	// Types
	import type { Contract } from '$lib/db';

	// State
	let contracts: Contract[] = [];
	let filteredContracts: Contract[] = [];
	let searchQuery = '';
	let selectedCategoryGroup = 'all';

	// Reactive declarations
	$: currencyValue = $currency; // Subscribe to currency changes
	$: if (searchQuery || selectedCategoryGroup) {
		filterContracts();
	}

	// Functions
	function filterContracts() {
		filteredContracts = contracts.filter((c) => {
			const matchesSearch =
				searchQuery === '' ||
				c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.provider.toLowerCase().includes(searchQuery.toLowerCase());

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

	// Lifecycle
	onMount(() => {
		const subscription = liveQuery(() => db.contracts.toArray()).subscribe((result) => {
			contracts = result || [];
			filterContracts();
		});

		return () => subscription.unsubscribe();
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
		<div class="relative">
			<Search class="absolute left-4 top-3 text-muted" size={20} />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={$t('contract.searchPlaceholder')}
				class="input w-full pl-11"
			/>
		</div>

		<div class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
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
	</div>

	<!-- Contracts List -->
	{#if filteredContracts.length > 0}
		<div class="space-y-3 pb-6">
			{#each filteredContracts as contract (contract.id)}
				<a href="/contracts/{contract.id}" class="card block hover:shadow-lg transition-shadow">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<CategoryIcon category={contract.category} size="lg" />
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-medium text-foreground truncate">{contract.name}</h3>
							<div class="flex items-center gap-2 mt-1">
								<p class="text-sm text-secondary">{contract.provider}</p>
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
	{:else if searchQuery || selectedCategoryGroup !== 'all'}
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
			<a href="/contracts/new" class="btn-primary inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto">
				<Plus size={20} />
				{$t('contract.add')}
			</a>
		</div>
	{/if}

	<!-- Floating Add Button -->
	<a
		href="/contracts/new"
		class="fixed bottom-20 right-4 w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
	>
		<Plus size={24} />
	</a>
</div>
