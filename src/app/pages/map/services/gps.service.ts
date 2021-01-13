import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';



@Injectable({
  providedIn: 'root'
})
export class GpsService {

	private trackedRoute = [];
	private posistionMarker = null;

	constructor(private geolocation: Geolocation) {	}

	createDefaultMarker() {
		this.posistionMarker = new L.Icon({
			iconUrl: 'assets/icon/marker-icon.png',
			shadowUrl: 'assets/icon/marker-shadow.png',
			iconSize: [25, 41],
 			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize: [41, 41]
		});
		return this.posistionMarker
 	}

	updateTrackAndPosition(map: L.Map) {
		this.geolocation.getCurrentPosition().then((data) => {
			this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
			console.log('Tracked route: ' + JSON.stringify(this.trackedRoute));
			if(this.posistionMarker == null) {
				this.posistionMarker = this.createDefaultMarker();
			}
			L.marker([data.coords.latitude, data.coords.longitude], {icon: this.posistionMarker}).addTo(map);
			L.polyline(this.trackedRoute).addTo(map);
		}).catch((error) => {
				console.log('Error getting location', error);
		});
	}
}
