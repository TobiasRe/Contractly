<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';

	// Local imports
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { db, saveContract } from '$lib/db';
	import { getCategoryName } from '$lib/data/categories';
	import { getProvidersForCategory } from '$lib/data/providers';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import { t } from '$lib/stores/i18n';

	// Types
	import type { Contract, CategoryType } from '$lib/db';

	// Reactive declarations
	$: contractId = $page.params.id;

	// State
	let contract: Contract | null = null;
	let loading = true;

	// Form state
	let name = '';
	let provider = '';
	let contractNumber = '';
	let billingCost = 0;
	let billingPeriod: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' = 'monthly';
	let startDate = '';
	let endDate = '';
	let cancellationPeriod = 30;
	let reminderDays = 30;
	let status: 'aktiv' | 'gekündigt' | 'beendet' = 'aktiv';
	let paymentMethod: 'sepa' | 'rechnung' | 'kreditkarte' | 'bar' | 'other' = 'sepa';
	let notes = '';
	let selectedCategory: CategoryType | null = null;
	let errorMessage = '';
	let saving = false;
	let showProviderSuggestions = false;
	let providerSuggestions: string[] = [];

	// Reactive declarations
	$: if (provider) updateProviderSuggestions();

	// Functions
	function updateProviderSuggestions() {
		if (!selectedCategory) return;
		providerSuggestions = getProvidersForCategory(selectedCategory);
		showProviderSuggestions = provider.length > 0 && providerSuggestions.length > 0;
	}

	function selectProvider(p: string) {
		provider = p;
		showProviderSuggestions = false;
	}

	async function handleSubmit() {
		if (!selectedCategory || !contract) return;

		saving = true;
		errorMessage = '';
		try {
			const id = parseInt(contractId);
			if (isNaN(id)) {
				errorMessage = $t('contract.errorSaving');
				saving = false;
				return;
			}
			await saveContract({
				id: id.toString(),
				name,
				category: selectedCategory,
				provider,
				contractNumber: contractNumber || undefined,
				billingCost,
				billingPeriod,
				startDate: startDate ? new Date(startDate) : new Date(),
				endDate: endDate ? new Date(endDate) : undefined,
				cancellationPeriod,
				reminderDays,
				status,
				paymentMethod,
				notes: notes || undefined,
				createdAt: contract.createdAt
			});

			goto(`/contracts/${id}`);
		} catch (error) {
			console.error('Error saving contract:', error);
			errorMessage = $t('contract.errorSaving');
		} finally {
			saving = false;
		}
	}

	// Lifecycle
	onMount(async () => {
		try {
			// Convert string ID to number for Dexie
			const id = parseInt(contractId);
			const c = await db.contracts.get(id);
			if (c) {
				contract = c;
				// Pre-fill form
				name = c.name;
				provider = c.provider;
				contractNumber = c.contractNumber || '';
				billingCost = c.billingCost !== undefined ? c.billingCost : c.monthlyCost;
				billingPeriod = c.billingPeriod || 'monthly';
				startDate = c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '';
				endDate = c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : '';
				cancellationPeriod = c.cancellationPeriod;
				reminderDays = c.reminderDays;
				status = c.status || 'aktiv';
				paymentMethod = c.paymentMethod || 'sepa';
				notes = c.notes || '';
				selectedCategory = c.category;
			}
		} catch (error) {
			console.error('Error loading contract:', error);
		} finally {
			loading = false;
		}
	});
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
				<button on:click={() => goto(`/contracts/${contractId}`)} class="p-2 -ml-2">
					<ChevronLeft size={24} />
				</button>
				<h1 class="text-xl font-semibold flex-1">{$t('contract.edit')}</h1>
			</div>
		</header>

		<form on:submit|preventDefault={handleSubmit} class="p-4 pb-24 space-y-6">
			<!-- Error Message -->
			{#if errorMessage}
				<div class="card bg-red-50 border border-error">
					<p class="text-error text-sm">{errorMessage}</p>
				</div>
			{/if}

			<!-- Category Display -->
			<div class="card">
				<div class="flex items-center gap-4">
					<CategoryIcon category={selectedCategory} size="lg" />
					<div>
						<div class="text-sm text-muted">{$t('contract.category')}</div>
						<div class="font-medium">{selectedCategory ? getCategoryName(selectedCategory, $t) : ''}</div>
					</div>
				</div>
			</div>

			<!-- Form Fields -->
			<div class="space-y-4">
				<!-- Contract Name -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.nameRequired')}</label>
					<input type="text" bind:value={name} required class="input w-full" />
				</div>

				<!-- Provider -->
				<div class="relative">
					<label class="block text-sm font-medium mb-2">{$t('contract.providerRequired')}</label>
					<input
						type="text"
						bind:value={provider}
						required
						class="input w-full"
						placeholder={$t('contract.providerPlaceholder')}
						on:focus={updateProviderSuggestions}
					/>
					{#if showProviderSuggestions}
						<div class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-48 overflow-y-auto">
							{#each providerSuggestions.filter((p) => p.toLowerCase().includes(provider.toLowerCase())) as suggestion (suggestion)}
								<button
									type="button"
									class="block w-full text-left px-4 py-2 hover:bg-slate-50"
									on:click={() => selectProvider(suggestion)}
								>
									{suggestion}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Contract Number -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.contractNumber')}</label>
					<input type="text" bind:value={contractNumber} class="input w-full" />
				</div>

				<!-- Cost and Billing Period -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-2">{$t('contract.billingCostRequired')}</label>
						<input
							type="number"
							bind:value={billingCost}
							step="0.01"
							min="0"
							required
							class="input w-full"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">{$t('contract.billingPeriod')}</label>
						<select bind:value={billingPeriod} class="input w-full">
							<option value="monthly">{$t('contract.billingPeriod_monthly')}</option>
							<option value="quarterly">{$t('contract.billingPeriod_quarterly')}</option>
							<option value="half-yearly">{$t('contract.billingPeriod_half-yearly')}</option>
							<option value="yearly">{$t('contract.billingPeriod_yearly')}</option>
						</select>
					</div>
				</div>

				<!-- Dates -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-2">{$t('contract.startDate')}</label>
						<input type="date" bind:value={startDate} class="input w-full" />
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">{$t('contract.endDate')}</label>
						<input type="date" bind:value={endDate} class="input w-full" />
					</div>
				</div>

				<!-- Cancellation Period -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.cancellationPeriodDays')}</label>
					<input type="number" bind:value={cancellationPeriod} min="0" class="input w-full" />
				</div>

				<!-- Reminder Days -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.reminderDaysBefore')}</label>
					<input type="number" bind:value={reminderDays} min="0" class="input w-full" />
				</div>

				<!-- Status -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.status')}</label>
					<select bind:value={status} class="input w-full">
						<option value="aktiv">{$t('contract.statusAktiv')}</option>
						<option value="gekündigt">{$t('contract.statusGekündigt')}</option>
						<option value="beendet">{$t('contract.statusBeendet')}</option>
					</select>
				</div>

				<!-- Payment Method -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.paymentMethod')}</label>
					<select bind:value={paymentMethod} class="input w-full">
						<option value="sepa">{$t('paymentMethods.sepa')}</option>
						<option value="rechnung">{$t('paymentMethods.rechnung')}</option>
						<option value="kreditkarte">{$t('paymentMethods.kreditkarte')}</option>
						<option value="bar">{$t('paymentMethods.bar')}</option>
						<option value="other">{$t('paymentMethods.other')}</option>
					</select>
				</div>

				<!-- Notes -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.notes')}</label>
					<textarea bind:value={notes} rows="3" class="input w-full resize-none" />
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4">
				<button type="button" on:click={() => goto(`/contracts/${contractId}`)} class="btn-secondary flex-1">
					{$t('common.cancel')}
				</button>
				<button type="submit" disabled={saving} class="btn-primary flex-1">
					{saving ? $t('contract.saving') : $t('common.save')}
				</button>
			</div>
		</form>
	</div>
{/if}
