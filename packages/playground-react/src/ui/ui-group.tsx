import * as React from 'react';
import { BoxProps, UiBox } from './ui-box';

export type GroupProps = BoxProps;

export function UiGroup({ children, style = {}, ...props }: GroupProps) {
    const resolvedStyle: React.CSSProperties = {
        alignItems: 'center',
        display: 'flex',
        gap: '1rem',
        ...style,
    };
    return (
        <UiBox style={resolvedStyle} {...props}>
            {children}
        </UiBox>
    );
}
