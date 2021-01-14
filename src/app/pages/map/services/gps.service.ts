import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';


@Injectable({
  providedIn: 'root'
})
export class GpsService {

	private trackedRoute = [];
	private posistionIcon = null;
	private posistionMarker;

	constructor(private geolocation: Geolocation) {	}

	createDefaultMarker() {
		this.posistionIcon = new L.Icon({
			iconUrl: 'assets/icon/marker-icon.png',
			shadowUrl: 'assets/icon/marker-shadow.png',
			iconSize: [25, 41],
 			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize: [41, 41]
		});
		return this.posistionIcon;
	 }

	updateTrackAndPosition(map: L.Map) {
		this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
			this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
			// console.log('Tracked route: ' + JSON.stringify(this.trackedRoute));
			if (this.posistionIcon == null) {
				this.posistionIcon = this.createDefaultMarker();
				this.posistionMarker = L.marker([data.coords.latitude, data.coords.longitude], {icon: this.posistionIcon}).addTo(map);

			} else {
				this.posistionMarker.setLatLng([data.coords.latitude, data.coords.longitude]);
			}
			L.polyline(this.trackedRoute).addTo(map);
		}).catch((error) => {
				console.log('Error getting location', error);
		});
	}
}
