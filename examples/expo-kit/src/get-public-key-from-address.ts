import { Base64EncodedAddress } from '@solana-mobile/mobile-wallet-adapter-protocol';
import { Address, getAddressCodec, getBase64Encoder } from '@solana/kit';

export function getPublicKeyFromAddress(encoded: Base64EncodedAddress): Address {
    const decoded = getBase64Encoder().encode(encoded);

    return getAddressCodec().decode(decoded);
}
