export type TestAccount = {
    address: string;
    label: string;
    walletName: string;
};

export type TestWallet = {
    accounts: TestAccount[];
    chains: string[];
    name: string;
};

export function createAccount({
    address,
    label = address,
    walletName,
}: {
    address: string;
    label?: string;
    walletName: string;
}) {
    return { address, label, walletName };
}

export function createWallet({
    accounts = [],
    chains = ['solana:devnet'],
    name,
}: {
    accounts?: TestAccount[];
    chains?: string[];
    name: string;
}) {
    return { accounts, chains, name };
}

export function mockWalletStandardReact(useWallets: () => TestWallet[]) {
    return {
        getUiWalletAccountStorageKey: (account: TestAccount) => `${account.walletName}:${account.address}`,
        uiWalletAccountBelongsToUiWallet: (account: TestAccount, wallet: TestWallet) =>
            account.walletName === wallet.name,
        uiWalletAccountsAreSame: (a: TestAccount, b: TestAccount) =>
            a.address === b.address && a.walletName === b.walletName,
        useWallets,
    };
}
