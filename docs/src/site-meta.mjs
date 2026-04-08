export const siteUrl = 'https://wallet-ui.dev';
export const siteName = 'Wallet UI';
export const siteDescription = 'The wallet layer for Solana apps on web and mobile.';
export const defaultSocialImagePath = '/og.png';
export const defaultSocialImageAlt = 'Wallet UI documentation social card';
export const indexableHosts = new Set(['wallet-ui.dev', 'www.wallet-ui.dev']);

/**
 * @param {string | undefined | null} hostname The hostname to check.
 * @returns {boolean} Whether the host is permitted to be indexed.
 */
export function canIndexHost(hostname) {
    if (typeof hostname !== 'string') {
        return false;
    }

    return indexableHosts.has(hostname.toLowerCase());
}
