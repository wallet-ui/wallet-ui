export function stringToUint8Array(value: Uint8Array | string): Uint8Array {
    return value instanceof Uint8Array ? value : new TextEncoder().encode(value);
}
