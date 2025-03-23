import {
    BaseButton,
    BaseModal,
    UiWallet,
    UiWalletAccount,
    useBaseModal,
    WalletUiIconNoWallet,
    WalletUiList,
    WalletUiListProps,
    WalletUiSize,
} from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiSizes, UiStack } from '../../ui/';
import { useTestWallets } from '../../util/test-wallets';

export function PlaygroundBaseModal() {
    const wallets = useTestWallets();

    async function select(wallet: UiWalletAccount) {
        console.log('select start', wallet.address);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('select done', wallet.address);
    }

    return (
        <UiStack>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModalSimple size={size} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModalCustom size={size} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModalExternalTrigger size={size} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModalWallets select={select} size={size} wallets={wallets} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
            <UiGroup style={{ alignItems: 'flex-start' }}>
                <UiSizes
                    render={size => (
                        <UiPanel key={size} title={<code>{size}</code>}>
                            <TestModalNoWallet size={size} />
                        </UiPanel>
                    )}
                />
            </UiGroup>
        </UiStack>
    );
}

function TestModalSimple({ size }: { size: WalletUiSize }) {
    const modal = useBaseModal();

    return (
        <BaseModal modal={modal} size={size} buttonLabel="Open">
            THIS A SIMPLE MODAL
        </BaseModal>
    );
}

function TestModalCustom({ size }: { size: WalletUiSize }) {
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
                description={
                    <span>
                        This is the <b>{size}</b> size modal description
                    </span>
                }
                size={size}
            >
                <div>THIS IS A TEST OF A MODAL</div>
                <BaseButton size={size} onClick={() => void modal.close()} label="External Close" />
            </BaseModal>
            <BaseButton size={size} onClick={() => void modal.open()} label="External Open" />
        </UiGroup>
    );
}

function TestModalExternalTrigger({ size }: { size: WalletUiSize }) {
    const modal = useBaseModal();

    return (
        <UiGroup>
            <BaseModal modal={modal} size={size}>
                <BaseButton
                    size={size}
                    onClick={() => void modal.close()}
                    style={{ width: '100%' }}
                    label="External Close"
                />
            </BaseModal>
            <BaseButton size={size} onClick={() => void modal.open()} label="External Trigger" />
        </UiGroup>
    );
}

function TestModalWallets({
    select,
    size,
    wallets,
}: {
    select: WalletUiListProps['select'];
    size: WalletUiSize;
    wallets: UiWallet[];
}) {
    const modal = useBaseModal();

    return (
        <BaseModal
            modal={modal}
            buttonLabel="Select Wallet"
            description="Connect a wallet on Solana to continue"
            size={size}
        >
            <WalletUiList size={size} wallets={wallets} select={select} />
        </BaseModal>
    );
}

function TestModalNoWallet({ size }: { size: WalletUiSize }) {
    const modal = useBaseModal();

    return (
        <BaseModal
            modal={modal}
            buttonLabel="No Wallet"
            description="You'll need a wallet on Solana to continue"
            size={size}
        >
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
                    <WalletUiIconNoWallet size={size} />
                </a>
            </div>
        </BaseModal>
    );
}
