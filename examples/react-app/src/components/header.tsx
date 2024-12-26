export function Header() {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flexGrow: 1 }}>
                <span style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
                    <img src="/wallet-ui.png" alt="wallet-ui logo" width={32} height={32} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.6' }}>Wallet UI</span>
                    <span style={{ fontSize: '1rem', fontWeight: 300 }}>React App</span>
                </span>
            </div>
            <div style={{ alignItems: 'center', display: 'flex' }}>
                <a href="https://github.com/wallet-ui/wallet-ui" target="_blank" rel="noreferrer">
                    <img
                        src="https://img.shields.io/github/stars/wallet-ui/wallet-ui?style=social"
                        alt="GitHub Repo stars"
                    />
                </a>
            </div>
        </header>
    );
}
