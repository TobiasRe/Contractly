<script lang="ts">
	// External imports
	import { onMount } from 'svelte';
	import { Download, Upload, Database, FileSpreadsheet, FileText, Globe, Bell, BellOff, DollarSign } from 'lucide-svelte';

	// Local imports
	import { db } from '$lib/db';
	import { downloadCSV, downloadXLSX } from '$lib/utils/export';
	import { importFromCSV, importFromXLSX } from '$lib/utils/import';
	import { downloadBackup, importBackup } from '$lib/utils/backup';
	import { notificationsEnabled, requestNotificationPermission, checkNotificationSupport } from '$lib/stores/notifications';
	import { locale, setLocale, t } from '$lib/stores/i18n';
	import { currency, setCurrency, currencyNames } from '$lib/stores/currency';

	// Types
	import type { Contract } from '$lib/db';
	import type { Currency } from '$lib/stores/currency';

	let contracts: Contract[] = [];
	let importing = false;
	let exportMessage = '';
	let importMessage = '';
	let notificationSupported = false;

	$: language = $locale;
	$: selectedCurrency = $currency;

	onMount(async () => {
		contracts = await db.contracts.toArray();
		notificationSupported = checkNotificationSupport();
	});

	async function handleExportCSV() {
		downloadCSV(contracts);
		showExportMessage($t('settings.csvExported'));
	}

	async function handleExportXLSX() {
		downloadXLSX(contracts);
		showExportMessage($t('settings.excelExported'));
	}

	async function handleBackup() {
		downloadBackup();
		showExportMessage($t('settings.backupCreated'));
	}

	async function handleImport(event: Event, type: 'csv' | 'xlsx') {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		importing = true;
		importMessage = '';

		try {
			const result =
				type === 'csv' ? await importFromCSV(file) : await importFromXLSX(file);

			if (result.success > 0) {
				importMessage = `${result.success} ${$t('settings.contractsImported')}`;
				if (result.errors.length > 0) {
					importMessage += ` (${result.errors.length} ${$t('settings.errors')})`;
				}
				contracts = await db.contracts.toArray();
			} else {
				importMessage = `${$t('settings.importFailed')}: ${result.errors.join(', ')}`;
			}
		} catch (error) {
			importMessage = `${$t('common.error')}: ${(error as Error).message}`;
		} finally {
			importing = false;
			input.value = '';
		}

		setTimeout(() => {
			importMessage = '';
		}, 5000);
	}

	async function handleRestore(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (
			!confirm($t('settings.restoreWarning'))
		) {
			input.value = '';
			return;
		}

		importing = true;
		importMessage = '';

		try {
			const result = await importBackup(file);

			if (result.success) {
				importMessage = `${result.count} ${$t('settings.contractsRestored')}`;
				contracts = await db.contracts.toArray();
			} else {
				importMessage = `${$t('settings.restoreFailed')}: ${result.error}`;
			}
		} catch (error) {
			importMessage = `${$t('common.error')}: ${(error as Error).message}`;
		} finally {
			importing = false;
			input.value = '';
		}

		setTimeout(() => {
			importMessage = '';
		}, 5000);
	}

	function showExportMessage(message: string) {
		exportMessage = message;
		setTimeout(() => {
			exportMessage = '';
		}, 3000);
	}

	function changeLanguage(lang: 'de' | 'en') {
		setLocale(lang);
	}

	function changeCurrency(newCurrency: string) {
		setCurrency(newCurrency as Currency);
	}

	async function toggleNotifications() {
		if ($notificationsEnabled) {
			localStorage.removeItem('notificationsEnabled');
			notificationsEnabled.set(false);
		} else {
			const enabled = await requestNotificationPermission();
			if (!enabled) {
				alert($t('settings.notificationsDenied'));
			}
		}
	}
</script>

