import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

	private trackedRoute = [];

	constructor(private geolocation: Geolocation) {	}

	 updateTrack(map: L.Map) {
		this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe(data => {
			if ('coords' in data) {
				this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
				// console.log('Tracked route: ' + JSON.stringify(this.trackedRoute));
				L.polyline(this.trackedRoute).addTo(map);
			} else {
				console.error('There is a Posisiton Error, no coords in data');
			}
		});
	 }
}
