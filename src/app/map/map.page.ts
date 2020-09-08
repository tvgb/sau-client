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

		// This covers Gløshaugen
		const startLat = 63.427299;
		const startLong = 10.375893;
		const endLat = 63.409592;
		const endLong = 10.429605;

		// this.mapService.downloadMapTileArea(startLat, startLong, endLat, endLong);
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

		const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		L.GridLayer.DebugCoords = L.GridLayer.extend({
			createTile: (coords, done) => {
				const tile = document.createElement('img');

				console.log(coords);

				this.mapService.getTileTest(coords.x, coords.y, coords.z).then(base64Img => {
					tile.setAttribute(
						'src', base64Img.data
					);
					done(null, tile);

				});
				return tile;
			}
		});

		L.gridLayer.debugCoords = (opts) => {
			return new L.GridLayer.DebugCoords(opts);
		};

		this.map.addLayer( L.gridLayer.debugCoords() );

		// L.TileLayer.Kitten = L.TileLayer.extend({
		// 	getTileUrl: (coords) => {
		// 		const i = Math.ceil( Math.random() * 4 );
		// 		return 'https://placekitten.com/256/256?image=' + i;
		// 	},
		// 	getAttribution: () =>  {
		// 		return '<a href="https://placekitten.com/attribution.html">PlaceKitten</a>';
		// 	}
		// });

		// L.tileLayer.kitten = () => {
		// 	return new L.TileLayer.Kitten();
		// };

		// L.tileLayer.kitten().addTo(this.map);

		// tiles.addTo(this.map);
	}
}
