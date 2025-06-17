// Setup for Vitest testing environment

// Mock wallet standard for testing
global.navigator = global.navigator || {};
if (!global.navigator.clipboard) {
	Object.defineProperty(global.navigator, 'clipboard', {
		value: {
			writeText: vi.fn().mockResolvedValue(undefined)
		},
		writable: true
	});
}

// Mock crypto for random values if not already available
if (!global.crypto) {
	Object.defineProperty(global, 'crypto', {
		value: {
			getRandomValues: (arr: Uint8Array) => {
				for (let i = 0; i < arr.length; i++) {
					arr[i] = Math.floor(Math.random() * 256);
				}
				return arr;
			}
		},
		writable: true
	});
}

// Mock window.postMessage for modal interactions
Object.defineProperty(window, 'postMessage', {
	value: vi.fn(),
	writable: true
});