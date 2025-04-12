'use client';
import { PlaygroundUi, UiClientRender } from '@wallet-ui/playground-react';

export default function UIRoute() {
    return (
        <UiClientRender>
            <PlaygroundUi />
        </UiClientRender>
    );
}
