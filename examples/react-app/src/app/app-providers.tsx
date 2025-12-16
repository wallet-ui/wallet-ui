import { PlaygroundProviders } from '@wallet-ui/playground-react';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { registerLazorkitWallet } from '@lazorkit/wallet';

registerLazorkitWallet(
    {
        rpcUrl: "https://api.devnet.solana.com",
        paymasterConfig: {
            paymasterUrl: "https://kor.devnet.solana.com",
        }, 
        portalUrl: "https://portal.lazor.sh"
    }
);
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <PlaygroundProviders>{children}</PlaygroundProviders>
        </BrowserRouter>
    );
}
