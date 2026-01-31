import { describe, it, expect, beforeEach } from 'vitest';
import {
	categoryGroups,
	getCategoryConfig,
	getCategoryGroup,
	getCategoryName,
	getCategoryGroupName
} from './categories';
import type { CategoryType } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';

describe('categoryGroups', () => {
	it('should have category groups defined', () => {
		expect(categoryGroups).toBeDefined();
		expect(categoryGroups.length).toBeGreaterThan(0);
	});

	it('should have categories in each group', () => {
		categoryGroups.forEach((group) => {
			expect(group.categories.length).toBeGreaterThan(0);
			expect(group.id).toBeTruthy();
			expect(group.name).toBeTruthy();
			expect(group.nameEn).toBeTruthy();
			expect(group.icon).toBeTruthy();
		});
	});

	it('should have valid category configurations', () => {
		categoryGroups.forEach((group) => {
			group.categories.forEach((category) => {
				expect(category.id).toBeTruthy();
				expect(category.name).toBeTruthy();
				expect(category.nameEn).toBeTruthy();
				expect(category.icon).toBeTruthy();
				expect(category.color).toBeTruthy();
				expect(category.defaultCancellationPeriod).toBeGreaterThanOrEqual(0);
				expect(category.defaultReminderDays).toBeInstanceOf(Array);
			});
		});
	});
});

describe('getCategoryConfig', () => {
	it('should return category config for valid category ID', () => {
		const config = getCategoryConfig('internet');
		expect(config).toBeDefined();
		expect(config?.id).toBe('internet');
		expect(config?.name).toBeTruthy();
	});

	it('should return undefined for invalid category ID', () => {
		const config = getCategoryConfig('nonexistent' as CategoryType);
		expect(config).toBeUndefined();
	});

	it('should return config for all category types', () => {
		const categories: CategoryType[] = [
			'internet',
			'mobilfunk',
			'krankenversicherung',
				'strom',
			'streaming-video',
			'fitnessstudio'
		];

		categories.forEach((category) => {
			const config = getCategoryConfig(category);
			expect(config).toBeDefined();
			expect(config?.id).toBe(category);
		});
	});
});

describe('getCategoryGroup', () => {
	it('should return category group for valid category ID', () => {
		const group = getCategoryGroup('internet');
		expect(group).toBeDefined();
			expect(group?.id).toBe('telecom');
	});

	it('should return undefined for invalid category ID', () => {
		const group = getCategoryGroup('nonexistent' as CategoryType);
		expect(group).toBeUndefined();
	});

	it('should return correct group for different categories', () => {
		expect(getCategoryGroup('internet')?.id).toBe('telecom');
		expect(getCategoryGroup('krankenversicherung')?.id).toBe('insurance');
		expect(getCategoryGroup('strom')?.id).toBe('energy');
		expect(getCategoryGroup('fitnessstudio')?.id).toBe('fitness');
	});
});

describe('getCategoryName', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should return category name for valid category', () => {
		const name = getCategoryName('internet', (key: string) => {
			if (key === 'categories.items.internet') return 'Internet';
			return key;
		});
		expect(name).toBe('Internet');
	});

	it('should fall back to config name when translation not found', () => {
		setLocale('de');
		const name = getCategoryName('internet', (key: string) => key);
		expect(name).toBe('Internet');
	});

	it('should use English name when locale is English', () => {
		setLocale('en');
		const name = getCategoryName('internet', (key: string) => key);
		expect(name).toBe('Internet');
	});

	it('should return category ID if config not found', () => {
		const name = getCategoryName('nonexistent' as CategoryType, (key: string) => key);
		expect(name).toBe('nonexistent');
	});
});

describe('getCategoryGroupName', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should return group name for valid group ID', () => {
		const name = getCategoryGroupName('telecom', (key: string) => {
			if (key === 'categories.groups.telecom') return 'Telekommunikation';
			return key;
		});
		expect(name).toBe('Telekommunikation');
	});

	it('should fall back to config name when translation not found', () => {
		setLocale('de');
		const name = getCategoryGroupName('telecom', (key: string) => key);
		expect(name).toBe('Telekommunikation');
	});

	it('should use English name when locale is English', () => {
		setLocale('en');
		const name = getCategoryGroupName('telecom', (key: string) => key);
		expect(name).toBe('Telecommunications');
	});

	it('should return group ID if group not found', () => {
		const name = getCategoryGroupName('nonexistent', (key: string) => key);
		expect(name).toBe('nonexistent');
	});
});

describe('category data integrity', () => {
	it('should have unique category IDs across all groups', () => {
		const allCategories: CategoryType[] = [];
		categoryGroups.forEach((group) => {
			group.categories.forEach((category) => {
				expect(allCategories).not.toContain(category.id);
				allCategories.push(category.id);
			});
		});
	});

	it('should have valid default reminder days', () => {
		categoryGroups.forEach((group) => {
			group.categories.forEach((category) => {
				expect(category.defaultReminderDays.length).toBeGreaterThan(0);
				category.defaultReminderDays.forEach((days) => {
					expect(days).toBeGreaterThan(0);
				});
			});
		});
	});

	it('should have valid color format', () => {
		categoryGroups.forEach((group) => {
			group.categories.forEach((category) => {
				expect(category.color).toMatch(/^[a-z]+-\d+$/);
			});
		});
	});
});
