import { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import React from 'react';

import { BaseModal, BaseModalProps } from './base-modal';
import { WalletUiList } from './wallet-ui-list';

export interface WalletUiModalProps extends Omit<BaseModalProps, 'children'> {
    select: (account: UiWalletAccount) => Promise<void>;
    wallets: UiWallet[];
}

export function WalletUiModal({ wallets, select, ...props }: WalletUiModalProps) {
    return (
        <BaseModal description="Connect a wallet on Solana to continue" {...props}>
            <WalletUiList wallets={wallets} select={select} />
        </BaseModal>
    );
}
