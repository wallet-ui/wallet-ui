import React from 'react';

import { WalletUiSize } from './types/wallet-ui-size';
import { WalletUiSvg } from './types/wallet-ui-svg';

export interface BaseSvgProps extends WalletUiSvg {
    size: WalletUiSize;
    sizes: { [key: string]: number };
    viewBox: string;
}

export function BaseSvg({ sizes = {}, ...props }: BaseSvgProps) {
    const size = props.size ? sizes[props.size] : 12;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...props}>
            {props.children}
        </svg>
    );
}
