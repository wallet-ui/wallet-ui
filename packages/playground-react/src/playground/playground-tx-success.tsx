import { SolanaCluster } from '@wallet-ui/react';
import { getSolanaClusterMoniker } from '@wallet-ui/react-gill';
import { getBase58Decoder, getExplorerLink, ReadonlyUint8Array } from 'gill';
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
                    href={getExplorerLink({ cluster: getSolanaClusterMoniker(cluster.id), transaction })}
                    target="_blank"
                >
                    View this transaction
                </a>{' '}
                on Explorer
            </div>
        </div>
    );
}
