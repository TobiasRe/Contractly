<script lang="ts">
	// External imports
	import { ChevronLeft, ChevronDown } from 'lucide-svelte';

	// Local imports
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { saveContract } from '$lib/db';
	import { categoryGroups, getCategoryConfig, getCategoryName, getCategoryGroupName } from '$lib/data/categories';
	import { getProvidersForCategory } from '$lib/data/providers';
	import CategoryIcon from '$lib/components/CategoryIcon.svelte';
	import { t } from '$lib/stores/i18n';

	// Types
	import type { CategoryType } from '$lib/db';

	// State
	let step: 'category-group' | 'category' | 'form' = 'category-group';
	let selectedGroup: string | null = null;
	let selectedCategory: CategoryType | null = null;

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

	let saving = false;
	let showProviderSuggestions = false;
	let providerSuggestions: string[] = [];

	function withBase(path: string): string {
		if (path === '/') return base || '/';
		return `${base}${path}`;
	}

	// Reactive declarations
	$: if (provider) updateProviderSuggestions();

	// Functions
	function selectGroup(groupId: string) {
		selectedGroup = groupId;
		step = 'category';
	}

	function selectCategory(category: CategoryType) {
		selectedCategory = category;
		const config = getCategoryConfig(category);
		if (config) {
			cancellationPeriod = config.defaultCancellationPeriod;
			reminderDays = config.defaultReminderDays[0];
		}
		step = 'form';
	}

	function back() {
		if (step === 'form') {
			step = 'category';
		} else if (step === 'category') {
			step = 'category-group';
			selectedGroup = null;
		}
	}

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
		if (!selectedCategory) return;

		saving = true;
		try {
			await saveContract({
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
				notes: notes || undefined
			});

			goto(withBase('/contracts'));
		} catch (error) {
			console.error('Error saving contract:', error);
			alert($t('contract.errorSaving'));
		} finally {
			saving = false;
		}
	}
</script>

<div class="page-shell">
	<!-- Header -->
	<header class="glass-header">
		<div class="flex items-center gap-4 p-4">
			<button on:click={step === 'category-group' ? () => goto(withBase('/contracts')) : back} class="p-2 -ml-2">
				<ChevronLeft size={24} />
			</button>
			<h1 class="text-xl font-semibold flex-1">
				{#if step === 'category-group'}
					{$t('categories.selectGroup')}
				{:else if step === 'category'}
					{selectedGroup ? getCategoryGroupName(selectedGroup, $t) : ''}
				{:else}
					{$t('contract.add')}
				{/if}
			</h1>
		</div>
	</header>

	<div class="p-4">
		<!-- Step 1: Category Group Selection -->
		{#if step === 'category-group'}
			<div class="space-y-2">
				{#each categoryGroups as group (group.id)}
					<button
						class="card w-full text-left hover:shadow-lg transition-shadow flex items-center justify-between"
						on:click={() => selectGroup(group.id)}
					>
						<span class="font-medium">{getCategoryGroupName(group.id, $t)}</span>
						<ChevronDown class="text-muted rotate-[-90deg]" size={20} />
					</button>
				{/each}
			</div>
		{/if}

		<!-- Step 2: Category Selection -->
		{#if step === 'category' && selectedGroup}
			<div class="space-y-2">
				{#each categoryGroups.find((g) => g.id === selectedGroup)?.categories || [] as category (category.id)}
					<button
						class="card w-full text-left hover:shadow-lg transition-shadow flex items-center gap-4"
						on:click={() => selectCategory(category.id)}
					>
						<CategoryIcon category={category.id} size="md" />
						<span class="font-medium flex-1">{getCategoryName(category.id, $t)}</span>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Step 3: Form -->
		{#if step === 'form' && selectedCategory}
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div class="card">
					<div class="flex items-center gap-3 mb-4">
						<CategoryIcon category={selectedCategory} size="lg" />
						<div>
							<div class="font-medium">{selectedCategory ? getCategoryName(selectedCategory, $t) : ''}</div>
							<button
								type="button"
								on:click={() => (step = 'category')}
								class="text-sm text-accent"
							>
								{$t('common.edit')}
							</button>
						</div>
					</div>
				</div>

				<!-- Name -->
				<div>
					<label class="block text-sm font-medium mb-2">{$t('contract.nameRequired')}</label>
					<input
						type="text"
						bind:value={name}
						required
						class="input w-full"
						placeholder={$t('contract.namePlaceholder')}
					/>
				</div>

				<!-- Provider -->
				<div class="relative">
					<label class="block text-sm font-medium mb-2">{$t('contract.provider')}</label>
					<input
						type="text"
						bind:value={provider}
						class="input w-full"
						placeholder={$t('contract.providerPlaceholder')}
						on:focus={updateProviderSuggestions}
					/>
					{#if showProviderSuggestions}
						<div class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-white/60 bg-white/70 shadow-card backdrop-blur-lg">
							{#each providerSuggestions.filter((p) => p.toLowerCase().includes(provider.toLowerCase())) as suggestion (suggestion)}
								<button
									type="button"
									class="block w-full px-4 py-2 text-left hover:bg-white/60"
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

				<!-- Actions -->
				<div class="flex gap-3 pt-4">
					<button type="button" on:click={() => goto(withBase('/contracts'))} class="btn-secondary flex-1">
						{$t('common.cancel')}
					</button>
					<button type="submit" disabled={saving} class="btn-primary flex-1">
						{saving ? $t('contract.saving') : $t('common.save')}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
