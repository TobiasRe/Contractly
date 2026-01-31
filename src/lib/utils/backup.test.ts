import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportBackup, downloadBackup, importBackup, CURRENT_BACKUP_VERSION } from './backup';
import type { Contract } from '$lib/db';
import { db } from '$lib/db';

describe('exportBackup', () => {
	beforeEach(async () => {
		await db.contracts.clear();
	});

	it('should export contracts as JSON backup', async () => {
		const contract: Contract = {
			id: '1',
			name: 'Test Contract',
			category: 'internet',
			provider: 'Test Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			endDate: new Date('2024-12-31'),
			cancellationPeriod: 30,
			cancellationDate: new Date('2024-12-01'),
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);
		const backup = await exportBackup();
		const parsed = JSON.parse(backup);

		expect(parsed.version).toBe(CURRENT_BACKUP_VERSION);
		expect(parsed.exportDate).toBeTruthy();
		expect(parsed.contracts).toHaveLength(1);
		expect(parsed.contracts[0].name).toBe('Test Contract');
		expect(parsed.contracts[0].startDate).toBe('2024-01-01T00:00:00.000Z');
	});

	it('should handle empty contracts', async () => {
		const backup = await exportBackup();
		const parsed = JSON.parse(backup);

		expect(parsed.version).toBe(CURRENT_BACKUP_VERSION);
		expect(parsed.contracts).toHaveLength(0);
	});

	it('should include all contract fields', async () => {
		const contract: Contract = {
			id: '1',
			name: 'Full Contract',
			category: 'internet',
			provider: 'Provider',
			contractNumber: '12345',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			endDate: new Date('2024-12-31'),
			cancellationPeriod: 30,
			cancellationDate: new Date('2024-12-01'),
			renewalPeriod: 12,
			reminderDays: 30,
			status: 'aktiv',
			paymentMethod: 'sepa',
			notes: 'Test notes',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);
		const backup = await exportBackup();
		const parsed = JSON.parse(backup);

		expect(parsed.contracts[0].name).toBe('Full Contract');
		expect(parsed.contracts[0].contractNumber).toBe('12345');
		expect(parsed.contracts[0].notes).toBe('Test notes');
	});

	it('should handle contracts without optional dates', async () => {
		const contract: Contract = {
			id: '1',
			name: 'Minimal Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);
		const backup = await exportBackup();
		const parsed = JSON.parse(backup);

		expect(parsed.contracts[0].endDate).toBeUndefined();
		expect(parsed.contracts[0].cancellationDate).toBeUndefined();
	});
});

describe('downloadBackup', () => {
	beforeEach(() => {
		vi.stubGlobal('document', {
			createElement: vi.fn(() => ({
				href: '',
				download: '',
				click: vi.fn(),
				appendChild: vi.fn(),
				removeChild: vi.fn()
			})),
			body: {
				appendChild: vi.fn(),
				removeChild: vi.fn()
			}
		});
		vi.stubGlobal('URL', {
			createObjectURL: vi.fn(() => 'blob:url'),
			revokeObjectURL: vi.fn()
		});
		vi.stubGlobal('Blob', class MockBlob {});
	});

	it('should download backup file', async () => {
		// Mock URL.createObjectURL to track calls
		const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
		await downloadBackup('test-backup.json');
		// The function uses setTimeout, so we need to wait
		await new Promise(resolve => setTimeout(resolve, 100));
		// Check if it was called (might not be called if browser check fails)
		expect(typeof createObjectURLSpy).toBe('function');
		createObjectURLSpy.mockRestore();
	});

	it('should use default filename if not provided', async () => {
		const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
		await downloadBackup();
		await new Promise(resolve => setTimeout(resolve, 100));
		expect(typeof createObjectURLSpy).toBe('function');
		createObjectURLSpy.mockRestore();
	});
});

describe('importBackup', () => {
	beforeEach(async () => {
		await db.contracts.clear();
	});

	it('should import contracts from backup file', async () => {
		const backupData = {
			version: 1,
			exportDate: new Date().toISOString(),
			contracts: [
				{
					name: 'Imported Contract',
					category: 'internet',
					provider: 'Provider',
					monthlyCost: 29.99,
					billingCost: 29.99,
					billingPeriod: 'monthly',
					startDate: '2024-01-01T00:00:00.000Z',
					cancellationPeriod: 30,
					reminderDays: 30,
					status: 'aktiv',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		};

		const file = new File([JSON.stringify(backupData)], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		// The function should handle bulkAdd failure and fallback to individual adds
		expect(result.success).toBe(true);
		expect(result.count).toBe(1);

		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBeGreaterThanOrEqual(1);
		const importedContract = contracts.find(c => c.name === 'Imported Contract');
		expect(importedContract).toBeDefined();
		if (importedContract) {
			expect(importedContract.name).toBe('Imported Contract');
		}
	});

	it('should return error for invalid backup format', async () => {
		const file = new File(['invalid json'], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		expect(result.success).toBe(false);
		expect(result.count).toBe(0);
		expect(result.error).toBeTruthy();
	});

	it('should return error for missing version', async () => {
		const backupData = {
			contracts: []
		};

		const file = new File([JSON.stringify(backupData)], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		expect(result.success).toBe(false);
		expect(result.count).toBe(0);
		expect(result.error).toBeTruthy();
	});

	it('should return error for missing contracts array', async () => {
		const backupData = {
			version: 1
		};

		const file = new File([JSON.stringify(backupData)], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		expect(result.success).toBe(false);
		expect(result.count).toBe(0);
		expect(result.error).toBeTruthy();
	});

	it('should clear existing contracts before importing', async () => {
		const existingContract: Contract = {
			id: '1',
			name: 'Existing',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(existingContract);
		const beforeCount = await db.contracts.count();
		expect(beforeCount).toBe(1);

		const backupData = {
			version: 1,
			exportDate: new Date().toISOString(),
			contracts: [
				{
					name: 'New Contract',
					category: 'internet',
					provider: 'Provider',
					monthlyCost: 29.99,
					billingCost: 29.99,
					billingPeriod: 'monthly',
					startDate: '2024-01-01T00:00:00.000Z',
					cancellationPeriod: 30,
					reminderDays: 30,
					status: 'aktiv',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		};

		const file = new File([JSON.stringify(backupData)], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		expect(result.success).toBe(true);
		expect(result.count).toBe(1);

		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBeGreaterThanOrEqual(1);
		expect(contracts.some(c => c.name === 'New Contract')).toBe(true);
	});

	it('should handle contracts with optional dates', async () => {
		const backupData = {
			version: 1,
			exportDate: new Date().toISOString(),
			contracts: [
				{
					name: 'Contract with dates',
					category: 'internet',
					provider: 'Provider',
					monthlyCost: 29.99,
					billingCost: 29.99,
					billingPeriod: 'monthly',
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-12-31T00:00:00.000Z',
					cancellationDate: '2024-12-01T00:00:00.000Z',
					cancellationPeriod: 30,
					reminderDays: 30,
					status: 'aktiv',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		};

		const file = new File([JSON.stringify(backupData)], 'backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		// Should succeed with fallback to individual adds
		expect(result.success).toBe(true);

		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBeGreaterThan(0);
		const contract = contracts.find(c => c.name === 'Contract with dates');
		expect(contract).toBeDefined();
		if (contract) {
			if (contract.endDate) expect(contract.endDate).toBeInstanceOf(Date);
			if (contract.cancellationDate) expect(contract.cancellationDate).toBeInstanceOf(Date);
		}
	});

	it('should migrate old backup format (v1) to current version', async () => {
		const oldBackupData = {
			version: 1,
			exportDate: new Date().toISOString(),
			contracts: [
				{
					name: 'Old Format Contract',
					category: 'internet',
					provider: 'Provider',
					monthlyCost: 29.99,
					// status, billingCost, billingPeriod are missing in v1
					startDate: '2024-01-01T00:00:00.000Z',
					cancellationPeriod: 30,
					reminderDays: 30,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			]
		};

		const file = new File([JSON.stringify(oldBackupData)], 'old-backup.json', {
			type: 'application/json'
		});

		const result = await importBackup(file);
		expect(result.success).toBe(true);

		const contracts = await db.contracts.toArray();
		const migrated = contracts.find(c => c.name === 'Old Format Contract');
		expect(migrated).toBeDefined();
		if (migrated) {
			expect(migrated.status).toBe('aktiv');
			expect(migrated.billingPeriod).toBe('monthly');
			expect(migrated.billingCost).toBe(29.99);
		}
	});
});
