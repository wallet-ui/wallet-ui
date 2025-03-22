import { BaseButton } from '@wallet-ui/react';
import * as React from 'react';
import { Group } from './group';
import { Stack } from './stack';
import { testReactUiStyleBorder, testReactUiStylePadding } from './test-react-ui-style';

export function PlaygroundUiCard({
    children,
    open = false,
    title,
    toggle,
}: {
    children: React.ReactNode;
    open?: boolean;
    title: React.ReactNode;
    toggle?: () => void;
}) {
    const [isOpen, setIsOpen] = React.useState(open);
    return (
        <div style={{ ...testReactUiStyleBorder }}>
            <Group style={{ ...testReactUiStylePadding, justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 500, paddingLeft: '0.5rem' }}>{title}</div>
                <BaseButton
                    label={isOpen ? 'Close' : 'Open'}
                    onClick={() => {
                        setIsOpen(prev => !prev);
                        toggle?.();
                    }}
                    size="sm"
                />
            </Group>
            {isOpen ? <Stack style={{ ...testReactUiStylePadding, paddingTop: 0 }}>{children}</Stack> : null}
        </div>
    );
}
