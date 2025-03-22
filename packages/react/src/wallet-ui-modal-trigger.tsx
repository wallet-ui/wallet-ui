import React from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { BaseModalControl } from './use-base-modal';

export interface WalletUiModalTriggerProps extends Omit<BaseButtonProps, 'label'> {
    label?: string;
    modal: BaseModalControl;
}

export function WalletUiModalTrigger({ label = 'Select Wallet', modal, ...props }: WalletUiModalTriggerProps) {
    return <BaseButton label={label} onClick={() => void modal.open()} {...props} />;
}
