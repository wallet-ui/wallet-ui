import React, { HTMLAttributes } from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { BaseDropdownControl } from './use-base-dropdown';

export interface BaseDropdownItem {
    closeMenu?: boolean;
    disabled?: boolean;
    handler: () => void;
    label: string;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    value: string;
}

export interface BaseDropdownProps {
    buttonProps: BaseButtonProps;
    dropdown: BaseDropdownControl;
    items: BaseDropdownItem[];
    showIndicator?: boolean;
}

export function BaseDropdown({ buttonProps, dropdown, showIndicator, items }: BaseDropdownProps) {
    const api = dropdown.api;
    const trigger = (
        <BaseButton
            {...api.getTriggerProps()}
            className={`wallet-ui-base-dropdown-trigger`}
            data-part="trigger"
            rightSection={
                showIndicator ? (
                    <span className="wallet-actions">
                        <span {...api.getIndicatorProps()} className="indicator">
                            <BaseDropdownChevronDown size={12} />
                        </span>
                    </span>
                ) : null
            }
            {...buttonProps}
        />
    );

    return (
        <div className="wallet-ui-base-dropdown">
            {trigger}
            <div {...api.getPositionerProps()} className="wallet-positioner">
                <ul {...api.getContentProps()} className="wallet-ui-base-dropdown-list" data-part="content">
                    {items.map(item => (
                        <li
                            key={item.value}
                            {...api.getItemProps({ value: item.value })}
                            className="wallet-ui-base-dropdown-item"
                            data-part="item"
                            onClick={() => {
                                if (item.disabled) {
                                    return;
                                }
                                item.handler();
                                if (item.closeMenu !== false) {
                                    dropdown.close();
                                }
                            }}
                        >
                            {item.leftSection ? (
                                <span className="wallet-ui-base-dropdown-item-left-section">{item.leftSection}</span>
                            ) : null}
                            {item.label}
                            {item.rightSection ? (
                                <span className="wallet-ui-base-dropdown-item-right-section">{item.rightSection}</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function BaseDropdownChevronDown(props: HTMLAttributes<SVGElement> & { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size ?? 24}
            height={props.size ?? 24}
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
