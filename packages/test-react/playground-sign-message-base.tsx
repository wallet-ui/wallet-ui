import { BaseButton, useWalletUiCluster } from '@wallet-ui/react';
import type { ReadonlyUint8Array } from 'gill';
import type { SyntheticEvent } from 'react';
import React, { useState } from 'react';

import { PlaygroundErrorPanel } from './playground-error-panel';
import { PlaygroundTxSuccess } from './playground-tx-success';
import { useError } from './use-error';

export function PlaygroundSignMessageBase({
    signMessage,
}: {
    signMessage(message: ReadonlyUint8Array): Promise<ReadonlyUint8Array>;
}) {
    const { error, hasError, setError, resetError } = useError();
    const { cluster } = useWalletUiCluster();
    const [isSigningMessage, setIsSigningMessage] = useState(false);
    const [lastSignature, setLastSignature] = useState<ReadonlyUint8Array | undefined>();
    const [text, setText] = useState<string>();

    async function submit() {
        resetError();
        setIsSigningMessage(true);
        try {
            const signature = await signMessage(new TextEncoder().encode(text));
            setLastSignature(signature);
        } catch (e) {
            setLastSignature(undefined);
            setError(e);
        } finally {
            setIsSigningMessage(false);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await submit();
                }}
            >
                <div style={{ display: 'flex', gap: '3', alignItems: 'center' }}>
                    <input
                        placeholder="Write a message to sign"
                        onChange={(e: SyntheticEvent<HTMLInputElement>) => setText(e.currentTarget.value)}
                        value={text}
                    />
                    <BaseButton label="Sign Message" disabled={!text || isSigningMessage} type="submit" />
                </div>
                {lastSignature ? (
                    <PlaygroundTxSuccess cluster={cluster} signature={lastSignature} title={'You Signed a Message!'} />
                ) : null}
                {hasError ? (
                    <PlaygroundErrorPanel error={error} onClose={() => resetError()} title="Failed to sign message" />
                ) : null}
            </form>
        </div>
    );
}
