import { AfterViewInit, Component} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, Subject, Subscription } from 'rxjs';
import * as L from 'leaflet';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { Select, Store} from '@ngxs/store';
import { FieldTripInfo, UpdateFieldTripInfoObject } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { DeadSheepRegistration, InjuredSheepRegistration, PredatorRegistration, SheepRegistration } from 'src/app/shared/classes/Registration';
import { MapUIService } from 'src/app/shared/services/map-ui.service';
import { UpdateFieldTripInfo } from 'src/app/shared/store/fieldTripInfo.actions';
import { Network } from '@capacitor/core';
import { MapService } from '../map/services/map.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

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
	injuredCount = 0;
	deadCount = 0;
	predators = 0;

	private fieldTripInfoSub: Subscription;
	private startPos = [63.424, 10.3961];
	private mapUrl = '/map';
	private mainMenuUrl = '/main-menu';
	private map;
	private onlineTileLayer: any;
	private offlineTileLayer: any;

	private alertConfirmHeader = 'Fullfør oppsynstur';
	private alertNoRegistrationsMessage =
	'<br> <br> Det er ingen registreringer lagret på denne oppsynsturen.'; // <br> for newline
	private alertNoLocationMessage = '<br> <br> Det er ikke registrert en GPS rute på denne oppsynsturen.';

	descriptionChanged = false;
	descriptionValue = '';

	private unsubscribe$: Subject<void> = new Subject();

	connectedToNetwork = false;
	completeButtonPressed = false;
	uploadCompleted = false;
	uploadFailed = false;
	progressBarValue = 0;
	waitBeforeNavTime = 4000;
	uploadStatusText = 'Laster opp oppsynsturrapporten i skyen.';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) fieldTripInfo$: Observable<FieldTripInfo>;

	constructor(
		private navController: NavController,
		private statusBarService: StatusbarService,
		private mapUiService: MapUIService,
		private mapService: MapService,
		private store: Store,
		private alertService: AlertService,
		private firestoreService: FirestoreService) { }

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(false, true);
		this.fieldTripInfoSub = this.fieldTripInfo$.pipe(
			takeUntil(this.unsubscribe$)
		) .subscribe((res) => {
			this.fieldTripInfo = res;
			console.log(this.fieldTripInfo.dateTimeEnded);
		});

		this.descriptionValue = this.fieldTripInfo.description;

		if (this.fieldTripInfo.registrations) {
			this.getTotalSheep();
			this.getInjuredSheep();
			this.getDeadSheep();
			this.getPredators();
		}

		this.getDateAndDuration();

		Network.getStatus().then((status) => {
			this.connectedToNetwork = status.connected;
		});

		Network.addListener('networkStatusChange', (status) => {
			this.connectedToNetwork = status.connected;

			if (status.connected) {
				this.map.removeLayer(this.offlineTileLayer);
				this.map.addLayer(this.onlineTileLayer);
			} else {
				this.map.removeLayer(this.onlineTileLayer);
				this.map.addLayer(this.offlineTileLayer);
			}
		});
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
		const sheepRegistrations = this.fieldTripInfo.registrations
			.filter(reg => reg.registrationType === RegistrationType.Sheep) as SheepRegistration[];

		sheepRegistrations.forEach((registration) => {
			this.totalSheepCount += registration.sheepInfo.totalSheep.totalSheep.count;
		});
	}

	getInjuredSheep(): void {
		const injuredRegistrations = this.fieldTripInfo.registrations
		.filter(reg => reg.registrationType === RegistrationType.Injured) as InjuredSheepRegistration[];

		injuredRegistrations.forEach((registration) => {
			this.injuredCount += registration.count;
		});
	}

	getDeadSheep(): void {
		const deadRegistrations = this.fieldTripInfo.registrations
		.filter(reg => reg.registrationType === RegistrationType.Dead) as DeadSheepRegistration[];

		deadRegistrations.forEach((registration) => {
			this.deadCount += registration.count;
		});
	}

	getPredators(): void {
		const predatorsRegistrations = this.fieldTripInfo.registrations
		.filter(reg => reg.registrationType === RegistrationType.Predator) as PredatorRegistration[];
		this.predators = predatorsRegistrations.length;
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	async initMap(): Promise<void> {
		this.map = L.map('summary-map', {
			zoomControl: false,
			attributionControl: false,
		});

		if (this.fieldTripInfo?.trackedRoute) {
			const trackedRoutePolyline = L.polyline(this.fieldTripInfo.trackedRoute, {smoothFactor: 10});
			const fitBoundsCoords: Coordinate[] = [...this.fieldTripInfo.trackedRoute];
			trackedRoutePolyline.addTo(this.map);

			if (this.fieldTripInfo?.registrations) {
				this.fieldTripInfo.registrations.forEach(registration => {
					fitBoundsCoords.push(registration.registrationPos);
					const {pin, polyline} = this.mapUiService.createRegistrationPin(
						registration.registrationPos,
						registration.gpsPos,
						registration.registrationType,
						true
					);

					pin.addTo(this.map);
					polyline.addTo(this.map);
				});
			}

			this.map.fitBounds(L.polyline(fitBoundsCoords).getBounds());

		} else {
			this.map.setView(this.startPos, 12);
		}

		this.setOnlineTileLayer();
		this.setOfflineTileLayer();

		if ((await Network.getStatus()).connected) {
			this.map.addLayer(this.onlineTileLayer);
		} else {
			this.map.addLayer(this.offlineTileLayer);
			this.map.setZoom(this.mapService.getMaxZoom());
		}
	}

	private setOnlineTileLayer(): void {
		this.onlineTileLayer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
		});
	}

	private setOfflineTileLayer(): void {
		L.GridLayer.OfflineMap = L.GridLayer.extend({
			createTile: (coords, done) => {
				const tile = document.createElement('img');

				this.mapService.getTile(coords.z, coords.x, coords.y).then((base64Img) => {
					tile.setAttribute(
						'src', base64Img
					);
					done(null, tile);
				}).catch((e) => {
					tile.innerHTML = 'Map not available offline.';
					console.log(e);
				});
				return tile;
			}
		});
		L.gridLayer.offlineMap = (opts) => {
			return new L.GridLayer.OfflineMap(opts);
		};
		this.offlineTileLayer = L.gridLayer.offlineMap();
	}

	onNavigateBack(): void {
		this.store.dispatch(new UpdateFieldTripInfo({dateTimeEnded: undefined} as UpdateFieldTripInfoObject));
		this.navController.navigateBack(this.mapUrl);
	}

	onCompleteSummary(): void {
		let alertConfirmMessage = 'Er du sikker på at du vil fullføre oppsynsturen?';
		if (this.descriptionChanged) {
			this.store.dispatch(new UpdateFieldTripInfo({description: this.descriptionValue} as UpdateFieldTripInfoObject));
		}
		if (!this.fieldTripInfo.registrations) {
			alertConfirmMessage = alertConfirmMessage + this.alertNoRegistrationsMessage;
		}
		if (this.fieldTripInfo.trackedRoute.length < 2) {
			alertConfirmMessage = alertConfirmMessage + this.alertNoLocationMessage;
		}
		this.alertService.confirmAlert(this.alertConfirmHeader, alertConfirmMessage, this, this.confirmHandler);
	}


	confirmHandler(): void {
		this.completeButtonPressed = true;
		this.firestoreService.saveNewFieldTrip(this.fieldTripInfo).then((saveComplete) => {
			this.uploadCompleted = true;

			if (saveComplete) {
				this.uploadStatusText = 'Oppsynsturrapporten har blitt lagret i skyen. Du blir tatt tilbake til hovedmenyen.';
				this.tickProgressBar();
				setTimeout(() => {
					this.navController.navigateBack(this.mainMenuUrl);
				}, this.waitBeforeNavTime);
			} else {
				this.uploadFailed = true;
				this.uploadStatusText = 'Noe gikk galt under opplastingen...';
			}
		});
	}

	private tickProgressBar() {
		setTimeout(() => {
			if (this.progressBarValue < 1) {
				this.progressBarValue += 0.01;
				this.tickProgressBar();
			}
		}, this.waitBeforeNavTime / 120);
	}

	ionViewWillLeave(): void {
		this.store.dispatch(new UpdateFieldTripInfo({dateTimeEnded: null} as UpdateFieldTripInfoObject));
		this.unsubscribe$.next();
	}
}
