import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GpsService {

	private trackedRoute = [];
	private calibrationCoords = [];
	private posistionIcon = null;
	private posistionMarker;
	private CALIBRATION_LIMIT = 0.0001;
	private TIMEOUT = 10000;
	private tracking = true;
	private getInitialPosistion = true;

	constructor(private geolocation: Geolocation) {	}

	setTracking(trackingStatus: boolean) {
		this.tracking = trackingStatus;
	}

	startTrackingInterval(map: L.Map) {
		console.log('Starting tracking interval');
		if (this.getInitialPosistion) {
			this.updateTrackAndPosition(map);
			this.getInitialPosistion = false;
			this.startTrackingInterval(map);
		}
		else if (this.tracking) {
			setTimeout(() => {
				console.log('hello kimia');
				this.updateTrackAndPosition(map);
				this.startTrackingInterval(map);
			}, this.TIMEOUT);
		}
		else {
			return;
		}
	}

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

	/**
	 * Recalibrates position when app has been inactive, waits until stable position
	 */
	recalibratePosition(map: L.Map) {
		this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
			this.calibrationCoords.push({lat: data.coords.latitude, lng: data.coords.longitude});
			console.log('CALIBRATION COORDS LENTGH: ' + this.calibrationCoords.length);
			if (this.calibrationCoords.length < 2) {
				setTimeout(() => {
					this.recalibratePosition(map);
				}, 3000);
			} else {
				const latDiff = Math.abs(this.calibrationCoords[0].lat - this.calibrationCoords[1].lat);
				const lngDiff = Math.abs(this.calibrationCoords[0].lng - this.calibrationCoords[1].lng);
				console.log('DIFF: ' + latDiff + ' ' + lngDiff);

				if (latDiff < this.CALIBRATION_LIMIT && lngDiff < this.CALIBRATION_LIMIT) {
					console.log('CALIBRATION DONE');
					this.updateTrackAndPosition(map);
					this.startTrackingInterval(map);
				} else {
					this.calibrationCoords = [];
					setTimeout(() => {
						this.recalibratePosition(map);
					}, 3000);
				}
			}
		});
	}

	/**
	 * Updates position on map with marker and line for tracked route
	 */
	updateTrackAndPosition(map: L.Map) {
		this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
			this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
			console.log('Tracked route: ' + JSON.stringify(this.trackedRoute));
			if (this.posistionIcon == null) {
				this.posistionIcon = this.createDefaultMarker();
				this.posistionMarker = L.marker([data.coords.latitude, data.coords.longitude], {icon: this.posistionIcon}).addTo(map);

			} else {
				this.posistionMarker.setLatLng([data.coords.latitude, data.coords.longitude]);
			}
			// {smoothFactor: 8}
			L.polyline(this.trackedRoute).addTo(map);
		}).catch((error) => {
				console.log('Error getting location', error);
		});
	}
}
