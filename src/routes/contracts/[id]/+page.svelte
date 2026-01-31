<script lang="ts">
	// External imports
	import {
		ChevronLeft,
		Edit,
		Trash2,
		Calendar,
		FileText,
		AlertCircle,
		CreditCard
	} from 'lucide-svelte';

	// Local imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { db } from '$lib/db';
	import { getCategoryConfig, getCategoryName } from '$lib/data/categories';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import CurrencyIcon from '$lib/components/CurrencyIcon.svelte';
	import { t, locale, getLocaleCode } from '$lib/stores/i18n';
	import { formatCurrency } from '$lib/utils/currency';
	import { formatDate as formatDateUtil } from '$lib/utils/date';
	import { currency } from '$lib/stores/currency';

	// Types
	import type { Contract } from '$lib/db';

	// Reactive declarations
	$: contractId = $page.params.id;
	$: currencyValue = $currency;

	// State
	let contract: Contract | null = null;
	let loading = true;

	// Functions
	async function loadContract() {
		loading = true;
		try {
			// Convert string ID from URL to number for Dexie query
			const id = Number(contractId);
			if (isNaN(id)) {
				contract = null;
				return;
			}
			const c = await db.contracts.get(id);
			contract = c || null;
		} catch (error) {
			console.error('Error loading contract:', error);
			contract = null;
		} finally {
			loading = false;
		}
	}

	async function deleteContract() {
		if (!contract) return;
		if (!confirm(`${$t('contract.delete')} "${contract.name}" ${$t('contract.deleteConfirm')}`)) return;

		try {
			// Convert string ID from URL to number for Dexie query
			const id = Number(contractId);
			if (!isNaN(id)) {
				await db.contracts.delete(id);
			}
			goto('/contracts');
		} catch (error) {
			console.error('Error deleting contract:', error);
			alert($t('contract.errorDeleting'));
		}
	}

	function formatDate(date: Date | string | undefined): string {
		return formatDateUtil(date);
	}

	function getDaysUntil(date: Date | string | undefined): number {
		if (!date) return 0;
		const target = new Date(date);
		const now = new Date();
		const diff = target.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}

	// Reactive statements
	$: if (contractId) {
		loadContract();
	}
</script>

