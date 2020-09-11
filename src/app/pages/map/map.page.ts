import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';


@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {

	private map;

	constructor(private mapService: MapService) { }

	ngOnInit(): void {

		// This covers Gløshaugen ++
		const startLat = 63.427299;
		const startLong = 10.375893;
		const endLat = 63.409592;
		const endLong = 10.429605;

		this.mapService.downloadMapTileArea(startLat, startLong, endLat, endLong);
	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	initMap(): void {

		// Coordinates for the middle of Gløshaugen
		const lat = 63.418604;
		const lng = 10.402832;

		this.map = L.map('map', {
			center: [ lat, lng ],
			zoom: 15
		});

		L.GridLayer.OfflineMap = L.GridLayer.extend({
			createTile: (coords, done) => {
				const tile = document.createElement('img');

				this.mapService.getTile(coords.x, coords.y, coords.z).then((base64Img) => {
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
}
