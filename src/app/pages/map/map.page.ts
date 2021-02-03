import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Plugins } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

const { App } = Plugins;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})

export class MapPage implements AfterViewInit {
	private registrationUrl = '/registration/register';
	private map;
	private readonly OFFLINE_MAP = false;
	private currentMainCategory: MainCategory;
	private trackedRouteSub: Subscription;

	private posistionIcon =  new L.Icon({
		iconUrl: 'assets/icon/marker-icon.png',
		shadowUrl: 'assets/icon/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize: [41, 41]
	});

	private alertHeader = 'Fullfør oppsynstur';
	private alertMessage = 'Ønsker du å fullføre og lagre denne oppsynsturen?';


	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	currentMainCategorySub: Subscription;
	posistionMarker: any;
	addMarkerAgain: boolean;

	constructor(
		private platform: Platform,
		private statusBarService: StatusbarService,
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private alertService: AlertService,
		private navController: NavController) {
			this.platform.backButton.subscribeWithPriority(5, () => {
				this.navController.navigateBack('/main-menu');
			  });
		}

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(true, false);
		this.trackedRouteSub =  this.gpsService.getTrackedRoute().subscribe((res) => {
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
			this.gpsService.startTrackingInterval(this.map);
		}
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.gpsService.setTracking(true);
			this.initMap();
		});
	}

	navigateToRegistration() {
		this.ttsService.speak(`Registrer ${this.currentMainCategory.name}`);
		this.navController.navigateForward(this.registrationUrl);
	}

	navigateToSummary() {
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

	 	this.gpsService.startTrackingInterval(this.map);

			App.addListener('appStateChange', ({ isActive }) => {
				if (isActive) {
					this.gpsService.setTracking(true);
					this.gpsService.recalibratePosition(this.map);
				} else {
					this.gpsService.setTracking(false);
				}
			  });

			if (this.OFFLINE_MAP) {
				this.initOfflineMap();
			} else {
				L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
				{
					attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
				}).addTo(this.map);
			}
		});
	}

	initOfflineMap(): void {
		L.GridLayer.OfflineMap = L.GridLayer.extend({
			createTile: (coords, done) => {
				const tile = document.createElement('img');

				this.mapService.getTile(coords.z, coords.x, coords.y).then((base64Img) => {
					tile.setAttribute(
						'src', base64Img.data
					);
					done(null, tile);
				}).catch((e) => {
					tile.innerHTML = 'Map not available offline.';
				});
				return tile;
			}
		});
		L.gridLayer.offlineMap = (opts) => {
			return new L.GridLayer.OfflineMap(opts);
		};
		this.map.addLayer( L.gridLayer.offlineMap() );
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
