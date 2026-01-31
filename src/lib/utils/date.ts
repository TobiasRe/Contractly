import { get } from 'svelte/store';
import { locale, getLocaleCode } from '$lib/stores/i18n';

/**
 * Formats a date using the current locale settings
 * @param date - Date object, date string, or undefined
 * @returns Formatted date string or '-' if date is undefined
 */
export function formatDate(date: Date | string | undefined): string {
	if (!date) return '-';
	
	const currentLocale = get(locale);
	const dateObj = date instanceof Date ? date : new Date(date);
	
	// Validate date
	if (isNaN(dateObj.getTime())) {
		return '-';
	}
	
	return new Intl.DateTimeFormat(getLocaleCode(currentLocale), {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(dateObj);
}
