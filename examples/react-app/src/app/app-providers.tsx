import { PlaygroundProviders } from '@wallet-ui/playground-react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <PlaygroundProviders>{children}</PlaygroundProviders>
        </BrowserRouter>
    );
}
