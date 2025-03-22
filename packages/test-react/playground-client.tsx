import React from 'react';
import { PlaygroundClientGetGenesisHash, PlaygroundClientGetVersion } from './playground-client-get-version';
import { PlaygroundUiCard } from './playground-ui-card';

export function PlaygroundClient() {
    return (
        <PlaygroundUiCard title="Solana Client" open>
            <PlaygroundClientGetVersion />
            <PlaygroundClientGetGenesisHash />
        </PlaygroundUiCard>
    );
}
