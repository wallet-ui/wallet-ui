import { WalletUiSize } from '@wallet-ui/react';
import React from 'react';

export const testUiSizes: WalletUiSize[] = ['sm', 'md', 'lg'] as const;

export function UiSizes(props: { render: (size: WalletUiSize) => React.ReactNode }) {
    return testUiSizes.map(size => props.render(size));
}
