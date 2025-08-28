import React from 'react';

import { BaseDropdown } from './base-dropdown';
import { useWalletUiDropdown } from './use-wallet-ui-dropdown';

export interface WalletUiDropdownProps {
    label?: string;
}

export function WalletUiDropdown({ ...props }: WalletUiDropdownProps) {
    const { buttonProps, items, dropdown } = useWalletUiDropdown();
    return <BaseDropdown {...props} buttonProps={{ ...buttonProps }} dropdown={dropdown} items={items} />;
}
