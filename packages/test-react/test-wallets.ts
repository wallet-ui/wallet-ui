import type { WalletUiWallet } from '@wallet-ui/react';

export const testWalletBackpack: WalletUiWallet = {
    accounts: [
        {
            address: 'BEEMANuMhmSwTukEUhBbosH5zHpnaTeno9atgCfc5hgi',
        },
    ],
    chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet', 'solana:localnet'],
    features: [
        'standard:connect',
        'standard:disconnect',
        'standard:events',
        'solana:signAndSendTransaction',
        'solana:signTransaction',
        'solana:signMessage',
        'solana:signIn',
        'backpack:',
    ],
    icon: 'data:image/png;base64,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',
    name: 'Backpack',
};
export const testWalletPhantom: WalletUiWallet = {
    accounts: [],
    chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet', 'solana:localnet'],
    features: [
        'standard:connect',
        'standard:disconnect',
        'standard:events',
        'solana:signAndSendTransaction',
        'solana:signTransaction',
        'solana:signMessage',
        'solana:signIn',
        'phantom:',
    ],
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo=',
    name: 'Phantom',
};
export const testWalletSolflare: WalletUiWallet = {
    accounts: [],
    chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet'],
    features: [
        'standard:connect',
        'standard:disconnect',
        'standard:events',
        'solana:signAndSendTransaction',
        'solana:signTransaction',
        'solana:signMessage',
    ],
    icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJTIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMwMjA1MGE7c3Ryb2tlOiNmZmVmNDY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOi41cHg7fS5jbHMtMntmaWxsOiNmZmVmNDY7fTwvc3R5bGU+PC9kZWZzPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTIiIHJ5PSIxMiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0LjIzLDI2LjQybDIuNDYtMi4zOCw0LjU5LDEuNWMzLjAxLDEsNC41MSwyLjg0LDQuNTEsNS40MywwLDEuOTYtLjc1LDMuMjYtMi4yNSw0LjkzbC0uNDYuNS4xNy0xLjE3Yy42Ny00LjI2LS41OC02LjA5LTQuNzItNy40M2wtNC4zLTEuMzhoMFpNMTguMDUsMTEuODVsMTIuNTIsNC4xNy0yLjcxLDIuNTktNi41MS0yLjE3Yy0yLjI1LS43NS0zLjAxLTEuOTYtMy4zLTQuNTF2LS4wOGgwWk0xNy4zLDMzLjA2bDIuODQtMi43MSw1LjM0LDEuNzVjMi44LjkyLDMuNzYsMi4xMywzLjQ2LDUuMThsLTExLjY1LTQuMjJoMFpNMTMuNzEsMjAuOTVjMC0uNzkuNDItMS41NCwxLjEzLTIuMTcuNzUsMS4wOSwyLjA1LDIuMDUsNC4wOSwyLjcxbDQuNDIsMS40Ni0yLjQ2LDIuMzgtNC4zNC0xLjQyYy0yLS42Ny0yLjg0LTEuNjctMi44NC0yLjk2TTI2LjgyLDQyLjg3YzkuMTgtNi4wOSwxNC4xMS0xMC4yMywxNC4xMS0xNS4zMiwwLTMuMzgtMi01LjI2LTYuNDMtNi43MmwtMy4zNC0xLjEzLDkuMTQtOC43Ny0xLjg0LTEuOTYtMi43MSwyLjM4LTEyLjgxLTQuMjJjLTMuOTcsMS4yOS04Ljk3LDUuMDktOC45Nyw4Ljg5LDAsLjQyLjA0LjgzLjE3LDEuMjktMy4zLDEuODgtNC42MywzLjYzLTQuNjMsNS44LDAsMi4wNSwxLjA5LDQuMDksNC41NSw1LjIybDIuNzUuOTItOS41Miw5LjE0LDEuODQsMS45NiwyLjk2LTIuNzEsMTQuNzMsNS4yMmgwWiIvPjwvc3ZnPg==',
    name: 'Solflare',
};

export function useTestWallets() {
    return [
        //
        testWalletBackpack,
        testWalletPhantom,
        testWalletSolflare,
    ];
}
