import React from 'react';

import { BaseDropdown, BaseDropdownProps } from './base-dropdown';
import { WalletUiSize } from './types/wallet-ui-size';
import { useBaseDropdown } from './use-base-dropdown';
import { useWalletUiCluster } from './use-wallet-ui-cluster';

export interface WalletUiClusterDropdownProps
    extends Omit<BaseDropdownProps, 'buttonProps' | 'dropdown' | 'items' | 'label'> {
    buttonProps?: Partial<BaseDropdownProps['buttonProps']>;
    size?: WalletUiSize;
}

export function WalletUiClusterDropdown({ buttonProps, size = 'md', ...props }: WalletUiClusterDropdownProps) {
    const dropdown = useBaseDropdown();
    const { cluster, clusters, setCluster } = useWalletUiCluster();
    return (
        <BaseDropdown
            buttonProps={{ ...buttonProps, label: cluster.label, size: size }}
            items={clusters.map(cluster => ({
                handler: () => setCluster(cluster.id),
                label: cluster.label,
                value: cluster.id,
            }))}
            dropdown={dropdown}
            {...props}
        />
    );
}
