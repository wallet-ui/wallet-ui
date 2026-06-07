import {
    BaseButton,
    BaseDropdown,
    BaseDropdownItemType,
    BaseModal,
    createSolanaDevnet,
    createSolanaLocalnet,
    createSolanaTestnet,
    createWalletUiConfig,
    type UiWallet,
    useBaseDropdown,
    useBaseModal,
    WalletUi,
    WalletUiClusterDropdown,
    WalletUiDropdown,
    WalletUiIcon,
    WalletUiLabel,
    WalletUiList,
    WalletUiQrCode,
} from '@wallet-ui/react';
import walletUiStylesheetHref from '@wallet-ui/css/index.css?url';
import { useMemo, useState } from 'react';

import { frameworkStyleOptions, type FrameworkStyleId } from './framework-styles';
import { useStylesheet } from './use-stylesheet';

const customFrameworkId = 'custom';
const defaultFrameworkId: FrameworkStyleId = 'none';
const walletUiConfig = createWalletUiConfig({
    clusters: [createSolanaDevnet(), createSolanaLocalnet({ url: 'http://localhost:8899' }), createSolanaTestnet()],
});

export function App() {
    const [customFrameworkHref, setCustomFrameworkHref] = useState('');
    const [frameworkId, setFrameworkId] = useState<FrameworkStyleId>(defaultFrameworkId);
    const [structureStylesEnabled, setStructureStylesEnabled] = useState(false);
    const selectedFramework =
        frameworkStyleOptions.find(option => option.id === frameworkId) ?? frameworkStyleOptions[0];
    const frameworkHref = frameworkId === customFrameworkId ? customFrameworkHref : selectedFramework.href;

    useStylesheet({
        href: frameworkHref,
        id: 'wallet-ui-framework-stylesheet',
    });
    useStylesheet({
        href: structureStylesEnabled ? walletUiStylesheetHref : '',
        id: 'wallet-ui-structure-stylesheet',
    });

    return (
        <WalletUi config={walletUiConfig}>
            <main data-demo="app">
                <header data-demo="header">
                    <div>
                        <h1>Wallet UI Unstyled</h1>
                        <p>
                            Test Wallet UI markup with no bundled theme, a classless CSS framework, and the optional
                            Wallet UI structure adapter.
                        </p>
                    </div>
                    <StyleControls
                        customFrameworkHref={customFrameworkHref}
                        frameworkId={frameworkId}
                        setCustomFrameworkHref={setCustomFrameworkHref}
                        setFrameworkId={setFrameworkId}
                        setStructureStylesEnabled={setStructureStylesEnabled}
                        structureStylesEnabled={structureStylesEnabled}
                    />
                </header>
                <ComponentGrid />
            </main>
        </WalletUi>
    );
}

function ComponentGrid() {
    return (
        <section aria-label="Wallet UI components" data-demo="grid">
            <DemoCard title="WalletUiDropdown">
                <WalletUiDropdown />
            </DemoCard>
            <DemoCard title="WalletUiClusterDropdown">
                <WalletUiClusterDropdown />
            </DemoCard>
            <DemoCard title="BaseDropdown">
                <DemoDropdown />
            </DemoCard>
            <DemoCard title="BaseModal">
                <DemoModal />
            </DemoCard>
            <DemoCard title="WalletUiList">
                <WalletUiList
                    select={async account => {
                        console.info('Selected account', account.address);
                    }}
                    wallets={demoWallets}
                />
            </DemoCard>
            <DemoCard title="WalletUiIcon + WalletUiLabel">
                <p data-demo="wallet-label">
                    <WalletUiIcon wallet={demoWallets[0]} />
                    <WalletUiLabel wallet={demoWallets[0]} />
                </p>
            </DemoCard>
            <DemoCard title="WalletUiQrCode">
                <WalletUiQrCode
                    aria-label="Wallet UI website QR code"
                    data-demo="qr-code"
                    value="https://wallet-ui.dev"
                />
            </DemoCard>
        </section>
    );
}

function DemoCard({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <article data-demo="card">
            <header>
                <h2>{title}</h2>
            </header>
            <div data-demo="card-body">{children}</div>
        </article>
    );
}

function DemoDropdown() {
    const dropdown = useBaseDropdown();
    const items = useMemo(
        () => [
            {
                handler: async () => console.info('Copied address'),
                label: 'Copy address',
                type: BaseDropdownItemType.WalletCopy,
                value: 'copy-address',
            },
            {
                handler: async () => console.info('Opened explorer'),
                label: 'Open explorer',
                type: BaseDropdownItemType.Item,
                value: 'open-explorer',
            },
            {
                handler: async () => console.info('Disconnected wallet'),
                label: 'Disconnect',
                type: BaseDropdownItemType.WalletDisconnect,
                value: 'disconnect',
            },
        ],
        [],
    );

    return <BaseDropdown buttonProps={{ label: 'Wallet actions' }} dropdown={dropdown} items={items} showIndicator />;
}

function DemoModal() {
    const modal = useBaseModal();

    return (
        <BaseModal buttonLabel="Open dialog" modal={modal} title="Demo dialog">
            <p>
                This dialog is rendered by Wallet UI and uses the same semantic page styles as the rest of this example.
            </p>
            <BaseButton label="Close" onClick={() => modal.close()} />
        </BaseModal>
    );
}

function StyleControls({
    customFrameworkHref,
    frameworkId,
    setCustomFrameworkHref,
    setFrameworkId,
    setStructureStylesEnabled,
    structureStylesEnabled,
}: {
    customFrameworkHref: string;
    frameworkId: FrameworkStyleId;
    setCustomFrameworkHref: (value: string) => void;
    setFrameworkId: (value: FrameworkStyleId) => void;
    setStructureStylesEnabled: (value: boolean) => void;
    structureStylesEnabled: boolean;
}) {
    return (
        <form data-demo="controls">
            <label>
                Framework
                <select onChange={event => setFrameworkId(event.target.value as FrameworkStyleId)} value={frameworkId}>
                    {frameworkStyleOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            {frameworkId === customFrameworkId ? (
                <label>
                    Stylesheet URL
                    <input
                        onChange={event => setCustomFrameworkHref(event.target.value)}
                        placeholder="https://example.com/framework.css"
                        type="url"
                        value={customFrameworkHref}
                    />
                </label>
            ) : null}
            <label data-demo="checkbox">
                <input
                    checked={structureStylesEnabled}
                    onChange={event => setStructureStylesEnabled(event.target.checked)}
                    type="checkbox"
                />
                Wallet UI structure CSS
            </label>
        </form>
    );
}

const demoWallets = [
    createDemoWallet({
        address: 'Demo111111111111111111111111111111111111111',
        color: '#512da8',
        name: 'Demo Wallet',
    }),
    createDemoWallet({
        address: 'Local111111111111111111111111111111111111111',
        color: '#00695c',
        name: 'Local Wallet',
    }),
] as UiWallet[];

function createDemoWallet({ address, color, name }: { address: string; color: string; name: string }) {
    const icon = createWalletIcon({ color, label: name.slice(0, 1) });
    return {
        accounts: [
            {
                address,
                chains: ['solana:devnet'],
                features: [],
                icon,
                label: name,
                publicKey: new Uint8Array(32),
            },
        ],
        chains: ['solana:devnet'],
        features: {},
        icon,
        name,
        version: '1.0.0',
    };
}

function createWalletIcon({ color, label }: { color: string; label: string }) {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="${color}" />
            <text x="32" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="white">${label}</text>
        </svg>
    `)}`;
}
