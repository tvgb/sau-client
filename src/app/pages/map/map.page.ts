import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
	selector: 'app-map',
	templateUrl: './map.page.html',
	styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {

	private map;
	private trackedRoute = []; 
	private readonly OFFLINE_MAP = false;

	constructor(private mapService: MapService, private geolocation: Geolocation) { }

	ngOnInit(): void {

		// This covers Gløshaugen ++++
		const startLat = 63.441702;
		const startLong = 10.343219;
		const endLat = 63.385869;
		const endLong = 10.473667;

		if (this.OFFLINE_MAP) {
			//this.mapService.downloadMapTileArea(startLat, startLong, endLat, endLong);
		}
	}

	updateTrack() {
		const subscription = this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe(data => {
		  if ("coords" in data) {
			this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude})
			console.log("Tracked route: " + JSON.stringify(this.trackedRoute))
			if(this.trackedRoute.length > 1) {
				L.polyline(this.trackedRoute).addTo(this.map)
			}
		  } else {
			console.error("There is a Posisiton Error, no coords in data");
		  }
		})
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
			zoom: 13
		});
		
		console.log("Inside method, check time")
		this.updateTrack();

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
}
