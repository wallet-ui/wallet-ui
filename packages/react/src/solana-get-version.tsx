import React, { useState } from 'react';

import { useSolanaClient } from './use-solana-client';

export function SolanaGetVersion() {
    const [version, setVersion] = useState('');
    const client = useSolanaClient();

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
