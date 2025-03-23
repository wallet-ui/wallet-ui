import * as React from 'react';
import { UiStack } from './ui-stack';
import { uiStyleBorder, uiStyleHeader, uiStylePadding } from './ui-style';

export function UiPanel({ children, title }: { children: React.ReactNode; title: React.ReactNode }) {
    return (
        <div style={{ ...uiStyleBorder }}>
            <div style={{ ...uiStyleHeader, ...uiStylePadding }}>{title}</div>
            <UiStack style={{ ...uiStylePadding, alignItems: 'flex-start' }}>{children}</UiStack>
        </div>
    );
}
