import { useWalletUiGill } from '@wallet-ui/react-gill';
import { getMonikerFromGenesisHash } from 'gill';
import React from 'react';
import { UiCard } from '../../ui/';
import { PlaygroundRunCommand } from './playground-run-command';

export function PlaygroundClient() {
    const client = useWalletUiGill();

    const commandMap = new Map<string, () => Promise<unknown>>()
        .set('getLatestBlockhash', () =>
            client.rpc
                .getLatestBlockhash()
                .send()
                .then(blockhash => blockhash.value),
        )
        .set('getGenesisHash', () =>
            client.rpc
                .getGenesisHash()
                .send()
                .then(genesisHash => ({
                    genesisHash,
                    cluster: getMonikerFromGenesisHash(genesisHash),
                })),
        );

    return (
        <UiCard title="Solana Client" open>
            {Array.from(commandMap.entries()).map(([label, command]) => (
                <PlaygroundRunCommand key={label} command={command} label={label} />
            ))}
        </UiCard>
    );
}
