import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportToCSV, downloadCSV, exportToXLSX, downloadXLSX } from './export';
import type { Contract } from '$lib/db';

describe('exportToCSV', () => {
	it('should export contracts to CSV format', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Test Contract',
				category: 'internet',
				provider: 'Test Provider',
				contractNumber: '12345',
				monthlyCost: 29.99,
				billingCost: 29.99,
				billingPeriod: 'monthly',
				startDate: new Date('2024-01-01'),
				endDate: new Date('2024-12-31'),
				cancellationPeriod: 30,
				cancellationDate: new Date('2024-12-01'),
				reminderDays: 30,
				status: 'aktiv',
				paymentMethod: 'sepa',
				notes: 'Test notes',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01')
			}
		];

		const csv = exportToCSV(contracts);
		expect(csv).toContain('Test Contract');
		expect(csv).toContain('internet');
		expect(csv).toContain('Test Provider');
		expect(csv).toContain('12345');
		expect(csv).toContain('29.99');
	});

	it('should handle contracts without optional fields', () => {
		const contracts: Contract[] = [
			{
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
			}
		];

		const csv = exportToCSV(contracts);
		expect(csv).toContain('Minimal Contract');
		expect(csv).toContain('internet');
	});

	it('should handle empty contracts array', () => {
		const csv = exportToCSV([]);
		expect(typeof csv).toBe('string');
	});

	it('should use billingCost when available', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Contract',
				category: 'internet',
				provider: 'Provider',
				monthlyCost: 19.99,
				billingCost: 59.97,
				billingPeriod: 'quarterly',
				startDate: new Date('2024-01-01'),
				cancellationPeriod: 30,
				reminderDays: 30,
				status: 'aktiv',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01')
			}
		];

		const csv = exportToCSV(contracts);
		expect(csv).toContain('59.97');
	});

	it('should format dates correctly', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Contract',
				category: 'internet',
				provider: 'Provider',
				monthlyCost: 19.99,
				billingCost: 19.99,
				billingPeriod: 'monthly',
				startDate: new Date('2024-01-15'),
				endDate: new Date('2024-12-31'),
				cancellationDate: new Date('2024-12-01'),
				cancellationPeriod: 30,
				reminderDays: 30,
				status: 'aktiv',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01')
			}
		];

		const csv = exportToCSV(contracts);
		expect(csv).toContain('2024-01-15');
		expect(csv).toContain('2024-12-31');
		expect(csv).toContain('2024-12-01');
	});
});

describe('downloadCSV', () => {
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

	it('should download CSV file in browser', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Test',
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
			}
		];

		downloadCSV(contracts, 'test.csv');
		expect(URL.createObjectURL).toHaveBeenCalled();
	});

	it('should use default filename if not provided', () => {
		const contracts: Contract[] = [];
		downloadCSV(contracts);
		expect(URL.createObjectURL).toHaveBeenCalled();
	});
});

describe('exportToXLSX', () => {
	it('should export contracts to XLSX format', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Test Contract',
				category: 'internet',
				provider: 'Test Provider',
				monthlyCost: 29.99,
				billingCost: 29.99,
				billingPeriod: 'monthly',
				startDate: new Date('2024-01-01'),
				cancellationPeriod: 30,
				reminderDays: 30,
				status: 'aktiv',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01')
			}
		];

		const buffer = exportToXLSX(contracts);
		expect(buffer).toBeInstanceOf(ArrayBuffer);
		expect(buffer.byteLength).toBeGreaterThan(0);
	});

	it('should handle empty contracts array', () => {
		const buffer = exportToXLSX([]);
		expect(buffer).toBeInstanceOf(ArrayBuffer);
	});

	it('should handle multiple contracts', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Contract 1',
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
			},
			{
				id: '2',
				name: 'Contract 2',
				category: 'mobilfunk',
				provider: 'Provider 2',
				monthlyCost: 29.99,
				billingCost: 29.99,
				billingPeriod: 'monthly',
				startDate: new Date('2024-01-01'),
				cancellationPeriod: 30,
				reminderDays: 30,
				status: 'aktiv',
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01')
			}
		];

		const buffer = exportToXLSX(contracts);
		expect(buffer).toBeInstanceOf(ArrayBuffer);
		expect(buffer.byteLength).toBeGreaterThan(0);
	});
});

describe('downloadXLSX', () => {
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

	it('should download XLSX file in browser', () => {
		const contracts: Contract[] = [
			{
				id: '1',
				name: 'Test',
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
			}
		];

		downloadXLSX(contracts, 'test.xlsx');
		expect(URL.createObjectURL).toHaveBeenCalled();
	});

	it('should use default filename if not provided', () => {
		const contracts: Contract[] = [];
		downloadXLSX(contracts);
		expect(URL.createObjectURL).toHaveBeenCalled();
	});
});
