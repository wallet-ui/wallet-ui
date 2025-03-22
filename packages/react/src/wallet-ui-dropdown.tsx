import React from 'react';

import { BaseDropdown, BaseDropdownProps } from './base-dropdown';

export interface WalletUiDropdownProps extends Omit<BaseDropdownProps, 'children'> {
    children?: React.ReactNode;
    label?: string;
}

export function WalletUiDropdown({ children, label = 'Select Wallet', ...props }: WalletUiDropdownProps) {
    return <BaseDropdown {...props}>{children ?? label}</BaseDropdown>;
}
