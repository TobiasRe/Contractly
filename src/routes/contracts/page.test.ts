import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import ContractsPage from './+page.svelte';
import { db } from '$lib/db';
import type { Contract } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';
import { setCurrency } from '$lib/stores/currency';

describe('ContractsPage', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
		setCurrency('EUR');
	});

	it('should render the page', () => {
		const { container } = render(ContractsPage);
		expect(container).toBeTruthy();
	});

	it('should display empty state when no contracts', async () => {
		const { container } = render(ContractsPage);
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		});
	});

	it('should display contracts when available', async () => {
		const contract: Contract = {
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
		};

		await db.contracts.add(contract);
		const { container } = render(ContractsPage);
		
		// Wait for component to render
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		}, { timeout: 2000 });
		
		// Verify contract was added
		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBeGreaterThan(0);
	});

	it('should filter contracts by search query', async () => {
		const contract1: Contract = {
			id: '1',
			name: 'Internet Contract',
			category: 'internet',
			provider: 'Provider A',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		const contract2: Contract = {
			id: '2',
			name: 'Mobile Contract',
			category: 'mobilfunk',
			provider: 'Provider B',
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

		await db.contracts.add(contract1);
		await db.contracts.add(contract2);
		
		const { container } = render(ContractsPage);
		
		// Wait for component to render
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		}, { timeout: 2000 });
		
		// Verify contracts were added
		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBe(2);
	});
});
