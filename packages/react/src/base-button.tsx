import React from 'react';

import { WalletUiButton } from './types/wallet-ui-button';
import { WalletUiSize } from './types/wallet-ui-size';

export interface BaseButtonProps extends Omit<WalletUiButton, 'children'> {
    label: React.ReactNode;
    leftSection?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    rightSection?: React.ReactNode;
    size?: WalletUiSize;
}

export function BaseButton({ className, label, leftSection, onClick, rightSection, size, ...props }: BaseButtonProps) {
    return (
        <button data-wu="base-button" className={`${size ?? 'md'} ${className ?? ''}`} onClick={onClick} {...props}>
            {leftSection ? <span data-wu="base-button-left-section">{leftSection}</span> : null}
            {label}
            {rightSection ? <span data-wu="base-button-right-section">{rightSection}</span> : null}
        </button>
    );
}
