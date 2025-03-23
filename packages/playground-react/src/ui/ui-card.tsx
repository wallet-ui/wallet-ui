import { BaseButton } from '@wallet-ui/react';
import * as React from 'react';
import { UiGroup } from './ui-group';
import { UiStack } from './ui-stack';
import { testReactUiStyleBorder, testReactUiStylePadding } from './ui-style';

export function UiCard({
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
            <UiGroup style={{ ...testReactUiStylePadding, justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 500, paddingLeft: '0.5rem' }}>{title}</div>
                <BaseButton
                    label={isOpen ? 'Close' : 'Open'}
                    onClick={() => {
                        setIsOpen(prev => !prev);
                        toggle?.();
                    }}
                    size="sm"
                />
            </UiGroup>
            {isOpen ? <UiStack style={{ ...testReactUiStylePadding, paddingTop: 0 }}>{children}</UiStack> : null}
        </div>
    );
}
