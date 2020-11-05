import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './services/map.service';
import { GpsService } from './services/gps.service';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TextToSpeechService } from '../registration/services/text-to-speech.service';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { SheepInfoCategory } from 'src/app/shared/classes/SheepInfoCategory';
import { Plugins } from '@capacitor/core';
import 'tts-plugin';

const { TtsPlugin } = Plugins;

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {

	private routeLink = ['/registration/register'];
	private map;
	private readonly OFFLINE_MAP = false;
	private currentSheepInfoCategory: SheepInfoCategory;

	@Select(SheepInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<SheepInfoCategory>;

	currentSheepInfoCategorySub: Subscription;

	constructor(
		private mapService: MapService,
		private gpsService: GpsService,
		private ttsService: TextToSpeechService,
		private router: Router) { }

	ionViewWillEnter(): void {

		this.currentSheepInfoCategorySub = this.currentSheepInfoCategory$.subscribe(res => {
			this.currentSheepInfoCategory = res;
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
			this.initMap();
		});
	}

	navigateToRegistration() {
		// console.log('navigate method');
		// this.ttsService.speak(`Registrer ${this.currentSheepInfoCategory.name}`);
		// this.router.navigate(this.routeLink);


		console.log('GETTING COTACTS!');
		TtsPlugin.getContacts('some filter').then((res) => {
			console.log(res);
		});

	}

	initMap(): void {
		// Coordinates for the middle of Gløshaugen
		const lat = 63.418604;
		const lng = 10.402832;

		this.map = L.map('map', {
			center: [ lat, lng ],
			zoom: 16
		});

		this.gpsService.updateTrack(this.map);

		if (this.OFFLINE_MAP) {
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
		} else {
			L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
			{
				attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
			}).addTo(this.map);
		}
	}

	ionViewWillLeave(): void {
		this.currentSheepInfoCategorySub.unsubscribe();
	}
}
