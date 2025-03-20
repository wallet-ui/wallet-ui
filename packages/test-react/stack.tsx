import * as React from 'react';
import { Box, BoxProps } from './box';

export type StackProps = BoxProps;

export function Stack({ children, style = {}, ...props }: StackProps) {
    const resolvedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        ...style,
    };
    return (
        <Box style={resolvedStyle} {...props}>
            {children}
        </Box>
    );
}
