import { expect, test, describe, vi } from 'vitest';
import { 
	createStorageAccount, 
	createStorageCluster, 
	createStorage,
	Storage
} from './storage.svelte.js';

// Mock @wallet-ui/core since it's a workspace dependency
vi.mock('@wallet-ui/core', () => ({
	createStorageAccount: vi.fn(() => ({
		get: vi.fn(),
		set: vi.fn()
	})),
	createStorageCluster: vi.fn(() => ({
		get: vi.fn(),
		set: vi.fn()
	})),
	createStorage: vi.fn(() => ({
		get: vi.fn(),
		set: vi.fn()
	})),
	Storage: vi.fn().mockImplementation(() => ({
		get: vi.fn(),
		set: vi.fn()
	}))
}));

describe('storage exports', () => {
	test('re-exports createStorageAccount from core', () => {
		const storage = createStorageAccount();
		
		expect(storage).toBeDefined();
		expect(storage.get).toBeDefined();
		expect(storage.set).toBeDefined();
	});

	test('re-exports createStorageCluster from core', () => {
		const storage = createStorageCluster();
		
		expect(storage).toBeDefined();
		expect(storage.get).toBeDefined();
		expect(storage.set).toBeDefined();
	});

	test('re-exports createStorage from core', () => {
		const storage = createStorage({ key: 'test-key', initial: null });
		
		expect(storage).toBeDefined();
		expect(storage.get).toBeDefined();
		expect(storage.set).toBeDefined();
	});

	test('re-exports Storage class from core', () => {
		const storage = new Storage({ key: 'test-key', initial: null });
		
		expect(storage).toBeDefined();
		expect(storage.get).toBeDefined();
		expect(storage.set).toBeDefined();
	});
});