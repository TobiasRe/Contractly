import { browser } from '$app/environment';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { Contract } from '$lib/db';

/**
 * Export contracts to CSV format
 */
export function exportToCSV(contracts: Contract[]): string {
	const data = contracts.map((c) => ({
		Name: c.name,
		Kategorie: c.category,
		Anbieter: c.provider,
		Vertragsnummer: c.contractNumber || '',
		'Monatliche Kosten': c.monthlyCost,
		Kosten: c.billingCost !== undefined ? c.billingCost : c.monthlyCost,
		Abrechnungszeitraum: c.billingPeriod || 'monthly',
		Vertragsbeginn: c.startDate?.toISOString().split('T')[0] || '',
		Vertragsende: c.endDate?.toISOString().split('T')[0] || '',
		'Kündigungsfrist (Tage)': c.cancellationPeriod,
		'Kündigungsdatum': c.cancellationDate?.toISOString().split('T')[0] || '',
		Zahlungsart: c.paymentMethod || '',
		Notizen: c.notes || ''
	}));

	return Papa.unparse(data, {
		delimiter: ';',
		header: true
	});
}

/**
 * Download contracts as CSV file
 */
export function downloadCSV(contracts: Contract[], filename: string = 'vertraege.csv') {
	if (!browser) {
		console.error('downloadCSV can only be called in the browser');
		return;
	}
	
	const csv = exportToCSV(contracts);
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	downloadBlob(blob, filename);
}

/**
 * Export contracts to XLSX format
 */
export function exportToXLSX(contracts: Contract[]): ArrayBuffer {
	const data = contracts.map((c) => ({
		Name: c.name,
		Kategorie: c.category,
		Anbieter: c.provider,
		Vertragsnummer: c.contractNumber || '',
		'Monatliche Kosten': c.monthlyCost,
		Kosten: c.billingCost !== undefined ? c.billingCost : c.monthlyCost,
		Abrechnungszeitraum: c.billingPeriod || 'monthly',
		Vertragsbeginn: c.startDate?.toISOString().split('T')[0] || '',
		Vertragsende: c.endDate?.toISOString().split('T')[0] || '',
		'Kündigungsfrist (Tage)': c.cancellationPeriod,
		'Kündigungsdatum': c.cancellationDate?.toISOString().split('T')[0] || '',
		Zahlungsart: c.paymentMethod || '',
		Notizen: c.notes || ''
	}));

	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Verträge');

	return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

/**
 * Download contracts as XLSX file
 */
export function downloadXLSX(contracts: Contract[], filename: string = 'vertraege.xlsx') {
	if (!browser) {
		console.error('downloadXLSX can only be called in the browser');
		return;
	}
	
	const buffer = exportToXLSX(contracts);
	const blob = new Blob([buffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});
	downloadBlob(blob, filename);
}

/**
 * Helper function to download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string) {
	if (!browser) {
		console.error('downloadBlob can only be called in the browser');
		return;
	}
	
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
