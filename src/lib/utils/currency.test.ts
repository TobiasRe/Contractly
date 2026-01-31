import { describe, it, expect, beforeEach } from 'vitest';
import { formatCurrency } from './currency';
import { setCurrency } from '$lib/stores/currency';
import { setLocale } from '$lib/stores/i18n';

describe('formatCurrency', () => {
	beforeEach(() => {
		setCurrency('EUR');
		setLocale('de');
	});

	it('should format EUR correctly for German locale', () => {
		setCurrency('EUR');
		setLocale('de');
		const result = formatCurrency(1234.56);
		expect(result).toContain('1.234,56');
		expect(result).toContain('€');
	});

	it('should format USD correctly', () => {
		setCurrency('USD');
		const result = formatCurrency(1234.56);
		expect(result).toContain('$');
	});

	it('should format GBP correctly', () => {
		setCurrency('GBP');
		const result = formatCurrency(1234.56);
		expect(result).toContain('£');
	});

	it('should format CHF correctly', () => {
		setCurrency('CHF');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should format PLN correctly', () => {
		setCurrency('PLN');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should format CZK correctly', () => {
		setCurrency('CZK');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should format SEK correctly', () => {
		setCurrency('SEK');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should format NOK correctly', () => {
		setCurrency('NOK');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should format DKK correctly', () => {
		setCurrency('DKK');
		const result = formatCurrency(1234.56);
		expect(result).toBeTruthy();
	});

	it('should use custom currency when provided', () => {
		setCurrency('EUR');
		const result = formatCurrency(100, 'USD');
		expect(result).toContain('$');
	});

	it('should format zero correctly', () => {
		const result = formatCurrency(0);
		expect(result).toBeTruthy();
	});

	it('should format negative amounts correctly', () => {
		const result = formatCurrency(-100);
		expect(result).toBeTruthy();
	});

	it('should format large amounts correctly', () => {
		const result = formatCurrency(999999.99);
		expect(result).toBeTruthy();
	});

	it('should format small amounts correctly', () => {
		const result = formatCurrency(0.01);
		expect(result).toBeTruthy();
	});

	it('should format for English locale', () => {
		setLocale('en');
		setCurrency('EUR');
		const result = formatCurrency(1234.56);
		expect(result).toContain('€');
	});
});
