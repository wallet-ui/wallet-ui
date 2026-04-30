/**
 * @jest-environment node
 */

import { SolanaSignMessage } from '@solana/wallet-standard-features';
import type { UiWalletAccount } from '@wallet-standard/ui';

import { WalletUiAuthError } from '../wallet-ui-auth-types';
import { signInWithMessageSigner } from '../wallet-ui-auth-utils';

describe('wallet-ui-auth-utils', () => {
    it('requires a domain when no location host is available', async () => {
        expect.assertions(3);

        const account = {
            address: 'solflare-1',
            chains: ['solana:devnet'],
            features: [SolanaSignMessage],
            publicKey: Uint8Array.from([1, 2, 3]),
        } as unknown as UiWalletAccount;
        const signMessage = jest.fn();
        let error: WalletUiAuthError | undefined;

        try {
            await signInWithMessageSigner({
                account,
                input: {},
                signMessage,
            });
        } catch (e) {
            error = e as WalletUiAuthError;
        }

        expect(error).toBeInstanceOf(WalletUiAuthError);
        expect(error?.reason).toBe('missing-domain');
        expect(signMessage).not.toHaveBeenCalled();
    });
});
