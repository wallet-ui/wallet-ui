<script lang="ts">
	import {
		createSolanaDevnet,
		createSolanaTestnet,
		createSolanaMainnet,
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
	import Card from './Card.svelte';
	import CardHeader from './CardHeader.svelte';
	import CardTitle from './CardTitle.svelte';
	import CardDescription from './CardDescription.svelte';
	import CardContent from './CardContent.svelte';
	import Badge from './Badge.svelte';
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

	<div style="min-height: 100vh; padding: 1rem;">
		<div style="max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
			<!-- Header Card -->
			<Card>
				<CardHeader>
					{#snippet children()}
						<CardTitle>{#snippet children()}@wallet-ui/svelte Demo{/snippet}</CardTitle>
						<CardDescription>
							{#snippet children()}Real Svelte 5 wallet UI components with actual Solana wallet integration using CSS-only design system.{/snippet}
						</CardDescription>
						<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
							<Badge variant={walletInfo.connected ? 'default' : 'secondary'}>
								{#snippet children()}{walletInfo.connected ? '🟢 Connected' : '🔴 Disconnected'}{/snippet}
							</Badge>
							{#if walletInfo.cluster}
								<Badge variant="outline">
									{#snippet children()}🌐 {walletInfo.cluster.label}{/snippet}
								</Badge>
							{/if}
							<Badge variant="outline">
								{#snippet children()}👛 {walletInfo.wallets.length} wallets detected{/snippet}
							</Badge>
							<Badge variant="secondary">
								{#snippet children()}⚡ Svelte 5{/snippet}
							</Badge>
							<Badge variant="secondary">
								{#snippet children()}🎨 CSS-only{/snippet}
							</Badge>
						</div>
					{/snippet}
				</CardHeader>
			</Card>

			<!-- Main Components Demo -->
			<Card>
				<CardHeader>
					{#snippet children()}
						<CardTitle>{#snippet children()}Main Components{/snippet}</CardTitle>
						<CardDescription>
							{#snippet children()}Core wallet interaction components for your application{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))">
					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Wallet Button{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Simple click-to-copy when connected{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiButton />
							{/snippet}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Wallet Dropdown{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Full featured dropdown with options{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiDropdown />
							{/snippet}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Modal Trigger{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Opens wallet selection dialog{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiModalTrigger buttonLabel="Connect via Modal" />
							{/snippet}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Cluster Selection{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Switch between networks{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiClusterDropdown clusters={config.clusters} />
							{/snippet}
						</CardContent>
					</Card>

					<Card class="md:col-span-2">
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Wallet List{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Available wallets for connection{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiList wallets={walletInfo.wallets} />
							{/snippet}
						</CardContent>
					</Card>
						</div>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Size Variants -->
			<Card>
				<CardHeader>
					{#snippet children()}
						<CardTitle>{#snippet children()}Size Variants{/snippet}</CardTitle>
						<CardDescription>
							{#snippet children()}Components in different sizes for various use cases{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))">
					{#each sizes as size}
						<Card>
							<CardHeader>
								{#snippet children()}
									<CardTitle>{#snippet children()}Size: {size}{/snippet}</CardTitle>
								{/snippet}
							</CardHeader>
							<CardContent>
								{#snippet children()}
									<div style="margin-bottom: 1rem;">
										<p style="margin-bottom: 0.5rem; opacity: 0.7;">Button</p>
										<WalletUiButton {size} />
									</div>
									<div style="margin-bottom: 1rem;">
										<p style="margin-bottom: 0.5rem; opacity: 0.7;">Dropdown</p>
										<WalletUiDropdown {size} />
									</div>
									<div style="margin-bottom: 1rem;">
										<p style="margin-bottom: 0.5rem; opacity: 0.7;">Modal</p>
										<WalletUiModalTrigger {size} buttonLabel="Connect" />
									</div>
									<div style="margin-bottom: 1rem;">
										<p style="margin-bottom: 0.5rem; opacity: 0.7;">Cluster</p>
										<WalletUiClusterDropdown {size} clusters={config.clusters} />
									</div>
								{/snippet}
							</CardContent>
						</Card>
					{/each}
						</div>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Custom Styling Examples -->
			<Card>
				<CardHeader>
					{#snippet children()}
						<CardTitle class="text-2xl text-center">{#snippet children()}Custom Styling{/snippet}</CardTitle>
						<CardDescription class="text-center">
							{#snippet children()}Examples of components with custom styling and properties{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<div class="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Custom Classes{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Components with custom styling{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent class="space-y-4">
							{#snippet children()}
								<WalletUiButton class="w-full bg-purple-600 hover:bg-purple-700" />
								<WalletUiDropdown class="w-full" />
								<WalletUiModalTrigger class="w-full" buttonLabel="Purple Modal" />
							{/snippet}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Custom Modal{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Modal with custom title and description{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent>
							{#snippet children()}
								<WalletUiModalTrigger
									buttonLabel="Custom Modal"
									title="Choose Your Wallet"
									description="Select a Solana wallet to connect to the application"
								/>
							{/snippet}
						</CardContent>
					</Card>
						</div>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Individual Components -->
			<Card>
				<CardHeader>
					{#snippet children()}
						<CardTitle class="text-2xl text-center">{#snippet children()}Individual Components{/snippet}</CardTitle>
						<CardDescription class="text-center">
							{#snippet children()}Individual wallet icons and labels at different sizes{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							{#each walletInfo.wallets.slice(0, 4) as wallet}
								<Card class="border-dashed">
									<CardHeader>
										{#snippet children()}
											<CardTitle class="text-base">{#snippet children()}Wallet Components{/snippet}</CardTitle>
										{/snippet}
									</CardHeader>
									<CardContent class="space-y-3">
										{#snippet children()}
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
										{/snippet}
									</CardContent>
								</Card>
							{/each}
						</div>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Test Wallet Connection -->
			<Card class="border-orange-200 bg-orange-50">
				<CardHeader>
					{#snippet children()}
						<CardTitle class="text-2xl text-center text-orange-800">{#snippet children()}🧪 Connection Test{/snippet}</CardTitle>
						<CardDescription class="text-center text-orange-700">
							{#snippet children()}Test if cached wallet connection actually works with real operations{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<Card class="bg-white">
					<CardHeader>
						{#snippet children()}
							<CardTitle>{#snippet children()}Test Cached Connection{/snippet}</CardTitle>
							<CardDescription>{#snippet children()}Test if cached wallet connection actually works{/snippet}</CardDescription>
						{/snippet}
					</CardHeader>
					<CardContent>
						{#snippet children()}
							{#if walletInfo.connected}
								<div style="display: flex; flex-direction: column; gap: 1rem;">
									<p style="font-size: 0.875rem; color: #10b981;">Wallet appears connected from cache</p>
									<button
										onclick={() => {
											if (walletInfo.account) {
												navigator.clipboard.writeText(walletInfo.account.address);
												alert('Copied address: ' + walletInfo.account.address);
											}
										}}
										style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; margin: 0.25rem;"
									>
										Test: Copy Address (should work if truly connected)
									</button>
									<button
										onclick={async () => {
										try {
											// Get the actual UiWallet from WalletState
											const walletState = walletInfo.wallet; // This is WalletState
											const actualWallet = walletState.wallet; // Now returns clean wallet automatically
											
											console.log('WalletState:', walletState);
											console.log('[snapshot] Actual UiWallet:', $state.snapshot(actualWallet));
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
									style="padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 0.375rem; cursor: pointer; margin: 0.25rem;"
									>
										Test: Sign Message
									</button>
									<button
										onclick={async () => {
										try {
											const walletState = walletInfo.wallet;
											const actualWallet = walletState.wallet;
											
											if (!actualWallet || !walletInfo.account || !walletState.client) {
												alert('No wallet or client available');
												return;
											}
											
											console.log('Testing transaction: send 0.001 SOL to self...');
											
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
											
											// Get latest blockhash using client
											if (!walletState.client) {
												alert('No client available');
												return;
											}
											
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
									style="padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 0.375rem; cursor: pointer; margin: 0.25rem;"
									>
										Test: Send 0.001 SOL to Self (Devnet)
									</button>
								</div>
							{:else}
								<p style="font-size: 0.875rem; opacity: 0.7;">No wallet connected to test</p>
							{/if}
						{/snippet}
					</CardContent>
				</Card>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Wallet State Information -->
			<Card class="border-blue-200 bg-blue-50">
				<CardHeader>
					{#snippet children()}
						<CardTitle class="text-2xl text-center text-blue-800">{#snippet children()}📊 Wallet State{/snippet}</CardTitle>
						<CardDescription class="text-center text-blue-700">
							{#snippet children()}Real-time wallet connection information and status{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<Card class="bg-white">
					<CardHeader>
						{#snippet children()}
							<CardTitle>{#snippet children()}Current State{/snippet}</CardTitle>
							<CardDescription>{#snippet children()}Real-time wallet connection information{/snippet}</CardDescription>
						{/snippet}
					</CardHeader>
					<CardContent>
						{#snippet children()}
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
										<Badge variant="outline" class="text-xs">{#snippet children()}Persistent Storage{/snippet}</Badge>
										<Badge variant="outline" class="text-xs">{#snippet children()}Auto-reconnect{/snippet}</Badge>
										<Badge variant="outline" class="text-xs">{#snippet children()}Multi-account{/snippet}</Badge>
										<Badge variant="outline" class="text-xs">{#snippet children()}Svelte 5{/snippet}</Badge>
										<Badge variant="outline" class="text-xs">{#snippet children()}CSS-only Design{/snippet}</Badge>
									</div>
								</div>
							</div>
						{/snippet}
					</CardContent>
				</Card>
					{/snippet}
				</CardContent>
			</Card>

			<!-- Usage Examples -->
			<Card class="border-green-200 bg-green-50">
				<CardHeader>
					{#snippet children()}
						<CardTitle class="text-2xl text-center text-green-800">{#snippet children()}💡 Usage Examples{/snippet}</CardTitle>
						<CardDescription class="text-center text-green-700">
							{#snippet children()}Common implementation patterns and use cases{/snippet}
						</CardDescription>
					{/snippet}
				</CardHeader>
				<CardContent>
					{#snippet children()}
						<div class="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Quick Connect{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Simple button for basic use cases{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent class="space-y-4">
							{#snippet children()}
								<div class="flex flex-col gap-2">
									<WalletUiButton />
									<p class="text-muted-foreground text-xs">
										Shows "Connect Wallet" when disconnected, shows truncated address when connected.
										Click to copy address.
									</p>
								</div>
							{/snippet}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							{#snippet children()}
								<CardTitle>{#snippet children()}Full Featured{/snippet}</CardTitle>
								<CardDescription>{#snippet children()}Dropdown with all options{/snippet}</CardDescription>
							{/snippet}
						</CardHeader>
						<CardContent class="space-y-4">
							{#snippet children()}
								<div class="flex flex-col gap-2">
									<WalletUiDropdown />
									<p class="text-muted-foreground text-xs">
										Shows wallet list when disconnected, shows copy/disconnect when connected.
									</p>
								</div>
							{/snippet}
						</CardContent>
					</Card>
						</div>
					{/snippet}
				</CardContent>
			</Card>
		</div>
	</div>
</WalletUi>

<style>
	/* Custom styles for demo purposes */
	:global(.custom-wallet-button) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
</style>