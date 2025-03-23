import React from 'react';
import { UiCard } from '../../ui/';
import { PlaygroundClientGetGenesisHash, PlaygroundClientGetVersion } from './playground-client-get-version';

export function PlaygroundClient() {
    return (
        <UiCard title="Solana Client" open>
            <PlaygroundClientGetVersion />
            <PlaygroundClientGetGenesisHash />
        </UiCard>
    );
}
