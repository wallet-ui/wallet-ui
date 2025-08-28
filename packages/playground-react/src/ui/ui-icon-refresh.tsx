import * as React from 'react';
import { HTMLAttributes } from 'react';

export function UiIconRefresh(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
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
