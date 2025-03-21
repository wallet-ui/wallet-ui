import { UiWallet } from '@wallet-standard/react';
import React from 'react';

import { BaseModal, BaseModalProps } from './base-modal';
import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiList } from './wallet-ui-list';

export interface WalletUiModalProps extends Omit<BaseModalProps, 'children'> {
    select: (wallet: UiWallet) => Promise<void>;
    size?: WalletUiSize;
    wallets: UiWallet[];
}

export function WalletUiModal({ size = 'md', wallets, select, ...props }: WalletUiModalProps) {
    return (
        <BaseModal description="Connect a wallet on Solana to continue" size={size} {...props}>
            <WalletUiList size={size} wallets={wallets} select={select} />
        </BaseModal>
    );
}
