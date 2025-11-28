import { Account as AuthorizedAccount } from '@solana-mobile/mobile-wallet-adapter-protocol';

import { getPublicKeyFromAddress } from './get-public-key-from-address';
import { Account } from './use-authorization';

function ellipsify(str = '', len = 4, delimiter = '..') {
    const limit = len * 2 + delimiter.length;

    return str.length > limit ? str.slice(0, len) + delimiter + str.slice(-len) : str;
}

export function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
    const publicKey = getPublicKeyFromAddress(account.address);

    return {
        address: account.address,
        icon: account.icon,
        label: account.label ?? ellipsify(publicKey.toString(), 8),
        publicKey,
    };
}
