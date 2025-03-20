import { BaseButton } from '@wallet-ui/react';
import * as React from 'react';
import { Group } from './group';
import { testReactUiStyleBorder, testReactUiStylePadding } from './test-react-ui-style';

export function TestReactUiCard({ children, title }: { children: React.ReactNode; title: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div style={{ ...testReactUiStyleBorder }}>
            <Group style={{ ...testReactUiStylePadding, justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 500, paddingLeft: '0.5rem' }}>{title}</div>
                <BaseButton size="sm" onClick={() => setIsOpen(prev => !prev)}>
                    {isOpen ? 'Close' : 'Open'}
                </BaseButton>
            </Group>
            {isOpen ? <div style={{ ...testReactUiStylePadding, paddingTop: 0 }}>{children}</div> : null}
        </div>
    );
}
