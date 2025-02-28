import { AccountUiBalanceCheck } from '@/components/account/ui/account-ui-balance-check';
import { useSolanaWalletAddress } from '@wallet-ui/react';

export function AccountUiChecker() {
    const address = useSolanaWalletAddress();
    if (!address) {
        return null;
    }
    return <AccountUiBalanceCheck address={address} />;
}
