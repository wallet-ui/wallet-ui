import React from 'react';
import { UiCard } from '../../ui/';
import { PlaygroundClusterDropdown } from './playground-cluster-dropdown';

export function PlaygroundCluster() {
    return (
        <UiCard title="Clusters" open>
            <PlaygroundClusterDropdown />
        </UiCard>
    );
}
