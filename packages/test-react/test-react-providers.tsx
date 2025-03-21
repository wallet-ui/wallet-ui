import { WalletUiProvider } from '@wallet-ui/react';
import React from 'react';

export function TestReactProviders({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <WalletUiProvider size="md">{children}</WalletUiProvider>
        </div>
    );
}
