import './wallet-ui-button.css';

import React, { ButtonHTMLAttributes } from 'react';

export interface WalletUiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function WalletUiButton({
    children,
    type = 'button',
    onClick,
    disabled = false,
    className,
    id,
    style,
    ...rest
}: WalletUiButtonProps) {
    const baseClassName = 'wallet-ui-button';
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className ? `${baseClassName} ${className}` : baseClassName}
            id={id}
            style={style}
            {...rest}
        >
            {children}
        </button>
    );
}
