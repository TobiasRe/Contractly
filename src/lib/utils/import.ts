import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { Contract, CategoryType, BillingPeriod } from '$lib/db';
import { db, saveContract } from '$lib/db';
import { t } from '$lib/stores/i18n';
import { get } from 'svelte/store';

export interface ImportResult {
	success: number;
	errors: string[];
}

/**
 * Import contracts from CSV file
 */
export async function importFromCSV(file: File): Promise<ImportResult> {
	return new Promise((resolve) => {
		Papa.parse(file, {
			header: true,
			delimiter: ';',
			complete: async (results: Papa.ParseResult<Record<string, unknown>>) => {
				const rows = results.data as ImportRow[];
				const result = await processImportData(rows);
				resolve(result);
			},
			error: (error: Papa.ParseError) => {
				resolve({ success: 0, errors: [error.message] });
			}
		});
	});
}

/**
 * Import contracts from XLSX file
 */
export async function importFromXLSX(file: File): Promise<ImportResult> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		const translate = get(t);

		reader.onload = async (e) => {
			try {
				if (!e.target?.result) {
					resolve({ success: 0, errors: [translate('import.fileReadError')] });
					return;
				}
				
				const data = new Uint8Array(e.target.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });
				const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(firstSheet) as ImportRow[];

				const result = await processImportData(jsonData);
				resolve(result);
			} catch (error) {
				resolve({ success: 0, errors: [(error as Error).message] });
			}
		};

		reader.onerror = () => {
			resolve({ success: 0, errors: [translate('import.fileReadError')] });
		};

		reader.readAsArrayBuffer(file);
	});
}

type ImportRow = Record<string, unknown>;

function getStringValue(row: ImportRow, ...keys: string[]): string {
	for (const key of keys) {
		const value = row[key];
		if (typeof value === 'string') return value;
		if (typeof value === 'number') return String(value);
	}
	return '';
}

function getOptionalString(row: ImportRow, ...keys: string[]): string | undefined {
	const value = getStringValue(row, ...keys);
	return value || undefined;
}

function getNumberValue(row: ImportRow, ...keys: string[]): number {
	const value = getStringValue(row, ...keys);
	return parseFloat(value) || 0;
}

function getIntValue(row: ImportRow, ...keys: string[]): number {
	const value = getStringValue(row, ...keys);
	return parseInt(value) || 0;
}

/**
 * Process imported data and save contracts
 */
async function processImportData(data: ImportRow[]): Promise<ImportResult> {
	const translate = get(t);
	let success = 0;
	const errors: string[] = [];

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		try {
			const contract: Partial<Contract> = {
				name: getStringValue(row, 'Name', 'name'),
				category: (getStringValue(row, 'Kategorie', 'category') || 'custom') as CategoryType,
				provider: getStringValue(row, 'Anbieter', 'provider'),
				contractNumber: getOptionalString(row, 'Vertragsnummer', 'contractNumber'),
				monthlyCost: getNumberValue(row, 'Monatliche Kosten', 'monthlyCost'),
				billingCost: getNumberValue(row, 'Kosten', 'billingCost', 'Monatliche Kosten', 'monthlyCost'),
				billingPeriod: (getStringValue(row, 'Abrechnungszeitraum', 'billingPeriod') || 'monthly') as BillingPeriod,
				startDate: getStringValue(row, 'Vertragsbeginn', 'startDate') 
					? new Date(getStringValue(row, 'Vertragsbeginn', 'startDate')) 
					: new Date(),
				endDate: getOptionalString(row, 'Vertragsende', 'endDate') 
					? new Date(getOptionalString(row, 'Vertragsende', 'endDate')!) 
					: undefined,
				cancellationPeriod: getIntValue(row, 'Kündigungsfrist (Tage)', 'cancellationPeriod') || 30,
				reminderDays: getIntValue(row, 'Erinnerung', 'reminderDays') || 30,
				paymentMethod: getOptionalString(row, 'Zahlungsart', 'paymentMethod') as Contract['paymentMethod'],
				notes: getOptionalString(row, 'Notizen', 'notes')
			};

			if (!contract.name) {
				errors.push(`${translate('common.line')} ${i + 1}: ${translate('contract.nameRequired')}`);
				continue;
			}

			await saveContract(contract);
			success++;
		} catch (error) {
			errors.push(`${translate('common.line')} ${i + 1}: ${(error as Error).message}`);
		}
	}

	return { success, errors };
}
