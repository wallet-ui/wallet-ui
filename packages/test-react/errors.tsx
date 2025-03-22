import {
    isWalletStandardError,
    WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
    WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
    WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
} from '@wallet-ui/react';
import React from 'react';
import { Stack } from './stack';

export const NO_ERROR = Symbol();

export function getErrorMessage(err: unknown, fallbackMessage: React.ReactNode): React.ReactNode {
    if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED)) {
        return (
            <>
                This account does not support the <code>{err.context.featureName}</code> feature
            </>
        );
    } else if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED)) {
        return (
            <Stack>
                <p>
                    The wallet '{err.context.walletName}' (
                    {err.context.supportedChains.sort().map((chain, ii, { length }) => (
                        <React.Fragment key={chain}>
                            <code>{chain}</code>
                            {ii === length - 1 ? null : ', '}
                        </React.Fragment>
                    ))}
                    ) does not support the <code>{err.context.featureName}</code> feature.
                </p>
                <p>
                    Features supported:
                    <ul>
                        {err.context.supportedFeatures.sort().map(featureName => (
                            <li key={featureName}>
                                <code>{featureName}</code>
                            </li>
                        ))}
                    </ul>
                </p>
            </Stack>
        );
    } else if (isWalletStandardError(err, WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED)) {
        return (
            <Stack>
                <p>
                    This account does not support the chain <code>{err.context.chain}</code>.
                </p>
                <p>
                    Chains supported:
                    <ul>
                        {err.context.supportedChains.sort().map(chain => (
                            <li key={chain}>
                                <code>{chain}</code>
                            </li>
                        ))}
                    </ul>
                </p>
            </Stack>
        );
    } else if (err && typeof err === 'object' && 'message' in err) {
        return String(err.message);
    }
    return fallbackMessage;
}
