import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeTakingService } from '../services/time-taking.service';

@Component({
	selector: 'app-time-measurements',
	templateUrl: './time-measurements.page.html',
	styleUrls: ['./time-measurements.page.scss'],
})
export class TimeMeasurementsPage implements OnInit {

	timeMeasurements: any[];

	constructor(private timeTakingService: TimeTakingService, private router: Router) { }

	ngOnInit() {
		this.timeMeasurements = [...this.timeTakingService.getTimeMeasurements()];
	}


	backToMap() {
		this.timeTakingService.clearTimeTakings();
		this.router.navigate(['/map']);
	}
}
