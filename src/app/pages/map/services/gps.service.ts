import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
	private trackedRoute = [];
	private calibrationCoords = [];
	private posistionMarker;
	private CALIBRATION_THRESHOLD = 0.0001;
	private TRACKING_INTERVAL = 10000;
	private RECALIBRATION_INTERVAL = 4000;
	private tracking = true;
	private getInitialPosistion = true;
	private addMarkerAgain;

	private posistionIcon =  new L.Icon({
		iconUrl: 'assets/icon/marker-icon.png',
		shadowUrl: 'assets/icon/marker-shadow.png',
		iconSize: [25, 41],
		 iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize: [41, 41]
	});

	constructor(private geolocation: Geolocation) {	}

	setTracking(trackingStatus: boolean) {
		this.tracking = trackingStatus;
	}

	setAddMarker(addMarkerAgainStatus: boolean) {
		this.addMarkerAgain = addMarkerAgainStatus;
	}

	startTrackingInterval(map: L.Map) {
		// Gets position immediately first time app opens
		if (this.getInitialPosistion) {
			this.updateTrackAndPosition(map);
			this.getInitialPosistion = false;
			this.startTrackingInterval(map);
			return;
		} else if (this.tracking) {
			setTimeout(() => {
				this.updateTrackAndPosition(map);
				this.startTrackingInterval(map);
			}, this.TRACKING_INTERVAL);
		} else {
			return;
		}
	}

	// createDefaultMarker() {
	// 	console.log('Inside createDefaultMarker');
	// 	this.posistionIcon = new L.Icon({
	// 		iconUrl: 'assets/icon/marker-icon.png',
	// 		shadowUrl: 'assets/icon/marker-shadow.png',
	// 		iconSize: [25, 41],
 	// 		iconAnchor: [12, 41],
	// 		popupAnchor: [1, -34],
	// 		tooltipAnchor: [16, -28],
	// 		shadowSize: [41, 41]
	// 	});
	// 	return this.posistionIcon;
	//  }

	/**
	 * Recalibrates position when app has been inactive, waits until stable position
	 */
	recalibratePosition(map: L.Map) {
		console.log('RECALIBRATING POSITION');
		this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
			this.calibrationCoords.push({lat: data.coords.latitude, lng: data.coords.longitude});
			if (this.calibrationCoords.length < 2) {
				setTimeout(() => {
					this.recalibratePosition(map);
				}, this.RECALIBRATION_INTERVAL);
			} else {
				const latDiff = Math.abs(this.calibrationCoords[0].lat - this.calibrationCoords[1].lat);
				const lngDiff = Math.abs(this.calibrationCoords[0].lng - this.calibrationCoords[1].lng);

				if (latDiff < this.CALIBRATION_THRESHOLD && lngDiff < this.CALIBRATION_THRESHOLD) {
					this.updateTrackAndPosition(map);
					this.startTrackingInterval(map);
					this.calibrationCoords = [];
				} else {
					this.calibrationCoords = [];
					setTimeout(() => {
						this.recalibratePosition(map);
					}, this.RECALIBRATION_INTERVAL);
				}
			}
		});
	}

	/**
	 * Updates position on map with marker and line for tracked route
	 */
	updateTrackAndPosition(map: L.Map) {
		if (this.tracking) {
			this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
				this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});

				console.log('SET MARKER AGAIN: ', this.addMarkerAgain);
				if (!this.posistionMarker || this.addMarkerAgain) {
					this.posistionMarker = L.marker([data.coords.latitude, data.coords.longitude], {icon: this.posistionIcon}).addTo(map);
					this.addMarkerAgain = false;
				} else {
					console.log('GPS: ' + JSON.stringify([data.coords.latitude, data.coords.longitude]));
					this.posistionMarker.setLatLng([data.coords.latitude, data.coords.longitude]);
				}
				// if (this.posistionIcon == null) {
				// 	console.log('posistionIcon er null');
				// 	this.posistionIcon = this.createDefaultMarker();
				// 	this.posistionMarker = L.marker([data.coords.latitude, data.coords.longitude], {icon: this.posistionIcon}).addTo(map);
				// } else { this.posistionMarker.setLatLng([data.coords.latitude, data.coords.longitude]); }
				// {smoothFactor: 8}
				L.polyline(this.trackedRoute).addTo(map);
			}).catch((error) => {
					console.log('Error getting location', error);
			});
		}
	}

	getCurrentPosition(): Promise<Geoposition> {
		return this.geolocation.getCurrentPosition();
	}
}
