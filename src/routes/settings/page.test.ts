import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import SettingsPage from './+page.svelte';
import { db } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';
import { setCurrency } from '$lib/stores/currency';
import { downloadCSV, downloadXLSX } from '$lib/utils/export';
import { importFromCSV, importFromXLSX } from '$lib/utils/import';
import { downloadBackup, importBackup } from '$lib/utils/backup';

vi.mock('$lib/utils/export', () => ({
	downloadCSV: vi.fn(),
	downloadXLSX: vi.fn()
}));

vi.mock('$lib/utils/import', () => ({
	importFromCSV: vi.fn(),
	importFromXLSX: vi.fn()
}));

vi.mock('$lib/utils/backup', () => ({
	downloadBackup: vi.fn(),
	importBackup: vi.fn()
}));

vi.mock('$lib/stores/notifications', () => ({
	notificationsEnabled: writable(false),
	requestNotificationPermission: vi.fn(async () => false),
	checkNotificationSupport: vi.fn(() => false)
}));

describe('SettingsPage', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
		setCurrency('EUR');
		vi.clearAllMocks();
		vi.stubGlobal('confirm', vi.fn(() => true));
	});

	it('should render the page', () => {
		const { container } = render(SettingsPage);
		expect(container).toBeTruthy();
	});

	it('should display language settings', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should display currency settings', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should export as CSV', async () => {
		const { container } = render(SettingsPage);
		const button = Array.from(container.querySelectorAll('button')).find(
			(btn) => btn.textContent?.trim() === 'Als CSV exportieren'
		);
		expect(button).toBeTruthy();

		await fireEvent.click(button!);

		expect(downloadCSV).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(container.textContent).toContain('CSV-Datei wurde heruntergeladen');
		});
	});

	it('should import CSV and show success message', async () => {
		const { container } = render(SettingsPage);
		vi.mocked(importFromCSV).mockResolvedValue({
			success: 1,
			errors: []
		});

		const input = container.querySelector('input[accept=".csv"]') as HTMLInputElement;
		const file = new File(['Name;Kategorie;Anbieter\nTest;internet;Provider'], 'contracts.csv', {
			type: 'text/csv'
		});
		await fireEvent.change(input, { target: { files: [file] } });

		expect(importFromCSV).toHaveBeenCalledWith(file);
		await waitFor(() => {
			expect(container.textContent).toContain('1 Verträge importiert');
		});
	});

	it('should import XLSX and show error message on failure', async () => {
		const { container } = render(SettingsPage);
		vi.mocked(importFromXLSX).mockResolvedValue({
			success: 0,
			errors: ['Dateifehler']
		});

		const input = container.querySelector('input[accept=".xlsx,.xls"]') as HTMLInputElement;
		const file = new File(['xlsx'], 'contracts.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		await fireEvent.change(input, { target: { files: [file] } });

		expect(importFromXLSX).toHaveBeenCalledWith(file);
		await waitFor(() => {
			expect(container.textContent).toContain('Import fehlgeschlagen: Dateifehler');
		});
	});

	it('should create a backup file', async () => {
		const { container } = render(SettingsPage);
		const button = Array.from(container.querySelectorAll('button')).find(
			(btn) => btn.textContent?.trim() === 'Backup erstellen'
		);
		expect(button).toBeTruthy();

		await fireEvent.click(button!);

		expect(downloadBackup).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(container.textContent).toContain('Backup wurde erstellt');
		});
	});

	it('should restore backup after confirmation', async () => {
		const { container } = render(SettingsPage);
		vi.mocked(importBackup).mockResolvedValue({
			success: true,
			count: 2
		});

		const input = container.querySelector('input[accept=".json"]') as HTMLInputElement;
		const file = new File(['{"version":3,"contracts":[]}'], 'backup.json', {
			type: 'application/json'
		});
		await fireEvent.change(input, { target: { files: [file] } });

		expect(confirm).toHaveBeenCalledTimes(1);
		expect(importBackup).toHaveBeenCalledWith(file);
		await waitFor(() => {
			expect(container.textContent).toContain('2 Verträge wiederhergestellt');
		});
	});

	it('should not restore backup when confirmation is cancelled', async () => {
		vi.stubGlobal('confirm', vi.fn(() => false));
		const { container } = render(SettingsPage);
		const input = container.querySelector('input[accept=".json"]') as HTMLInputElement;
		const file = new File(['{"version":3,"contracts":[]}'], 'backup.json', {
			type: 'application/json'
		});
		await fireEvent.change(input, { target: { files: [file] } });

		expect(confirm).toHaveBeenCalledTimes(1);
		expect(importBackup).not.toHaveBeenCalled();
	});
});
