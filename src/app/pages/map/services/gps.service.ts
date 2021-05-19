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
	private MIN_DISTANCE_BETWEEN_COORDS = 10; // In meters
	private MAX_WALKING_SPEED = 4; // In m/s

	private trackedRoute$: BehaviorSubject<Coordinate[]> = new BehaviorSubject<Coordinate[]>([]);
	private lastTrackedPos: Subject<Coordinate> = new Subject();

	private backgroundWatcherId: string;

	constructor() { }

	startGpsTracking(): void {
		this.startBackgroundGpsWatcher();
	}

	stopGpsTracking(): void {
		this.stopBackgroundGpsWatcher();
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
			backgroundMessage: "Cancel to prevent battery drain.",
			backgroundTitle: "Tracking You.",
			requestPermissions: true,
			stale: false,
			distanceFilter: this.MIN_DISTANCE_BETWEEN_COORDS
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
				this.lastTrackedPos.next(newCoordinate);

				if (this.newPositionValid(position)) {
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

	private newPositionValid(pos: Location): boolean {

		if (!pos?.speed) {
			return false;
		}

		if (pos.speed > this.MAX_WALKING_SPEED) {
			return false;
		}

		return true;
	}

	async getCurrentPosition(): Promise<Coordinate> {
		const coord = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
		return { lat: coord.coords.latitude, lng: coord.coords.longitude } as Coordinate;
	}
}
