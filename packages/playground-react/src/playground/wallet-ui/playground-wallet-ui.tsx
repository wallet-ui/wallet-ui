import React, { useEffect } from 'react';

import { UiCard, UiStack } from '../../ui/';

import { PlaygroundBaseButton } from '../base-ui/playground-base-button';
import { PlaygroundBaseDropdown } from '../base-ui/playground-base-dropdown';
import { PlaygroundBaseModal } from '../base-ui/playground-base-modal';
import { PlaygroundClusterDropdown } from '../cluster/playground-cluster-dropdown';
import { PlaygroundProviders } from '../playground-providers';
import { PlaygroundWalletUiButton } from './playground-wallet-ui-button';
import { PlaygroundWalletUiDropdown } from './playground-wallet-ui-dropdown';
import { PlaygroundWalletUiIcon } from './playground-wallet-ui-icon';
import { PlaygroundWalletUiIconClose } from './playground-wallet-ui-icon-close';
import { PlaygroundWalletUiIconNoWallet } from './playground-wallet-ui-icon-no-wallet';
import { PlaygroundWalletUiLabel } from './playground-wallet-ui-label';
import { PlaygroundWalletUiList } from './playground-wallet-ui-list';
import { PlaygroundWalletUiListButton } from './playground-wallet-ui-list-button';
import { PlaygroundWalletUiModal } from './playground-wallet-ui-modal';
import { PlaygroundWalletUiProvider } from './playground-wallet-ui-provider';

export function PlaygroundWalletUi() {
    const [open, setOpen] = React.useState<Map<string, boolean>>(new Map());

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
            <UiStack>
                {Object.entries({
                    BaseButton: <PlaygroundBaseButton />,
                    BaseDropdown: <PlaygroundBaseDropdown />,
                    BaseModal: <PlaygroundBaseModal />,
                    WalletUiClusterDropdown: <PlaygroundClusterDropdown />,
                    WalletUiButton: <PlaygroundWalletUiButton />,
                    WalletUiDropdown: <PlaygroundWalletUiDropdown />,
                    WalletUiIcon: <PlaygroundWalletUiIcon />,
                    WalletUiIconClose: <PlaygroundWalletUiIconClose />,
                    WalletUiIconNoWallet: <PlaygroundWalletUiIconNoWallet />,
                    WalletUiLabel: <PlaygroundWalletUiLabel />,
                    WalletUiList: <PlaygroundWalletUiList />,
                    WalletUiListButton: <PlaygroundWalletUiListButton />,
                    WalletUiModal: <PlaygroundWalletUiModal />,
                    WalletUiProvider: <PlaygroundWalletUiProvider />,
                }).map(([name, element]) => (
                    <UiCard
                        title={<code>{name}</code>}
                        key={name}
                        toggle={() => handleToggle(name)}
                        open={open.get(name)}
                    >
                        {element}
                    </UiCard>
                ))}
            </UiStack>
        </PlaygroundProviders>
    );
}
