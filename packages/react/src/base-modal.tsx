import { Portal } from '@zag-js/react';
import React from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { BaseModalControl } from './use-base-modal';
import { WalletUiIconClose } from './wallet-ui-icon-close';

export interface BaseModalProps {
    buttonLabel?: React.ReactNode;
    buttonProps?: Partial<BaseButtonProps>;
    children: React.ReactNode;
    description?: React.ReactNode;
    modal: BaseModalControl;
    title?: React.ReactNode;
}

export function BaseModal({ modal, buttonLabel, buttonProps = {}, ...props }: BaseModalProps) {
    const api = modal.api;
    return (
        <>
            {buttonLabel ? <BaseButton label={buttonLabel} {...buttonProps} {...api.getTriggerProps()} /> : null}
            {api.open && (
                <Portal>
                    <div {...api.getBackdropProps()} />
                    <div {...api.getPositionerProps()}>
                        <div {...api.getContentProps()}>
                            <header>
                                <button {...api.getCloseTriggerProps()}>
                                    <WalletUiIconClose />
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
