import { Account as AuthorizedAccount } from '@solana-mobile/mobile-wallet-adapter-protocol';

import { ellipsify } from './ellipsify';
import { getAddressFromBase64 } from './get-address-from-base64';
import { Account } from './use-authorization';

export function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
    const address = getAddressFromBase64(account.address);

    return {
        address,
        addressBase64: account.address,
        icon: account.icon,
        label: account.label ?? ellipsify(address.toString(), 8),
    };
}
