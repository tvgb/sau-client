import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { Coordinate } from 'src/app/shared/classes/Coordinate';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
	private trackedRoute = [];
	private trackedRoute$: BehaviorSubject<Coordinate[]> = new BehaviorSubject<Coordinate[]>([]);
	private calibrationCoords = [];
	private posistionMarker;
	private CALIBRATION_THRESHOLD = 0.0001;
	private TRACKING_INTERVAL = 10000;
	private RECALIBRATION_INTERVAL = 4000;
	private tracking = true;
	private getInitialPosistion = true;
	private addMarkerAgain;


	constructor(private geolocation: Geolocation) {	}

	getTracking(): boolean {
		return this.tracking;
	}

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

	/**
	 * Recalibrates position when app has been inactive, waits until stable position
	 */
	recalibratePosition(map: L.Map) {
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
				// this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
				this.trackedRoute$.next([...this.trackedRoute$.getValue(), new Coordinate(data.coords.latitude, data.coords.longitude)]);
				// {smoothFactor: 8}
				// L.polyline(this.trackedRoute).addTo(map);
			}).catch((error) => {
					console.log('Error getting location', error);
			});
		}
	}

	getTrackedRoute() {
		return this.trackedRoute$.asObservable();
	}

	getCurrentPosition(): Promise<Geoposition> {
		return this.geolocation.getCurrentPosition();
	}
}
