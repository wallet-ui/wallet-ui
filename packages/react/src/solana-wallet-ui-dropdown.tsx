// import './solana-wallet-ui-dropdown.css';

import React, { ButtonHTMLAttributes } from 'react';

import { useSolanaWalletUi } from './solana-wallet-ui-context';

export interface AppMenuItem {
    disabled?: boolean;
    handler: () => Promise<void> | void;
    label: string;
    value: string;
}

export function SolanaWalletUiDropdown() {
    const { change, connected, copy, disconnect, menuApi: api, wallet } = useSolanaWalletUi();

    const menuItems: AppMenuItem[] = [
        {
            handler: copy,
            label: 'Copy Address',
            value: 'copy',
        },
        {
            handler: change,
            label: 'Change Wallet',
            value: 'change',
        },
        {
            handler: disconnect,
            label: 'Disconnect',
            value: 'disconnect',
        },
    ];

    const trigger = (
        <AppMenuButton
            {...api.getTriggerProps()}
            className={`wallet-trigger ${connected ? 'connected' : ''}`}
            data-part="trigger"
        >
            {connected ? wallet?.name : 'Select Wallet'}
            <span className="wallet-actions">
                <span {...api.getIndicatorProps()} className="indicator">
                    ▾
                </span>
            </span>
        </AppMenuButton>
    );

    return (
        <div className="wallet-menu">
            {trigger}
            <div {...api.getPositionerProps()} className="wallet-positioner">
                <ul {...api.getContentProps()} className="wallet-content" data-part="content">
                    {menuItems.map(item => (
                        <li
                            key={item.value}
                            {...api.getItemProps({ value: item.value })}
                            className="wallet-item"
                            data-part="item"
                            onClick={() => {
                                if (item.disabled) {
                                    return;
                                }
                                void item.handler();
                            }}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function AppMenuButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button {...props}>{props.children}</button>;
}
