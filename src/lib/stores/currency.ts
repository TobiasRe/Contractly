import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'PLN' | 'CZK' | 'SEK' | 'NOK' | 'DKK';

/**
 * Get initial currency from localStorage or default to EUR
 */
const getStoredCurrency = (): Currency | null => {
	if (!browser) return null;
	const stored = localStorage.getItem('currency');
	return (stored as Currency) || null;
};

const initialCurrency: Currency = getStoredCurrency() || 'EUR';

export const currency = writable<Currency>(initialCurrency);

/**
 * Save currency to localStorage when it changes
 */
currency.subscribe((value) => {
	if (browser) {
		localStorage.setItem('currency', value);
	}
});

export function setCurrency(newCurrency: Currency) {
	currency.set(newCurrency);
}

export const currencyNames: Record<Currency, string> = {
	EUR: 'Euro (€)',
	USD: 'US Dollar ($)',
	GBP: 'British Pound (£)',
	CHF: 'Swiss Franc (CHF)',
	PLN: 'Polish Złoty (zł)',
	CZK: 'Czech Koruna (Kč)',
	SEK: 'Swedish Krona (kr)',
	NOK: 'Norwegian Krone (kr)',
	DKK: 'Danish Krone (kr)'
};
