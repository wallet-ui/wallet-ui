import { BaseButton } from '@wallet-ui/react';
import React, { useState } from 'react';
import { UiPanel } from '../../ui';

export function PlaygroundRunCommand({ command, label }: { command: () => Promise<unknown>; label: string }) {
    const [result, setResult] = useState<unknown | undefined>(undefined);

    return (
        <UiPanel title={label}>
            <BaseButton
                label={label}
                onClick={() => {
                    setResult('Loading...');
                    void command().then(res => {
                        setResult(res);
                    });
                }}
            />
            {result ? <pre>{JSON.stringify(result, null, 4)}</pre> : null}
        </UiPanel>
    );
}
