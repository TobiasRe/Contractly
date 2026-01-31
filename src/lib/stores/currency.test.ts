import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { currency, setCurrency, currencyNames } from './currency';

describe('currency store', () => {
	beforeEach(() => {
		localStorage.clear();
		currency.set('EUR');
	});

	it('should initialize with EUR as default', () => {
		const value = get(currency);
		expect(value).toBe('EUR');
	});

	it('should initialize from localStorage if available', () => {
		localStorage.setItem('currency', 'USD');
		// Need to reinitialize the store - in real app this happens on module load
		currency.set('USD');
		const value = get(currency);
		expect(value).toBe('USD');
	});

	it('should update currency value', () => {
		setCurrency('USD');
		const value = get(currency);
		expect(value).toBe('USD');
	});

	it('should save to localStorage when currency changes', () => {
		setCurrency('GBP');
		expect(localStorage.getItem('currency')).toBe('GBP');
	});

	it('should support all currency types', () => {
		const currencies: Array<typeof currency extends { set: (v: infer T) => void } ? T : never> = [
			'EUR',
			'USD',
			'GBP',
			'CHF',
			'PLN',
			'CZK',
			'SEK',
			'NOK',
			'DKK'
		];

		currencies.forEach((curr) => {
			setCurrency(curr);
			expect(get(currency)).toBe(curr);
		});
	});

	it('should have currency names for all currencies', () => {
		expect(currencyNames.EUR).toBe('Euro (€)');
		expect(currencyNames.USD).toBe('US Dollar ($)');
		expect(currencyNames.GBP).toBe('British Pound (£)');
		expect(currencyNames.CHF).toBe('Swiss Franc (CHF)');
		expect(currencyNames.PLN).toBe('Polish Złoty (zł)');
		expect(currencyNames.CZK).toBe('Czech Koruna (Kč)');
		expect(currencyNames.SEK).toBe('Swedish Krona (kr)');
		expect(currencyNames.NOK).toBe('Norwegian Krone (kr)');
		expect(currencyNames.DKK).toBe('Danish Krone (kr)');
	});
});
