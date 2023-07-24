<script lang="ts">
	import NavItem from './NavItem.svelte';

	type navItem = {
		link: [string, string];
		children?: navItem[];
	};
	type menu = navItem[];

	const menu: menu = [
		{
			link: ['/analytics', 'Analytics'],
			children: [
				{ link: ['/analytics/receipts', 'Receipts'] },
				{ link: ['/analytics/receipts', 'Receipts'] }
			]
		},
		{ link: ['/about', 'About'] }
	];
</script>

<header class="bg-white shadow">
	<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<a class="logo" href="/">AQSI-Analytics</a>
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
  .logo
    @apply text-2xl font-bold text-gray-900
</style>
