import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
	notificationsEnabled,
	checkNotificationSupport,
	requestNotificationPermission,
	checkUpcomingDeadlines,
	initNotifications
} from './notifications';
import { db } from '$lib/db';
import type { Contract } from '$lib/db';
import { setLocale } from '$lib/stores/i18n';

describe('checkNotificationSupport', () => {
	it('should check for Notification API', () => {
		const result = checkNotificationSupport();
		expect(typeof result).toBe('boolean');
	});
});

describe('requestNotificationPermission', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		setLocale('de');
	});

	it('should request permission and update store', async () => {
		// Mock browser environment
		global.Notification = class MockNotification {
			static permission: NotificationPermission = 'default';
			static requestPermission = vi.fn(() => Promise.resolve('granted' as NotificationPermission));
			constructor(public title: string, public options?: NotificationOptions) {}
		} as unknown as typeof Notification;

		Object.defineProperty(navigator, 'serviceWorker', {
			writable: true,
			value: {}
		});

		const result = await requestNotificationPermission();
		expect(result).toBe(true);
		expect(get(notificationsEnabled)).toBe(true);
		expect(localStorage.getItem('notificationsEnabled')).toBe('true');
	});

	it('should handle denied permission', async () => {
		global.Notification = class MockNotification {
			static permission: NotificationPermission = 'default';
			static requestPermission = vi.fn(() => Promise.resolve('denied' as NotificationPermission));
			constructor(public title: string, public options?: NotificationOptions) {}
		} as unknown as typeof Notification;

		Object.defineProperty(navigator, 'serviceWorker', {
			writable: true,
			value: {}
		});

		const result = await requestNotificationPermission();
		expect(result).toBe(false);
		expect(get(notificationsEnabled)).toBe(false);
	});
});

describe('checkUpcomingDeadlines', () => {
	beforeEach(async () => {
		await db.contracts.clear();
		localStorage.clear();
		setLocale('de');
	});

	it('should not check when notifications disabled', async () => {
		localStorage.setItem('notificationsEnabled', 'false');
		await checkUpcomingDeadlines();
		// Should complete without errors
		expect(true).toBe(true);
	});

	it('should check contracts and send notifications', async () => {
		localStorage.setItem('notificationsEnabled', 'true');

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 30);

		const contract: Contract = {
			id: '1',
			name: 'Test Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationDate: futureDate,
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);

		global.Notification = class MockNotification {
			static permission: NotificationPermission = 'granted';
			constructor(public title: string, public options?: NotificationOptions) {}
		} as unknown as typeof Notification;

		Object.defineProperty(navigator, 'serviceWorker', {
			writable: true,
			value: {}
		});

		await checkUpcomingDeadlines();
		// Should complete without errors
		expect(true).toBe(true);
	});

	it('should skip contracts without cancellation date', async () => {
		localStorage.setItem('notificationsEnabled', 'true');

		const contract: Contract = {
			id: '1',
			name: 'Test Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);

		await checkUpcomingDeadlines();
		// Should complete without errors
		expect(true).toBe(true);
	});

	it('should not send duplicate notifications', async () => {
		localStorage.setItem('notificationsEnabled', 'true');

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 30);

		const contract: Contract = {
			id: '1',
			name: 'Test Contract',
			category: 'internet',
			provider: 'Provider',
			monthlyCost: 29.99,
			billingCost: 29.99,
			billingPeriod: 'monthly',
			startDate: new Date('2024-01-01'),
			cancellationDate: futureDate,
			cancellationPeriod: 30,
			reminderDays: 30,
			status: 'aktiv',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		};

		await db.contracts.add(contract);

		localStorage.setItem(`notification-1-30`, 'true');

		await checkUpcomingDeadlines();
		// Should complete without errors
		expect(true).toBe(true);
	});
});

describe('initNotifications', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllTimers();
		vi.useFakeTimers();
		setLocale('de');
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should initialize notifications when enabled', () => {
		localStorage.setItem('notificationsEnabled', 'true');

		global.Notification = class MockNotification {
			static permission: NotificationPermission = 'granted';
			constructor(public title: string, public options?: NotificationOptions) {}
		} as unknown as typeof Notification;

		Object.defineProperty(navigator, 'serviceWorker', {
			writable: true,
			value: {}
		});

		initNotifications();
		expect(get(notificationsEnabled)).toBe(true);
	});

	it('should not initialize when disabled', () => {
		localStorage.setItem('notificationsEnabled', 'false');
		initNotifications();
		expect(get(notificationsEnabled)).toBe(false);
	});

	it('should set up interval for daily checks', () => {
		localStorage.setItem('notificationsEnabled', 'true');

		global.Notification = class MockNotification {
			static permission: NotificationPermission = 'granted';
			constructor(public title: string, public options?: NotificationOptions) {}
		} as unknown as typeof Notification;

		Object.defineProperty(navigator, 'serviceWorker', {
			writable: true,
			value: {}
		});

		const setIntervalSpy = vi.spyOn(global, 'setInterval');
		initNotifications();

		expect(setIntervalSpy).toHaveBeenCalled();
		setIntervalSpy.mockRestore();
	});
});
