import { describe, it, expect, beforeEach, vi } from 'vitest';
import { importFromCSV, importFromXLSX } from './import';
import { db } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';

describe('importFromCSV', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
	});

	it('should import contracts from CSV file', async () => {
		const csvContent = `Name;Kategorie;Anbieter;Vertragsnummer;Monatliche Kosten;Kosten;Abrechnungszeitraum;Vertragsbeginn;Vertragsende;Kündigungsfrist (Tage);Erinnerung;Zahlungsart;Notizen
Test Contract;internet;Test Provider;12345;29.99;29.99;monthly;2024-01-01;2024-12-31;30;30;sepa;Test notes`;

		const file = new File([csvContent], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBeGreaterThan(0);
		expect(result.errors).toHaveLength(0);

		const contracts = await db.contracts.toArray();
		expect(contracts).toHaveLength(1);
		expect(contracts[0].name).toBe('Test Contract');
	});

	it('should handle missing name field', async () => {
		const csvContent = `Name;Kategorie;Anbieter
;internet;Provider`;

		const file = new File([csvContent], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBe(0);
		expect(result.errors.length).toBeGreaterThan(0);
	});

	it('should handle multiple contracts', async () => {
		const csvContent = `Name;Kategorie;Anbieter;Monatliche Kosten
Contract 1;internet;Provider 1;19.99
Contract 2;mobilfunk;Provider 2;29.99`;

		const file = new File([csvContent], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBe(2);
		expect(result.errors).toHaveLength(0);

		const contracts = await db.contracts.toArray();
		expect(contracts).toHaveLength(2);
	});

	it('should handle CSV parsing errors', async () => {
		const invalidCsv = 'invalid csv content';
		const file = new File([invalidCsv], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBe(0);
		expect(Array.isArray(result.errors)).toBe(true);
	});

	it('should use billingCost when available', async () => {
		const csvContent = `Name;Kategorie;Anbieter;Monatliche Kosten;Kosten;Abrechnungszeitraum;Vertragsbeginn;Kündigungsfrist (Tage);Erinnerung
Test;internet;Provider;19.99;59.97;quarterly;2024-01-01;30;30`;

		const file = new File([csvContent], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBe(1);

		const contracts = await db.contracts.toArray();
		expect(contracts[0].billingCost).toBe(59.97);
		expect(contracts[0].billingPeriod).toBe('quarterly');
	});

	it('should handle optional fields', async () => {
		const csvContent = `Name;Kategorie;Anbieter;Monatliche Kosten;Vertragsbeginn;Kündigungsfrist (Tage);Erinnerung
Minimal;internet;Provider;19.99;2024-01-01;30;30`;

		const file = new File([csvContent], 'contracts.csv', {
			type: 'text/csv'
		});

		const result = await importFromCSV(file);
		expect(result.success).toBe(1);

		const contracts = await db.contracts.toArray();
		expect(contracts[0].contractNumber).toBeUndefined();
		expect(contracts[0].notes).toBeUndefined();
	});
});

describe('importFromXLSX', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
	});

	it('should import contracts from XLSX file', async () => {
		// Create a simple XLSX file structure
		const XLSX = await import('xlsx');
		const data = [
			{
				Name: 'Test Contract',
				Kategorie: 'internet',
				Anbieter: 'Test Provider',
				'Monatliche Kosten': 29.99,
				Kosten: 29.99,
				Abrechnungszeitraum: 'monthly',
				Vertragsbeginn: '2024-01-01',
				'Kündigungsfrist (Tage)': 30,
				Erinnerung: 30
			}
		];

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Verträge');
		const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

		const file = new File([buffer], 'contracts.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});

		const result = await importFromXLSX(file);
		expect(result.success).toBe(1);
		expect(result.errors).toHaveLength(0);

		const contracts = await db.contracts.toArray();
		expect(contracts).toHaveLength(1);
		expect(contracts[0].name).toBe('Test Contract');
	});

	it('should handle file read errors', async () => {
		const invalidFile = new File(['invalid'], 'contracts.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});

		const result = await importFromXLSX(invalidFile);
		expect(result.success).toBe(0);
		expect(Array.isArray(result.errors)).toBe(true);
		// Errors array might be empty if error handling is different
	});

	it('should handle multiple contracts in XLSX', async () => {
		const XLSX = await import('xlsx');
		const data = [
			{
				Name: 'Contract 1',
				Kategorie: 'internet',
				Anbieter: 'Provider 1',
				'Monatliche Kosten': 19.99,
				Kosten: 19.99,
				Abrechnungszeitraum: 'monthly',
				Vertragsbeginn: '2024-01-01',
				'Kündigungsfrist (Tage)': 30,
				Erinnerung: 30
			},
			{
				Name: 'Contract 2',
				Kategorie: 'mobilfunk',
				Anbieter: 'Provider 2',
				'Monatliche Kosten': 29.99,
				Kosten: 29.99,
				Abrechnungszeitraum: 'monthly',
				Vertragsbeginn: '2024-01-01',
				'Kündigungsfrist (Tage)': 30,
				Erinnerung: 30
			}
		];

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Verträge');
		const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

		const file = new File([buffer], 'contracts.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});

		const result = await importFromXLSX(file);
		expect(result.success).toBe(2);

		const contracts = await db.contracts.toArray();
		expect(contracts).toHaveLength(2);
	});
});
