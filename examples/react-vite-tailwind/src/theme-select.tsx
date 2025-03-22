import { ChangeEvent } from 'react';
import { Theme, useTheme } from './theme-provider.tsx';

export function ThemeSelect() {
    const { theme, themes, setTheme } = useTheme();

    return (
        <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value as Theme)}
            value={theme}
            className="rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white

            "
        >
            {themes.map(item => (
                <option key={item.value} value={item.value} disabled={item.value === theme}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}
