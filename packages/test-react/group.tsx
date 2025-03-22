import * as React from 'react';
import { Box, BoxProps } from './box';

export type GroupProps = BoxProps;

export function Group({ children, style = {}, ...props }: GroupProps) {
    const resolvedStyle: React.CSSProperties = {
        alignItems: 'center',
        display: 'flex',
        gap: '1rem',
        ...style,
    };
    return (
        <Box style={resolvedStyle} {...props}>
            {children}
        </Box>
    );
}
