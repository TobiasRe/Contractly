<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import { TrendingUp, Calendar, Plus } from 'lucide-svelte';
	import { base } from '$app/paths';

	// Local imports
	import { db } from '$lib/db';
	import { getCategoryGroup, getCategoryGroupName } from '$lib/data/categories';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import CurrencyIcon from '$lib/components/CurrencyIcon.svelte';
	import { t, locale, getLocaleCode } from '$lib/stores/i18n';
	import { formatDate as formatDateUtil } from '$lib/utils/date';
	import { currency } from '$lib/stores/currency';

	// Types
	import type { Contract, ContractStatus } from '$lib/db';

	// Computed values
	const currentYear = new Date().getFullYear();

	// State
	let contracts: Contract[] = [];
	let statusFilter: ContractStatus | 'all' = 'all';
	let totalMonthly = 0;
	let totalYearly = 0;
	let categoryStats: { group: string; total: number; count: number; color: string }[] = [];
	let topContracts: Contract[] = [];
	let upcomingDeadlines: Contract[] = [];
	let selectedYear = currentYear;
	let yearTotal = 0;
	let availableYears: number[] = [];

	function withBase(path: string): string {
		if (path === '/') return base || '/';
		return `${base}${path}`;
	}

	// Reactive declarations
	$: currentCurrency = $currency;
	$: currentLocale = $locale;

	// Functions
	function formatCurrencyReactive(amount: number): string {
		const formatLocale = getLocaleCode(currentLocale);
		return new Intl.NumberFormat(formatLocale, {
			style: 'currency',
			currency: currentCurrency
		}).format(amount);
	}

	// Reactive statements
	$: if (currentCurrency || currentLocale || statusFilter || selectedYear || contracts.length) {
		calculateStats();
	}

	function calculateStats() {
		// Filter contracts by status
		const filteredContracts = statusFilter === 'all' 
			? contracts 
			: contracts.filter(c => (c.status || 'aktiv') === statusFilter);

		// Calculate totals
		totalMonthly = filteredContracts.reduce((sum, c) => sum + c.monthlyCost, 0);
		totalYearly = totalMonthly * 12;

		// Generate available years from all contracts
		const yearsSet = new Set<number>();
		for (const contract of contracts) {
			const startYear = new Date(contract.startDate).getFullYear();
			const endYear = contract.endDate ? new Date(contract.endDate).getFullYear() : currentYear;
			
			// Add all years between start and end
			for (let year = startYear; year <= endYear; year++) {
				yearsSet.add(year);
			}
		}
		availableYears = Array.from(yearsSet).sort((a, b) => b - a); // Sort descending

		// Calculate total for selected year
		yearTotal = calculateYearTotal(filteredContracts, selectedYear);

		// Group by category group
		const groupMap = new Map<string, { total: number; count: number }>();
		for (const contract of filteredContracts) {
			const group = getCategoryGroup(contract.category);
			if (group) {
				// Use group ID as key for consistency
				const existing = groupMap.get(group.id) || { total: 0, count: 0 };
				groupMap.set(group.id, {
					total: existing.total + contract.monthlyCost,
					count: existing.count + 1
				});
			}
		}

		categoryStats = Array.from(groupMap.entries())
			.map(([groupId, data]) => ({
				group: getCategoryGroupName(groupId, $t),
				total: data.total,
				count: data.count,
				color: 'blue-500'
			}))
			.sort((a, b) => b.total - a.total);

		// Top 5 expensive contracts
		topContracts = [...filteredContracts].sort((a, b) => b.monthlyCost - a.monthlyCost).slice(0, 5);

		// Upcoming deadlines
		const now2 = new Date();
		const threeMonthsLater = new Date(now2.getTime() + 90 * 24 * 60 * 60 * 1000);
		upcomingDeadlines = filteredContracts
			.filter((c) => {
				if (!c.cancellationDate) return false;
				const cancelDate = new Date(c.cancellationDate);
				return cancelDate >= now2 && cancelDate <= threeMonthsLater;
			})
			.sort((a, b) => {
				return new Date(a.cancellationDate).getTime() - new Date(b.cancellationDate).getTime();
			})
			.slice(0, 5);
	}

	function calculateYearTotal(contracts: Contract[], year: number): number {
		let total = 0;
		
		for (const contract of contracts) {
			const startYear = new Date(contract.startDate).getFullYear();
			const endYear = contract.endDate ? new Date(contract.endDate).getFullYear() : currentYear;
			
			// Check if contract was active in the given year
			if (startYear <= year && endYear >= year) {
				// Calculate months active in the year
				const startMonth = startYear === year ? new Date(contract.startDate).getMonth() : 0;
				const endMonth = endYear === year && contract.endDate ? new Date(contract.endDate).getMonth() : 11;
				const monthsActive = endMonth - startMonth + 1;
				total += (contract.monthlyCost * monthsActive);
			}
		}
		
		return total;
	}


	function formatDate(date: Date | string): string {
		return formatDateUtil(date);
	}

	function getPercentage(amount: number): number {
		if (totalMonthly === 0) return 0;
		return (amount / totalMonthly) * 100;
	}

	// Lifecycle
	onMount(() => {
		const subscription = liveQuery(() => db.contracts.toArray()).subscribe((result) => {
			contracts = result || [];
			calculateStats();
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="p-4 space-y-6">
	<!-- Header -->
	<header class="pt-4">
		<h1 class="text-2xl font-semibold text-foreground">{$t('stats.title')}</h1>
		<p class="text-secondary mt-1">{$t('stats.subtitle')}</p>
	</header>

	<!-- Status Filter -->
	<div class="flex gap-2 overflow-x-auto pb-2">
		<button
			class="glass-toggle {statusFilter === 'all' ? 'glass-toggle-active' : 'text-foreground'}"
			on:click={() => (statusFilter = 'all')}
		>
			{$t('common.all')}
		</button>
		<button
			class="glass-toggle {statusFilter === 'aktiv' ? 'glass-toggle-active' : 'text-foreground'}"
			on:click={() => (statusFilter = 'aktiv')}
		>
			{$t('contract.statusAktiv')}
		</button>
		<button
			class="glass-toggle {statusFilter === 'gekündigt' ? 'glass-toggle-active' : 'text-foreground'}"
			on:click={() => (statusFilter = 'gekündigt')}
		>
			{$t('contract.statusGekündigt')}
		</button>
		<button
			class="glass-toggle {statusFilter === 'beendet' ? 'glass-toggle-active' : 'text-foreground'}"
			on:click={() => (statusFilter = 'beendet')}
		>
			{$t('contract.statusBeendet')}
		</button>
	</div>

	<!-- Total Stats -->
	<div class="grid grid-cols-2 gap-4">
		<div class="card">
			<div class="flex items-center gap-2 text-muted mb-2">
				<CurrencyIcon size={16} />
				<span class="text-sm">{$t('stats.monthlyTotal')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums">{formatCurrencyReactive(totalMonthly)}</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-2 text-muted mb-2">
				<TrendingUp size={16} />
				<span class="text-sm">{$t('stats.yearlyTotal')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums">{formatCurrencyReactive(totalYearly)}</div>
		</div>
	</div>

	<!-- Year Filter -->
	{#if availableYears.length > 0}
		<section class="card">
			<h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
				<Calendar size={20} />
				{$t('stats.yearFilter')}
			</h2>
			<div class="flex gap-2 overflow-x-auto pb-2 mb-4">
				{#each availableYears as year (year)}
					<button
						class="glass-toggle {selectedYear === year ? 'glass-toggle-active' : 'text-foreground'}"
						on:click={() => (selectedYear = year)}
					>
						{year}
					</button>
				{/each}
			</div>
			<div class="card bg-white/30">
				<div class="flex items-center gap-2 text-muted mb-2">
					<CurrencyIcon size={16} />
					<span class="text-sm">{$t('stats.totalForYear')} {selectedYear}</span>
				</div>
				<div class="text-2xl font-semibold tabular-nums">{formatCurrencyReactive(yearTotal)}</div>
			</div>
		</section>
	{/if}

	<!-- Category Breakdown -->
	{#if categoryStats.length > 0}
		<section class="card">
			<h2 class="text-lg font-semibold mb-4">{$t('stats.byCategory')}</h2>
			<div class="space-y-4">
				{#each categoryStats as stat (stat.group)}
					<div>
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm font-medium">{stat.group}</span>
							<span class="text-sm text-secondary">
								{formatCurrencyReactive(stat.total)} ({stat.count})
							</span>
						</div>
						<div class="w-full bg-slate-100 rounded-full h-2">
							<div
								class="bg-accent rounded-full h-2 transition-all"
								style="width: {getPercentage(stat.total)}%"
							/>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Top 5 Expensive -->
	{#if topContracts.length > 0}
		<section>
			<h2 class="text-lg font-semibold mb-3">{$t('stats.topExpensive')}</h2>
			<div class="space-y-2">
				{#each topContracts as contract (contract.id)}
					<a href={withBase(`/contracts/${contract.id}`)} class="card flex items-center gap-4 hover:shadow-lg transition-shadow">
						<div class="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm font-semibold">
							{topContracts.indexOf(contract) + 1}
						</div>
						<CategoryIcon category={contract.category} size="sm" />
						<div class="flex-1 min-w-0">
							<div class="font-medium truncate">{contract.name}</div>
							<div class="flex items-center gap-2 mt-1">
								<div class="text-sm text-secondary">{contract.provider}</div>
								<StatusBadge status={contract.status || 'aktiv'} size="sm" />
							</div>
						</div>
						<div class="font-semibold tabular-nums flex-shrink-0">{formatCurrencyReactive(contract.monthlyCost)}</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Upcoming Deadlines -->
	{#if upcomingDeadlines.length > 0}
		<section>
			<h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
				<Calendar size={20} />
				{$t('stats.upcomingDeadlines')}
			</h2>
			<div class="space-y-2">
				{#each upcomingDeadlines as contract (contract.id)}
					<a href={withBase(`/contracts/${contract.id}`)} class="card hover:shadow-lg transition-shadow">
						<div class="flex justify-between items-start">
							<div class="flex items-center gap-3">
								<CategoryIcon category={contract.category} size="sm" />
								<div>
									<div class="font-medium">{contract.name}</div>
									<div class="flex items-center gap-2 mt-1">
										<div class="text-sm text-secondary">{contract.provider}</div>
										<StatusBadge status={contract.status || 'aktiv'} size="sm" />
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="font-semibold text-warning text-sm">
									{formatDate(contract.cancellationDate)}
								</div>
								<div class="text-xs text-muted">{$t('contract.cancellationDate')}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if contracts.length === 0}
				<div class="card mt-8 py-12 text-center">
			<div class="flex justify-center mb-6">
				<div class="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-white/55 backdrop-blur-md">
					<TrendingUp size={40} class="text-muted" />
				</div>
			</div>
			<h3 class="text-xl font-semibold mb-3">{$t('stats.noStats')}</h3>
			<p class="text-secondary mb-8 max-w-sm mx-auto px-4">
				{$t('stats.noStatsDesc')}
			</p>
			<a href={withBase('/contracts/new')} class="btn-primary inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto">
				<Plus size={20} />
				{$t('contract.add')}
			</a>
		</div>
	{/if}
</div>
