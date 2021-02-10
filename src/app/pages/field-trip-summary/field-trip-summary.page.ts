import { AfterViewInit, Component} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import * as L from 'leaflet';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { Select} from '@ngxs/store';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';

@Component({
	selector: 'app-field-trip-summary',
	templateUrl: './field-trip-summary.page.html',
	styleUrls: ['./field-trip-summary.page.scss'],
})

export class FieldTripSummaryPage implements AfterViewInit {

	fieldTripInfo: FieldTripInfo;
	date: number;
	hours: number;
	min: number;
	sec: number;
	totalSheepCount = 0;
	totalEweCount = 0;
	totalLambCount = 0;
	private fieldTripInfoSub: Subscription;
	private startPos = [63.424, 10.3961];
	private mapUrl = '/map';
	private mainMenuUrl = '/main-menu';
	private map;

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) fieldTripInfo$: Observable<FieldTripInfo>;

	constructor(private navController: NavController, private statusBarService: StatusbarService) { }

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(false, true);
		this.fieldTripInfoSub = this.fieldTripInfo$.subscribe((res) => {
			this.fieldTripInfo = res;
		});
		this.getDateAndDuration();
		this.getTotalSheep();
	}

	getDateAndDuration(): void {
		this.date = this.fieldTripInfo.dateTimeStarted;
		let delta = Math.abs(this.fieldTripInfo.dateTimeEnded - this.fieldTripInfo.dateTimeStarted) / 1000;
		const days = Math.floor(delta / 86400);
		delta -= days * 86400;

		this.hours = Math.floor(delta / 3600) % 24;
		delta -= this.hours * 3600;

		this.min = Math.floor(delta / 60) % 60;
		delta -= this.min * 60;
	}

	getTotalSheep(): void {
		this.fieldTripInfo.registrations.forEach((registration) => {
			if (registration.registrationType === RegistrationType.Sheep) {
				this.totalSheepCount += registration.sheepInfo.totalSheep.totalSheep.count;
				this.totalEweCount += registration.sheepInfo.sheepType.ewe.count;
				this.totalLambCount += registration.sheepInfo.sheepType.lamb.count;
			}
		});
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	initMap(): void {
		this.map = L.map('summary-map', {
			zoomControl: false,
			attributionControl: false,
		});

		if (this.fieldTripInfo?.trackedRoute) {
			const polyline = L.polyline(this.fieldTripInfo.trackedRoute);
			polyline.addTo(this.map);
			this.map.fitBounds(polyline.getBounds());
		} else {
			this.map.setView(this.startPos, 12);
		}

		L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
		}).addTo(this.map);
	}

	navigateBack(): void {
		this.navController.navigateBack(this.mapUrl);
	}

	completeSummary(): void {
		this.navController.navigateBack(this.mainMenuUrl);

		// Add To File!!
	}

	ionViewWillLeave(): void {
	this.fieldTripInfoSub.unsubscribe();
	}
}
