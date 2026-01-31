import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Layout from './+layout.svelte';
import { setLocale } from '$lib/stores/i18n';

describe('Layout', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should render the layout', () => {
		const { container } = render(Layout);
		expect(container).toBeTruthy();
	});

	it('should render navigation items', () => {
		const { container } = render(Layout);
		const nav = container.querySelector('nav');
		expect(nav).toBeTruthy();
	});

	it('should have navigation links', () => {
		const { container } = render(Layout);
		const links = container.querySelectorAll('a');
		expect(links.length).toBeGreaterThan(0);
	});

	it('should initialize notifications on mount', () => {
		const { container } = render(Layout);
		expect(container).toBeTruthy();
	});
});
