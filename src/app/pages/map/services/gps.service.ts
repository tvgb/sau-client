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
	private MIN_DISTANCE_BETWEEN_COORDS = 30; // In meters
	private MAX_WALKING_SPEED = 4; // In m/s
	private tracking = true;
	private getInitialPosistion = true;
	private lastTrackedPos: Subject<Coordinate> = new Subject();
	private lastPos$: Subject<any> = new Subject();
	private gpsWatchId: string;
	private prevStoredPos: any;
	private skippedGpsPosCount = 0;
	private lastPos: any;


	constructor() { }

	getTracking(): boolean {
		return this.tracking;
	}

	setTracking(trackingStatus: boolean) {
		this.tracking = trackingStatus;
	}

	startWatchPosition(): void {
		this.gpsWatchId = Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
			if (err) {
				console.log(`Error occured while getting GPS position: ${err.message}`);
				return;
			}

			if (position) {
				if (this.lastPos) {
					const timeDiff = (position.timestamp - this.lastPos.timestamp) / 1000;
					const distance = this.getDistanceBetweenCoords(
						new Coordinate(position.coords.latitude, position.coords.longitude),
						new Coordinate(this.lastPos.coords.latitude, this.lastPos.coords.longitude)
					);

					console.log(`Sekunder mellom: ${timeDiff} s | Meter mellom: ${distance} m`);
					this.lastPos$.next(position);
				}
				this.lastPos = position;
				this.lastTrackedPos.next(new Coordinate(position.coords.latitude, position.coords.longitude));
			}

			if (this.skippedGpsPosCount >= 100) {
				this.skippedGpsPosCount = 0;
				this.prevStoredPos = null;
			}

			if (this.newPositionIsInvalid(position, this.prevStoredPos)) {
				this.skippedGpsPosCount++;
			} else if (position) {
				this.prevStoredPos = position;
				this.trackedRoute$.next([...this.trackedRoute$.getValue(), new Coordinate(position.coords.latitude, position.coords.longitude)]);
			}
		});
	}

	stopWatchPosition(): void {
		if (this.gpsWatchId) {
			this.lastPos = null;
			Geolocation.clearWatch({ id: this.gpsWatchId });
		}
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

	getPos(): Observable<any> {
		return this.lastPos$.asObservable();
	}

	/**
	 * Updates position on map with marker and line for tracked route
	 */
	updateTrackAndPosition(): void {
		if (this.tracking) {
			Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((data) => {
				this.trackedRoute$.next([...this.trackedRoute$.getValue(), new Coordinate(data.coords.latitude, data.coords.longitude)]);
			}).catch((error) => {
				console.log('Error getting location', error);
			});
		}
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

	private newPositionIsInvalid(currentPos: any, prevPos: any): boolean {
		if (!currentPos) {
			return true;
		}

		if (!prevPos) {
			return false;
		}

		const coord1 = new Coordinate(currentPos.coords.latitude, currentPos.coords.longitude);
		const coord2 = new Coordinate(prevPos.coords.latitude, prevPos.coords.longitude);
		const distanceBetweenCoords = this.getDistanceBetweenCoords(coord1, coord2); // In meters
		const timeBetweenCords = (currentPos.timestamp - prevPos.timestamp) / 1000; // In seconds

		if (distanceBetweenCoords < this.MIN_DISTANCE_BETWEEN_COORDS) {
			return true;
		}

		const walkingSpeed = distanceBetweenCoords / timeBetweenCords; // In m/s

		if (walkingSpeed > this.MAX_WALKING_SPEED) {
			return true;
		}

		return false;
	}

	getDistanceBetweenCoords(coord1: Coordinate, coord2: Coordinate): number {
		const lat1 = coord1.lat;
		const lon1 = coord1.lng;
		const lat2 = coord2.lat;
		const lon2 = coord2.lng;

		const R = 6371e3; // metres
		const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
		const φ2 = lat2 * Math.PI / 180;
		const Δφ = (lat2 - lat1) * Math.PI / 180;
		const Δλ = (lon2 - lon1) * Math.PI / 180;

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
				Math.cos(φ1) * Math.cos(φ2) *
				Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const d = R * c; // in metres

		return d;
	}

	async getCurrentPosition(): Promise<Coordinate> {
		const coord = await Geolocation.getCurrentPosition({enableHighAccuracy: false});
		return { lat: coord.coords.latitude, lng: coord.coords.longitude } as Coordinate;
	}
}
