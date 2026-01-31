import { describe, it, expect } from 'vitest';
import { providersByCategory, getProvidersForCategory } from './providers';
import type { CategoryType } from '$lib/db';

describe('providersByCategory', () => {
	it('should have providers defined for categories', () => {
		expect(providersByCategory).toBeDefined();
		expect(Object.keys(providersByCategory).length).toBeGreaterThan(0);
	});

	it('should have array of providers for each category', () => {
		Object.keys(providersByCategory).forEach((category) => {
			expect(Array.isArray(providersByCategory[category])).toBe(true);
		});
	});

	it('should have providers for internet category', () => {
		expect(providersByCategory.internet.length).toBeGreaterThan(0);
		expect(providersByCategory.internet).toContain('Telekom');
	});

	it('should have providers for mobilfunk category', () => {
		expect(providersByCategory.mobilfunk.length).toBeGreaterThan(0);
	});

	it('should have providers for insurance categories', () => {
		expect(providersByCategory.krankenversicherung.length).toBeGreaterThan(0);
		expect(providersByCategory.haftpflicht.length).toBeGreaterThan(0);
	});

	it('should have providers for energy categories', () => {
		expect(providersByCategory.strom.length).toBeGreaterThan(0);
		expect(providersByCategory.gas.length).toBeGreaterThan(0);
	});

	it('should have providers for streaming categories', () => {
		expect(providersByCategory['streaming-video'].length).toBeGreaterThan(0);
		expect(providersByCategory['streaming-musik'].length).toBeGreaterThan(0);
	});

	it('should allow empty arrays for categories without providers', () => {
		expect(Array.isArray(providersByCategory.miete)).toBe(true);
		expect(Array.isArray(providersByCategory.custom)).toBe(true);
	});
});

describe('getProvidersForCategory', () => {
	it('should return providers for valid category', () => {
		const providers = getProvidersForCategory('internet');
		expect(Array.isArray(providers)).toBe(true);
		expect(providers.length).toBeGreaterThan(0);
	});

	it('should return empty array for invalid category', () => {
		const providers = getProvidersForCategory('nonexistent' as CategoryType);
		expect(Array.isArray(providers)).toBe(true);
		expect(providers.length).toBe(0);
	});

	it('should return correct providers for internet', () => {
		const providers = getProvidersForCategory('internet');
		expect(providers).toContain('Telekom');
		expect(providers).toContain('Vodafone');
	});

	it('should return correct providers for mobilfunk', () => {
		const providers = getProvidersForCategory('mobilfunk');
		expect(providers).toContain('Telekom');
		expect(providers).toContain('Vodafone');
		expect(providers).toContain('O2');
	});

	it('should return correct providers for streaming-video', () => {
		const providers = getProvidersForCategory('streaming-video');
		expect(providers).toContain('Netflix');
		expect(providers).toContain('Disney+');
		expect(providers).toContain('Amazon Prime Video');
	});

	it('should return correct providers for streaming-musik', () => {
		const providers = getProvidersForCategory('streaming-musik');
		expect(providers).toContain('Spotify');
		expect(providers).toContain('Apple Music');
	});

	it('should return providers for all major categories', () => {
		const categories: CategoryType[] = [
			'internet',
			'mobilfunk',
			'krankenversicherung',
			'strom',
			'streaming-video',
			'fitnessstudio',
			'girokonto'
		];

		categories.forEach((category) => {
			const providers = getProvidersForCategory(category);
			expect(Array.isArray(providers)).toBe(true);
		});
	});

	it('should handle custom category', () => {
		const providers = getProvidersForCategory('custom');
		expect(Array.isArray(providers)).toBe(true);
	});
});
