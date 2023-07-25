import { Helpers } from './helpers';

class CacheOutdatedError extends Error {}
class CacheHasNoValueError extends Error {}

type CachedValue = any;
type Cached = { ts: number; ttl: number; value: CachedValue };

export class Cache {
	values: Record<string, Cached>;

	constructor() {
		this.values = {};
	}

	get(key: string): CachedValue {
		if (!this.hasValue(key)) throw CacheHasNoValueError;
		if (this.isOutdated(key)) throw CacheOutdatedError;

		return this.values[key].value;
	}

	set(key: string, value: CachedValue, ttl = 60): Cached {
		return (this.values[key] = { ts: Date.now(), ttl, value });
	}

	hasValue(key: string): boolean {
		return Object.keys(this.values).includes(key);
	}

	isOutdated(key: string): boolean {
		const _value = this.values[key];
		return _value.ts + _value.ttl > Date.now();
	}

	isActual(key: string): boolean {
		return this.hasValue(key) && !this.isOutdated(key);
	}

	static getKey(key: string, query: string | boolean = false): string {
		if (query) key += '_' + Helpers.hash(JSON.stringify(query));
		return key;
	}
}
