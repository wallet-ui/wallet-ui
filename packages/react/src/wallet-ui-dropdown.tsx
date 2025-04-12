import React from 'react';

import { BaseDropdown } from './base-dropdown';
import { WalletUiSize } from './types/wallet-ui-size';
import { useWalletUiDropdown } from './use-wallet-ui-dropdown';

export interface WalletUiDropdownProps {
    label?: string;
    size?: WalletUiSize;
}

export function WalletUiDropdown({ size = 'md', ...props }: WalletUiDropdownProps) {
    const { buttonProps, items, dropdown } = useWalletUiDropdown({ size });
    return <BaseDropdown {...props} buttonProps={{ ...buttonProps }} dropdown={dropdown} items={items} size={size} />;
}
