import { PlaygroundProviders } from '@wallet-ui/test-react';
import React from 'react';
import { ThemeProvider } from '../theme-provider.tsx';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <PlaygroundProviders>{children}</PlaygroundProviders>
        </ThemeProvider>
    );
}
