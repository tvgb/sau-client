import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Router } from '@angular/router';
import { Select, UpdateState } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { MainCategory } from 'src/app/shared/classes/Category';
import { Plugins, StatusBarStyle, AppState } from '@capacitor/core';

const { StatusBar, App } = Plugins;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})

export class MapPage implements AfterViewInit {
	private routeLink = ['/registration/register'];
	private map;
	private readonly OFFLINE_MAP = true;
	private currentMainCategory: MainCategory;


	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	currentMainCategorySub: Subscription;

	constructor(
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private router: Router) { }


	changeStatusBar(): void {
		StatusBar.setOverlaysWebView({
			overlay: true
		});
		StatusBar.setStyle({
			style: StatusBarStyle.Light
		});
	}

	ionViewWillEnter(): void {
		this.changeStatusBar();
		this.currentMainCategorySub = this.currentMainCategory$.subscribe(res => {
			this.currentMainCategory = res;
		});
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	navigateToRegistration() {
		this.ttsService.speak(`Registrer ${this.currentMainCategory.name}`);
		this.router.navigate(this.routeLink);
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

	ionViewWillLeave(): void {
		this.currentMainCategorySub.unsubscribe();
	}
}
