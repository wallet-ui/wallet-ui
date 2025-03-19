import './solana-wallet-ui-dialog.css';

import { Portal } from '@zag-js/react';
import React from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';
import { SolanaWalletUiDialogList } from './solana-wallet-ui-dialog-list';

export function SolanaWalletUiDialog({ description, title }: { description?: string; title?: string }) {
    const { dialogApi: api, connected, disconnect } = useSolanaWalletUi();

    if (!api || !api.open) {
        return null;
    }

    return (
        <Portal>
            <div className="dialog" {...api.getBackdropProps()} />
            <div className="dialog" {...api.getPositionerProps()}>
                <div className="dialog" {...api.getContentProps()}>
                    {title ? (
                        <h2 className="dialog" {...api.getTitleProps()}>
                            {title}
                        </h2>
                    ) : null}
                    {description ? (
                        <p className="dialog" {...api.getDescriptionProps()}>
                            {description}
                        </p>
                    ) : null}
                    <div style={{ marginTop: '32px' }}>
                        <SolanaWalletUiDialogList />
                        {connected ? <button onClick={disconnect}>Disconnect</button> : null}
                    </div>
                    <button className="dialog" {...api.getCloseTriggerProps()}>
                        &times;
                    </button>
                </div>
            </div>
        </Portal>
    );
}
