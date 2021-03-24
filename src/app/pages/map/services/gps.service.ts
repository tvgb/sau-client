import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
	private trackedRoute$: BehaviorSubject<Coordinate[]> = new BehaviorSubject<Coordinate[]>([]);
	private calibrationCoords = [];
	private CALIBRATION_THRESHOLD = 0.0001;
	private TRACKING_INTERVAL = 10000;
	private RECALIBRATION_INTERVAL = 4000;
	private tracking = true;
	private getInitialPosistion = true;
	private lastTrackedPos: Subject<Coordinate> = new Subject();
	private positionsRejected = 0;
	private lastTrackedDateTime: number;

	constructor() { }

	getTracking(): boolean {
		return this.tracking;
	}

	setTracking(trackingStatus: boolean) {
		this.tracking = trackingStatus;
	}

	startTrackingInterval() {
		// Gets position immediately first time app opens
		if (this.getInitialPosistion) {
			this.updateTrackAndPosition();
			this.getInitialPosistion = false;
			this.startTrackingInterval();
			return;
		} else if (this.tracking) {
			setTimeout(() => {
				this.updateTrackAndPosition();
				this.startTrackingInterval();
			}, this.TRACKING_INTERVAL);
		} else {
			return;
		}
	}

	/**
	 * Recalibrates position when app has been inactive, waits until stable position
	 */
	recalibratePosition() {
		Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
			this.calibrationCoords.push({lat: data.coords.latitude, lng: data.coords.longitude});
			if (this.calibrationCoords.length < 2) {
				setTimeout(() => {
					this.recalibratePosition();
				}, this.RECALIBRATION_INTERVAL);
			} else {
				const latDiff = Math.abs(this.calibrationCoords[0].lat - this.calibrationCoords[1].lat);
				const lngDiff = Math.abs(this.calibrationCoords[0].lng - this.calibrationCoords[1].lng);

				if (latDiff < this.CALIBRATION_THRESHOLD && lngDiff < this.CALIBRATION_THRESHOLD) {
					this.updateTrackAndPosition();
					this.startTrackingInterval();
					this.calibrationCoords = [];
				} else {
					this.calibrationCoords = [];
					setTimeout(() => {
						this.recalibratePosition();
					}, this.RECALIBRATION_INTERVAL);
				}
			}
		});
	}

	/**
	 * Updates position on map with marker and line for tracked route
	 */
	updateTrackAndPosition(): void {
		if (this.tracking) {
			Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
				const lat = data.coords.latitude;
				const lng = data.coords.longitude;

				const trackedRoute = this.trackedRoute$.getValue();

				if (trackedRoute.length > 0) {
					const lastTrackedCoord = trackedRoute[trackedRoute.length - 1];
					const secondsBetweenUpdates = (Date.now() - this.lastTrackedDateTime) / 1000;
					const walkingSpeed = this.haversine(new Coordinate(lat, lng), lastTrackedCoord) / secondsBetweenUpdates;

					// console.log('WALKING SPEED:');
					// console.log(walkingSpeed);

					if (this.positionsRejected >= 10 || walkingSpeed < 3) {
						this.positionsRejected = 0;
						this.lastTrackedDateTime = Date.now();
						this.trackedRoute$.next([...this.trackedRoute$.getValue(), new Coordinate(data.coords.latitude, data.coords.longitude)]);
					} else {
						this.positionsRejected++;
					}
				} else {
					this.lastTrackedDateTime = Date.now();
					this.trackedRoute$.next([...this.trackedRoute$.getValue(), new Coordinate(data.coords.latitude, data.coords.longitude)]);
				}

			}).catch((error) => {
				console.log('Error getting location', error);
			});
		}
	}

	haversine(coord1: Coordinate, coord2: Coordinate): number {
		const R = 6371000; // Jordas radius i meter
		const lat1 = coord1.lat * Math.PI / 180;
		const lat2 = coord2.lat * Math.PI / 180;

		const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
		const deltaLng = (coord2.lng - coord1.lng) * Math.PI / 180;

		const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
				  Math.cos(lat1) * Math.cos(lat2) *
				  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	addToTrackedRoute(gpsPos: Coordinate): void {
		this.trackedRoute$.next([...this.trackedRoute$.getValue(), gpsPos]);
	}

	getLastTrackedPosition(): Observable<Coordinate> {
		return this.lastTrackedPos.asObservable();
	}

	getTrackedRoute() {
		return this.trackedRoute$.asObservable();
	}

	resetTrackedRoute() {
		this.trackedRoute$.next([]);
	}

	async getCurrentPosition(): Promise<Coordinate> {
		const coord = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
		return { lat: coord.coords.latitude, lng: coord.coords.longitude } as Coordinate;
	}
}