{#if loading}
	<div class="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
		<div class="flex flex-col items-center gap-3">
			<div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
			<div class="text-secondary">{$t('common.loading')}</div>
		</div>
	</div>
{:else if !contract}
	<div class="min-h-screen bg-slate-50 pb-20">
		<div class="flex flex-col items-center justify-center min-h-[80vh] p-6">
			<div class="card max-w-md w-full text-center py-12">
				<div class="flex justify-center mb-6">
					<div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
						<FileText size={40} class="text-muted" />
					</div>
				</div>
				<h2 class="text-2xl font-semibold text-foreground mb-3">{$t('contract.notFound')}</h2>
				<p class="text-secondary mb-8 px-4">
					{$t('contract.notFoundDesc')}
				</p>
				<a href="/contracts" class="btn-primary w-full max-w-xs text-center inline-block">
					{$t('contract.backToOverview')}
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-slate-50">
		<!-- Header -->
		<header class="bg-white border-b border-slate-200 sticky top-0 z-10">
			<div class="flex items-center gap-4 p-4">
				<button on:click={() => goto('/contracts')} class="p-2 -ml-2">
					<ChevronLeft size={24} />
				</button>
				<h1 class="text-xl font-semibold flex-1">{$t('contract.details')}</h1>
				<button on:click={deleteContract} class="p-2 text-error">
					<Trash2 size={20} />
				</button>
			</div>
		</header>

		<div class="p-4 space-y-4 pb-24">
			<!-- Category & Name -->
			<div class="card">
				<div class="flex items-start gap-4">
					<CategoryIcon category={contract.category} size="lg" />
					<div class="flex-1 min-w-0">
						<h2 class="text-xl font-semibold mb-2 break-words">{contract.name}</h2>
						<div class="flex items-center gap-2 mb-2">
							<p class="text-secondary">{contract.provider}</p>
							<StatusBadge status={contract.status || 'aktiv'} size="md" />
						</div>
						<div class="text-xs text-muted">
							{getCategoryName(contract.category, $t)}
						</div>
					</div>
				</div>
			</div>

			<!-- Cost -->
			<div class="card">
				<div class="flex items-center gap-3 mb-2">
					<CurrencyIcon size={20} class="text-muted" />
					<span class="text-sm text-secondary">
						{contract.billingPeriod === 'monthly' || !contract.billingPeriod ? $t('contract.monthlyCost') : $t('contract.billingCost')}
					</span>
				</div>
				<div class="text-3xl font-semibold tabular-nums">
					{formatCurrency(contract.billingCost !== undefined ? contract.billingCost : contract.monthlyCost, currencyValue)}
					{#if contract.billingPeriod && contract.billingPeriod !== 'monthly'}
						<span class="text-lg font-normal text-secondary ml-1">
							/ {$t(`contract.billingPeriod_${contract.billingPeriod}`)}
						</span>
					{/if}
				</div>
				{#if contract.billingPeriod && contract.billingPeriod !== 'monthly'}
					<div class="text-sm text-secondary mt-2">
						≈ {formatCurrency(contract.monthlyCost, currencyValue)} {$t('common.perMonth')}
					</div>
				{/if}
			</div>

			<!-- Cancellation Warning -->
			{#if contract.cancellationDate}
				{@const daysUntil = getDaysUntil(contract.cancellationDate)}
				{#if daysUntil > 0 && daysUntil <= 90}
					<div
						class="card border-2 {daysUntil <= 30
							? 'border-error bg-red-50'
							: 'border-warning bg-amber-50'}"
					>
						<div class="flex items-start gap-3">
							<AlertCircle
								size={24}
								class={daysUntil <= 30 ? 'text-error' : 'text-warning'}
							/>
							<div class="flex-1">
								<div class="font-medium {daysUntil <= 30 ? 'text-error' : 'text-warning'}">
									{$t('contract.deadlineExpiring')}
								</div>
								<p class="text-sm text-secondary mt-1">
									{$t('contract.cancelBy')} {formatDate(contract.cancellationDate)}
								</p>
								<p class="text-sm font-medium mt-1">
									{daysUntil} {$t('common.days')} {$t('contract.remaining')}
								</p>
							</div>
						</div>
					</div>
				{/if}
			{/if}

			<!-- Details -->
			<div class="card space-y-4">
				<h3 class="font-semibold">{$t('contract.details')}</h3>

				{#if contract.contractNumber}
					<div>
						<div class="text-sm text-muted">{$t('contract.contractNumber')}</div>
						<div class="font-medium">{contract.contractNumber}</div>
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div>
						<div class="text-sm text-muted">{$t('contract.startDate')}</div>
						<div class="font-medium">{formatDate(contract.startDate)}</div>
					</div>
					<div>
						<div class="text-sm text-muted">{$t('contract.endDate')}</div>
						<div class="font-medium">{formatDate(contract.endDate)}</div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<div class="text-sm text-muted">{$t('contract.cancellationPeriod')}</div>
						<div class="font-medium">{contract.cancellationPeriod} {$t('common.days')}</div>
					</div>
					<div>
						<div class="text-sm text-muted">{$t('contract.reminderDays')}</div>
						<div class="font-medium">{contract.reminderDays} {$t('contract.daysBefore')}</div>
					</div>
				</div>

				{#if contract.paymentMethod}
					<div>
						<div class="text-sm text-muted">{$t('contract.paymentMethod')}</div>
						<div class="font-medium">
							{#if contract.paymentMethod === 'sepa'}
								{$t('paymentMethods.sepa')}
							{:else if contract.paymentMethod === 'rechnung'}
								{$t('paymentMethods.rechnung')}
							{:else if contract.paymentMethod === 'kreditkarte'}
								{$t('paymentMethods.kreditkarte')}
							{:else if contract.paymentMethod === 'bar'}
								{$t('paymentMethods.bar')}
							{:else}
								{$t('paymentMethods.other')}
							{/if}
						</div>
					</div>
				{/if}

				{#if contract.notes}
					<div>
						<div class="text-sm text-muted">{$t('contract.notes')}</div>
						<div class="mt-1 text-secondary">{contract.notes}</div>
					</div>
				{/if}
			</div>

			<!-- Edit Button -->
			<a href="/contracts/{contract.id}/edit" class="btn-primary w-full flex items-center justify-center gap-2">
				<Edit size={20} />
				{$t('common.edit')}
			</a>
		</div>
	</div>
{/if}
