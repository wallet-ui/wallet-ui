import { WalletUiSize } from '@wallet-ui/react';
import * as React from 'react';
import { HTMLAttributes } from 'react';

export function TestReactUiIconRefresh(props: HTMLAttributes<SVGElement> & { size?: number | WalletUiSize }) {
    const size = getSize(props.size);
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 8.987 6" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-8.987-6" />
        </svg>
    );
}

function getSize(size?: number | WalletUiSize) {
    if (typeof size === 'number') {
        return size;
    }
    switch (size) {
        case 'sm':
            return 16;
        case 'md':
            return 24;
        case 'lg':
            return 32;
        default:
            return 24;
    }
}
