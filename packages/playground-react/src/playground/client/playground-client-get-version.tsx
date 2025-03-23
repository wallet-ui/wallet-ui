import { BaseButton, useWalletUi } from '@wallet-ui/react';
import React, { useState } from 'react';
import { UiPanel } from '../../ui/';

export function PlaygroundClientGetVersion() {
    const [result, setResult] = useState('');
    const { client } = useWalletUi();

    return (
        <UiPanel title="Get Version">
            <BaseButton
                label="Get Version"
                onClick={() => {
                    setResult('Loading...');
                    void client.rpc
                        .getVersion()
                        .send()
                        .then(res => {
                            setResult(res['solana-core']);
                        });
                }}
            />
            <pre>{result}</pre>
        </UiPanel>
    );
}
