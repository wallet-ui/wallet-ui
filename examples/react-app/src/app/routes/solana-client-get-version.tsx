import { useWalletUiGill } from '@wallet-ui/react-gill';
import { useState } from 'react';

export function SolanaClientGetVersion() {
    const [version, setVersion] = useState('');
    const client = useWalletUiGill();

    return (
        <div>
            <button
                onClick={() => {
                    setVersion('Loading...');
                    void client.rpc
                        .getVersion()
                        .send()
                        .then(res => {
                            setVersion(res['solana-core']);
                        });
                }}
            >
                Get Solana Version
            </button>
            <pre>{version}</pre>
        </div>
    );
}
