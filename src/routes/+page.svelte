<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { Plus, AlertCircle, FileText } from 'lucide-svelte';
	import { liveQuery } from 'dexie';

	// Local imports
	import { db } from '$lib/db';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import CurrencyIcon from '$lib/components/CurrencyIcon.svelte';
	import { t, locale, getLocaleCode } from '$lib/stores/i18n';
	import { formatCurrency } from '$lib/utils/currency';
	import { currency } from '$lib/stores/currency';

	// Types
	import type { Contract } from '$lib/db';

	// State
	let totalMonthly = 0;
	let contractCount = 0;
	let upcomingContracts: Contract[] = [];

	// Reactive declarations
	$: formattedTotal = formatCurrency(totalMonthly, $currency);

	// Functions
	function formatDate(date: Date | string): string {
		return new Intl.DateTimeFormat(getLocaleCode($locale), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(new Date(date));
	}

	// Lifecycle
	onMount(() => {
		// Subscribe to contracts
		const subscription = liveQuery(async () => {
			const contracts = await db.contracts.toArray();
			contractCount = contracts.length;
			totalMonthly = contracts.reduce((sum, c) => sum + c.monthlyCost, 0);

			// Find contracts ending soon
			const now = new Date();
			const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

			upcomingContracts = contracts
				.filter((c) => {
					if (!c.cancellationDate) return false;
					const cancelDate = new Date(c.cancellationDate);
					return cancelDate >= now && cancelDate <= threeMonthsLater;
				})
				.sort((a, b) => {
					return new Date(a.cancellationDate!).getTime() - new Date(b.cancellationDate!).getTime();
				})
				.slice(0, 5);

			return { totalMonthly, contractCount, upcomingContracts };
		}).subscribe((result) => {
			if (result) {
				totalMonthly = result.totalMonthly;
				contractCount = result.contractCount;
				upcomingContracts = result.upcomingContracts;
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="p-4 space-y-6">
	<!-- Header -->
	<header class="pt-4">
		<h1 class="text-2xl font-semibold text-foreground">{$t('app.title')}</h1>
		<p class="text-secondary mt-1">{$t('dashboard.subtitle')}</p>
	</header>

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 gap-4">
		<div class="card">
			<div class="flex items-center gap-2 text-muted mb-2">
				<CurrencyIcon size={16} />
				<span class="text-sm">{$t('dashboard.totalMonthly')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums">
				{formattedTotal}
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-2 text-muted mb-2">
				<FileText size={16} />
				<span class="text-sm">{$t('dashboard.contracts')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums">{contractCount}</div>
		</div>
	</div>

	<!-- Upcoming Cancellations -->
	{#if upcomingContracts.length > 0}
		<section>
			<h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
				<AlertCircle size={20} class="text-warning" />
				{$t('dashboard.upcomingDeadlines')}
			</h2>
			<div class="space-y-3">
				{#each upcomingContracts as contract (contract.id)}
					<a href="/contracts/{contract.id}" class="card block hover:shadow-lg transition-shadow">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<h3 class="font-medium text-foreground">{contract.name}</h3>
								<div class="flex items-center gap-2 mt-1">
									<p class="text-sm text-secondary">{contract.provider}</p>
									<StatusBadge status={contract.status || 'aktiv'} size="sm" />
								</div>
							</div>
							<div class="text-right flex-shrink-0">
								<div class="font-semibold text-warning text-sm">
									{formatDate(contract.cancellationDate)}
								</div>
								<div class="text-sm text-muted">{$t('contract.cancellationDate')}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{:else if contractCount > 0}
		<div class="card text-center py-8">
			<p class="text-secondary">{$t('dashboard.noUpcomingDeadlines')}</p>
		</div>
	{/if}

	<!-- Add Contract Button -->
	<a
		href="/contracts/new"
		class="fixed bottom-20 right-4 w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
	>
		<Plus size={24} />
	</a>

	<!-- Empty State -->
	{#if contractCount === 0}
		<div class="card text-center py-12 mt-8">
			<div class="flex justify-center mb-6">
				<div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
					<FileText size={40} class="text-muted" />
				</div>
			</div>
			<h3 class="text-xl font-semibold mb-3">{$t('dashboard.noContractsYet')}</h3>
			<p class="text-secondary mb-8 max-w-sm mx-auto px-4">
				{$t('dashboard.noContractsDesc')}
			</p>
			<a href="/contracts/new" class="btn-primary inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto">
				<Plus size={20} />
				{$t('contract.add')}
			</a>
		</div>
	{/if}
</div>
