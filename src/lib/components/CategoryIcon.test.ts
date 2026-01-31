import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import CategoryIcon from './CategoryIcon.svelte';
import type { CategoryType } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';

describe('CategoryIcon', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should render with valid category', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType
			}
		});

		expect(container).toBeTruthy();
		const iconContainer = container.querySelector('div');
		expect(iconContainer).toBeTruthy();
	});

	it('should render with different categories', () => {
		const categories: CategoryType[] = [
			'internet',
			'mobilfunk',
			'krankenversicherung',
			'strom',
			'streaming-video'
		];

		categories.forEach((category) => {
			const { container } = render(CategoryIcon, {
				props: { category }
			});
			expect(container.querySelector('div')).toBeTruthy();
		});
	});

	it('should use small size when specified', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType,
				size: 'sm' as const
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer?.className).toContain('w-8');
		expect(iconContainer?.className).toContain('h-8');
	});

	it('should use medium size by default', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer?.className).toContain('w-10');
		expect(iconContainer?.className).toContain('h-10');
	});

	it('should use large size when specified', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType,
				size: 'lg' as const
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer?.className).toContain('w-12');
		expect(iconContainer?.className).toContain('h-12');
	});

	it('should render fallback icon for invalid category', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'nonexistent' as CategoryType
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer).toBeTruthy();
		expect(iconContainer?.className).toContain('bg-slate-100');
	});

	it('should have rounded-lg class', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer?.className).toContain('rounded-lg');
	});

	it('should apply category color styles', () => {
		const { container } = render(CategoryIcon, {
			props: {
				category: 'internet' as CategoryType
			}
		});

		const iconContainer = container.querySelector('div');
		expect(iconContainer?.getAttribute('style')).toBeTruthy();
	});
});
