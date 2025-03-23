import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';

import { BaseModal, BaseModalProps } from './base-modal';
import { WalletUiSize } from './types/wallet-ui-size';
import { useBaseModal } from './use-base-modal';
import { WalletUiList } from './wallet-ui-list';
import { WalletUiModalTrigger } from './wallet-ui-modal-trigger';

export interface WalletUiModalProps extends Omit<BaseModalProps, 'children'> {
    select: (account: UiWalletAccount) => Promise<void>;
    size?: WalletUiSize;
    wallets: UiWallet[];
}

export function WalletUiModal({ size = 'md', wallets, select, ...props }: WalletUiModalProps) {
    const modal = useBaseModal();
    return (
        <>
            <WalletUiModalTrigger modal={modal} />
            <BaseModal description="Connect a wallet on Solana to continue" size={size} {...props}>
                <WalletUiList size={size} wallets={wallets} select={select} />
            </BaseModal>
        </>
    );
}
