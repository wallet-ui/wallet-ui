import React, { ReactNode, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = Omit<Theme, 'system'>;
export type ThemeOption = { icon: ReactNode; label: string; value: Theme };

const themeOptions: ThemeOption[] = [
    { icon: <span>🌞</span>, label: 'Light', value: 'light' },
    { icon: <span>🌚</span>, label: 'Dark', value: 'dark' },
    { icon: <span>💻</span>, label: 'System', value: 'system' },
];

export interface ThemeProviderContext {
    isDark: boolean;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    theme: Theme;
    themes: ThemeOption[];
}

const ThemeContext = React.createContext<ThemeProviderContext>({} as ThemeProviderContext);

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function ThemeProvider({
    children,
    storageKey = 'app-theme',
    themes = themeOptions,
}: {
    children: ReactNode;
    storageKey?: string;
    themes?: ThemeOption[];
}) {
    const [theme, setTheme] = React.useState<Theme>((localStorage.getItem(storageKey) ?? 'system') as Theme);

    useEffect(() => {
        if (document.documentElement.getAttribute('data-theme') !== theme) {
            const newTheme = theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('app-theme', newTheme);
        }
    }, [theme]);

    const resolvedTheme: ResolvedTheme = React.useMemo(
        () => (theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme),
        [theme],
    );

    return (
        <ThemeContext.Provider
            value={{
                isDark: resolvedTheme === 'dark',
                resolvedTheme,
                setTheme: (theme: Theme) => {
                    // Ensure the option provided exists in the themes array
                    if (themes.find(item => item.value === theme)) {
                        setTheme(theme);
                    }
                },
                theme,
                themes,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return React.useContext(ThemeContext);
}
