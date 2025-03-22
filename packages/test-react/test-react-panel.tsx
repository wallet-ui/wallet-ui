import React, { useEffect } from 'react';
import { PlaygroundClusterDropdown } from './playground-cluster-dropdown';
import { PlaygroundProviders } from './playground-providers';

import { PlaygroundUiCard } from './playground-ui-card';
import { Stack } from './stack';

import { TestReactPanelBaseButton } from './test-react-panel-base-button';
import { TestReactPanelBaseDropdown } from './test-react-panel-base-dropdown';
import { TestReactPanelBaseModal } from './test-react-panel-base-modal';
import { TestReactPanelWalletUiDropdown } from './test-react-panel-wallet-ui-dropdown';
import { TestReactPanelWalletUiIcon } from './test-react-panel-wallet-ui-icon';
import { TestReactPanelWalletUiIconClose } from './test-react-panel-wallet-ui-icon-close';
import { TestReactPanelWalletUiIconNoWallet } from './test-react-panel-wallet-ui-icon-no-wallet';
import { TestReactPanelWalletUiLabel } from './test-react-panel-wallet-ui-label';
import { TestReactPanelWalletUiList } from './test-react-panel-wallet-ui-list';
import { TestReactPanelWalletUiListButton } from './test-react-panel-wallet-ui-list-button';
import { TestReactPanelWalletUiModal } from './test-react-panel-wallet-ui-modal';
import { TestReactPanelWalletUiProvider } from './test-react-panel-wallet-ui-provider';

const url = new URL(window.location.href);
const urlOpen = new Map(
    url.searchParams
        .get('open')
        ?.split(',')
        .map(name => [name, true]),
);

export function TestReactPanel() {
    const [open, setOpen] = React.useState<Map<string, boolean>>(urlOpen);

    function handleToggle(name: string) {
        if (open.has(name) && open.get(name) === true) {
            setOpen(prev => new Map(prev.set(name, false)));
        } else {
            setOpen(prev => new Map(prev.set(name, true)));
        }
    }

    useEffect(() => {
        const url = new URL(window.location.href);
        const urlParam = Array.from(open.keys()).join(',');
        if (urlParam !== url.searchParams.get('open')) {
            url.searchParams.set('open', urlParam);
            window.history.pushState(null, '', url.toString());
        }
    }, [open]);

    return (
        <PlaygroundProviders>
            <Stack>
                {Object.entries({
                    BaseButton: <TestReactPanelBaseButton />,
                    BaseDropdown: <TestReactPanelBaseDropdown />,
                    BaseModal: <TestReactPanelBaseModal />,
                    WalletUiClusterDropdown: <PlaygroundClusterDropdown />,
                    WalletUiDropdown: <TestReactPanelWalletUiDropdown />,
                    WalletUiIcon: <TestReactPanelWalletUiIcon />,
                    WalletUiIconClose: <TestReactPanelWalletUiIconClose />,
                    WalletUiIconNoWallet: <TestReactPanelWalletUiIconNoWallet />,
                    WalletUiLabel: <TestReactPanelWalletUiLabel />,
                    WalletUiList: <TestReactPanelWalletUiList />,
                    WalletUiListButton: <TestReactPanelWalletUiListButton />,
                    WalletUiModal: <TestReactPanelWalletUiModal />,
                    WalletUiProvider: <TestReactPanelWalletUiProvider />,
                }).map(([name, element]) => (
                    <PlaygroundUiCard
                        title={<code>{name}</code>}
                        key={name}
                        toggle={() => handleToggle(name)}
                        open={open.get(name)}
                    >
                        {element}
                    </PlaygroundUiCard>
                ))}
            </Stack>
        </PlaygroundProviders>
    );
}
