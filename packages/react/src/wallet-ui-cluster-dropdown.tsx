import React from 'react';

import { BaseDropdown, BaseDropdownItemType, BaseDropdownProps } from './base-dropdown';
import { useBaseDropdown } from './use-base-dropdown';
import { useWalletUiCluster } from './use-wallet-ui-cluster';

export interface WalletUiClusterDropdownProps
    extends Omit<BaseDropdownProps, 'buttonProps' | 'dropdown' | 'items' | 'label'> {
    buttonProps?: Partial<BaseDropdownProps['buttonProps']>;
}

export function WalletUiClusterDropdown({ buttonProps, ...props }: WalletUiClusterDropdownProps) {
    const dropdown = useBaseDropdown();
    const { cluster, clusters, setCluster } = useWalletUiCluster();
    return (
        <BaseDropdown
            buttonProps={{ ...buttonProps, label: cluster.label }}
            items={clusters.map(cluster => ({
                handler: async () => {
                    setCluster(cluster.id);
                    await Promise.resolve();
                },
                label: cluster.label,
                type: BaseDropdownItemType.Item,
                value: cluster.id,
            }))}
            dropdown={dropdown}
            {...props}
        />
    );
}
