import * as React from 'react';
import { testReactUiStyleBorder, testReactUiStyleHeader, testReactUiStylePadding } from './test-react-ui-style';

export function TestReactUiPanel({ children, title }: { children: React.ReactNode; title: React.ReactNode }) {
    return (
        <div style={{ ...testReactUiStyleBorder }}>
            <div style={{ ...testReactUiStyleHeader, ...testReactUiStylePadding }}>{title}</div>
            <div style={{ ...testReactUiStylePadding }}>{children}</div>
        </div>
    );
}