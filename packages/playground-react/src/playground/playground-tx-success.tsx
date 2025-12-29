import { getBase58Decoder, ReadonlyUint8Array } from '@solana/kit';
import { getExplorerUrl, SolanaCluster } from '@wallet-ui/react';
import React from 'react';

export function PlaygroundTxSuccess({
    cluster,
    signature,
    title,
}: {
    cluster: SolanaCluster;
    signature: Uint8Array | ReadonlyUint8Array;
    title: string;
}) {
    const transaction = getBase58Decoder().decode(signature);
    return (
        <div>
            <div>{title}</div>
            <span>Signature:</span>
            <blockquote>{transaction}</blockquote>
            <div>
                <a
                    href={getExplorerUrl({ network: cluster, path: `/tx/${transaction}`, provider: 'solana' })}
                    target="_blank"
                >
                    View this transaction
                </a>{' '}
                on Explorer
            </div>
        </div>
    );
}
