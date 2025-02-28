'use client';

import { AppHero } from '@/components/app-layout';
import { ConnectWalletMenu } from '@/components/wallet-ui';
import { useSolanaWallet } from '@wallet-ui/react';
import { redirect } from 'next/navigation';

export default function AccountListFeature() {
    const [selectedWallet] = useSolanaWallet();

    if (selectedWallet?.address) {
        return redirect(`/account/${selectedWallet.address}`);
    }

    return (
        <AppHero>
            <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
        </AppHero>
    );
}
