import { PlaygroundClient } from '@wallet-ui/playground-react';

import { SolanaClientGetVersion } from './solana-client-get-version.tsx';

export default function ClientRoute() {
    return (
        <div>
            <PlaygroundClient />
            <pre>{JSON.stringify({ page: 'RPC' }, null, 4)}</pre>
            <SolanaClientGetVersion />
        </div>
    );
}
