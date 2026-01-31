import { get } from 'svelte/store';
import { currency } from '$lib/stores/currency';
import { locale } from '$lib/stores/i18n';

type LocaleCode = 'de-DE' | 'en-US';

const LOCALE_MAP: Record<string, LocaleCode> = {
	de: 'de-DE',
	en: 'en-US'
};

const DEFAULT_LOCALE: LocaleCode = 'de-DE';

/**
 * Formats a number as currency using the selected currency and locale
 * @param amount - The amount to format
 * @param customCurrency - Optional custom currency code (defaults to selected currency)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, customCurrency?: string): string {
	const selectedCurrency = customCurrency || get(currency);
	const currentLocale = get(locale);
	const formatLocale = LOCALE_MAP[currentLocale] || DEFAULT_LOCALE;
	
	return new Intl.NumberFormat(formatLocale, {
		style: 'currency',
		currency: selectedCurrency
	}).format(amount);
}
