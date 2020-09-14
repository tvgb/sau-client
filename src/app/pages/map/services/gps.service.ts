import { Injectable } from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

	private trackedRoute = [];

	constructor(private geolocation: Geolocation) {	}

	 updateTrack(): any {
		this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe(data => {
			if ('coords' in data) {
				this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
				console.log('Tracked route: ' + JSON.stringify(this.trackedRoute));
				if (this.trackedRoute.length === 1) {
					this.updateTrack();
				}
				else if (this.trackedRoute.length > 1) {
					return this.trackedRoute;
				}
			} else {
				console.error('There is a Posisiton Error, no coords in data');
			}
		});
	 }
}
