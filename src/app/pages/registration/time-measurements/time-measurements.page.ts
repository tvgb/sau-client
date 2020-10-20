import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeTakingService } from '../services/time-taking.service';

@Component({
	selector: 'app-time-measurements',
	templateUrl: './time-measurements.page.html',
	styleUrls: ['./time-measurements.page.scss'],
})
export class TimeMeasurementsPage {

	timeMeasurements: any[];
	total: any;

	constructor(private timeTakingService: TimeTakingService, private router: Router) { }

	ionViewWillEnter() {
		this.timeMeasurements = [...this.timeTakingService.getTimeMeasurements()];
		const totalIndex = this.timeMeasurements.findIndex(tm => tm.name === 'totalTMID');
		this.total = this.timeMeasurements[totalIndex];
		this.timeMeasurements.splice(totalIndex, 1);
	}

	backToMap() {
		this.timeTakingService.clearTimeTakings();
		this.router.navigate(['/map']);
	}
}
