import { lamports } from '@solana/kit';

export function solStringToLamports(solQuantityString: string) {
    if (Number.isNaN(parseFloat(solQuantityString))) {
        throw new Error('Could not parse token quantity: ' + String(solQuantityString));
    }
    const numDecimals = BigInt(solQuantityString.split('.')[1]?.length ?? 0);
    const bigIntLamports = BigInt(solQuantityString.replace('.', '')) * 10n ** (9n - numDecimals);
    return lamports(bigIntLamports);
}
