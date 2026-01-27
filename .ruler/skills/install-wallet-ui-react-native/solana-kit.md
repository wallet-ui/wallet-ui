--- 
name: install-wallet-ui-react-native-kit
description: Use when setting up @wallet-ui/react-native-kit (modern @solana/kit) in a new or existing Expo application.
---

# Install Wallet UI (React Native - Kit)

## Overview

This skill guides the installation and configuration of `@wallet-ui/react-native-kit` in an Expo React Native application. It handles the critical polyfill requirements for Solana libraries and sets up the Mobile Wallet Adapter provider using the modern `@solana/kit` library.

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
bun add @wallet-ui/react-native-kit \
  react-native-quick-crypto \
  @solana/kit \
  expo-dev-client
```

**For npm:**
```bash
npm install @wallet-ui/react-native-kit \
  react-native-quick-crypto \
  @solana/kit \
  expo-dev-client
```

**For Yarn:**
```bash
yarn add @wallet-ui/react-native-kit \
  react-native-quick-crypto \
  @solana/kit \
  expo-dev-client
```

**For pnpm:**
```bash
pnpm add @wallet-ui/react-native-kit \
  react-native-quick-crypto \
  @solana/kit \
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
import { MobileWalletProvider, createSolanaDevnet } from '@wallet-ui/react-native-kit';

const cluster = createSolanaDevnet();
const identity = {
    name: 'My Solana App',
    uri: 'https://solana.com',
    icon: 'favicon.png', // Optional. MUST be a relative path (relative to the uri above)
};

export default function RootLayout() {
    return (
        <MobileWalletProvider cluster={cluster} identity={identity}>
            {/* Your App Navigation/Content */}
        </MobileWalletProvider>
    );
}
```

## Usage Patterns

### Connect / Disconnect

Use the `useMobileWallet` hook.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-kit';
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

**IMPORTANT**: The `signMessage` function expects a `Uint8Array`. Use `TextEncoder` to convert plain strings to bytes.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { Button, Text, View } from 'react-native';
import { useState } from 'react';

export function SignMessageButton() {
    const { signMessage } = useMobileWallet();
    const [status, setStatus] = useState('');

    const handleSign = async () => {
        try {
            const message = "Verify this message";
            const messageBytes = new TextEncoder().encode(message);
            const signature = await signMessage(messageBytes);
            // Signature is a Uint8Array
            console.log('Signed:', signature); 
            setStatus('Message signed successfully!');
        } catch (error) {
            console.error('Signing failed:', error);
            setStatus('Signing failed');
        }
    };

    return (
        <View>
            <Button title="Sign Message" onPress={handleSign} />
            {status ? <Text>{status}</Text> : null}
        </View>
    );
}
```

### Sign In with Solana (SIWS)

Use the `signIn` method for authentication using the Sign In With Solana (SIWS) standard.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export function SignInButton() {
    const { account, chain, identity, signIn } = useMobileWallet();
    const [signedIn, setSignedIn] = useState(false);

    const handleSignIn = async () => {
        try {
            await signIn({
                address: account?.address.toString(),
                chainId: chain,
                uri: identity.uri,
                domain: 'your-app-domain.com',
                statement: 'Sign in to Your App',
            });
            setSignedIn(true);
            console.log('Signed in!');
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

### Sign and Send Transaction

The `sendTransaction` helper simplifies the process of creating, signing, and sending a transaction. You simply provide an array of instructions.

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-kit';
import { Button } from 'react-native';
import { getAddMemoInstruction } from '@solana-program/memo';
import { Instruction } from '@solana/kit';

export function SendTransactionButton() {
    const { sendTransaction } = useMobileWallet();

    const handleSend = async () => {
        try {
            // 1. Create instructions (example using memo program)
            const instructions: Instruction[] = [
                getAddMemoInstruction({ memo: 'Hello from Mobile Wallet Adapter' }),
            ];

            // 2. Send transaction (handles blockhash, signing, and sending)
            const signature = await sendTransaction(instructions);
            
            console.log('Transaction sent. Signature:', signature);

        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    return <Button title="Send Transaction" onPress={handleSend} />;
}
```

## Common Issues & Fixes

1.  **"Crypto not found"**: 
    -   Ensure `polyfill.js` is imported at the VERY TOP of `index.js`.
    -   Ensure `package.json` points to `index.js`.

2.  **Build Failures**:
    -   Ensure `expo-dev-client` is installed.
    -   Re-run `npx expo run:android` or `npx expo run:ios` to rebuild the native app after adding native dependencies like `react-native-quick-crypto`.

3.  **Wallet not connecting**:
    -   Ensure a compatible wallet (e.g., Phantom, Solflare) is installed on the simulator/device.

4.  **"SolanaMobileWalletAdapterProtocolError: -32602"**:
    -   This occurs if `identity.icon` is set to an absolute URL (e.g., `https://...`).
    -   **Fix**: Ensure `identity.icon` is a relative path (e.g., `/icon.png`) relative to your `identity.uri`.
