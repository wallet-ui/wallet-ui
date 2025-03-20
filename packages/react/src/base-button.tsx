import React from 'react';

import { WalletUiButton } from './types/wallet-ui-button';
import { WalletUiSize } from './types/wallet-ui-size';

export interface BaseButtonProps extends WalletUiButton {
    children: React.ReactNode;
    leftSection?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    rightSection?: React.ReactNode;
    size?: WalletUiSize;
}

export function BaseButton({
    children,
    className,
    leftSection,
    onClick,
    rightSection,
    size,
    ...props
}: BaseButtonProps) {
    return (
        <button className={`wallet-ui-base-button ${size ?? 'md'} ${className ?? ''}`} onClick={onClick} {...props}>
            {leftSection ? <span className="wallet-ui-base-button-left-section">{leftSection}</span> : null}
            {children}
            {rightSection ? <span className="wallet-ui-base-button-right-section">{rightSection}</span> : null}
        </button>
    );
}
