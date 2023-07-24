<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	export let href: string;
	export let title: string;
	export let children: any[] = [];

	// function isActive() {}
	const nested = !!children.length;
	let hovered = false;

	let isActive = false;
	$: isActive = ($page.route.id ?? '').startsWith(href);
</script>

<li
	class="nav-item"
	class:relative={nested}
	class:nested
	class:active={isActive}
	on:mouseover={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:focus={() => (hovered = true)}
	on:blur={() => (hovered = false)}
>
	<a {href}>{title}</a>

	{#if children && hovered}
		<ul class="submenu" transition:fade={{ duration: 100 }}>
			{#each children as item}
				<svelte:self href={item.link[0]} title={item.link[1]} children={item.children} />
			{/each}
		</ul>
	{/if}
</li>

<style lang="sass">
  .nav-item
    @apply px-2 py-1
    &.active
      @apply bg-gray-300
    &.nested
      >ul.submenu
        @apply flex flex-col absolute bg-gray-300 bg-opacity-90 border border-gray-400

        :global(li)
          @apply border-b border-gray-500 last:border-none  

</style>
