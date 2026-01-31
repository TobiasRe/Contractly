import { browser } from '$app/environment';
import { db } from '$lib/db';
import type { Contract } from '$lib/db';
import { t } from '$lib/stores/i18n';
import { get } from 'svelte/store';

export const CURRENT_BACKUP_VERSION = 3;

interface BackupData {
	version: number;
	exportDate: string;
	contracts: Array<Omit<Contract, 'startDate' | 'endDate' | 'cancellationDate' | 'createdAt' | 'updatedAt'> & {
		startDate?: string;
		endDate?: string;
		cancellationDate?: string;
		createdAt?: string;
		updatedAt?: string;
	}>;
}

/**
 * Export all contracts as a backup JSON string
 */
export async function exportBackup(): Promise<string> {
	const contracts = await db.contracts.toArray();
	
	const backup: BackupData = {
		version: CURRENT_BACKUP_VERSION,
		exportDate: new Date().toISOString(),
		contracts: contracts.map((c) => ({
			...c,
			startDate: c.startDate?.toISOString(),
			endDate: c.endDate?.toISOString(),
			cancellationDate: c.cancellationDate?.toISOString(),
			createdAt: c.createdAt?.toISOString(),
			updatedAt: c.updatedAt?.toISOString()
		}))
	};

	return JSON.stringify(backup, null, 2);
}

/**
 * Download backup file
 */
export function downloadBackup(filename: string = `vertraege-backup-${new Date().toISOString().split('T')[0]}.json`) {
	if (!browser) {
		console.error('downloadBackup can only be called in the browser');
		return;
	}
	
	exportBackup().then((json) => {
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}).catch((error) => {
		console.error('Error exporting backup:', error);
	});
}

interface ImportBackupResult {
	success: boolean;
	count: number;
	error?: string;
}

/**
 * Migrate backup data to the current version
 */
function migrateBackupData(backup: Partial<BackupData>): BackupData {
	const version = backup.version || 1;
	let contracts = backup.contracts || [];

	// v1 -> v2: Add status field
	if (version < 2) {
		contracts = contracts.map((c: any) => ({
			...c,
			status: c.status || 'aktiv'
		}));
	}

	// v2 -> v3: Add billingCost and billingPeriod fields
	if (version < 3) {
		contracts = contracts.map((c: any) => ({
			...c,
			billingPeriod: c.billingPeriod || 'monthly',
			billingCost: c.billingCost !== undefined ? c.billingCost : (c.monthlyCost || 0)
		}));
	}

	return {
		...backup,
		version: CURRENT_BACKUP_VERSION,
		exportDate: backup.exportDate || new Date().toISOString(),
		contracts
	} as BackupData;
}

/**
 * Import contracts from backup file
 */
export async function importBackup(file: File): Promise<ImportBackupResult> {
	try {
		const text = await file.text();
		const rawBackup = JSON.parse(text) as Partial<BackupData>;

		if (!rawBackup.contracts || !Array.isArray(rawBackup.contracts)) {
			const errorMsg = get(t)('settings.invalidBackupFormat');
			return { success: false, count: 0, error: errorMsg || 'Invalid backup format' };
		}

		const backup = migrateBackupData(rawBackup);

		await db.contracts.clear();

		const contracts: Omit<Contract, 'id'>[] = backup.contracts.map((c) => {
			// Remove id field if present, as it will be auto-generated
			const { id, ...contractData } = c;
			return {
				...contractData,
				startDate: c.startDate ? new Date(c.startDate) : new Date(),
				endDate: c.endDate ? new Date(c.endDate) : undefined,
				cancellationDate: c.cancellationDate ? new Date(c.cancellationDate) : undefined,
				createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
				updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date()
			} as Omit<Contract, 'id'>;
		});

		// Try bulkAdd first, fallback to individual adds if it fails
		let addedCount = 0;
		try {
			await db.contracts.bulkAdd(contracts);
			addedCount = contracts.length;
		} catch (bulkError) {
			// Fallback to individual adds if bulkAdd fails (e.g., in test environment with fake-indexeddb)
			for (const contract of contracts) {
				try {
					await db.contracts.add(contract);
					addedCount++;
				} catch (addError) {
					// Continue with next contract if one fails
					console.warn('Failed to add contract:', addError);
				}
			}
		}

		if (addedCount === 0) {
			return { success: false, count: 0, error: 'Failed to import any contracts' };
		}

		return { success: true, count: addedCount };
	} catch (error) {
		return { success: false, count: 0, error: (error as Error).message };
	}
}
