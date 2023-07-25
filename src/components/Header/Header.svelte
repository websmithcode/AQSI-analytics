<script lang="ts">
	import { browser } from '$app/environment';
	import NavItem from './NavItem.svelte';

	type navItem = {
		link: [string, string];
		children?: navItem[];
	};
	type menu = navItem[];

	const menu: menu = [
		{
			link: ['/analytics', 'Analytics'],
			children: [{ link: ['/analytics/receipts', 'Receipts'] }]
		},
		{ link: ['/about', 'About'] }
	];

	let AQSI_API_KEY = '';
	const updateApiKey = () => localStorage.setItem('AQSI_API_KEY', AQSI_API_KEY);
	if (browser) AQSI_API_KEY = window.localStorage.getItem('AQSI_API_KEY') ?? AQSI_API_KEY;
</script>

<header class="header">
	<div class="row">
		<a class="logo" href="/">AQSI-Analytics</a>
		<form class="api-key" on:submit|preventDefault={updateApiKey}>
			<input class="blur-sm" bind:value={AQSI_API_KEY} />
			<button>Set</button>
		</form>
	</div>
	<nav>
		<ul class="flex flex-row">
			{#each menu as item}
				<NavItem href={item.link[0]} title={item.link[1]} children={item.children} />
			{/each}
		</ul>
	</nav>
</header>

<style lang="sass">
  .header
    @apply bg-white shadow
    .row
      @apply max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8
      @apply flex flex-row justify-between items-center
      .logo
        @apply text-2xl font-bold text-gray-900
      .api-key
        @apply relative flex flex-row border border-gray-300 rounded-md shadow-sm  
        &:after  
          @apply absolute left-3 top-2 text-gray-500 pointer-events-none
          content: "Your aQsi API key"
          
        input
          @apply flex-grow p-2
        button
          @apply border-l border-gray-300 px-3 py-1
</style>
