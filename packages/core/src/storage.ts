export interface Storage {
    getItem(key: string): string | null;

    removeItem(key: string): void;

    setItem(key: string, value: string): void;
}

export class LocalStorage implements Storage {
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
