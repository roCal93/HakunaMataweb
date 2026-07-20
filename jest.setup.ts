import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// Test setup file. If you add client-side i18n later, add any mocks or providers here.
// ...other test setup as needed...

jest.mock('@vercel/analytics/next', () => ({
	Analytics: function AnalyticsMock() {
		return React.createElement(React.Fragment, null);
	},
}));

if (!global.IntersectionObserver) {
	global.IntersectionObserver = class IntersectionObserver {
		root = null;
		rootMargin = '';
		thresholds: ReadonlyArray<number> = [];

		constructor() {}
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	} as unknown as typeof IntersectionObserver;
}

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

