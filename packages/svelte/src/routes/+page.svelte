<script lang="ts">
	import {
		createSolanaDevnet,
		createSolanaMainnet,
		createSolanaTestnet,
		createSolanaLocalnet,
		createWalletUiConfig,
		WalletUi,
		WalletUiButton,
		WalletUiClusterDropdown,
		WalletUiDropdown,
		WalletUiModalTrigger,
		WalletUiList,
		WalletUiIcon,
		WalletUiLabel,
		useWalletUi
	} from '$lib/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getTransferSolInstruction } from '@solana-program/system';
	import {
		createTransaction,
		pipe,
		setTransactionMessageLifetimeUsingBlockhash,
		transactionToBase64
	} from 'gill';
	import { getWalletFeature } from 'wallet-standard-svelte';
	import { SolanaSignAndSendTransaction } from '@solana/wallet-standard-features';

	const config = createWalletUiConfig({
		clusters: [
			createSolanaDevnet(),
			createSolanaTestnet(),
			createSolanaMainnet(),
			createSolanaLocalnet()
		],
		size: 'md'
	});

	// Sizes for testing
	const sizes = ['sm', 'md', 'lg'] as const;

	// Component to access wallet state inside WalletUi context
	function WalletInfo() {
		const wallet = useWalletUi();
		return {
			get connected() {
				return wallet.connected;
			},
			get account() {
				return wallet.account;
			},
			get cluster() {
				return wallet.cluster;
			},
			get wallets() {
				return wallet.wallets;
			},
			wallet // expose the wallet instance for testing
		};
	}
</script>

