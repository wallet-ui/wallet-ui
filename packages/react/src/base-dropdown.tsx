import * as menu from '@zag-js/menu';
import { normalizeProps, useMachine } from '@zag-js/react';
import React, { HTMLAttributes, useId } from 'react';

import { BaseButton } from './base-button';
import { WalletUiSize } from './types/wallet-ui-size';

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
    buttonLabel: React.ReactNode;
    buttonLeftSection?: React.ReactNode;
    buttonSize?: WalletUiSize;
    items: BaseDropdownItem[];
    showIndicator?: boolean;
}

export function BaseDropdown({
    buttonLabel,
    buttonLeftSection,
    buttonSize = 'md',
    showIndicator,
    items,
}: BaseDropdownProps) {
    const service = useMachine(menu.machine, { id: useId() });
    const api = menu.connect(service, normalizeProps);

    const trigger = (
        <BaseButton
            {...api.getTriggerProps()}
            className={`wallet-ui-base-dropdown-trigger`}
            data-part="trigger"
            leftSection={buttonLeftSection}
            rightSection={
                showIndicator ? (
                    <span className="wallet-actions">
                        <span {...api.getIndicatorProps()} className="indicator">
                            <BaseDropdownChevronDown size={12} />
                        </span>
                    </span>
                ) : null
            }
            size={buttonSize}
        >
            {buttonLabel}
        </BaseButton>
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
                                    service.send({ type: 'CLOSE' });
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
