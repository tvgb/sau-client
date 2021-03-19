import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Plugins } from '@capacitor/core';
import { Animation, NavController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../registration/services/registration.service';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { UpdateFieldTripInfo } from 'src/app/shared/store/fieldTripInfo.actions';
import { FieldTripInfo, UpdateFieldTripInfoObject } from 'src/app/shared/classes/FieldTripInfo';
import { takeUntil } from 'rxjs/operators';
import { MapUIService } from 'src/app/shared/services/map-ui.service';
import { Coordinate } from 'src/app/shared/classes/Coordinate';

const { App, Network } = Plugins;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})

export class MapPage {
	private registrationSheepUrl = '/registration/register-sheep';
	private registrationDeadUrl = 'registration/register-dead';
	private registrationInjuredUrl = '/registration/register-injured';
	private registrationPredatorUrl = '/registration/register-predator';
	private map;
	private currentMainCategory: MainCategory;
	private trackedRouteSub: Subscription;
	private onlineTileLayer: any;
	private offlineTileLayer: any;
	private trackedRoute = [];
	private networkHandler;

	@ViewChild('lowPowerModeOverlay') lowPowerModeOverlay: ElementRef;
	@ViewChild('lowPowerModeHelpMessage') lowPowerModeHelpMessage: ElementRef;
	lowPowerModeOn = false;
	showLowPowerModeHelpMessage = true;
	lowPowerModeOnAnimation: Animation;
	lowPowerModeOffAnimation: Animation;

	private posistionIcon =  new L.Icon({
		iconUrl: 'assets/icon/current_gps_pos.png',
		iconSize: [30, 30],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
	});

	private crosshairIcon = new L.Icon({
		iconUrl: 'assets/icon/crosshair_icon.png',
		iconSize: [20, 20],
		tooltipAnchor: [16, -28],
	});

	private iconPath = 'assets/icon';
	addSheepBtnPath = `${this.iconPath}/add_sheep_btn.png`;
	addPredatorBtnPath = `${this.iconPath}/add_predator_btn.png`;
	addInjuredSheepBtnPath = `${this.iconPath}/add_injured_sheep_btn.png`;
	addDeadSheepBtnPath = `${this.iconPath}/add_dead_sheep_btn.png`;

	registrationType = RegistrationType;

