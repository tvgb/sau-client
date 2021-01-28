import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';

const { StatusBar, App } = Plugins;

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


	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	currentMainCategorySub: Subscription;

	constructor(
		private platform: Platform,
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private navController: NavController) {
			this.platform.backButton.subscribeWithPriority(5, () => {
				this.navController.navigateBack('/main-menu');
			  });
		}

	changeStatusBar(): void {
		StatusBar.setOverlaysWebView({
			overlay: true
		});
		StatusBar.setStyle({
			style: StatusBarStyle.Light
		});
	}

	ionViewWillEnter(): void {
		if (!this.gpsService.getTracking()) {
			this.gpsService.setTracking(true);
			this.gpsService.startTrackingInterval(this.map);
		}

		this.changeStatusBar();
		this.currentMainCategorySub = this.currentMainCategory$.subscribe(res => {
			this.currentMainCategory = res;
		});
		// This covers Gløshaugen ++++
		// const startLat = 63.433167;
		// const startLong =  10.358562;
		// const endLat = 63.400195;
		// const endLong = 10.445320;

		// This covers Gløshaugen +
		const startLat = 63.423846;
		const startLong =  10.387870;
		const endLat = 63.412948;
		const endLong = 10.417666;

		// This covers Gløshaugen
		// const startLat = 63.422297;
		// const startLong =  10.394725;
		// const endLat = 63.413847;
		// const endLong = 10.415751;

		if (this.OFFLINE_MAP) {
			this.mapService.downloadMapTileArea(startLat, startLong, endLat, endLong);
		}
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.gpsService.setTracking(true);
			this.gpsService.setAddMarker(true);
			this.initMap();
		});
	}

	navigateToRegistration() {
		this.ttsService.speak(`Registrer ${this.currentMainCategory.name}`);
		this.navController.navigateForward(this.registrationUrl);
	}

	initMap(): void {
		this.gpsService.getCurrentPosition().then(gpsPosition => {
			this.map = L.map('map', {
				center: [gpsPosition.coords.latitude, gpsPosition.coords.longitude],
				zoom: 12,
				zoomControl: false,
				attributionControl: false
			});
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
				L.GridLayer.OfflineMap = L.GridLayer.extend({
					createTile: (coords, done) => {
						const tile = document.createElement('img');

						const mapName = 'testMap1';

						this.mapService.getTile(mapName, coords.z, coords.x, coords.y).then((base64Img) => {
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
			} else {
				L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
				{
					attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
				}).addTo(this.map);
			}
		});
	}

	ionViewWillLeave(): void {
		this.currentMainCategorySub.unsubscribe();
		this.gpsService.setTracking(false);
	}
}
