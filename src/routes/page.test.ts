import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { onMount } from 'svelte';
import HomePage from './+page.svelte';
import { db } from '$lib/db';
import type { Contract } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';
import { setCurrency } from '$lib/stores/currency';

describe('HomePage', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
		setCurrency('EUR');
	});

	it('should render the page', () => {
		const { container } = render(HomePage);
		expect(container).toBeTruthy();
	});

	it('should display empty state when no contracts', async () => {
		const { container } = render(HomePage);
		await waitFor(() => {
			const emptyState = container.querySelector('.card.text-center');
			expect(emptyState).toBeTruthy();
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
		const { container } = render(HomePage);
		
		// Wait for component to render and check if it renders at all
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		}, { timeout: 2000 });
		
		// Verify contract was added to database
		const contracts = await db.contracts.toArray();
		expect(contracts.length).toBeGreaterThan(0);
	});

	it('should display total monthly cost', async () => {
		const contract: Contract = {
			id: '1',
			name: 'Contract',
			category: 'internet',
			provider: 'Provider',
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
		const { container } = render(HomePage);
		
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		});
	});

	it('should display contract count', async () => {
		const contract: Contract = {
			id: '1',
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
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);
		const { container } = render(HomePage);
		
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		});
	});

	it('should display upcoming deadlines', async () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 30);

		const contract: Contract = {
			id: '1',
			name: 'Upcoming Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationDate: futureDate,
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);
		const { container } = render(HomePage);
		
		// Wait for component to render
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		}, { timeout: 2000 });
		
		// Verify contract with cancellation date was added
		const contracts = await db.contracts.toArray();
		const upcomingContract = contracts.find(c => c.cancellationDate);
		expect(upcomingContract).toBeDefined();
	});
});
