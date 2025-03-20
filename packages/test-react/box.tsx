import * as React from 'react';
import { HTMLAttributes } from 'react';

export type BoxProps = HTMLAttributes<HTMLDivElement>;

export function Box({ children, style = {}, ...props }: BoxProps) {
    return (
        <div style={{ ...style }} {...props}>
            {children}
        </div>
    );
}
