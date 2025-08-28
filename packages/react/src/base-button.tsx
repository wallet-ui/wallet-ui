import React from 'react';

import { WalletUiButton } from './types/wallet-ui-button';

export interface BaseButtonProps extends Omit<WalletUiButton, 'children'> {
    label: React.ReactNode;
    leftSection?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    rightSection?: React.ReactNode;
}

export function BaseButton({ className, label, leftSection, onClick, rightSection, ...props }: BaseButtonProps) {
    return (
        <button data-wu="base-button" className={`${className ?? ''}`} onClick={onClick} {...props}>
            {leftSection ? <span data-wu="base-button-left-section">{leftSection}</span> : null}
            {label}
            {rightSection ? <span data-wu="base-button-right-section">{rightSection}</span> : null}
        </button>
    );
}
