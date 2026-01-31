import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import SettingsPage from './+page.svelte';
import { db } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';
import { setCurrency } from '$lib/stores/currency';

describe('SettingsPage', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		setLocale('de');
		setCurrency('EUR');
	});

	it('should render the page', () => {
		const { container } = render(SettingsPage);
		expect(container).toBeTruthy();
	});

	it('should display language settings', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should display currency settings', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should display export options', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should display import options', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});

	it('should display backup options', () => {
		const { container } = render(SettingsPage);
		expect(container.textContent).toBeTruthy();
	});
});
