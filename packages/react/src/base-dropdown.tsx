import { UiWallet } from '@wallet-standard/react';
import React, { HTMLAttributes } from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { BaseDropdownControl } from './use-base-dropdown';
import { useWalletUiWallet } from './use-wallet-ui-wallet';
import { WalletUiIcon } from './wallet-ui-icon';

export enum BaseDropdownItemType {
    Item = 'Item',
    WalletConnect = 'WalletConnect',
    WalletCopy = 'WalletCopy',
    WalletDisconnect = 'WalletDisconnect',
    WalletNeeded = 'WalletNeeded',
}

export interface BaseDropdownItem {
    closeMenu?: boolean;
    disabled?: boolean;
    handler: () => Promise<void>;
    label: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    type: BaseDropdownItemType;
    value: string;
    wallet?: UiWallet;
}

export interface BaseDropdownProps {
    buttonProps: BaseButtonProps;
    dropdown: BaseDropdownControl;
    items: BaseDropdownItem[];
    showIndicator?: boolean;
}

export function BaseDropdown({ buttonProps, dropdown, items, showIndicator }: BaseDropdownProps) {
    const api = dropdown.api;
    const trigger = (
        <BaseButton
            {...api.getTriggerProps()}
            rightSection={
                showIndicator ? (
                    <span {...api.getIndicatorProps()}>
                        <BaseDropdownChevronDown />
                    </span>
                ) : null
            }
            {...buttonProps}
        />
    );

    return (
        <div data-wu="base-dropdown">
            {trigger}
            <div {...api.getPositionerProps()} data-wu="base-dropdown-wrapper">
                <div {...api.getContentProps()} data-wu="base-dropdown-list" data-part="content">
                    {items.map(item => {
                        return (
                            <BaseDropdownItem
                                {...api.getItemProps({ value: item.value })}
                                key={item.value}
                                item={item}
                                afterClick={() => {
                                    if (item.disabled) {
                                        return;
                                    }
                                    if (item.closeMenu !== false) {
                                        dropdown.close();
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function BaseDropdownItem({ afterClick, item }: BaseDropdownItemRenderProps) {
    if (!item.wallet) {
        return <BaseDropdownItemRender afterClick={afterClick} item={item} />;
    }
    switch (item.type) {
        case BaseDropdownItemType.Item:
            return <BaseDropdownItemRender afterClick={afterClick} item={item} />;
        case BaseDropdownItemType.WalletConnect:
            return <BaseDropdownItemWalletConnect afterClick={afterClick} item={item} wallet={item.wallet} />;
        case BaseDropdownItemType.WalletCopy:
            return <BaseDropdownItemRender afterClick={afterClick} item={item} />;
        case BaseDropdownItemType.WalletDisconnect:
            return <BaseDropdownItemWalletDisconnect afterClick={afterClick} item={item} wallet={item.wallet} />;
    }
}

function BaseDropdownItemWalletConnect({
    afterClick,
    item,
    wallet,
}: BaseDropdownItemRenderProps & {
    wallet: UiWallet;
}) {
    const { connect } = useWalletUiWallet({ wallet });
    return (
        <BaseDropdownItemRender
            afterClick={afterClick}
            item={{
                ...item,
                handler: async () => {
                    //
                    await connect();
                    return await item.handler();
                },
                leftSection: wallet ? <WalletUiIcon wallet={wallet} /> : undefined,
            }}
        />
    );
}

function BaseDropdownItemWalletDisconnect({
    afterClick,
    item,
    wallet,
}: BaseDropdownItemRenderProps & {
    wallet: UiWallet;
}) {
    const { disconnect } = useWalletUiWallet({ wallet });
    return (
        <BaseDropdownItemRender
            afterClick={afterClick}
            item={{
                ...item,
                handler: async () => {
                    //
                    await disconnect();
                    return await item.handler();
                },
            }}
        />
    );
}

interface BaseDropdownItemRenderProps {
    afterClick: () => void;
    item: BaseDropdownItem;
}

function BaseDropdownItemRender({ afterClick, item }: BaseDropdownItemRenderProps) {
    function onClick() {
        if (item.disabled) {
            return;
        }
        void item.handler().then(() => {
            afterClick();
        });
    }

    return (
        <button type="button" data-wu="base-dropdown-item" data-part="item" onClick={onClick}>
            {item.leftSection ? <span data-wu="base-dropdown-item-left-section">{item.leftSection}</span> : null}
            {item.label}
            {item.rightSection ? <span data-wu="base-dropdown-item-right-section">{item.rightSection}</span> : null}
        </button>
    );
}

export function BaseDropdownChevronDown(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