<div class="p-4 space-y-6">
	<!-- Header -->
	<header class="pt-4">
		<h1 class="text-2xl font-semibold text-foreground">{$t('settings.title')}</h1>
		<p class="text-secondary mt-1">{$t('settings.dataManagement')}</p>
	</header>

	<!-- Language -->
	<section class="card">
		<div class="flex items-center gap-3 mb-4">
			<Globe size={20} class="text-muted" />
			<h2 class="font-semibold">{$t('settings.language')}</h2>
		</div>
		<div class="flex gap-2">
			<button
				class="glass-toggle {language === 'de' ? 'glass-toggle-active' : 'text-foreground'}"
				on:click={() => changeLanguage('de')}
			>
				{$t('settings.german')}
			</button>
			<button
				class="glass-toggle {language === 'en' ? 'glass-toggle-active' : 'text-foreground'}"
				on:click={() => changeLanguage('en')}
			>
				{$t('settings.english')}
			</button>
		</div>
	</section>

	<!-- Currency -->
	<section class="card">
		<div class="flex items-center gap-3 mb-4">
			<DollarSign size={20} class="text-muted" />
			<h2 class="font-semibold">{$t('settings.currency')}</h2>
		</div>
		<p class="text-sm text-secondary mb-4">
			{$t('settings.currencyDescription')}
		</p>
		<select
			bind:value={selectedCurrency}
			on:change={(e) => changeCurrency(e.target.value)}
			class="input w-full"
		>
			{#each Object.entries(currencyNames) as [code, name] (code)}
				<option value={code}>{name}</option>
			{/each}
		</select>
	</section>

	<!-- Notifications -->
	{#if notificationSupported}
		<section class="card">
			<div class="flex items-center gap-3 mb-4">
				{#if $notificationsEnabled}
					<Bell size={20} class="text-muted" />
				{:else}
					<BellOff size={20} class="text-muted" />
				{/if}
				<h2 class="font-semibold">{$t('settings.notifications')}</h2>
			</div>
			<p class="text-sm text-secondary mb-4">
				{$t('settings.notificationDescription')}
			</p>
			<button
				on:click={toggleNotifications}
				class="btn-secondary w-full flex items-center justify-center gap-2"
			>
				{#if $notificationsEnabled}
					<BellOff size={18} />
					{$t('settings.disableNotifications')}
				{:else}
					<Bell size={18} />
					{$t('settings.enableNotifications')}
				{/if}
			</button>
		</section>
	{/if}

	<!-- Export -->
	<section class="card">
		<div class="flex items-center gap-3 mb-4">
			<Download size={20} class="text-muted" />
			<h2 class="font-semibold">{$t('settings.export')}</h2>
		</div>
		<p class="text-sm text-secondary mb-4">
			{$t('settings.exportDescription')}
		</p>
		<div class="space-y-2">
			<button on:click={handleExportCSV} class="btn-secondary w-full flex items-center justify-center gap-2">
				<FileText size={18} />
				{$t('settings.exportCSV')}
			</button>
			<button on:click={handleExportXLSX} class="btn-secondary w-full flex items-center justify-center gap-2">
				<FileSpreadsheet size={18} />
				{$t('settings.exportXLSX')}
			</button>
		</div>
		{#if exportMessage}
			<div class="mt-3 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
				{exportMessage}
			</div>
		{/if}
	</section>

	<!-- Import -->
	<section class="card">
		<div class="flex items-center gap-3 mb-4">
			<Upload size={20} class="text-muted" />
			<h2 class="font-semibold">{$t('settings.import')}</h2>
		</div>
		<p class="text-sm text-secondary mb-4">{$t('settings.importDescription')}</p>
		<div class="space-y-2">
			<label class="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
				<FileText size={18} />
				{$t('settings.importCSV')}
				<input
					type="file"
					accept=".csv"
					class="hidden"
					on:change={(e) => handleImport(e, 'csv')}
					disabled={importing}
				/>
			</label>
			<label class="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
				<FileSpreadsheet size={18} />
				{$t('settings.importXLSX')}
				<input
					type="file"
					accept=".xlsx,.xls"
					class="hidden"
					on:change={(e) => handleImport(e, 'xlsx')}
					disabled={importing}
				/>
			</label>
		</div>
		{#if importMessage}
			<div
				class="mt-3 p-3 rounded-lg text-sm {importMessage.includes($t('settings.importFailed')) ||
				importMessage.includes($t('common.error'))
					? 'bg-red-50 text-red-700'
					: 'bg-green-50 text-green-700'}"
			>
				{importMessage}
			</div>
		{/if}
	</section>

	<!-- Backup -->
	<section class="card">
		<div class="flex items-center gap-3 mb-4">
			<Database size={20} class="text-muted" />
			<h2 class="font-semibold">{$t('settings.backup')}</h2>
		</div>
		<p class="text-sm text-secondary mb-4">
			{$t('settings.backupDescription')}
		</p>
		<div class="space-y-2">
			<button on:click={handleBackup} class="btn-secondary w-full flex items-center justify-center gap-2">
				<Download size={18} />
				{$t('settings.backupData')}
			</button>
			<label class="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
				<Upload size={18} />
				{$t('settings.restoreData')}
				<input
					type="file"
					accept=".json"
					class="hidden"
					on:change={handleRestore}
					disabled={importing}
				/>
			</label>
		</div>
		<div class="mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
			{$t('settings.backupWarning')}
		</div>
	</section>

	<!-- Info -->
	<section class="card text-center">
		<div class="text-sm text-muted">{$t('app.title')} v1.0.0</div>
		<div class="text-xs text-muted mt-1">
			{$t('settings.localDataInfo')}
		</div>
	</section>
</div>
