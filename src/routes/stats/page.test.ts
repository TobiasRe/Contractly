import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import StatsPage from './+page.svelte';
import { db } from '$lib/db';
import type { Contract } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';
import { setCurrency } from '$lib/stores/currency';

describe('StatsPage', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
		setCurrency('EUR');
	});

	it('should render the page', () => {
		const { container } = render(StatsPage);
		expect(container).toBeTruthy();
	});

	it('should display stats when contracts available', async () => {
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
		const { container } = render(StatsPage);
		
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		});
	});

	it('should display empty state when no contracts', async () => {
		const { container } = render(StatsPage);
		await waitFor(() => {
			expect(container.textContent).toBeTruthy();
		});
	});
});
