import React from 'react';

export interface SolanaWalletUiProviderContext {
    name?: string;
}

export const SolanaWalletUiContext = React.createContext<SolanaWalletUiProviderContext>(
    {} as SolanaWalletUiProviderContext,
);

export function useSolanaWalletUi() {
    return React.useContext(SolanaWalletUiContext);
}
