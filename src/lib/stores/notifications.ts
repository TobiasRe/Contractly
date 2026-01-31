import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { db } from '$lib/db';
import { t } from '$lib/stores/i18n';

export const notificationsEnabled = writable(false);

/**
 * Check if browser supports notifications
 */
export function checkNotificationSupport(): boolean {
	if (!browser) return false;
	return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
	if (!browser || !checkNotificationSupport()) {
		return false;
	}

	const permission = await Notification.requestPermission();
	const enabled = permission === 'granted';
	notificationsEnabled.set(enabled);
	
	if (enabled) {
		localStorage.setItem('notificationsEnabled', 'true');
	}

	return enabled;
}

/**
 * Check contracts and send notifications
 */
export async function checkUpcomingDeadlines() {
	if (!browser) return;
	
	const enabled = localStorage.getItem('notificationsEnabled') === 'true';
	if (!enabled || !checkNotificationSupport()) {
		return;
	}

	const contracts = await db.contracts.toArray();
	const now = new Date();

	for (const contract of contracts) {
		if (!contract.cancellationDate) continue;

		const cancelDate = new Date(contract.cancellationDate);
		const daysUntil = Math.ceil((cancelDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

		// Send notification if within reminder period
		if (daysUntil > 0 && daysUntil <= contract.reminderDays) {
			const notificationShown = localStorage.getItem(`notification-${contract.id}-${daysUntil}`);
			
			if (!notificationShown) {
				showNotification(contract.name, daysUntil);
				localStorage.setItem(`notification-${contract.id}-${daysUntil}`, 'true');
			}
		}
	}
}

function showNotification(contractName: string, daysUntil: number) {
	if (!browser || Notification.permission !== 'granted') {
		return;
	}
	
	const translate = get(t);
	new Notification(translate('contract.deadlineExpiring'), {
		body: translate('contract.deadlineExpiringBody')
			.replace('{name}', contractName)
			.replace('{days}', daysUntil.toString()),
		icon: '/icon-192.png',
		badge: '/icon-192.png',
		tag: contractName
	});
}

/**
 * Initialize notification checking (call this on app start)
 */
export function initNotifications() {
	if (!browser) return;
	
	const enabled = localStorage.getItem('notificationsEnabled') === 'true';
	notificationsEnabled.set(enabled);

	if (enabled) {
		checkUpcomingDeadlines();
		
		// Check daily (24 hours in milliseconds)
		const DAILY_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
		setInterval(() => {
			checkUpcomingDeadlines();
		}, DAILY_CHECK_INTERVAL);
	}
}
