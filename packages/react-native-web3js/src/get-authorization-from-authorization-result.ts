import { AuthorizationResult } from '@solana-mobile/mobile-wallet-adapter-protocol';

import { getAccountFromAuthorizedAccount } from './get-account-from-authorized-account';
import { Account, WalletAuthorization } from './use-authorization';

export function getAuthorizationFromAuthorizationResult(
    authorizationResult: AuthorizationResult,
    previouslySelectedAccount?: Account,
): WalletAuthorization {
    let selectedAccount: Account;
    if (
        // We have yet to select an account.
        previouslySelectedAccount == null ||
        // The previously selected account is no longer in the set of authorized addresses.
        !authorizationResult.accounts.some(({ address }) => address === previouslySelectedAccount.address)
    ) {
        const firstAccount = authorizationResult.accounts[0];
        selectedAccount = getAccountFromAuthorizedAccount(firstAccount);
    } else {
        selectedAccount = previouslySelectedAccount;
    }
    return {
        accounts: authorizationResult.accounts.map(getAccountFromAuthorizedAccount),
        authToken: authorizationResult.auth_token,
        selectedAccount,
    };
}
