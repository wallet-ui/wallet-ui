import { Portal } from '@zag-js/react';
import React from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { WalletUiSize } from './types/wallet-ui-size';
import { BaseModalControl } from './use-base-modal';
import { WalletUiIconClose } from './wallet-ui-icon-close';

export interface BaseModalProps {
    buttonLabel?: React.ReactNode;
    buttonProps?: Partial<BaseButtonProps>;
    children: React.ReactNode;
    description?: React.ReactNode;
    modal: BaseModalControl;
    size?: WalletUiSize;
    title?: React.ReactNode;
}

export function BaseModal({ modal, buttonLabel, buttonProps = {}, size = 'md', ...props }: BaseModalProps) {
    const api = modal.api;
    return (
        <>
            {buttonLabel ? (
                <BaseButton label={buttonLabel} size={size} {...buttonProps} {...api.getTriggerProps()} />
            ) : null}
            {api.open && (
                <Portal>
                    <div {...api.getBackdropProps()} />
                    <div {...api.getPositionerProps()}>
                        <div {...api.getContentProps()} className={size}>
                            <header>
                                <button {...api.getCloseTriggerProps()}>
                                    <WalletUiIconClose size={size} />
                                </button>
                            </header>
                            {props.description ? <p {...api.getDescriptionProps()}>{props.description}</p> : null}
                            <main>{props.children}</main>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}
