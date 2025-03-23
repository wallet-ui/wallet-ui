import React from 'react';
import { UiCard } from '../../ui/';
import { PlaygroundClientGetGenesisHash } from './playground-client-get-genesis-hash';
import { PlaygroundClientGetVersion } from './playground-client-get-version';

export function PlaygroundClient() {
    return (
        <UiCard title="Solana Client" open>
            <PlaygroundClientGetVersion />
            <PlaygroundClientGetGenesisHash />
        </UiCard>
    );
}
