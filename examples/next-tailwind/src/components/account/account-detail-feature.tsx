'use client';

import { AppHero } from '@/components/app-layout';
import { ExplorerLink } from '@/components/explorer-link';
import { ellipsify } from '@/lib/utils';
import { address as addressFn } from 'gill';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { AccountUiBalance } from './ui/account-ui-balance';
import { AccountUiButtons } from './ui/account-ui-buttons';
import { AccountUiTokens } from './ui/account-ui-tokens';
import { AccountUiTransactions } from './ui/account-ui-transactions';

export default function AccountDetailFeature() {
    const params = useParams();
    const address = useMemo(() => {
        if (!params.address || typeof params.address !== 'string') {
            return;
        }
        try {
            return addressFn(params.address);
        } catch (e) {
            console.log(`Invalid public key`, e);
        }
    }, [params]);

    if (!address) {
        return <div>Error loading account</div>;
    }

    return (
        <div>
            <AppHero
                title={<AccountUiBalance address={address} />}
                subtitle={
                    <div className="my-4">
                        <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
                    </div>
                }
            >
                <div className="my-4">{<AccountUiButtons address={address} />}</div>
            </AppHero>

            <div className="space-y-8">
                <div>
                    <AccountUiTokens address={address} />
                </div>
                <div>
                    <AccountUiTransactions address={address} />
                </div>
            </div>
        </div>
    );
}
