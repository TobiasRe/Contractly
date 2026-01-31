import type { CategoryType } from '$lib/db';
import { locale } from '$lib/stores/i18n';
import { get } from 'svelte/store';

export interface CategoryGroup {
	id: string;
	name: string;
	nameEn: string;
	icon: string;
	categories: CategoryConfig[];
}

export interface CategoryConfig {
	id: CategoryType;
	name: string;
	nameEn: string;
	icon: string;
	color: string;
	defaultCancellationPeriod: number;
	defaultReminderDays: number[];
	typicalDuration?: number;
}

export const categoryGroups: CategoryGroup[] = [
	{
		id: 'telecom',
		name: 'Telekommunikation',
		nameEn: 'Telecommunications',
		icon: 'Smartphone',
		categories: [
			{
				id: 'mobilfunk',
				name: 'Mobilfunk',
				nameEn: 'Mobile',
				icon: 'Smartphone',
				color: 'blue-500',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90, 60, 30],
				typicalDuration: 24
			},
			{
				id: 'festnetz',
				name: 'Festnetz',
				nameEn: 'Landline',
				icon: 'Phone',
				color: 'blue-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90, 60],
				typicalDuration: 24
			},
			{
				id: 'internet',
				name: 'Internet',
				nameEn: 'Internet',
				icon: 'Wifi',
				color: 'blue-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90, 60],
				typicalDuration: 24
			},
			{
				id: 'kombi-tarif',
				name: 'Kombi-Tarif',
				nameEn: 'Bundle',
				icon: 'Package',
				color: 'blue-400',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90, 60],
				typicalDuration: 24
			}
		]
	},
	{
		id: 'insurance',
		name: 'Versicherungen',
		nameEn: 'Insurance',
		icon: 'Shield',
		categories: [
			{
				id: 'krankenversicherung',
				name: 'Krankenversicherung',
				nameEn: 'Health Insurance',
				icon: 'Heart',
				color: 'red-500',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'haftpflicht',
				name: 'Haftpflicht',
				nameEn: 'Liability',
				icon: 'Shield',
				color: 'green-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'hausrat',
				name: 'Hausrat',
				nameEn: 'Contents Insurance',
				icon: 'Home',
				color: 'amber-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'kfz-versicherung',
				name: 'Kfz-Versicherung',
				nameEn: 'Car Insurance',
				icon: 'Car',
				color: 'slate-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'rechtsschutz',
				name: 'Rechtsschutz',
				nameEn: 'Legal Insurance',
				icon: 'Scale',
				color: 'purple-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'berufsunfaehigkeit',
				name: 'Berufsunfähigkeit',
				nameEn: 'Disability Insurance',
				icon: 'Briefcase',
				color: 'indigo-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'lebensversicherung',
				name: 'Lebensversicherung',
				nameEn: 'Life Insurance',
				icon: 'Users',
				color: 'cyan-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'zahnzusatz',
				name: 'Zahnzusatz',
				nameEn: 'Dental Insurance',
				icon: 'Smile',
				color: 'teal-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'unfallversicherung',
				name: 'Unfallversicherung',
				nameEn: 'Accident Insurance',
				icon: 'AlertTriangle',
				color: 'orange-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			},
			{
				id: 'tierversicherung',
				name: 'Tierversicherung',
				nameEn: 'Pet Insurance',
				icon: 'PawPrint',
				color: 'pink-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'energy',
		name: 'Energie & Versorgung',
		nameEn: 'Energy & Utilities',
		icon: 'Zap',
		categories: [
			{
				id: 'strom',
				name: 'Strom',
				nameEn: 'Electricity',
				icon: 'Zap',
				color: 'yellow-500',
				defaultCancellationPeriod: 42,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'gas',
				name: 'Gas',
				nameEn: 'Gas',
				icon: 'Flame',
				color: 'orange-500',
				defaultCancellationPeriod: 42,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'fernwaerme',
				name: 'Fernwärme',
				nameEn: 'District Heating',
				icon: 'Thermometer',
				color: 'red-400',
				defaultCancellationPeriod: 42,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'wasser',
				name: 'Wasser',
				nameEn: 'Water',
				icon: 'Droplet',
				color: 'cyan-500',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'housing',
		name: 'Wohnen',
		nameEn: 'Housing',
		icon: 'Home',
		categories: [
			{
				id: 'miete',
				name: 'Miete',
				nameEn: 'Rent',
				icon: 'Home',
				color: 'purple-500',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [180, 90]
			},
			{
				id: 'nebenkosten',
				name: 'Nebenkosten',
				nameEn: 'Utilities',
				icon: 'Receipt',
				color: 'purple-400',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90]
			},
			{
				id: 'hausmeister',
				name: 'Hausmeister',
				nameEn: 'Caretaker',
				icon: 'Wrench',
				color: 'slate-500',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90],
				typicalDuration: 12
			},
			{
				id: 'parkplatz',
				name: 'Parkplatz',
				nameEn: 'Parking',
				icon: 'ParkingCircle',
				color: 'gray-600',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'media',
		name: 'Medien & Abos',
		nameEn: 'Media & Subscriptions',
		icon: 'Film',
		categories: [
			{
				id: 'streaming-video',
				name: 'Streaming (Video)',
				nameEn: 'Streaming (Video)',
				icon: 'Video',
				color: 'pink-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [7]
			},
			{
				id: 'streaming-musik',
				name: 'Streaming (Musik)',
				nameEn: 'Streaming (Music)',
				icon: 'Music',
				color: 'green-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [7]
			},
			{
				id: 'streaming-gaming',
				name: 'Streaming (Gaming)',
				nameEn: 'Streaming (Gaming)',
				icon: 'Gamepad2',
				color: 'violet-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [7]
			},
			{
				id: 'zeitschrift',
				name: 'Zeitschrift',
				nameEn: 'Magazine',
				icon: 'BookOpen',
				color: 'amber-500',
				defaultCancellationPeriod: 42,
				defaultReminderDays: [60],
				typicalDuration: 12
			},
			{
				id: 'zeitung',
				name: 'Zeitung',
				nameEn: 'Newspaper',
				icon: 'Newspaper',
				color: 'slate-700',
				defaultCancellationPeriod: 28,
				defaultReminderDays: [60],
				typicalDuration: 12
			},
			{
				id: 'hoerbuch',
				name: 'Hörbuch',
				nameEn: 'Audiobook',
				icon: 'Headphones',
				color: 'indigo-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [7]
			}
		]
	},
	{
		id: 'software',
		name: 'Software & Cloud',
		nameEn: 'Software & Cloud',
		icon: 'Cloud',
		categories: [
			{
				id: 'software-abo',
				name: 'Software-Abo',
				nameEn: 'Software Subscription',
				icon: 'Monitor',
				color: 'blue-600',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [30, 7],
				typicalDuration: 12
			},
			{
				id: 'cloud-speicher',
				name: 'Cloud-Speicher',
				nameEn: 'Cloud Storage',
				icon: 'Cloud',
				color: 'sky-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [30, 7]
			},
			{
				id: 'domain-hosting',
				name: 'Domain/Hosting',
				nameEn: 'Domain/Hosting',
				icon: 'Globe',
				color: 'emerald-600',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'fitness',
		name: 'Fitness & Gesundheit',
		nameEn: 'Fitness & Health',
		icon: 'Dumbbell',
		categories: [
			{
				id: 'fitnessstudio',
				name: 'Fitnessstudio',
				nameEn: 'Gym',
				icon: 'Dumbbell',
				color: 'emerald-500',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'yoga-studio',
				name: 'Yoga Studio',
				nameEn: 'Yoga Studio',
				icon: 'Activity',
				color: 'teal-500',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 6
			},
			{
				id: 'schwimmbad',
				name: 'Schwimmbad',
				nameEn: 'Swimming Pool',
				icon: 'Waves',
				color: 'cyan-600',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'physiotherapie',
				name: 'Physiotherapie',
				nameEn: 'Physiotherapy',
				icon: 'HeartPulse',
				color: 'rose-500',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [30]
			}
		]
	},
	{
		id: 'mobility',
		name: 'Mobilität',
		nameEn: 'Mobility',
		icon: 'Train',
		categories: [
			{
				id: 'bahncard',
				name: 'BahnCard',
				nameEn: 'BahnCard',
				icon: 'Train',
				color: 'red-600',
				defaultCancellationPeriod: 42,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'oepnv-abo',
				name: 'ÖPNV-Abo',
				nameEn: 'Public Transport',
				icon: 'Bus',
				color: 'green-600',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30]
			},
			{
				id: 'carsharing',
				name: 'Carsharing',
				nameEn: 'Car Sharing',
				icon: 'CarFront',
				color: 'blue-600',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [30]
			},
			{
				id: 'kfz-leasing',
				name: 'Kfz-Leasing',
				nameEn: 'Car Leasing',
				icon: 'Car',
				color: 'slate-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [180, 90],
				typicalDuration: 36
			},
			{
				id: 'fahrrad-leasing',
				name: 'Fahrrad-Leasing',
				nameEn: 'Bike Leasing',
				icon: 'Bike',
				color: 'lime-600',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 36
			},
			{
				id: 'parkhaus-abo',
				name: 'Parkhaus-Abo',
				nameEn: 'Parking Subscription',
				icon: 'ParkingCircle',
				color: 'gray-500',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'tankstelle-karte',
				name: 'Tankstellen-Karte',
				nameEn: 'Fuel Card',
				icon: 'Fuel',
				color: 'orange-600',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30]
			}
		]
	},
	{
		id: 'finance',
		name: 'Finanzprodukte',
		nameEn: 'Financial Products',
		icon: 'CreditCard',
		categories: [
			{
				id: 'girokonto',
				name: 'Girokonto',
				nameEn: 'Current Account',
				icon: 'Wallet',
				color: 'blue-700',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30]
			},
			{
				id: 'kreditkarte',
				name: 'Kreditkarte',
				nameEn: 'Credit Card',
				icon: 'CreditCard',
				color: 'purple-600',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'depot',
				name: 'Depot',
				nameEn: 'Securities Account',
				icon: 'TrendingUp',
				color: 'green-700',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30]
			},
			{
				id: 'bausparvertrag',
				name: 'Bausparvertrag',
				nameEn: 'Building Loan',
				icon: 'Building2',
				color: 'amber-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [180, 90]
			},
			{
				id: 'kredit',
				name: 'Kredit',
				nameEn: 'Loan',
				icon: 'Coins',
				color: 'red-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 60
			}
		]
	},
	{
		id: 'public',
		name: 'Öffentliche Beiträge',
		nameEn: 'Public Contributions',
		icon: 'Building',
		categories: [
			{
				id: 'rundfunkbeitrag',
				name: 'Rundfunkbeitrag',
				nameEn: 'Broadcasting Fee',
				icon: 'Radio',
				color: 'blue-800',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90]
			},
			{
				id: 'muellabfuhr',
				name: 'Müllabfuhr',
				nameEn: 'Waste Disposal',
				icon: 'Trash2',
				color: 'green-800',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120],
				typicalDuration: 12
			},
			{
				id: 'schornsteinfeger',
				name: 'Schornsteinfeger',
				nameEn: 'Chimney Sweep',
				icon: 'Sparkles',
				color: 'slate-800',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'membership',
		name: 'Mitgliedschaften',
		nameEn: 'Memberships',
		icon: 'Users',
		categories: [
			{
				id: 'verein',
				name: 'Verein',
				nameEn: 'Club',
				icon: 'Users',
				color: 'indigo-600',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'gewerkschaft',
				name: 'Gewerkschaft',
				nameEn: 'Union',
				icon: 'Handshake',
				color: 'red-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90]
			},
			{
				id: 'automobilclub',
				name: 'Automobilclub',
				nameEn: 'Auto Club',
				icon: 'Car',
				color: 'yellow-600',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'berufsverband',
				name: 'Berufsverband',
				nameEn: 'Professional Association',
				icon: 'Briefcase',
				color: 'gray-700',
				defaultCancellationPeriod: 90,
				defaultReminderDays: [120, 90],
				typicalDuration: 12
			}
		]
	},
	{
		id: 'other',
		name: 'Sonstiges',
		nameEn: 'Other',
		icon: 'MoreHorizontal',
		categories: [
			{
				id: 'telematik',
				name: 'Telematik',
				nameEn: 'Telematics',
				icon: 'Satellite',
				color: 'cyan-700',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'security-dienst',
				name: 'Security-Dienst',
				nameEn: 'Security Service',
				icon: 'ShieldCheck',
				color: 'red-800',
				defaultCancellationPeriod: 60,
				defaultReminderDays: [90, 60],
				typicalDuration: 12
			},
			{
				id: 'reinigung',
				name: 'Reinigung',
				nameEn: 'Cleaning',
				icon: 'Sparkles',
				color: 'sky-600',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30],
				typicalDuration: 12
			},
			{
				id: 'lieferservice-abo',
				name: 'Lieferservice-Abo',
				nameEn: 'Delivery Subscription',
				icon: 'Truck',
				color: 'orange-700',
				defaultCancellationPeriod: 0,
				defaultReminderDays: [30, 7]
			},
			{
				id: 'custom',
				name: 'Benutzerdefiniert',
				nameEn: 'Custom',
				icon: 'Tag',
				color: 'gray-600',
				defaultCancellationPeriod: 30,
				defaultReminderDays: [60, 30]
			}
		]
	}
];

/**
 * Get category configuration by category ID
 */
export function getCategoryConfig(categoryId: CategoryType): CategoryConfig | undefined {
	for (const group of categoryGroups) {
		const category = group.categories.find((c) => c.id === categoryId);
		if (category) return category;
	}
	return undefined;
}

/**
 * Get category group that contains the given category
 */
export function getCategoryGroup(categoryId: CategoryType): CategoryGroup | undefined {
	return categoryGroups.find((group) => 
		group.categories.some((c) => c.id === categoryId)
	);
}

/**
 * Get category name with translation fallback
 */
export function getCategoryName(categoryId: CategoryType, t: (key: string) => string): string {
	const translationKey = `categories.items.${categoryId}`;
	const translated = t(translationKey);
	
	// If translation exists (not just the key), return it
	if (translated !== translationKey) {
		return translated;
	}
	
	// Fall back to config name
	const config = getCategoryConfig(categoryId);
	if (!config) return categoryId;
	
	const currentLocale = get(locale);
	return currentLocale === 'en' ? config.nameEn : config.name;
}

/**
 * Get category group name with translation fallback
 */
export function getCategoryGroupName(groupId: string, t: (key: string) => string): string {
	const translationKey = `categories.groups.${groupId}`;
	const translated = t(translationKey);
	
	// If translation exists (not just the key), return it
	if (translated !== translationKey) {
		return translated;
	}
	
	// Fall back to config name
	const group = categoryGroups.find((g) => g.id === groupId);
	if (!group) return groupId;
	
	const currentLocale = get(locale);
	return currentLocale === 'en' ? group.nameEn : group.name;
}
