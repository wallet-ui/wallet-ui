import { SolanaGetVersion } from './solana-get-version';

export default function Home() {
    return (
        <div>
            <pre>{JSON.stringify({ page: 'RPC' }, null, 4)}</pre>
            <SolanaGetVersion />
        </div>
    );
}
