import { PlaygroundUiWalletProvider } from '@/components/playground/playground-ui-wallet-provider';
import type { ReactNode } from 'react';

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
    return (
        <main className="container flex flex-1 flex-col">
            <PlaygroundUiWalletProvider>{children}</PlaygroundUiWalletProvider>
        </main>
    );
}
