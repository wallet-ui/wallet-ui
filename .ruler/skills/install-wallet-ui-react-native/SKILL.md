---
name: install-wallet-ui-react-native
description: Use when setting up @wallet-ui/react-native-web3js in a new or existing Expo application. Covers installation, polyfills, provider setup, and usage examples.
---

# Install Wallet UI (React Native)

## Overview

This skill guides the installation and configuration of `@wallet-ui/react-native-web3js` in an Expo React Native application. It handles the critical polyfill requirements for Solana libraries and sets up the Mobile Wallet Adapter provider.

## Prerequisites

- Existing Expo project (managed workflow supported via Config Plugins/Dev Client).
- `expo-dev-client` is recommended for testing on physical devices.

## Step-by-Step Implementation

### 1. Detect Package Manager & Install Dependencies

Check which lockfile exists in your project root to determine the package manager:
- `bun.lockb` or `bun.lock`: Use **Bun**
- `package-lock.json`: Use **npm**
- `yarn.lock`: Use **Yarn**
- `pnpm-lock.yaml`: Use **pnpm**

Install the core SDK and required polyfills using the detected package manager.

**For Bun:**
```bash
bun add @wallet-ui/react-native-web3js \
  react-native-quick-crypto \
  @solana/web3.js \
  expo-dev-client
```

**For npm:**
```bash
npm install @wallet-ui/react-native-web3js \
  react-native-quick-crypto \
  @solana/web3.js \
  expo-dev-client
```

**For Yarn:**
```bash
yarn add @wallet-ui/react-native-web3js \
  react-native-quick-crypto \
  @solana/web3.js \
  expo-dev-client
```

**For pnpm:**
```bash
pnpm add @wallet-ui/react-native-web3js \
  react-native-quick-crypto \
  @solana/web3.js \
  expo-dev-client
```

### 2. Configure Polyfills (CRITICAL)

Solana libraries require crypto polyfills in React Native.

**A. Create `polyfill.js` in the project root:**

```javascript
// polyfill.js
import { install } from 'react-native-quick-crypto';

install();
```

**B. Create/Update `index.js` in the project root:**

This file ensures polyfills load before the app starts.

```javascript
// index.js
import './polyfill';
import 'expo-router/entry'; // If using Expo Router
// import { AppRegistry } from 'react-native'; // If NOT using Expo Router
// import App from './App';
// AppRegistry.registerComponent('main', () => App);
```

**C. Update `package.json`:**

Point the `main` entry to your new `index.js` instead of the default Expo entry. Update your scripts so `android` uses `expo run:android` and `ios` uses `expo run:ios`. This is needed to run with the Expo Dev Client; otherwise, the app will fail due to missing native polyfills.

```json
{
  "main": "./index.js",
  "scripts": {
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
}
```

### 3. Setup Provider

Wrap your application root (e.g., in `app/_layout.tsx` or `App.tsx`) with `MobileWalletProvider`.

```tsx
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js';
import { clusterApiUrl } from '@solana/web3.js';

const chain = 'solana:devnet';
const endpoint = clusterApiUrl('devnet');
const identity = {
    name: 'My Solana App',
    uri: 'https://solana.com',
    icon: 'favicon.png', // Optional. MUST be a relative path (relative to the uri above)
};

export default function RootLayout() {
    return (
        <MobileWalletProvider chain={chain} endpoint={endpoint} identity={identity}>
            {/* Your App Navigation/Content */}
        </MobileWalletProvider>
    );
}
```

## Usage Patterns

### Connect / Disconnect

Use the `useMobileWallet` hook.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { Button, Text, View } from 'react-native';

export function ConnectWallet() {
    const { account, connect, disconnect } = useMobileWallet();

    if (account) {
        return (
            <View>
                <Text>Connected: {account.address.toString()}</Text>
                <Button title="Disconnect" onPress={disconnect} />
            </View>
        );
    }

    return <Button title="Connect Wallet" onPress={connect} />;
}
```

### Sign Message

**IMPORTANT**: The `signMessage` function expects a `Uint8Array`. Use `TextEncoder` to convert plain strings to bytes. Do NOT use `toUint8Array` for plain text - that helper is for decoding base64 strings.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { Button } from 'react-native';

export function SignMessageButton() {
    const { signMessage } = useMobileWallet();

    const handleSign = async () => {
        try {
            const message = "Verify this message";
            const messageBytes = new TextEncoder().encode(message);
            const signature = await signMessage(messageBytes);
            console.log('Signed:', Buffer.from(signature).toString('base64'));
        } catch (error) {
            console.error('Signing failed:', error);
        }
    };

    return <Button title="Sign Message" onPress={handleSign} />;
}
```