<WalletUi {config}>
	{@const walletInfo = WalletInfo()}

	<div class="bg-background min-h-screen p-4 sm:p-8">
		<div class="mx-auto max-w-6xl">
			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-bold">@wallet-ui/svelte Demo</h1>
				<p class="text-muted-foreground mb-4 text-lg">
					Real Svelte 5 wallet UI components with actual Solana wallet integration.
				</p>
				<div class="flex flex-wrap gap-2">
					<Badge variant={walletInfo.connected ? 'default' : 'secondary'}>
						{walletInfo.connected ? 'Connected' : 'Disconnected'}
					</Badge>
					{#if walletInfo.cluster}
						<Badge variant="outline">{walletInfo.cluster.label}</Badge>
					{/if}
					<Badge variant="outline">{walletInfo.wallets.length} wallets detected</Badge>
				</div>
			</header>

			<!-- Main Components Demo -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Main Components</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card.Root>
						<Card.Header>
							<Card.Title>Wallet Button</Card.Title>
							<Card.Description>Simple click-to-copy when connected</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiButton />
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Wallet Dropdown</Card.Title>
							<Card.Description>Full featured dropdown with options</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiDropdown />
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Modal Trigger</Card.Title>
							<Card.Description>Opens wallet selection dialog</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiModalTrigger buttonLabel="Connect via Modal" />
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Cluster Selection</Card.Title>
							<Card.Description>Switch between networks</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiClusterDropdown clusters={config.clusters} />
						</Card.Content>
					</Card.Root>

					<Card.Root class="md:col-span-2">
						<Card.Header>
							<Card.Title>Wallet List</Card.Title>
							<Card.Description>Available wallets for connection</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiList wallets={walletInfo.wallets} />
						</Card.Content>
					</Card.Root>
				</div>
			</section>

			<!-- Size Variants -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Size Variants</h2>
				<div class="grid gap-6 md:grid-cols-3">
					{#each sizes as size}
						<Card.Root>
							<Card.Header>
								<Card.Title class="capitalize">Size: {size}</Card.Title>
							</Card.Header>
							<Card.Content class="space-y-4">
								<div>
									<p class="text-muted-foreground mb-2 text-sm">Button</p>
									<WalletUiButton {size} />
								</div>
								<div>
									<p class="text-muted-foreground mb-2 text-sm">Dropdown</p>
									<WalletUiDropdown {size} />
								</div>
								<div>
									<p class="text-muted-foreground mb-2 text-sm">Modal</p>
									<WalletUiModalTrigger {size} buttonLabel="Connect" />
								</div>
								<div>
									<p class="text-muted-foreground mb-2 text-sm">Cluster</p>
									<WalletUiClusterDropdown {size} clusters={config.clusters} />
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</section>

			<!-- Custom Styling Examples -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Custom Styling</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>Custom Classes</Card.Title>
							<Card.Description>Components with custom styling</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<WalletUiButton class="w-full bg-purple-600 hover:bg-purple-700" />
							<WalletUiDropdown class="w-full" />
							<WalletUiModalTrigger class="w-full" buttonLabel="Purple Modal" />
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Custom Modal</Card.Title>
							<Card.Description>Modal with custom title and description</Card.Description>
						</Card.Header>
						<Card.Content>
							<WalletUiModalTrigger
								buttonLabel="Custom Modal"
								title="Choose Your Wallet"
								description="Select a Solana wallet to connect to the application"
							/>
						</Card.Content>
					</Card.Root>
				</div>
			</section>

			<!-- Individual Components -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Individual Components</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{#each walletInfo.wallets.slice(0, 4) as wallet}
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-base">Wallet Components</Card.Title>
							</Card.Header>
							<Card.Content class="space-y-3">
								<div class="flex items-center gap-2">
									<WalletUiIcon {wallet} size="sm" />
									<WalletUiLabel {wallet} size="sm" />
								</div>
								<div class="flex items-center gap-2">
									<WalletUiIcon {wallet} size="md" />
									<WalletUiLabel {wallet} size="md" />
								</div>
								<div class="flex items-center gap-2">
									<WalletUiIcon {wallet} size="lg" />
									<WalletUiLabel {wallet} size="lg" />
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</section>

			<!-- Test Wallet Connection -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Connection Test</h2>
				<Card.Root>
					<Card.Header>
						<Card.Title>Test Cached Connection</Card.Title>
						<Card.Description>Test if cached wallet connection actually works</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if walletInfo.connected}
							<div class="space-y-4">
								<p class="text-sm text-green-600">Wallet appears connected from cache</p>
								<Button
									onclick={() => {
										if (walletInfo.account) {
											navigator.clipboard.writeText(walletInfo.account.address);
											alert('Copied address: ' + walletInfo.account.address);
										}
									}}
								>
									Test: Copy Address (should work if truly connected)
								</Button>
								<Button
									onclick={async () => {
									try {
										// Get the actual UiWallet from WalletState
										const walletState = walletInfo.wallet; // This is WalletState
										const actualWallet = walletState.wallet; // This should be UiWallet
										
										console.log('WalletState:', walletState);
										console.log('Actual UiWallet:', actualWallet);
										console.log('UiWallet features:', actualWallet?.features);
										console.log('UiWallet name:', actualWallet?.name);
										
										if (actualWallet && walletInfo.account) {
											// Try to sign a message - this will definitely require wallet to be unlocked
											const message = new TextEncoder().encode('Test signing from wallet-ui-svelte: ' + Date.now());
											
											console.log('Attempting to sign message (will fail if wallet is locked)...');
											
											// Get the signMessage feature from the wallet
											const signMessageFeature = actualWallet.features.find(f => f === 'solana:signMessage');
											if (signMessageFeature) {
												// Use getWalletFeature to get the actual feature implementation
												const { getWalletFeature } = await import('wallet-standard-svelte');
												const { SolanaSignMessage } = await import('@solana/wallet-standard-features');
												
												const signFeature = getWalletFeature(actualWallet, SolanaSignMessage) as any;
												const result = await signFeature.signMessage({
													account: walletInfo.account,
													message: message
												});
												
												console.log('Signature result:', result);
												alert('Message signing successful! Wallet is truly unlocked and connected.');
											} else {
												alert('Wallet does not support message signing');
											}
										} else {
											alert('No actual wallet found in WalletState');
										}
									} catch (error: any) {
										console.error('Wallet connection test failed:', error);
										alert('Connection test failed: ' + error.message + '\nThis proves the cached connection is invalid.');
									}
								}}
								>
									Test: Sign Message
								</Button>
								<Button
									onclick={async () => {
									try {
										const walletState = walletInfo.wallet;
										const actualWallet = walletState.wallet;
										
										if (!actualWallet || !walletInfo.account || !walletState.client) {
											alert('No wallet or client available');
											return;
										}
										
										console.log('Testing transaction: send 0.001 SOL to self...');
										
										// The gill client's sendAndConfirmTransaction expects signers, but we need to use the wallet
										// Let's go back to the manual approach but fix the RPC issue differently
										console.log('Creating transaction manually and using wallet to sign');
										
										// Get wallet sign and send feature
										const signAndSendFeature = getWalletFeature(actualWallet, SolanaSignAndSendTransaction);
										if (!signAndSendFeature) {
											alert('Wallet does not support transactions');
											return;
										}
										
										// Create transfer instruction
										const LAMPORTS_PER_SOL = 1_000_000_000n;
										const TEST_AMOUNT_SOL = 0.001;
										const transferInstruction = getTransferSolInstruction({
											source: { address: walletInfo.account.address } as any,
											destination: walletInfo.account.address as any,
											amount: BigInt(TEST_AMOUNT_SOL * Number(LAMPORTS_PER_SOL)) // 0.001 SOL
										});
										
										// Get latest blockhash using the working client
										const latestBlockhash = await walletState.client.rpc.getLatestBlockhash().send();
										
										// Create transaction using gill
										const transactionMessage = pipe(
											createTransaction({
												version: 0,
												instructions: [transferInstruction],
												feePayer: walletInfo.account.address as any
											}),
											tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash.value, tx)
										);
										
										// Serialize transaction properly using gill
										const base64Transaction = transactionToBase64(transactionMessage);
										
										// Convert base64 to Uint8Array for wallet (browser-compatible)
										const binaryString = atob(base64Transaction);
										const serializedTx = new Uint8Array(binaryString.length);
										for (let i = 0; i < binaryString.length; i++) {
											serializedTx[i] = binaryString.charCodeAt(i);
										}
										
										// Sign and send using wallet - use current cluster
										const DEFAULT_CLUSTER = 'devnet' as const;
										const SOLANA_CHAIN_PREFIX = 'solana:' as const;
										const currentChain = `${SOLANA_CHAIN_PREFIX}${walletState.cluster?.cluster || DEFAULT_CLUSTER}`;
										console.log('Sending transaction on chain:', currentChain);
										
										const results = await (signAndSendFeature as any).signAndSendTransaction({
											account: walletInfo.account,
											chain: currentChain,
											transaction: serializedTx
										});
										
										console.log('Transaction results:', results);
										// The result should be an array with signature bytes
										const signature = results[0]?.signature;
										if (signature) {
											// Convert signature bytes to hex for display (simpler than base58)
											const signatureHex = Array.from(signature)
												.map(b => b.toString(16).padStart(2, '0'))
												.join('');
											alert('Transaction successful! Signature: ' + signatureHex);
										} else {
											alert('Transaction sent but no signature returned');
										}
									} catch (error: any) {
										console.error('Transaction failed:', error);
										alert('Transaction failed: ' + error.message);
									}
								}}
								>
									Test: Send 0.001 SOL to Self (Devnet)
								</Button>
							</div>
						{:else}
							<p class="text-muted-foreground text-sm">No wallet connected to test</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</section>

			<!-- Wallet State Information -->
			<section class="mb-8">
				<h2 class="mb-6 text-2xl font-semibold">Wallet State</h2>
				<Card.Root>
					<Card.Header>
						<Card.Title>Current State</Card.Title>
						<Card.Description>Real-time wallet connection information</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<h4 class="mb-2 font-medium">Connection Status</h4>
								<p class="text-muted-foreground text-sm">
									{walletInfo.connected ? 'Connected' : 'Not connected'}
								</p>
								{#if walletInfo.account}
									<p class="mt-1 font-mono text-xs">
										{walletInfo.account.address.slice(0, 8)}...{walletInfo.account.address.slice(
											-8
										)}
									</p>
								{/if}
							</div>
							<div>
								<h4 class="mb-2 font-medium">Network</h4>
								<p class="text-muted-foreground text-sm">
									{walletInfo.cluster?.label || 'No cluster selected'}
								</p>
							</div>
							<div>
								<h4 class="mb-2 font-medium">Available Wallets</h4>
								<p class="text-muted-foreground text-sm">
									{walletInfo.wallets.length} wallet{walletInfo.wallets.length !== 1 ? 's' : ''} detected
								</p>
							</div>
							<div>
								<h4 class="mb-2 font-medium">Features</h4>
								<div class="flex flex-wrap gap-1">
									<Badge variant="outline" class="text-xs">Persistent Storage</Badge>
									<Badge variant="outline" class="text-xs">Auto-reconnect</Badge>
									<Badge variant="outline" class="text-xs">Multi-account</Badge>
									<Badge variant="outline" class="text-xs">Svelte 5</Badge>
									<Badge variant="outline" class="text-xs">shadcn-svelte</Badge>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</section>

			<!-- Usage Examples -->
			<section>
				<h2 class="mb-6 text-2xl font-semibold">Usage Examples</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>Quick Connect</Card.Title>
							<Card.Description>Simple button for basic use cases</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex flex-col gap-2">
								<WalletUiButton />
								<p class="text-muted-foreground text-xs">
									Shows "Connect Wallet" when disconnected, shows truncated address when connected.
									Click to copy address.
								</p>
							</div>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Full Featured</Card.Title>
							<Card.Description>Dropdown with all options</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex flex-col gap-2">
								<WalletUiDropdown />
								<p class="text-muted-foreground text-xs">
									Shows wallet list when disconnected, shows copy/disconnect when connected.
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</section>
		</div>
	</div>
</WalletUi>

<style>
	/* Custom styles for demo purposes */
	:global(.custom-wallet-button) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
</style>
