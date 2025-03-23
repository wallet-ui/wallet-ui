import { BaseButton } from '@wallet-ui/react';
import * as React from 'react';
import { UiGroup } from './ui-group';
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
            <UiGroup style={{ ...uiStylePadding, justifyContent: 'space-between' }}>
                <div style={{ ...uiStyleTitle, cursor: 'pointer' }} onClick={() => handleToggle()}>
                    {title}
                </div>
                <BaseButton label={isOpen ? 'Close' : 'Open'} onClick={() => handleToggle()} size="sm" />
            </UiGroup>
            {isOpen ? <UiStack style={{ ...uiStylePadding, paddingTop: 0 }}>{children}</UiStack> : null}
        </div>
    );
}
