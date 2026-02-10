<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { Plus, AlertCircle, FileText, Sparkles, FilePlus2, BellRing, Download, ArrowRight } from 'lucide-svelte';
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
	let contractsWithoutDeadline = 0;
	const onboardingSteps = [
		{
			icon: FilePlus2,
			titleKey: 'dashboard.onboardingStepAddTitle',
			descriptionKey: 'dashboard.onboardingStepAddDesc',
			href: '/contracts/new'
		},
		{
			icon: BellRing,
			titleKey: 'dashboard.onboardingStepNotifyTitle',
			descriptionKey: 'dashboard.onboardingStepNotifyDesc',
			href: '/settings'
		},
		{
			icon: Download,
			titleKey: 'dashboard.onboardingStepBackupTitle',
			descriptionKey: 'dashboard.onboardingStepBackupDesc',
			href: '/settings'
		}
	];

	// Reactive declarations
	$: formattedTotal = formatCurrency(totalMonthly, $currency);
	$: stableContractsRatio = contractCount > 0 ? (contractsWithoutDeadline / contractCount) * 100 : 0;
	$: upcomingRatio = contractCount > 0 ? (upcomingContracts.length / contractCount) * 100 : 0;

	// Functions
	function formatDate(date: Date | string): string {
		return new Intl.DateTimeFormat(getLocaleCode($locale), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(new Date(date));
	}

	function formatCancellationDate(contract: Contract): string {
		// cancellationDate is guaranteed in the upcoming list filter.
		return formatDate(contract.cancellationDate as Date | string);
	}

	function getDeadlineUrgency(contract: Contract): number {
		const cancellationDate = new Date(contract.cancellationDate as Date | string);
		const daysLeft = Math.ceil((cancellationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
		const normalized = ((90 - daysLeft) / 90) * 100;
		return Math.max(8, Math.min(100, normalized));
	}

	// Lifecycle
	onMount(() => {
		// Subscribe to contracts
		const subscription = liveQuery(async () => {
			const contracts = await db.contracts.toArray();
			contractCount = contracts.length;
			totalMonthly = contracts.reduce((sum, c) => sum + c.monthlyCost, 0);
			contractsWithoutDeadline = contracts.filter((c) => !c.cancellationDate).length;

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

			return { totalMonthly, contractCount, upcomingContracts, contractsWithoutDeadline };
		}).subscribe((result) => {
			if (result) {
				totalMonthly = result.totalMonthly;
				contractCount = result.contractCount;
				upcomingContracts = result.upcomingContracts;
				contractsWithoutDeadline = result.contractsWithoutDeadline;
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="dashboard-shell p-4 space-y-6">
	<!-- Header -->
	<header class="dashboard-hero pt-4">
		<div class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-accent shadow-subtle">
			<Sparkles size={14} />
			{$t('dashboard.title')}
		</div>
		<h1 class="text-2xl font-semibold text-foreground mt-3">{$t('app.title')}</h1>
		<p class="text-secondary mt-1 max-w-xs">{$t('dashboard.subtitle')}</p>
	</header>

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 gap-4">
		<div class="card stat-tile stat-tile-primary">
			<div class="flex items-center justify-between text-muted mb-3">
				<span class="stat-icon-chip">
					<CurrencyIcon size={16} />
				</span>
				<span class="text-sm">{$t('dashboard.totalMonthly')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums tracking-tight">
				{formattedTotal}
			</div>
			<div class="metric-bar mt-4">
				<span class="metric-fill metric-fill-primary" style="width: {stableContractsRatio}%"></span>
			</div>
		</div>

		<div class="card stat-tile">
			<div class="flex items-center justify-between text-muted mb-3">
				<span class="stat-icon-chip">
					<FileText size={16} />
				</span>
				<span class="text-sm">{$t('dashboard.contracts')}</span>
			</div>
			<div class="text-2xl font-semibold tabular-nums tracking-tight">{contractCount}</div>
			<div class="metric-bar mt-4">
				<span class="metric-fill metric-fill-warning" style="width: {upcomingRatio}%"></span>
			</div>
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
					<a href="/contracts/{contract.id}" class="card deadline-card block">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<h3 class="font-medium text-foreground">{contract.name}</h3>
								<div class="flex items-center gap-2 mt-1">
									<p class="text-sm text-secondary">{contract.provider}</p>
									<StatusBadge status={contract.status || 'aktiv'} size="sm" />
								</div>
							</div>
							<div class="text-right flex-shrink-0">
								<div class="deadline-date-pill">
									{formatCancellationDate(contract)}
								</div>
								<div class="text-sm text-muted">{$t('contract.cancellationDate')}</div>
							</div>
						</div>
						<div class="metric-bar mt-3">
							<span
								class="metric-fill metric-fill-warning"
								style="width: {getDeadlineUrgency(contract)}%"
							></span>
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

	<!-- Empty State -->
	{#if contractCount === 0}
		<section class="card onboarding-shell text-center py-10 mt-8 overflow-hidden">
			<div class="relative">
				<div class="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-accent ring-8 ring-white/70">
					<Sparkles size={38} />
				</div>
				<div class="pointer-events-none absolute -left-16 -top-8 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl"></div>
				<div class="pointer-events-none absolute -right-20 top-10 h-36 w-36 rounded-full bg-amber-100/70 blur-2xl"></div>
			</div>
			<h3 class="text-xl font-semibold mb-2">{$t('dashboard.onboardingTitle')}</h3>
			<p class="text-secondary mb-6 max-w-sm mx-auto px-2">
				{$t('dashboard.onboardingSubtitle')}
			</p>

			<div class="space-y-3 mb-7 text-left max-w-lg mx-auto">
				{#each onboardingSteps as step}
					<a href={step.href} class="onboarding-step group">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent">
							<svelte:component this={step.icon} size={18} />
						</div>
						<div class="min-w-0">
							<h4 class="text-sm font-semibold text-foreground">{$t(step.titleKey)}</h4>
							<p class="text-xs text-secondary">{$t(step.descriptionKey)}</p>
						</div>
						<div class="ml-auto text-accent opacity-70 group-hover:opacity-100 transition-opacity">
							<ArrowRight size={16} />
						</div>
					</a>
				{/each}
			</div>

			<a href="/contracts/new" class="btn-primary inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto shadow-subtle">
				<Plus size={20} />
				{$t('dashboard.onboardingPrimaryCta')}
			</a>
		</section>
	{/if}
</div>