**Encoding Reference:**
- `new TextEncoder().encode(str)` - converts plain string → Uint8Array (UTF-8 bytes)
- `toUint8Array(base64Str)` - decodes base64 string → Uint8Array

### Sign In with Solana (SIWS)

Use the `signIn` method for authentication using the Sign In With Solana (SIWS) standard. This is different from `signMessage` - it follows the SIWS spec and returns a structured result that can be verified server-side.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export function SignInButton() {
    const { account, signIn } = useMobileWallet();
    const [signedIn, setSignedIn] = useState(false);

    const handleSignIn = async () => {
        try {
            await signIn({
                domain: 'your-app-domain.com',
                statement: 'Sign in to Your App',
            });
            setSignedIn(true);
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    if (!account) return null;

    if (signedIn) {
        return <Text>Signed in with Solana</Text>;
    }

    return <Button title="Sign In with Solana" onPress={handleSignIn} />;
}
```

**SignInPayload Options:**
- `domain` - Your app's domain (required for verification)
- `statement` - Human-readable message shown to user
- `uri` - URI of your app
- `version` - SIWS version (default: "1")
- `chainId` - Chain identifier (e.g., "mainnet", "devnet")
- `nonce` - Random string for replay protection
- `issuedAt` - ISO timestamp
- `expirationTime` - ISO timestamp for expiration
- `resources` - Array of resource URIs

### Sign and Send Transaction

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { Button } from 'react-native';

export function SendTransactionButton() {
    const { account, signAndSendTransaction, connection } = useMobileWallet();

    const handleSend = async () => {
        if (!account) return;

        try {
            const { context: { slot: minContextSlot }, value: { blockhash, lastValidBlockHeight } } = 
                await connection.getLatestBlockhashAndContext();

            const transaction = new Transaction({
                feePayer: account.publicKey,
                blockhash,
                lastValidBlockHeight
            }).add(
                SystemProgram.transfer({
                    fromPubkey: account.publicKey,
                    toPubkey: new PublicKey("AhgC8gYtC9A6pWfH7gYtC9A6pWfH7gYtC9A6pWfH7gY"), // Example dest
                    lamports: 1000,
                })
            );

            const signature = await signAndSendTransaction(transaction, minContextSlot);
            console.log('Transaction sent:', signature);
            
            // Optional: Wait for confirmation
            await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
            console.log('Transaction confirmed');

        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    return <Button title="Send Transaction" onPress={handleSend} />;
}
```

## Common Issues & Fixes

1.  **"Crypto not found" / "Buffer is not defined"**: 
    -   Ensure `polyfill.js` is imported at the VERY TOP of `index.js`.
    -   Ensure `package.json` points to `index.js`.

2.  **"input is not valid base64 encoded data"** (when signing messages):
    -   You're using `toUint8Array()` with a plain string. That helper expects base64 input.
    -   **Fix**: Use `new TextEncoder().encode(message)` for plain text messages.

4.  **Build Failures**:
    -   Ensure `expo-dev-client` is installed.
    -   Re-run `npx expo run:android` or `npx expo run:ios` to rebuild the native app after adding native dependencies like `react-native-quick-crypto`.

5.  **Wallet not connecting**:
    -   Ensure a compatible wallet (e.g., Phantom, Solflare) is installed on the simulator/device.
    -   Ensure the scheme in `app.json` allows deep linking (though MWA usually handles this via intent/universal links).

6.  **"Objects are not valid as a React child"**:
    -   This usually happens when trying to render a `PublicKey` object (like `account.address`) directly in a `Text` component.
    -   **Fix**: Call `.toString()` or `.toBase58()` on the object (e.g., `{account.address.toString()}`).

7.  **"SolanaMobileWalletAdapterProtocolError: -32602"**:
    -   This occurs if `identity.icon` is set to an absolute URL (e.g., `https://...`).
    -   **Fix**: Ensure `identity.icon` is a relative path (e.g., `/icon.png`) relative to your `identity.uri`, or remove the icon property entirely during development.
