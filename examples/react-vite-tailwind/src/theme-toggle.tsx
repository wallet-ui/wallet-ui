import { ThemeOption, useTheme } from './theme-provider.tsx';

export function ThemeToggle() {
    const { isDark, themes, setTheme } = useTheme();

    const themeDark = themes.find(item => item.value === 'dark') as ThemeOption;
    const themeLight = themes.find(item => item.value === 'light') as ThemeOption;

    const resolved = isDark ? themeDark : themeLight;

    return (
        <button
            className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            {resolved.icon}
            <span className="ml-2 font-semibold">{resolved.label}</span>
        </button>
    );
}
