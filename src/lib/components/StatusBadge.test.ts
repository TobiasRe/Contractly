import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import StatusBadge from './StatusBadge.svelte';
import type { ContractStatus } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';

describe('StatusBadge', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should render with aktiv status', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus
			}
		});

		expect(container).toBeTruthy();
		const badge = container.querySelector('span');
		expect(badge).toBeTruthy();
	});

	it('should render with gekündigt status', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'gekündigt' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge).toBeTruthy();
		expect(badge?.className).toContain('text-warning');
	});

	it('should render with beendet status', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'beendet' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge).toBeTruthy();
		expect(badge?.className).toContain('text-muted');
	});

	it('should use small size when specified', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus,
				size: 'sm' as const
			}
		});

		const badge = container.querySelector('span');
		expect(badge?.className).toContain('text-xs');
	});

	it('should use medium size by default', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge?.className).toContain('text-sm');
	});

	it('should display translated status text', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge?.textContent).toBeTruthy();
	});

	it('should have correct CSS classes for aktiv status', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge?.className).toContain('text-success');
		expect(badge?.className).toContain('bg-green-50');
	});

	it('should have rounded-full class', () => {
		const { container } = render(StatusBadge, {
			props: {
				status: 'aktiv' as ContractStatus
			}
		});

		const badge = container.querySelector('span');
		expect(badge?.className).toContain('rounded-full');
	});
});
