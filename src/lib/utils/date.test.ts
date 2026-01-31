import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatDate } from './date';
import { locale, setLocale } from '$lib/stores/i18n';

describe('formatDate', () => {
	beforeEach(() => {
		setLocale('de');
	});

	it('should return "-" for undefined date', () => {
		expect(formatDate(undefined)).toBe('-');
	});

	it('should return "-" for invalid date string', () => {
		expect(formatDate('invalid-date')).toBe('-');
	});

	it('should format Date object correctly for German locale', () => {
		setLocale('de');
		const date = new Date('2024-01-15');
		const result = formatDate(date);
		expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
	});

	it('should format date string correctly', () => {
		setLocale('de');
		const result = formatDate('2024-01-15');
		expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
	});

	it('should format date correctly for English locale', () => {
		setLocale('en');
		const date = new Date('2024-01-15');
		const result = formatDate(date);
		expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
	});

	it('should handle dates at month boundaries', () => {
		setLocale('de');
		const date = new Date('2024-12-31');
		const result = formatDate(date);
		expect(result).toContain('2024');
	});

	it('should handle dates at year boundaries', () => {
		setLocale('de');
		const date = new Date('2024-01-01');
		const result = formatDate(date);
		expect(result).toContain('2024');
	});
});
