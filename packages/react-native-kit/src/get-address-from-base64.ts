import { Address, getAddressCodec, getBase64Encoder } from '@solana/kit';
import { Base64EncodedAddress } from '@solana-mobile/mobile-wallet-adapter-protocol';

export function getAddressFromBase64(encoded: Base64EncodedAddress): Address {
    const decoded = getBase64Encoder().encode(encoded);

    return getAddressCodec().decode(decoded);
}
