---
name: install-wallet-ui-react-native
description: Use when setting up Wallet UI in a new or existing Expo application. Guides selection between modern @solana/kit (Recommended) or legacy @solana/web3.js.
---

# Install Wallet UI (React Native)

## Overview

This skill helps you set up Wallet UI in your Expo React Native application. You need to choose which Solana library you are using, as the setup differs significantly.

## Choose Your Path

### 1. Modern: `@solana/kit` (Recommended)

**Use this if:**
- You are starting a new project.
- You prefer the modern, lightweight, functional API of `@solana/kit`.
- You want better tree-shaking and smaller bundle sizes.

**Instructions:**
[Open Solana Kit Guide](./solana-kit.md)

### 2. Legacy: `@solana/web3.js` (Maintenance Mode)

**Use this if:**
- You are maintaining an existing project heavily reliant on `@solana/web3.js` v1.
- You need specific legacy dependencies that haven't migrated to `@solana/kit`.
- You understand that `@solana/web3.js` is heavier and no longer the primary recommendation for new apps.

**Instructions:**
[Open Solana Web3.js Guide](./solana-web3js.md)

## Quick Comparison

| Feature | `@wallet-ui/react-native-kit` | `@wallet-ui/react-native-web3js` |
| :--- | :--- | :--- |
| **Solana Lib** | `@solana/kit` | `@solana/web3.js` (v1) |
| **API Style** | Functional, Tree-shakeable | Object-Oriented, Monolithic |
| **Bundle Size** | Smaller | Larger |
| **Status** | **Recommended** | Maintenance / Legacy Support |