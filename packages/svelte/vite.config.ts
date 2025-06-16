import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: [
				'/root/dev/wallet-ui-svelte/wallet-ui/packages/svelte/wallet-standard-svelte',
				'/root/dev/wallet-ui-svelte/wallet-ui/packages/svelte/wallet-standard-svelte/dist',
				'/root/dev/wallet-ui-svelte/wallet-ui/packages/svelte/wallet-standard-svelte/src'
			]
		}
	}
});
