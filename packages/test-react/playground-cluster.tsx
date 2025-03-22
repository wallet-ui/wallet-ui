import React from 'react';
import { PlaygroundClusterDropdown } from './playground-cluster-dropdown';
import { PlaygroundUiCard } from './playground-ui-card';

export function PlaygroundCluster() {
    return (
        <PlaygroundUiCard title="Clusters" open>
            <PlaygroundClusterDropdown />
        </PlaygroundUiCard>
    );
}
