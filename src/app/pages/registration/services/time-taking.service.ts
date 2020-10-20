import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TimeTakingService {

	private idTimeMap = new Map<string, number>();
	private timeMeasurements: TimeMeasurement[] = [];

	constructor() { }

	startNewStopWatch(id: string) {
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
		this.timeMeasurements = [];
		this.idTimeMap.clear();

		return timeMeasurements;
	}
}

class TimeMeasurement {
	time: number;
	name: string;

	constructor() {}
}
