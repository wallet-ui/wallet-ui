import * as React from 'react';
import { Stack } from './stack';
import { testReactUiStyleBorder, testReactUiStyleHeader, testReactUiStylePadding } from './test-react-ui-style';

export function PlaygroundUiPanel({ children, title }: { children: React.ReactNode; title: React.ReactNode }) {
    return (
        <div style={{ ...testReactUiStyleBorder }}>
            <div style={{ ...testReactUiStyleHeader, ...testReactUiStylePadding }}>{title}</div>
            <Stack style={{ ...testReactUiStylePadding, alignItems: 'flex-start' }}>{children}</Stack>
        </div>
    );
}
