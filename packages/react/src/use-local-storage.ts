import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Check if we're on the client side
            if (typeof window === 'undefined') {
                return initialValue;
            }

            const item = window.localStorage.getItem(key);
            // For wallet-related data, validate the stored value
            if (key.includes('wallet') || key.includes('account')) {
                // Return initial value if stored data might be stale
                return initialValue;
            }
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore = value instanceof Function ? value(storedValue) : value;

                // Save state
                setStoredValue(valueToStore);

                // Save to localStorage
                if (typeof window !== 'undefined') {
                    if (valueToStore === undefined || valueToStore === null) {
                        window.localStorage.removeItem(key);
                    } else {
                        window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    }
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue],
    );

    return [storedValue, setValue] as const;
}
