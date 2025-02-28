import '@wallet-ui/react/index.css';

import { WalletUiButton } from '@wallet-ui/react';

export default function Dev() {
    return (
        <div>
            <WalletUiButton
                onClick={e => {
                    console.log('click', e);
                }}
            >
                Button
            </WalletUiButton>
            <pre>{JSON.stringify({ page: 'DEV' }, null, 4)}</pre>
        </div>
    );
}
