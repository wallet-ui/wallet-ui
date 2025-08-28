import {
    BaseButton,
    BaseModal,
    UiWallet,
    UiWalletAccount,
    useBaseModal,
    useWalletUi,
    WalletUiIconNoWallet,
    WalletUiList,
    WalletUiListProps,
} from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiStack } from '../../ui/';

export function PlaygroundBaseModal() {
    const { wallets } = useWalletUi();

    async function select(wallet: UiWalletAccount) {
        console.log('select start', wallet.address);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('select done', wallet.address);
    }

    return (
        <UiStack>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <TestModalSimple />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <TestModalCustom />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <TestModalExternalTrigger />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <TestModalWallets select={select} wallets={wallets} />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <TestModalNoWallet />
            </UiGroup>
        </UiStack>
    );
}

function TestModalSimple() {
    const modal = useBaseModal();

    return (
        <BaseModal modal={modal} buttonLabel="Open">
            THIS A SIMPLE MODAL
        </BaseModal>
    );
}

function TestModalCustom() {
    const modal = useBaseModal();

    return (
        <UiGroup>
            <BaseModal
                modal={modal}
                buttonLabel="Open Modal"
                buttonProps={{
                    leftSection: <span>🚀</span>,
                    rightSection: <span>🚀</span>,
                }}
                description={<span>This is the modal description</span>}
            >
                <div>THIS IS A TEST OF A MODAL</div>
                <BaseButton onClick={() => void modal.close()} label="External Close" />
            </BaseModal>
            <BaseButton onClick={() => void modal.open()} label="External Open" />
        </UiGroup>
    );
}

function TestModalExternalTrigger() {
    const modal = useBaseModal();

    return (
        <UiGroup>
            <BaseModal modal={modal}>
                <BaseButton onClick={() => void modal.close()} style={{ width: '100%' }} label="External Close" />
            </BaseModal>
            <BaseButton onClick={() => void modal.open()} label="External Trigger" />
        </UiGroup>
    );
}

function TestModalWallets({ select, wallets }: { select: WalletUiListProps['select']; wallets: UiWallet[] }) {
    const modal = useBaseModal();

    return (
        <BaseModal modal={modal} buttonLabel="Select Wallet" description="Connect a wallet on Solana to continue">
            <WalletUiList wallets={wallets} select={select} />
        </BaseModal>
    );
}

function TestModalNoWallet() {
    const modal = useBaseModal();

    return (
        <BaseModal modal={modal} buttonLabel="No Wallet" description="You'll need a wallet on Solana to continue">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                }}
            >
                <a href="https://solana.com/solana-wallets" target="_blank" rel="noreferrer noopener">
                    <WalletUiIconNoWallet />
                </a>
            </div>
        </BaseModal>
    );
}
