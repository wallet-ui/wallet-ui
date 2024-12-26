import { foo as coreFoo } from '@wallet-ui/core';
import { SolanaGetVersion, useFoo } from '@wallet-ui/react';

export function Root() {
    const foo = useFoo();
    const coreFooResult = coreFoo();

    return (
        <div>
            <pre>{JSON.stringify({ coreFooResult, foo }, null, 4)}</pre>
            <SolanaGetVersion />
        </div>
    );
}
