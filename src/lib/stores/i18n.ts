import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import de from '$lib/i18n/de.json';
import en from '$lib/i18n/en.json';

type Locale = 'de' | 'en';

interface Translations {
	de: typeof de;
	en: typeof en;
}

const translations: Translations = { de, en };

/**
 * Get initial locale from localStorage or default to German
 */
const getStoredLocale = (): Locale | null => {
	if (!browser) return null;
	const stored = localStorage.getItem('locale');
	return (stored as Locale) || null;
};

const initialLocale: Locale = getStoredLocale() || 'de';

export const locale = writable<Locale>(initialLocale);

/**
 * Save locale to localStorage when it changes
 */
locale.subscribe((value) => {
	if (browser) {
		localStorage.setItem('locale', value);
		document.documentElement.lang = value;
	}
});

export const t = derived(locale, ($locale) => {
	return (key: string): string => {
		const keys = key.split('.');
		let value: unknown = translations[$locale];

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = (value as Record<string, unknown>)[k];
			} else {
				return key;
			}
		}

		return typeof value === 'string' ? value : key;
	};
});

export function setLocale(newLocale: Locale) {
	locale.set(newLocale);
}

export function getLocaleCode(l: Locale): string {
	const map: Record<Locale, string> = {
		de: 'de-DE',
		en: 'en-US'
	};
	return map[l] || 'de-DE';
}
