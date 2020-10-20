import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TimeTakingService {

	private idTimeMap = new Map<string, number>();
	private timeMeasurements: TimeMeasurement[] = [];

	constructor() { }

	startNewStopWatch(id: string): void {
		const t0 = performance.now();
		this.idTimeMap.set(id, t0);
	}

	stopStopWatch(id: string): void {
		const t0 = this.idTimeMap.get(id);
		const t1 = performance.now();
		const timeMeasurement: TimeMeasurement = {
			time: t1 - t0,
			name: id
		};

		this.timeMeasurements.push(timeMeasurement);
	}

	getTimeMeasurements(): TimeMeasurement[] {
		const timeMeasurements = [...this.timeMeasurements];
		const accumulatedTimeMeasurements: TimeMeasurement[] = [];

		for (const key of this.idTimeMap.keys()) {
			accumulatedTimeMeasurements.push({
				name: key,
				time: timeMeasurements.filter(tm => tm.name === key).reduce((acc, tm) => acc + tm.time, 0)
			});
		}

		return accumulatedTimeMeasurements;
	}

	clearTimeTakings(): void {
		this.timeMeasurements = [];
		this.idTimeMap.clear();
	}
}

class TimeMeasurement {
	time: number;
	name: string;

	constructor() {}
}
