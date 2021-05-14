import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin, Location, CallbackError, WatcherOptions} from '@capacitor-community/background-geolocation';
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class GpsService {
	private MIN_DISTANCE_BETWEEN_COORDS = 25; // In meters
	private MAX_WALKING_SPEED = 20; // In m/s

	private trackedRoute$: BehaviorSubject<Coordinate[]> = new BehaviorSubject<Coordinate[]>([]);
	private lastTrackedPos: Subject<Coordinate> = new Subject();

	private prevStoredCoordinateTime: number;
	private prevStoredCoordinate: Coordinate;

	private watcherId: string;
	private backgroundWatcherId: string;
	private appHandler: any;


	private backgroundPositions: Coordinate[] = [];

	constructor(private platform: Platform) { }

	async startGpsTracking(): Promise<void> {
		this.startGpsWatcher();
		this.appHandler = await App.addListener('appStateChange', status => {
			if (this.watcherId || this.backgroundWatcherId) {
				if (status.isActive) {
					if (!this.platform.is('mobileweb')) {
						this.stopBackgroundGpsWatcher();
					}
					this.startGpsWatcher();
				} else {
					this.stopGpsWatcher();
					if (!this.platform.is('mobileweb')) {
						this.startBackgroundGpsWatcher();
					}
				}
			}
		});
	}

	stopGpsTracking(): void {
		this.stopGpsWatcher();
		this.appHandler.remove();
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

	private startBackgroundGpsWatcher(): void {

		const watcherOptions = {
			backgroundMessage: 'Cancel to prevent battery drain.',
			backgroundTitle: 'Tracking You.',
			requestPermissions: true,
			stale: false,
			distanceFilter: 5
		} as WatcherOptions;

		BackgroundGeolocation.addWatcher(watcherOptions, (position: Location, error: CallbackError) => {
			if (error) {
				if (error.code === 'NOT_AUTHORIZED') {
					if (window.confirm('This app needs your location, but does not have permission \n\n Open settings now?')) {
						BackgroundGeolocation.openSettings();
					}
				}
				return console.error(error);
			}

			if (position) {
				const newCoordinate = new Coordinate(position.latitude, position.longitude);
				this.backgroundPositions.push(newCoordinate);
				this.lastTrackedPos.next(newCoordinate);

				if (this.newPositionValid(newCoordinate, position.time, this.prevStoredCoordinate)) {
					this.prevStoredCoordinate = newCoordinate;
					this.prevStoredCoordinateTime = position.time;
					this.trackedRoute$.next([...this.trackedRoute$.getValue(), newCoordinate]);
				}
			}

		}).then((watcherId) => {
			this.backgroundWatcherId = watcherId;
		});
	}

	private stopBackgroundGpsWatcher(): void {
		if (this.backgroundWatcherId) {
			BackgroundGeolocation.removeWatcher({ id: this.backgroundWatcherId }).then(() => {
				this.backgroundWatcherId = null;
			});
		}
	}


	private startGpsWatcher(): void {
		const positionOptions = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 0
		} as PositionOptions;

		Geolocation.watchPosition(positionOptions, (position: Position, err?: any) => {

			if (err) {
				if (err.code === 'NOT_AUTHORIZED') {
					if (window.confirm('This app needs your location, but does not have permission \n\n Open settings now?')) {
						BackgroundGeolocation.openSettings();
					}
				}
				return console.error(err);
			}

			if (position) {
				const newCoordinate = new Coordinate(position.coords.latitude, position.coords.longitude);

				this.lastTrackedPos.next(newCoordinate);

				if (this.newPositionValid(newCoordinate, position.timestamp, this.prevStoredCoordinate)) {
					this.prevStoredCoordinate = newCoordinate;
					this.prevStoredCoordinateTime = position.timestamp;
					this.trackedRoute$.next([...this.trackedRoute$.getValue(), newCoordinate]);
				}
			}

		}).then((watcherId) => {
			if (watcherId) {
				this.watcherId = watcherId;
			}
		});
	}

	private stopGpsWatcher(): void {
		if (this.watcherId) {
			Geolocation.clearWatch({ id: this.watcherId }).then(() => {
				this.watcherId = null;
			});
		}
	}

	private newPositionValid(currentPos: Coordinate, currentPosTime: number, prevPos: Coordinate): boolean {
		if (!prevPos) {
			return true;
		}

		const distanceBetweenCoords = this.getDistanceBetweenCoords(currentPos, prevPos); // In meters
		const timeBetweenCords = (currentPosTime - this.prevStoredCoordinateTime) / 1000; // In seconds

		if (distanceBetweenCoords < this.MIN_DISTANCE_BETWEEN_COORDS) {
			return false;
		}

		const walkingSpeed = distanceBetweenCoords / timeBetweenCords; // In m/s

		if (walkingSpeed > this.MAX_WALKING_SPEED) {
			return false;
		}

		return true;
	}

	private getDistanceBetweenCoords(coord1: Coordinate, coord2: Coordinate): number {
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
		const coord = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
		return { lat: coord.coords.latitude, lng: coord.coords.longitude } as Coordinate;
	}
}
