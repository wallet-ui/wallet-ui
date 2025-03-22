import React from 'react';

import { BaseSvg, BaseSvgProps } from './base-svg';

export function WalletUiIconClose({ size = 'md', ...props }: Omit<BaseSvgProps, 'sizes' | 'viewBox'>) {
    return (
        <BaseSvg
            size={size}
            sizes={{ lg: 16, md: 12, sm: 8 }}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 14 14"
            {...props}
        >
            <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"></path>
        </BaseSvg>
    );
}
