import { SolanaChainId, useSolanaChain } from '@wallet-ui/react';

export function SolanaChainUiSelect() {
    const { chain, chains, setChain } = useSolanaChain();
    return (
        <select
            onChange={e => {
                if (!setChain || !e.target.value) {
                    return;
                }
                return setChain(e.target.value as SolanaChainId);
            }}
            value={chain.id}
        >
            {chains.map(item => (
                <option key={item.id} value={item.id}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}
