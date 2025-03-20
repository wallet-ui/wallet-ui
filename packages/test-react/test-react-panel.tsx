import React from 'react';
import { Stack } from './stack';

import { TestReactPanelBaseButton } from './test-react-panel-base-button';
import { TestReactPanelBaseDropdown } from './test-react-panel-base-dropdown';
import { TestReactPanelWalletUiIcon } from './test-react-panel-wallet-ui-icon';
import { TestReactPanelWalletUiLabel } from './test-react-panel-wallet-ui-label';
import { TestReactPanelWalletUiList } from './test-react-panel-wallet-ui-list';
import { TestReactPanelWalletUiListItem } from './test-react-panel-wallet-ui-list-item';
import { TestReactPanelWalletUiModal } from './test-react-panel-wallet-ui-modal';

import { TestReactUiCard } from './test-react-ui-card';

export function TestReactPanel() {
    return (
        <Stack>
            {Object.entries({
                BaseButton: <TestReactPanelBaseButton />,
                BaseDropdown: <TestReactPanelBaseDropdown />,
                WalletUiIcon: <TestReactPanelWalletUiIcon />,
                WalletUiLabel: <TestReactPanelWalletUiLabel />,
                WalletUiList: <TestReactPanelWalletUiList />,
                WalletUiListItem: <TestReactPanelWalletUiListItem />,
                WalletUiModal: <TestReactPanelWalletUiModal />,
            }).map(([name, element]) => (
                <TestReactUiCard title={<code>{name}</code>} key={name}>
                    {element}
                </TestReactUiCard>
            ))}
        </Stack>
    );
}
