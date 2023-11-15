<script lang="ts">
	import { browser } from '$app/environment';
	import { AQSI } from '$lib/AQSI';

	let data;
	let date = new Date();

	function incDate() {
		date.setDate(date.getDate() + 1);
		date = date;
		data = null;
		console.log(date.toDateString());
	}

	function decDate() {
		date.setDate(date.getDate() - 1);
		date = date;
		data = null;
		console.log(date.toDateString());
	}

	async function getData() {
		if (!browser) return;
		const api = new AQSI();
		const _data = await api.getReceiptsOfDay(date);
		console.log(_data);
		_data.rows = _data.rows.sort(
			(a, b) => new Date(a.processedAt).getTime() - new Date(b.processedAt).getTime()
		);

		return {
			rows: _data.rows,
			total: AQSI.calculateTotal(_data.rows)
		};
	}

	$: if (date) getData().then((d) => (data = d));

	function formatToLocaleTimeString(datetime) {
		return new Date(datetime).toLocaleTimeString();
	}
</script>

<main>
	<div class="flex justify-center mb-3">
		<div class="flex items-center border border-black space-x-3">
			<button class="px-2 py-1 border border-gray-300" on:click={decDate}>{'<-'}</button>
			<div>{date.toDateString()}</div>
			<button class="px-2 py-1 border border-gray-300" on:click={incDate}>{'->'}</button>
		</div>
	</div>
	{#if data && data.rows.length > 0}
		<table class="mb-3">
			<tr>
				<th>Кассир</th>
				<th>Первый чек</th>
				<th>Чеков</th>
				<th>Итог</th>
			</tr>
			<tr>
				<td>{data.rows[0].cashier.name}</td>
				<td>{formatToLocaleTimeString(data.rows[0].processedAt)}</td>
				<td>{data.rows.length}</td>
				<td>{data.total}р</td>
			</tr>
		</table>
		<table>
			{#each data.rows as row, i}
				<tr>
					<td class="text-end">{i}</td>
					<td>{formatToLocaleTimeString(row.processedAt)}</td>
					<td>
						<ul>
							{#each row.content.positions as pos}
								<li>
									{pos.text} ({pos.quantity})
								</li>
							{/each}
						</ul>
					</td>
					<td>
						<ul>
							{#each row.content.positions as pos}
								<li>
									{pos.price}
								</li>
							{/each}
						</ul>
					</td>
					<td>
						{row.amount}
					</td>
				</tr>
			{/each}
		</table>
	{/if}
</main>

<style lang="sass">
  main
    @apply pt-3
    table, table td
      @apply border-collapse border border-black
    table td
      @apply p-2

</style>
