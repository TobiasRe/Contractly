import { expect, afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock SvelteKit $app/environment
vi.mock('$app/environment', () => ({
	browser: true,
	dev: false,
	building: false,
	version: '1.0.0'
}));

// Mock SvelteKit $app/stores
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn((fn) => {
			fn({
				url: new URL('http://localhost/'),
				params: {},
				route: { id: '/' },
				status: 200,
				error: null,
				data: {},
				form: null
			});
			return () => {};
		})
	},
	navigating: {
		subscribe: vi.fn((fn) => {
			fn(null);
			return () => {};
		})
	},
	updated: {
		subscribe: vi.fn((fn) => {
			fn(false);
			return () => {};
		}),
		check: vi.fn()
	}
}));

// Mock browser environment
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(() => false)
	}))
});

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
	writable: true
});

beforeEach(() => {
	localStorageMock.clear();
});

// Mock Notification API
global.Notification = class MockNotification {
	static permission: NotificationPermission = 'default';
	static requestPermission = vi.fn(() => Promise.resolve('granted' as NotificationPermission));
	
	constructor(public title: string, public options?: NotificationOptions) {}
} as unknown as typeof Notification;

// Mock ServiceWorker
Object.defineProperty(navigator, 'serviceWorker', {
	writable: true,
	value: {
		register: vi.fn(),
		ready: Promise.resolve({} as ServiceWorkerRegistration),
		controller: null
	}
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
	writable: true,
	value: {
		lang: 'de',
		setAttribute: vi.fn(),
		getAttribute: vi.fn()
	}
});

// IndexedDB is mocked by fake-indexeddb/auto

// Polyfill File.text() for JSDOM if missing
if (typeof File !== 'undefined' && !File.prototype.text) {
	File.prototype.text = function() {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsText(this);
		});
	};
}
