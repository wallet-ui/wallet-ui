import { WalletUiSize } from '@wallet-ui/react';
import React from 'react';
import { testUiSizes } from './test-ui-sizes';

export function TestReactRenderSizes(props: { render: (size: WalletUiSize) => React.ReactNode }) {
    return testUiSizes.map(size => props.render(size));
}
