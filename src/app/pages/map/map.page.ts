import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Animation, IonFab, NavController, Platform } from '@ionic/angular';
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
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

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
	private onlineTileLayer: any;
	private offlineTileLayer: any;
	private trackedRoute = [];
	private networkHandler: PluginListenerHandle;
	private mapMoveEnded = true;
	private connectedToInternet = true;

	centerMapOnPositionUpdate = true;
	registrationSelectorFabIsActive = false;

	@ViewChild('lowPowerModeOverlay') lowPowerModeOverlay: ElementRef;
	@ViewChild('lowPowerModeHelpMessage') lowPowerModeHelpMessage: ElementRef;
	@ViewChild('registrationSelectorFab') registrationSelectorFab: IonFab;


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
	lastTrackedPos: Coordinate;

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
		private mapUiService: MapUIService,
		private changeDetectorRef: ChangeDetectorRef) {

		this.platform.backButton.subscribeWithPriority(5, () => {
			this.navController.navigateBack('/main-menu');
		});

		Network.addListener('networkStatusChange', (status) => {

			if (status.connected === this.connectedToInternet) {
				return;
			}

			this.connectedToInternet = status.connected

			if (this.connectedToInternet) {
				this.mapService.setIsUsingOfflineMap(false);
				this.map.removeLayer(this.offlineTileLayer);
				this.map.addLayer(this.onlineTileLayer);

				if (this.platform.is('mobileweb')) {
					console.log('Toast: Connected to Internet, using ONLINE map.');
				} else {
					this.alertService.presentNetworkToast(true);
				}
			} else {
				this.mapService.setIsUsingOfflineMap(true);
				this.map.removeLayer(this.onlineTileLayer);
				this.map.setMinZoom(this.mapService.getMinZoom());
				this.map.setMaxZoom(this.mapService.getMaxZoom());
				this.map.setZoom(this.map.getMaxZoom());
				this.map.addLayer(this.offlineTileLayer);

				if (this.platform.is('mobileweb')) {
					console.log('Toast: Disconnected to Internet, using OFFLINE map.');
				} else {
					this.alertService.presentNetworkToast(false);
				}
			}
		}).then((pluginListenerHandle) => {
			this.networkHandler = pluginListenerHandle;
		});
	}

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(true, false);
		this.gpsService.getTrackedRoute().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((res) => {
			this.trackedRoute = res;
			if (this.map) {
				L.polyline(res).addTo(this.map);
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

				this.gpsService.addToTrackedRoute(lastRegistration.gpsPos);
			}
		});

		this.currentMainCategorySub = this.currentMainCategory$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(res => {
			this.currentMainCategory = res;
		});

		this.gpsService.getLastTrackedPosition().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((pos) => {
			if (pos) {
				this.lastTrackedPos = pos;

				if (!this.posistionMarker) {
					this.posistionMarker = L.marker([pos.lat, pos.lng], {icon: this.posistionIcon}).addTo(this.map);
				} else {
					this.posistionMarker.setLatLng(pos);
				}

				if (this.centerMapOnPositionUpdate && this.mapMoveEnded) {
					this.map.panTo((pos), {animate: true, duration: 1.0, easeLinearity: 0, noMoveStart: true});
				}
			}
		});
	}

	ionViewDidEnter(): void {
		if (!this.map) {
			this.initMap().then(() => {
				this.gpsService.startGpsTracking();
			});
		} else {
			this.gpsService.startGpsTracking();
		}
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

	toggleCenterMapMode(event: any) {
		this.centerMapOnPositionUpdate = !this.centerMapOnPositionUpdate;

		if (this.centerMapOnPositionUpdate && this.lastTrackedPos) {
			this.map.panTo((this.lastTrackedPos), {animate: true, duration: 1.0, easeLinearity: 0, noMoveStart: true});
		}
	}

	onRegistrationSelectorClick(): void {
		this.registrationSelectorFabIsActive = !this.registrationSelectorFab.activated;
	}

	navigateToSummary(): void {
		this.store.dispatch(new UpdateFieldTripInfo({dateTimeEnded: Date.now(), trackedRoute: this.trackedRoute} as UpdateFieldTripInfoObject));
		this.navController.navigateForward('/field-trip-summary');
	}

	async initMap(): Promise<void> {

		const zoom = 12;
		const center = [63.418669063607666, 10.402754156997933];
		const zoomControl = false;
		const attributionControl = false;

		this.map = L.map('map', { zoomControl, attributionControl }).on('load', e => setTimeout(() => {
			this.map.invalidateSize(); }, 0)
		).setView(center, zoom);

		// this.map = L.map('map', {
		// 	center: [63.418669063607666, 10.402754156997933], // Center of Gløshaugen
		// 	zoom: 12,
		// 	zoomControl: false,
		// 	attributionControl: false
		// });

		this.crosshairMarker = L.marker([this.map.getCenter().lat, this.map.getCenter().lng],
		{icon: this.crosshairIcon,  interactive: false, zIndexOffset: 100}).addTo(this.map);

		this.map.on('move', () => {
			this.crosshairMarker.setLatLng([this.map.getCenter().lat, this.map.getCenter().lng]);
		});

		this.map.on('zoomstart', () => {
			this.centerMapOnPositionUpdate = false;
		});

		this.map.on('movestart', () => {
			this.centerMapOnPositionUpdate = false;
			this.changeDetectorRef.detectChanges();
		});

		this.setOnlineTileLayer();
		this.setOfflineTileLayer();

		this.connectedToInternet = (await Network.getStatus()).connected;

		if (this.connectedToInternet) {
			this.map.addLayer(this.onlineTileLayer);
		} else {
			this.map.setMinZoom(this.mapService.getMinZoom());
			this.map.setMaxZoom(this.mapService.getMaxZoom());
			this.map.setZoom(this.map.getMaxZoom());
			this.map.addLayer(this.offlineTileLayer);
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

	async showConfirmAlert() {
		const status = (await Network.getStatus()).connected;
		if (!status && this.platform.is('mobileweb'))  {
			this.navController.navigateForward('/field-trip-summary');
		} else {
			this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.navigateToSummary);
		}
	}

	ionViewWillLeave(): void {
		this.gpsService.stopGpsTracking();
		this.networkHandler.remove();
		this.unsubscribe$.next();
	}
}
