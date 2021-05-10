import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { GpsService } from '../map/services/gps.service';
import { Plugins } from '@capacitor/core';

const { App, Network } = Plugins;


@Component({
	selector: 'app-test-page',
	templateUrl: './test-page.page.html',
	styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage {

	trackedPos: any[] = [];
	prevPos: any;
	inactive = false;

	constructor(private gpsService: GpsService, private changeDetector: ChangeDetectorRef) {}

	ionViewDidEnter() {
		App.addListener('appStateChange', status => {
			if (status.isActive) {
				this.inactive = false;
				this.trackedPos.push({timeDiff: null, distance: null, msg: 'active', inactive: this.inactive });
			} else {
				this.inactive = true;
				this.trackedPos.push({timeDiff: null, distance: null, msg: 'inactive', inactive: this.inactive});
			}

			this.changeDetector.detectChanges();
		});

		console.log('DID ENTER')
		this.gpsService.getPos().subscribe((res) => {
			if (res && this.prevPos) {
				const timeDiff = (res.timestamp - this.prevPos.timestamp) / 1000;
				const distance = Math.round(this.gpsService.getDistanceBetweenCoords(new Coordinate(res.coords.latitude, res.coords.longitude), new Coordinate(this.prevPos.coords.latitude, this.prevPos.coords.longitude)));
				const posObj = { timeDiff, distance, inactive: this.inactive }
				this.trackedPos.push(posObj);
				this.changeDetector.detectChanges();
				this.prevPos = res;
			} else if (res) {
				this.prevPos = res;
			}
		})

		this.gpsService.startWatchPosition();
	}

}
