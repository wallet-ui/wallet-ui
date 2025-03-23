import { type UiWalletAccount, useWalletAccountMessageSigner } from '@wallet-ui/react';
import type { Address, ReadonlyUint8Array } from 'gill';
import { useCallback } from 'react';

export interface UiWalletAccountWithSignMessage {
    account: UiWalletAccount;

    signMessage(message: ReadonlyUint8Array): Promise<ReadonlyUint8Array>;
}

export interface UiWalletAccountSignMessageLoaderProps {
    account: UiWalletAccount;

    render(props: UiWalletAccountWithSignMessage): React.ReactNode;
}

export function WalletUiAccountSignMessageLoader({ account, render }: UiWalletAccountSignMessageLoaderProps) {
    const messageSigner = useWalletAccountMessageSigner(account);

    const signMessage = useCallback(
        async (message: ReadonlyUint8Array) => {
            const [result] = await messageSigner.modifyAndSignMessages([
                {
                    content: message as Uint8Array,
                    signatures: {},
                },
            ]);
            const signature = result?.signatures[account.address as Address];
            if (!signature) {
                throw new Error();
            }
            return signature as ReadonlyUint8Array;
        },
        [account.address, messageSigner],
    );

    return render({ account, signMessage });
}
