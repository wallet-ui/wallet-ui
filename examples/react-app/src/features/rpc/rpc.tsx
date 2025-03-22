import { SolanaClientGetVersion } from './solana-client-get-version.tsx';

export default function Home() {
    return (
        <div>
            <pre>{JSON.stringify({ page: 'RPC' }, null, 4)}</pre>
            <SolanaClientGetVersion />
        </div>
    );
}
