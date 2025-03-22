import { BaseButton, useWalletUiClient } from '@wallet-ui/react';
import React, { useState } from 'react';
import { PlaygroundUiPanel } from './playground-ui-panel';

export function PlaygroundClientGetVersion() {
    const [result, setResult] = useState('');
    const { rpc } = useWalletUiClient();

    return (
        <PlaygroundUiPanel title="Get Version">
            <BaseButton
                label="Get Version"
                onClick={() => {
                    setResult('Loading...');
                    void rpc
                        .getVersion()
                        .send()
                        .then(res => {
                            setResult(res['solana-core']);
                        });
                }}
            />
            <pre>{result}</pre>
        </PlaygroundUiPanel>
    );
}

export function PlaygroundClientGetGenesisHash() {
    const [result, setResult] = useState('');
    const { rpc } = useWalletUiClient();

    return (
        <PlaygroundUiPanel title="Get GenesisHash">
            <BaseButton
                label="Get GenesisHash"
                onClick={() => {
                    setResult('Loading...');
                    void rpc
                        .getGenesisHash()
                        .send()
                        .then(res => {
                            setResult(res.toString());
                        });
                }}
            />
            <pre>{result}</pre>
        </PlaygroundUiPanel>
    );
}
