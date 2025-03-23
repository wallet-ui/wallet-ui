import * as React from 'react';
import { BoxProps, UiBox } from './ui-box';

export type StackProps = BoxProps;

export function UiStack({ children, style = {}, ...props }: StackProps) {
    const resolvedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        ...style,
    };
    return (
        <UiBox style={resolvedStyle} {...props}>
            {children}
        </UiBox>
    );
}
