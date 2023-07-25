export type AnyValue = any;
export type FiltersObject = Record<string, CallableFunction>;

export class Helpers {
  static objectToQueryParams(obj: object): string {
    return Object.entries(obj)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
  }

  static prepareResponse(response: Response) {
    return response;
  }

  static formatDatetime(datetime: Date): string {
    return datetime.toISOString().slice(0, 19);
  }

  static startOfDay(date: Date): Date {
    const _date = new Date(date.toISOString());
    _date.setHours(3);
    _date.setMinutes(0);
    _date.setSeconds(0);
    return _date;
  }
  static endOfDay(date: Date): Date {
    const _date = new Date(date.toISOString());
    _date.setHours(23);
    _date.setMinutes(59);
    _date.setSeconds(59);
    return _date;
  }

  static getDottedValue(data: Record<string, AnyValue>, key: string): AnyValue {
    const keys = key.split('.');

    keys.forEach((k) => (data = data[k]));

    return data;
  }

  static advFilter(dataArray: Array<AnyValue>, filters: FiltersObject = {}): Array<AnyValue> {
    return dataArray.filter((i) => {
      let isValid = true;
      Object.entries(filters).forEach(([k, cb]) => {
        if (!isValid) return;
        const val = this.getDottedValue(i, k);
        isValid = cb(val);
      });

      return isValid;
    });
  }

  static async pQueue(queue: CallableFunction[]) {
    for (const item of queue) {
      await item();
    }
  }
  static hash(val: string): number {
    let i,
      chr,
      hash = 0;

    if (val.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = val.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
