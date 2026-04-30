import {
    getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from '@wallet-standard/ui-registry';

// Centralize Wallet Standard registry escape hatches while upstream tracks a better public API:
// https://github.com/wallet-standard/wallet-standard/issues/133
export const getOrCreateUiWalletAccountForStandardWalletAccount =
    getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
export const getWalletAccountForUiWalletAccount = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
export const getWalletForHandle = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
