import { Cache } from '$lib/Cache';
import { Helpers } from '$lib/Helpers';

type _fetch_options = RequestInit;

export type Receipt = {
	amount: number;
	content: {
		positions: {
			text: string;
			price: number;
		}[];
	};
};

export type ReceiptsResponseData = {
	rows: Receipt[];
};

export class AQSI {
	URL: Record<string, string> = {
		'Receipts.index': '/v2/Receipts'
	};
	AQSI_BASE_URL = 'https://api.aqsi.ru/pub';
	SHEETS = {
		SALARY: 'Зарплаты',
		SUMMARY: 'Сводка',
		SELLS: 'Продажи'
	};
	TIMEZONE = 3;

	API_KEY: string;
	_fetch_options: _fetch_options;
	_cache: Cache;

	constructor() {
		this.API_KEY = localStorage.getItem('AQSI_API_KEY') ?? '';
		this._fetch_options = {
			method: 'GET',
			headers: {
				'x-client-key': `Application ${this.API_KEY}`
			}
		};
		this._cache = new Cache();
	}

	url(key: string, query = {}) {
		let qs = Helpers.objectToQueryParams(query).toString();
		qs = qs ? '?' + qs : '';

		const qsUrl = btoa(`${this.AQSI_BASE_URL}${this.URL[key]}${qs}`);
		const apikey = btoa(this.API_KEY);

		const url = `/tools/no-cors?url=${qsUrl}&key=${apikey}`;
		return url;
	}

	async fetch(resource: string) {
		const ckey = Cache.getKey('fetch', resource);
		if (this._cache.isActual(ckey)) {
			console.log('[CACHED] Fetch', resource);
			return this._cache.get(ckey);
		}

		const response = await fetch(resource);
		return this._cache.set(ckey, Helpers.prepareResponse(response)).value;
	}

	async getReceipts(params = {}) {
		params = Object.assign(
			{
				'filtered.BeginDate': Helpers.formatDatetime(new Date())
			},
			params
		);

		const url = this.url('Receipts.index', params);
		return this.fetch(url);
	}

	async getReceiptsOfDay(day = new Date(), params = {}) {
		const dateFrom = Helpers.startOfDay(day);
		const dateTo = Helpers.endOfDay(day);

		params = Object.assign(
			{
				'filtered.BeginDate': Helpers.formatDatetime(dateFrom),
				'filtered.EndDate': Helpers.formatDatetime(dateTo),
				pageSize: 100
			},
			params
		);
		console.log(params);

		const url = this.url('Receipts.index', params);
		const response = await this.fetch(url);
		return (await response.json()) as ReceiptsResponseData;
	}

	async getTotal(dateFrom: Date, dateTo: Date, _filters: Record<string, string | number> = {}) {
		const cashier = _filters['cashier.name'];
		const filters = {
			'cashier.name': (c: string) => (cashier ? c === cashier : true),
			'content.type': (i: number) => i === 1
		};

		const now = new Date();
		if (dateFrom == undefined) dateFrom = Helpers.startOfDay(now);
		if (dateTo == undefined) dateTo = Helpers.endOfDay(now);

		const response = await this.getReceipts({
			'filtered.BeginDate': Helpers.formatDatetime(dateFrom),
			'filtered.EndDate': Helpers.formatDatetime(dateTo),
			pageSize: 100
		});
		const data = await response.json();
		if (data.rows.length == 0) return 0;

		data.rows = Helpers.advFilter(data.rows, filters);

		return AQSI.calculateTotal(data.rows);
	}

	static calculateTotal(rows: Receipt[]) {
		if (rows.length == 0) return 0;
		const amounts = rows.map((i) => i.amount);
		const total = amounts.reduce((a: number, b: number) => a + b, 0);
		return total;
	}

	async getTotalOfDay(date: Date, filters = {}) {
		if (date == undefined) date = new Date();

		const dateFrom = Helpers.startOfDay(date);
		const dateTo = Helpers.endOfDay(date);

		return await this.getTotal(dateFrom, dateTo, filters);
	}

	// async getSellPositionsOfDay(date = new Date()) {
	// 	const positions = {};
	// 	const receipts = await this.getReceiptsOfDay(date);
	// 	const rows = receipts.json().rows;
	// 	rows.forEach((data) =>
	// 		data.content.positions.forEach((pos) => {
	// 			if (!Object.keys(positions).includes(pos.text))
	// 				positions[pos.text] = { price: pos.price, minPrice: Infinity, quantity: 0, revenue: 0 };
	// 			const position = positions[pos.text];
	// 			position.quantity += pos.quantity;
	// 			position.revenue += pos.price * pos.quantity;
	// 			if (pos.price < position.minPrice) position.minPrice = pos.price;
	// 		})
	// 	);
	//
	// 	return positions;
	// }
}
