import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapOptions, latLng, tileLayer, Map, popup, marker, icon, Path } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapService } from './map.servive';
import { FilesystemDirectory } from '@capacitor/core';


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit{

	options: MapOptions;
	map: Map;

	constructor(private geolocation: Geolocation, private mapService: MapService) {

		// This covers Gløshaugen
		const startLat = 63.422395;
		const startLong = 10.392414;
		const endLat = 63.413913;
		const endLong = 10.413799;

		// this.mapService.downloadMapTileArea(startLat, startLong, endLat, endLong);

	}

	ngOnInit(): void {
		this.initializeMapOptions();
	}

	ngAfterViewInit(): void {
	}

	onMapReady(map: Map): void {
		setTimeout(() => {
			map.invalidateSize();
			this.map = map;

		}, 100);
	}

	private initializeMapOptions() {

		.tileLayer.

		this.geolocation.getCurrentPosition().then((resp) => {
			this.options = {
				center: latLng(resp.coords.latitude, resp.coords.longitude),
				zoom: 13,
				layers: [
					tileLayer(
						`${FilesystemDirectory.Documents}/{x}/{y}/{z}/imagetile.png`, // 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
						{
							maxZoom: 18,
							attribution: 'Map data © OpenStreetMap contributors'
					}),
					marker(latLng(resp.coords.latitude, resp.coords.longitude), {
						icon: icon({
							iconSize: [ 25, 41 ],
							iconAnchor: [ 13, 41 ],
							iconUrl: 'assets/marker-icon.png',
							shadowUrl: 'assets/marker-shadow.png'
						})
					})
				]
			};
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

}
