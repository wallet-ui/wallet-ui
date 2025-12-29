import { useWalletUiGill } from '@wallet-ui/react-gill';
import React from 'react';
import { getSolanaNetworkFromGenesisHash } from '../../lib/get-solana-network-from-genesis-hash';
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
                    cluster: getSolanaNetworkFromGenesisHash(genesisHash),
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
