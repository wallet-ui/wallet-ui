import React from 'react';

import { BaseButton, BaseButtonProps } from './base-button';
import { WalletUiSize } from './types/wallet-ui-size';

export interface WalletUiButtonProps extends Omit<BaseButtonProps, 'label'> {
    size?: WalletUiSize;
}

export function WalletUiButton({ ...props }: WalletUiButtonProps) {
    return <BaseButton {...props} label={'CLICK'} />;
}
