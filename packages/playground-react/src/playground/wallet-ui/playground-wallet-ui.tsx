import React from 'react';

import { UiCard, UiStack } from '../../ui/';
import { useOpenState } from '../../ui/use-open-state';

import { PlaygroundBaseButton } from '../base-ui/playground-base-button';
import { PlaygroundBaseDropdown } from '../base-ui/playground-base-dropdown';
import { PlaygroundBaseModal } from '../base-ui/playground-base-modal';
import { PlaygroundClusterDropdown } from '../cluster/playground-cluster-dropdown';
import { PlaygroundProviders } from '../playground-providers';
import { PlaygroundWalletUiDropdown } from './playground-wallet-ui-dropdown';
import { PlaygroundWalletUiIcon } from './playground-wallet-ui-icon';
import { PlaygroundWalletUiIconClose } from './playground-wallet-ui-icon-close';
import { PlaygroundWalletUiIconNoWallet } from './playground-wallet-ui-icon-no-wallet';
import { PlaygroundWalletUiLabel } from './playground-wallet-ui-label';
import { PlaygroundWalletUiList } from './playground-wallet-ui-list';
import { PlaygroundWalletUiListButton } from './playground-wallet-ui-list-button';
import { PlaygroundWalletUiModal } from './playground-wallet-ui-modal';
import { PlaygroundWalletUiProvider } from './playground-wallet-ui-provider';

const cards = {
    BaseButton: <PlaygroundBaseButton />,
    BaseDropdown: <PlaygroundBaseDropdown />,
    BaseModal: <PlaygroundBaseModal />,
    WalletUiClusterDropdown: <PlaygroundClusterDropdown />,
    WalletUiDropdown: <PlaygroundWalletUiDropdown />,
    WalletUiIcon: <PlaygroundWalletUiIcon />,
    WalletUiIconClose: <PlaygroundWalletUiIconClose />,
    WalletUiIconNoWallet: <PlaygroundWalletUiIconNoWallet />,
    WalletUiLabel: <PlaygroundWalletUiLabel />,
    WalletUiList: <PlaygroundWalletUiList />,
    WalletUiListButton: <PlaygroundWalletUiListButton />,
    WalletUiModal: <PlaygroundWalletUiModal />,
    WalletUiProvider: <PlaygroundWalletUiProvider />,
};

export function PlaygroundWalletUi() {
    const { open, handleToggle } = useOpenState();
    return (
        <PlaygroundProviders>
            <UiStack>
                {Object.entries(cards).map(([name, element]) => (
                    <UiCard
                        title={<code>{name}</code>}
                        key={name}
                        toggle={() => handleToggle(name)}
                        open={open.includes(name)}
                    >
                        {element}
                    </UiCard>
                ))}
            </UiStack>
        </PlaygroundProviders>
    );
}
