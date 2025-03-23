import { useWalletUi, WalletUiIcon, WalletUiIconNoWallet, WalletUiLabel } from '@wallet-ui/react';
import React from 'react';
import { UiGroup, UiPanel, UiStack, uiStyleTitle } from '../../ui';
import { PlaygroundWalletListItem, walletList } from './playground-wallet-list';

const sortedWalletList = walletList.sort((a, b) => a.name.localeCompare(b.name));

export function useBrowserWallets() {
    const { wallets: browserWallets } = useWalletUi();
    const browserWalletNames = browserWallets.map(wallet => wallet.name);

    const walletsInstalled = sortedWalletList.filter(item => browserWalletNames.includes(item.name));
    const walletsNotInstalled = sortedWalletList.filter(item => !browserWalletNames.includes(item.name));

    return { walletsInstalled, walletsNotInstalled };
}

export function PlaygroundWalletInfo() {
    const { walletsInstalled, walletsNotInstalled } = useBrowserWallets();

    return (
        <UiStack style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <UiPanel title="Installed Wallets">
                {walletsInstalled.length ? (
                    walletsInstalled.map(item => <PlaygroundWalletInfoItem key={item.name} item={item} />)
                ) : (
                    <UiStack
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: '1rem',
                            paddingBottom: '1rem',
                            width: '100%',
                        }}
                    >
                        <a href="https://solana.com/solana-wallets" target="_blank" rel="noreferrer noopener">
                            <WalletUiIconNoWallet size="lg" />
                        </a>
                        <span style={{ ...uiStyleTitle }}>You'll need a wallet on Solana to continue.</span>
                    </UiStack>
                )}
            </UiPanel>
            <UiPanel title="Ecosystem Wallets">
                <span style={{ ...uiStyleTitle }}>
                    These are some of the{' '}
                    <a
                        href="https://solana.com/solana-wallets"
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: 'underline' }}
                    >
                        wallets on Solana
                    </a>{' '}
                    that you can install in your browser.
                </span>
                {walletsNotInstalled.map(item => (
                    <PlaygroundWalletInfoItem key={item.name} item={item} />
                ))}

                <span style={{ ...uiStyleTitle }}>
                    Please create a{' '}
                    <a
                        href="https://github.com/wallet-ui/wallet-ui/pulls"
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ textDecoration: 'underline' }}
                    >
                        pull request
                    </a>{' '}
                    to add your wallet to this list.
                </span>
            </UiPanel>
        </UiStack>
    );
}

function PlaygroundWalletInfoItem({ item }: { item: PlaygroundWalletListItem }) {
    return (
        <a key={item.name} href={item.website} target="_blank" rel="noreferrer noopener">
            <UiGroup>
                <WalletUiIcon size="lg" wallet={item} />
                <WalletUiLabel size="lg" wallet={item} />
            </UiGroup>
        </a>
    );
}
