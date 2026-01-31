import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db, saveContract, calculateCancellationDate, Contract } from './index';

describe('ContractDatabase', () => {
	beforeEach(async () => {
		await db.contracts.clear();
	});

	afterEach(async () => {
		await db.contracts.clear();
	});

	it('should create database instance', () => {
		expect(db).toBeDefined();
		expect(db.contracts).toBeDefined();
	});

	it('should add contract to database', async () => {
		const contract: Partial<Contract> = {
			name: 'Test Contract',
			category: 'internet',
			provider: 'Test Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		const id = await saveContract(contract);
		expect(id).toBeTruthy();

		const saved = await db.contracts.get(Number(id));
		expect(saved).toBeDefined();
		expect(saved?.name).toBe('Test Contract');
	});

	it('should update existing contract', async () => {
		const contract: Partial<Contract> = {
			name: 'Original Name',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		const id = await saveContract(contract);
		const numericId = Number(id);
		expect(numericId).toBeGreaterThan(0);
		
		const updatedContract: Partial<Contract> = {
			...contract,
			id: numericId,
			name: 'Updated Name'
		};

		await saveContract(updatedContract);
		const saved = await db.contracts.get(numericId);
		expect(saved).toBeDefined();
		expect(saved?.name).toBe('Updated Name');
	});

	it('should calculate monthly cost from billing cost and period', async () => {
		const contract: Partial<Contract> = {
			name: 'Quarterly Contract',
			category: 'internet',
			provider: 'Provider',
			billingCost: 90,
			billingPeriod: 'quarterly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.monthlyCost).toBe(30);
	});

	it('should calculate monthly cost for yearly period', async () => {
		const contract: Partial<Contract> = {
			name: 'Yearly Contract',
			category: 'internet',
			provider: 'Provider',
			billingCost: 240,
			billingPeriod: 'yearly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.monthlyCost).toBe(20);
	});

	it('should calculate monthly cost for half-yearly period', async () => {
		const contract: Partial<Contract> = {
			name: 'Half-Yearly Contract',
			category: 'internet',
			provider: 'Provider',
			billingCost: 120,
			billingPeriod: 'half-yearly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.monthlyCost).toBe(20);
	});

	it('should use existing monthlyCost if billingCost not provided', async () => {
		const contract: Partial<Contract> = {
			name: 'Monthly Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.monthlyCost).toBe(29.99);
	});

	it('should set default status to aktiv', async () => {
		const contract: Partial<Contract> = {
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.status).toBe('aktiv');
	});

	it('should set createdAt and updatedAt timestamps', async () => {
		const contract: Partial<Contract> = {
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.createdAt).toBeInstanceOf(Date);
		expect(saved?.updatedAt).toBeInstanceOf(Date);
	});

	it('should preserve existing createdAt when updating', async () => {
		const contract: Partial<Contract> = {
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2023-01-01')
		};

		const id = await saveContract(contract);
		const numericId = Number(id);
		const original = await db.contracts.get(numericId);
		const originalCreatedAt = original?.createdAt;
		expect(originalCreatedAt).toBeDefined();

		const updated: Partial<Contract> = {
			...contract,
			id: numericId,
			name: 'Updated',
			createdAt: originalCreatedAt
		};

		await saveContract(updated);
		const updatedContract = await db.contracts.get(numericId);
		expect(updatedContract).toBeDefined();
		expect(updatedContract?.createdAt).toEqual(originalCreatedAt);
		expect(updatedContract?.updatedAt).not.toEqual(originalCreatedAt);
	});
});

describe('calculateCancellationDate', () => {
	it('should calculate cancellation date correctly', () => {
		const endDate = new Date('2024-12-31');
		const cancellationPeriod = 30;
		const cancelDate = calculateCancellationDate(endDate, cancellationPeriod);

		expect(cancelDate).toBeInstanceOf(Date);
		const expectedDate = new Date(endDate);
		expectedDate.setDate(expectedDate.getDate() - cancellationPeriod);
		expect(cancelDate?.getTime()).toBe(expectedDate.getTime());
	});

	it('should return undefined if endDate is not provided', () => {
		const cancelDate = calculateCancellationDate(undefined, 30);
		expect(cancelDate).toBeUndefined();
	});

	it('should handle different cancellation periods', () => {
		const endDate = new Date('2024-12-31');
		
		const cancelDate90 = calculateCancellationDate(endDate, 90);
		expect(cancelDate90).toBeInstanceOf(Date);

		const cancelDate60 = calculateCancellationDate(endDate, 60);
		expect(cancelDate60).toBeInstanceOf(Date);

		expect(cancelDate90!.getTime()).toBeLessThan(cancelDate60!.getTime()!);
	});

	it('should calculate cancellation date and save it', async () => {
		const endDate = new Date('2024-12-31');
		const contract: Partial<Contract> = {
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			endDate: endDate,
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		await saveContract(contract);
		const saved = await db.contracts.get((await db.contracts.toArray())[0].id!);
		expect(saved?.cancellationDate).toBeInstanceOf(Date);
		expect(saved?.cancellationDate).not.toEqual(endDate);
	});
});

describe('saveContract edge cases', () => {
	beforeEach(async () => {
		await db.contracts.clear();
	});

	it('should handle contract with all optional fields', async () => {
		const contract: Partial<Contract> = {
			name: 'Full Contract',
			category: 'internet',
			subcategory: 'fiber',
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

		const id = await saveContract(contract);
		const saved = await db.contracts.get(Number(id));
		expect(saved?.subcategory).toBe('fiber');
		expect(saved?.contractNumber).toBe('12345');
		expect(saved?.notes).toBe('Test notes');
	});

	it('should handle contract with minimal required fields', async () => {
		const contract: Partial<Contract> = {
			name: 'Minimal Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30
		};

		const id = await saveContract(contract);
		const saved = await db.contracts.get(Number(id));
		expect(saved?.name).toBe('Minimal Contract');
		expect(saved?.status).toBe('aktiv');
	});

	it('should handle numeric string IDs', async () => {
		const contract: Partial<Contract> = {
			id: '123',
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		const id = await saveContract(contract);
		expect(id).toBe('123');
	});

	it('should handle numeric IDs', async () => {
		const contract: Partial<Contract> = {
			id: 456,
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 19.99,
			billingCost: 19.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv'
		};

		const id = await saveContract(contract);
		expect(id).toBe('456');
	});
});
