import * as React from 'react';
import { UiStack } from './ui-stack';
import { testReactUiStyleBorder, testReactUiStyleHeader, testReactUiStylePadding } from './ui-style';

export function UiPanel({ children, title }: { children: React.ReactNode; title: React.ReactNode }) {
    return (
        <div style={{ ...testReactUiStyleBorder }}>
            <div style={{ ...testReactUiStyleHeader, ...testReactUiStylePadding }}>{title}</div>
            <UiStack style={{ ...testReactUiStylePadding, alignItems: 'flex-start' }}>{children}</UiStack>
        </div>
    );
}
