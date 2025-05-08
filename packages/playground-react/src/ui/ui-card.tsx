import { BaseButton } from '@wallet-ui/react';
import * as React from 'react';
import { UiStack } from './ui-stack';
import { uiStyleBorder, uiStylePadding, uiStyleTitle } from './ui-style';

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

    function handleToggle() {
        setIsOpen(prev => !prev);
        toggle?.();
    }

    return (
        <div style={{ ...uiStyleBorder }}>
            <BaseButton
                style={{ ...uiStylePadding, display: 'flex', justifyContent: 'stretch', width: '100%' }}
                label={<div style={{ ...uiStyleTitle }}>{title}</div>}
                onClick={() => handleToggle()}
                size="sm"
            />

            {isOpen ? <UiStack style={{ ...uiStylePadding }}>{children}</UiStack> : null}
        </div>
    );
}
