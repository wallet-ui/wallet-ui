import { useWalletUiClient } from '@wallet-ui/react';
import { useState } from 'react';

export function SolanaGetVersion() {
    const [version, setVersion] = useState('');
    const { rpc } = useWalletUiClient();

    return (
        <div>
            <button
                onClick={() => {
                    setVersion('Loading...');
                    void rpc
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
