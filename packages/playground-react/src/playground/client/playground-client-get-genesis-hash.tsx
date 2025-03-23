import { BaseButton, useWalletUi } from '@wallet-ui/react';
import React, { useState } from 'react';
import { UiPanel } from '../../ui';

export function PlaygroundClientGetGenesisHash() {
    const [result, setResult] = useState('');
    const { client } = useWalletUi();

    return (
        <UiPanel title="Get GenesisHash">
            <BaseButton
                label="Get GenesisHash"
                onClick={() => {
                    setResult('Loading...');
                    void client.rpc
                        .getGenesisHash()
                        .send()
                        .then(res => {
                            setResult(res.toString());
                        });
                }}
            />
            <pre>{result}</pre>
        </UiPanel>
    );
}