	private alertHeader = 'Fullfør oppsynstur';
	private alertMessage = 'Ønsker du å fullføre og lagre denne oppsynsturen?';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) fieldTripInfo$: Observable<FieldTripInfo>;
	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	currentMainCategorySub: Subscription;
	posistionMarker: any;
	crosshairMarker: any;
	addMarkerAgain: boolean;


	private positionMarkerCoordinates: Coordinate;

	private unsubscribe$: Subject<void> = new Subject<void>();

	constructor(
		private platform: Platform,
		private store: Store,
		private regService: RegistrationService,
		private statusBarService: StatusbarService,
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private alertService: AlertService,
		private navController: NavController,
		private mapUiService: MapUIService) {

		this.platform.backButton.subscribeWithPriority(5, () => {
			this.navController.navigateBack('/main-menu');
		});

		this.networkHandler = Network.addListener('networkStatusChange', (status) => {
			if (status.connected) {
				this.map.removeLayer(this.offlineTileLayer);
				this.map.addLayer(this.onlineTileLayer);

				if (this.platform.is('mobileweb')) {
					console.log('Toast: Connected to Internet, using ONLINE map.');
				} else {
					this.alertService.presentNetworkToast(true);
				}
			} else {
				this.map.removeLayer(this.onlineTileLayer);
				this.map.addLayer(this.offlineTileLayer);

				if (this.platform.is('mobileweb')) {
					console.log('Toast: Disconnected to Internet, using OFFLINE map.');
				} else {
					this.alertService.presentNetworkToast(false);
				}
			}
		});
	}

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(true, false);
		this.trackedRouteSub = this.gpsService.getTrackedRoute().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((res) => {
			this.trackedRoute = res;
			if (this.map) {
				L.polyline(res).addTo(this.map);
				this.positionMarkerCoordinates = { lat: res[res.length - 1].lat, lng: res[res.length - 1].lng };
				this.posistionMarker.setLatLng(this.positionMarkerCoordinates);
			}
		});

		this.fieldTripInfo$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((fieldTripInfo) => {
			if (fieldTripInfo?.registrations?.length > 0 && !fieldTripInfo.dateTimeEnded) {
				const lastRegistration = fieldTripInfo.registrations[fieldTripInfo.registrations.length - 1];
				const {pin, polyline} = this.mapUiService.createRegistrationPin(
					lastRegistration.registrationPos,
					lastRegistration.gpsPos,
					lastRegistration.registrationType
				);
				pin.addTo(this.map);
				polyline.addTo(this.map);
			}
		});

		this.currentMainCategorySub = this.currentMainCategory$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(res => {
			this.currentMainCategory = res;
		});

		if (!this.gpsService.getTracking()) {
			this.gpsService.setTracking(true);
			this.gpsService.startTrackingInterval();
		}
	}

	ionViewDidEnter(): void {
		setTimeout(() => {
			this.gpsService.setTracking(true);
			if (!this.map) {
				this.initMap();
			}
		}, 100);
	}

	async navigateToRegistration(type: RegistrationType) {
		this.regService.registrationType = type;
		this.regService.registrationPosition = this.map.getCenter();
		this.regService.gpsPosition = await this.gpsService.getCurrentPosition();
		switch (type) {
			case RegistrationType.Sheep:
				this.ttsService.speak(`Registrer ${this.currentMainCategory.name}`);
				this.navController.navigateForward(this.registrationSheepUrl);
				break;

			case RegistrationType.Injured:
				this.navController.navigateForward(this.registrationInjuredUrl);
				break;

			case RegistrationType.Dead:
				this.navController.navigateForward(this.registrationDeadUrl);
				break;

			case RegistrationType.Predator:
				this.navController.navigateForward(this.registrationPredatorUrl);
		}
	}

	toggleLowPowerMode(event: any): void {
		if (this.lowPowerModeOn && event.tapCount === 2) {
			this.lowPowerModeOn = false;
			this.showLowPowerModeHelpMessage = false;

			const pos = this.posistionMarker.getLatLng();

			this.map.panTo((pos), {animate: true, duration: 1.0, easeLinearity: 0.2, noMoveStart: true});
			setTimeout(() => {
				this.map.doubleClickZoom.enable();
			}, 250);

		} else if (!this.lowPowerModeOn) {
			this.lowPowerModeOn = true;
			this.showLowPowerModeHelpMessage = true;
			this.map.doubleClickZoom.disable();
			setTimeout(() => {
				this.showLowPowerModeHelpMessage = false;
			}, 8000);
		} else if (this.lowPowerModeOn && event.tapCount === 1 && !this.showLowPowerModeHelpMessage) {
			this.showLowPowerModeHelpMessage = true;
			setTimeout(() => {
				this.showLowPowerModeHelpMessage = false;
			}, 8000);
		}
	}

	navigateToSummary(): void {
		this.store.dispatch(new UpdateFieldTripInfo({dateTimeEnded: Date.now(), trackedRoute: this.trackedRoute} as UpdateFieldTripInfoObject));
		this.navController.navigateForward('/field-trip-summary');
	}

	initMap(): void {
		this.gpsService.getCurrentPosition().then(async gpsPosition => {
			this.map = L.map('map', {
				center: [gpsPosition.coords.latitude, gpsPosition.coords.longitude],
				zoom: 12,
				minZoom: this.mapService.getMinZoom(),
				maxZoom: this.mapService.getMaxZoom(),
				zoomControl: false,
				attributionControl: false
			});

			this.crosshairMarker = L.marker([this.map.getCenter().lat, this.map.getCenter().lng],
			{icon: this.crosshairIcon,  interactive: false, zIndexOffset: 100}).addTo(this.map);

			this.map.on('move', () => {
				this.crosshairMarker.setLatLng([this.map.getCenter().lat, this.map.getCenter().lng]);
			});

			this.positionMarkerCoordinates = { lat: gpsPosition.coords.latitude, lng: gpsPosition.coords.longitude };

			this.posistionMarker = L.marker([gpsPosition.coords.latitude, gpsPosition.coords.longitude],
				{icon: this.posistionIcon}).addTo(this.map);

			this.gpsService.startTrackingInterval();

			App.addListener('appStateChange', ({ isActive }) => {
				if (isActive) {
					this.gpsService.setTracking(true);
					this.gpsService.recalibratePosition();
				} else {
					this.gpsService.setTracking(false);
				}
			});

			this.setOnlineTileLayer();
			this.setOfflineTileLayer();

			if ((await Network.getStatus()).connected) {
				this.map.addLayer(this.onlineTileLayer);
			} else {
				this.map.addLayer(this.offlineTileLayer);
			}
		});
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

	async showConfirmAlert() {
		const status = (await Network.getStatus()).connected;
		if (!status && this.platform.is('mobileweb'))  {
			this.navController.navigateForward('/field-trip-summary');
		} else {
			this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.navigateToSummary);
		}
	}

	ionViewWillLeave(): void {
		this.networkHandler.remove();
		this.unsubscribe$.next();
		this.gpsService.setTracking(false);
	}
}
