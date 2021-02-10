import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Plugins } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../registration/services/registration.service';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { FieldTripInfoModel } from 'src/app/shared/interfaces/FieldTripInfoModel';
import { SetDateTimeEnded } from 'src/app/shared/store/fieldTripInfo.actions';
import { UpdateFieldTripInfoObject } from 'src/app/shared/classes/FieldTripInfo';

const { App, Network } = Plugins;


@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})

export class MapPage implements AfterViewInit {
	private registrationUrl = '/registration/register';
	private map;
	private currentMainCategory: MainCategory;
	private trackedRouteSub: Subscription;
	private onlineTileLayer: any;
	private offlineTileLayer: any;
	private trackedRoute = [];

	private posistionIcon =  new L.Icon({
		iconUrl: 'assets/icon/current-pos-icon.png',
		iconSize: [30, 30],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
	});

	private alertHeader = 'Fullfør oppsynstur';
	private alertMessage = 'Ønsker du å fullføre og lagre denne oppsynsturen?';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) fieldTripInfo$: Observable<FieldTripInfoModel>;
	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	currentMainCategorySub: Subscription;
	posistionMarker: any;
	addMarkerAgain: boolean;

	constructor(
		private platform: Platform,
		private store: Store,
		private regService: RegistrationService,
		private statusBarService: StatusbarService,
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private alertService: AlertService,
		private navController: NavController) {


		this.platform.backButton.subscribeWithPriority(5, () => {
			this.navController.navigateBack('/main-menu');
		});

		Network.addListener('networkStatusChange', (status) => {
			if (status.connected) {
				this.map.removeLayer(this.offlineTileLayer);
				this.map.addLayer(this.onlineTileLayer);
			} else {
				this.map.removeLayer(this.onlineTileLayer);
				this.map.addLayer(this.offlineTileLayer);
			}
		});
	}

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(true, false);
		this.trackedRouteSub =  this.gpsService.getTrackedRoute().subscribe((res) => {
			this.trackedRoute = res;
			if (this.map) {
				L.polyline(res).addTo(this.map);
				this.posistionMarker.setLatLng([res[res.length - 1].lat, res[res.length - 1].lng]);
			}
		});

		this.currentMainCategorySub = this.currentMainCategory$.subscribe(res => {
			this.currentMainCategory = res;
		});


		if (!this.gpsService.getTracking()) {
			this.gpsService.setTracking(true);
			this.gpsService.startTrackingInterval();
		}
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.gpsService.setTracking(true);
			this.initMap();
		});
	}

	navigateToRegistration(): void {
		this.regService.position = this.posistionMarker.getLatLng();
		this.regService.registrationType = RegistrationType.Sheep;
		this.ttsService.speak(`Registrer ${this.currentMainCategory.name}`);
		this.navController.navigateForward(this.registrationUrl);
	}

	navigateToSummary(): void {
		this.store.dispatch(new SetDateTimeEnded({dateTimeEnded: Date.now(), trackedRoute: this.trackedRoute} as UpdateFieldTripInfoObject));
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

		 this.posistionMarker = L.marker([gpsPosition.coords.latitude, gpsPosition.coords.longitude], {icon: this.posistionIcon}).addTo(this.map);
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

	showConfirmAlert() {
		this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.navigateToSummary);
	}

	ionViewWillLeave(): void {
		this.currentMainCategorySub.unsubscribe();
		this.trackedRouteSub.unsubscribe();
		this.gpsService.setTracking(false);
	}
}
