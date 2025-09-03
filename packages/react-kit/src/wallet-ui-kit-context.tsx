import { createContext, ReactNode } from 'react';

import { Client, CreateClientOptions } from './wallet-ui-kit-provider';

export interface WalletUiGillContextProviderProps extends CreateClientOptions {
    children: ReactNode;
}

export const WalletUiKitContext = createContext<Client>({} as Client);
