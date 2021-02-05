import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { FilesystemDirectory, FilesystemEncoding, Filesystem, FileReadResult, StatResult, RmdirResult, FileWriteResult } from '@capacitor/core';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { DownloadProgressionData } from 'src/app/shared/classes/DownloadProgressionData';
import { v4 as uuidv4 } from 'uuid';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { GpsService } from './gps.service';
import { Plugins } from '@capacitor/core';

const { LocalNotifications, BackgroundTask, App} = Plugins;

@Injectable({
	providedIn: 'root'
})
export class MapService {
	private readonly ZOOM_LEVELS = [12];
	private readonly DOWNLOAD_DELAY = 200;
	private readonly FILESYSTEM_DIRECTORY = FilesystemDirectory.External;
	private readonly MAX_HTTP_RETRIES = 5;
	private readonly MAP_TILE_NAME = 'mapTile.b64';
	private downloads: BehaviorSubject<DownloadProgressionData[]> = new BehaviorSubject([] as DownloadProgressionData[]);
	private mapsUpdated$: Subject<any> = new Subject();
	private mapId: string;
	private lastTrackedPosition: Coordinate;
	private appActive = true;
	private stopDownloads = false;

	private readonly BASE_URLS = [
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache2.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache3.statkart.no/gatekeeper/gk/gk.open_gmaps',
	];

	private readonly MAP_LAYER = 'norges_grunnkart';

	constructor(private http: HttpClient, private gpsService: GpsService) {
		App.addListener('appStateChange', (state) => {
			this.appActive = state.isActive;
			this.stopDownloads = true;
			this.mapsUpdated$.next();
		});

		LocalNotifications.requestPermission();

		gpsService.getLastTrackedPosition().subscribe(pos => {
			if (pos) {
				this.lastTrackedPosition = pos;
				this.setOfflineMapId(this.lastTrackedPosition);
			}
		});

		this.finishDownloadingAndDeleting();
	}

	getMaxZoom(): number {
		return this.ZOOM_LEVELS.sort()[this.ZOOM_LEVELS.length - 1];
	}

	getMinZoom(): number {
		return this.ZOOM_LEVELS.sort()[0];
	}

	getZoomLevels(): number[] {
		return this.ZOOM_LEVELS;
	}

	async getTile(z: number, x: number, y: number): Promise<FileReadResult> {
		if (!this.mapId) {
			await this.gpsService.getCurrentPosition().then(async (pos) => {
				await this.setOfflineMapId({lat: pos.coords.latitude, lng: pos.coords.longitude});
			});
		}
		const img = this.readFile(`maps/${this.mapId}/mapTiles/${z}/${x}/${y}/${this.MAP_TILE_NAME}`);

		return img;
	}

	async startMapTileAreaDownload(offlineMapMetaData: OfflineMapMetaData) {
		this.stopDownloads = false;
		offlineMapMetaData = await this.downloadMapTileArea(offlineMapMetaData);

		if (!offlineMapMetaData.downloadFinished) {
			this.stopDownloads = false;
			const taskId = BackgroundTask.beforeExit(async () => {
				offlineMapMetaData = await this.downloadMapTileArea(offlineMapMetaData);

				BackgroundTask.finish({
					taskId
				});
			});
		}
	}

	/**
	 * startLat and startLng needs to be north west, while endLat and endLng needs to be south east.
	 */
	private async downloadMapTileArea(offlineMapMetaData: OfflineMapMetaData): Promise<OfflineMapMetaData> {
		const startPos = offlineMapMetaData.startPos;
		const endPos = offlineMapMetaData.endPos;

		if (!offlineMapMetaData.id) {
			offlineMapMetaData.id = uuidv4();
			offlineMapMetaData.name = `Nytt kart - ${new Date().toLocaleDateString()}`;
			offlineMapMetaData = await this.saveMapMetaData(offlineMapMetaData);
			this.mapsUpdated$.next();
		}

		this.downloads.next([...this.downloads.getValue(), ({
			totalTiles: this.getTotalTiles(startPos, endPos),
			downloadedTiles: 0,
			offlineMapMetaData
		} as DownloadProgressionData)]);

		const mapId = offlineMapMetaData.id;

		let currentUrl = 0;

		for (const z of this.ZOOM_LEVELS) {
			const startXY = this.getTileCoordinates(startPos, z);
			const endXY = this.getTileCoordinates(endPos, z);
			const startX = startXY[0];
			const startY = startXY[1];
			const endX = endXY[0];
			const endY = endXY[1];

			for (let x = startX; x <= endX; x++) {
				for (let y = startY; y <= endY; y++) {
					if (this.stopDownloads) {
						return offlineMapMetaData;
					}

					if (!(await this.TileExists(mapId, z, x, y))) {
						this.downloadTile(mapId, z, x, y, this.BASE_URLS[currentUrl]);

						if (currentUrl < 2) {
							currentUrl++;
						} else {
							currentUrl = 0;
							await new Promise(r => setTimeout(r, this.DOWNLOAD_DELAY));
						}
					}

					this.downloads.next([...this.downloads.getValue().map((d) => {
						if (d.offlineMapMetaData.id === mapId) {
							d.downloadedTiles++;
						}

						return d;
					})]);
				}
			}
		}

		offlineMapMetaData.name = (await this.getOfflineMapMetaData(mapId)).name;
		offlineMapMetaData.downloadFinished = true;
		offlineMapMetaData.downloadDate = Date.now();
		await this.saveMapMetaData(offlineMapMetaData, true);
		this.mapsUpdated$.next();
		this.downloads.next([...this.downloads.getValue().filter(d => d.offlineMapMetaData.id !== mapId)]);
		this.showDownloadFinishedNotification(offlineMapMetaData.name);
		return offlineMapMetaData;
	}

	async changeMapName(mapId: string, newMapName: string): Promise<FileWriteResult> {
		const offlineMapMetaData = await this.getOfflineMapMetaData(mapId);
		offlineMapMetaData.name = newMapName;
		return this.updateOfflineMapMetaData(mapId, offlineMapMetaData);
	}

	async updateOfflineMap(mapId: string) {
		const offlineMapMetaData = await this.getOfflineMapMetaData(mapId);
		await this.deleteOfflineMap(mapId);
		await this.downloadMapTileArea(offlineMapMetaData);
	}

	mapsUpdated(): Observable<any> {
		return this.mapsUpdated$.asObservable();
	}

	async getOfflineMapsMetaData(): Promise<OfflineMapMetaData[]> {

		let offlineMapsMetaData: OfflineMapMetaData[];

		await Filesystem.readdir({
			directory: this.FILESYSTEM_DIRECTORY,
			path: 'maps/'
		}).then(async res => {
			offlineMapsMetaData = [];
			if (res) {
				for (const path of res.files) {
					await Filesystem.readFile({
						directory: this.FILESYSTEM_DIRECTORY,
						path: `maps/${path}/metaData`
					}).then(metaData => {
						if (metaData) {
							offlineMapsMetaData.push(metaData.data as unknown as OfflineMapMetaData);
						}
					});
				}
			}
		}).catch(() => {
			offlineMapsMetaData = [];
		});

		return offlineMapsMetaData;
	}

	async getOfflineMapMetaData(mapId: string): Promise<OfflineMapMetaData> {
		return await Filesystem.readFile({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `maps/${mapId}/metaData`
		}).then(metaData => {
			if (metaData) {
				return metaData.data as unknown as OfflineMapMetaData;
			}
		});
	}

	async deleteOfflineMap(mapId: string): Promise<RmdirResult> {
		const offlineMapMetaData = await this.getOfflineMapMetaData(mapId);
		offlineMapMetaData.deleted = true;
		await this.updateOfflineMapMetaData(mapId, offlineMapMetaData);

		return Filesystem.rmdir({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `maps/${mapId}/mapTiles`,
			recursive: true
		}).then(() => {
			return Filesystem.rmdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path: `maps/${mapId}`,
				recursive: true
			});
		});
	}

	async saveMapMetaData(offlineMapMetaData: OfflineMapMetaData, saveSize: boolean = false): Promise<OfflineMapMetaData> {

		const mapSize = saveSize ? await this.getMapSize([offlineMapMetaData.id]) : 0;
		offlineMapMetaData.size = mapSize;

		const data: any = offlineMapMetaData;

		await Filesystem.writeFile({
			path: `maps/${offlineMapMetaData.id}/metaData/`,
			data,
			directory: this.FILESYSTEM_DIRECTORY,
			encoding: FilesystemEncoding.UTF8,
			recursive: true
		});

		return offlineMapMetaData;
	}

	getCurrentlyDownloading(): Observable<DownloadProgressionData[]> {
		return this.downloads.asObservable();
	}

	private async setOfflineMapId(currentGpsPos: Coordinate): Promise<any> {
		let bestCandidateId: string;
		let shortestDistance = Number.MAX_VALUE;
		const offlineMapsMetaData = await this.getOfflineMapsMetaData();

		for (const metaData of offlineMapsMetaData) {
			if (!this.coordInsideMap(currentGpsPos, metaData.startPos, metaData.endPos)) {
				continue;
			}

			const center = this.getMapCenterCoords(metaData.startPos, metaData.endPos);
			const distanceToCurrentGpsCoord = this.getDistanceBetweenCoords(currentGpsPos, center);
			if (distanceToCurrentGpsCoord < shortestDistance) {
				bestCandidateId = metaData.id;
				shortestDistance = distanceToCurrentGpsCoord;
			}
		}

		this.mapId = bestCandidateId;

		const promise = new Promise((resolve, reject) => {
			if (bestCandidateId) {
				resolve(bestCandidateId);
			} else {
				reject('No offline map suitable.');
			}
		});

		return promise;
	}

	private coordInsideMap(pos: Coordinate, startPos: Coordinate, endPos: Coordinate): boolean {
		return pos.lat < startPos.lat && pos.lat > endPos.lat && pos.lng > startPos.lng && pos.lng < endPos.lng;
	}

	private getDistanceBetweenCoords(coord1: Coordinate, coord2: Coordinate): number {
		const a = coord1.lng - coord2.lng;
		const b = coord1.lat - coord2.lat;
		return Math.sqrt((a * a) + (b * b));
	}

	private getMapCenterCoords(startPos: Coordinate, endPos: Coordinate): Coordinate {
		const verticalCentar = startPos.lat - endPos.lat;
		const horizontalCenter = startPos.lng - endPos.lng;

		return {lat: verticalCentar, lng: horizontalCenter};
	}

	private async readFile(path: string): Promise<FileReadResult> {
		const contents = await Filesystem.readFile({
			path,
			directory: this.FILESYSTEM_DIRECTORY,
			encoding: FilesystemEncoding.UTF8
		});
		return contents;
	}

	private async writeFile(mapId: string, data: any, z: number, x: number, y: number): Promise<void> {
		await Filesystem.stat({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `maps/${mapId}/mapTiles/${z}/${x}/${y}/${this.MAP_TILE_NAME}`
		}).catch(() => {
			return Filesystem.writeFile({
				path: `maps/${mapId}/mapTiles/${z}/${x}/${y}/${this.MAP_TILE_NAME}`,
				data,
				directory: this.FILESYSTEM_DIRECTORY,
				encoding: FilesystemEncoding.UTF8,
				recursive: true
			});
		});
	}

	private downloadTile(mapId: string, z: number, x: number, y: number, baseUrl: string): void {

		this.http.get(`${baseUrl}?layers=${this.MAP_LAYER}&zoom=${z}&x=${x}&y=${y}`,
		{
			responseType: 'blob'
		}).pipe(
			this.delayedRetry(5000, 5),
			catchError(err => {
				console.log(err);
				return EMPTY;
			})
		).subscribe(
			(res) => {
				const reader = new FileReader();
				reader.readAsDataURL(res);

				// Convert tile to base64 image
				reader.onloadend = async () => {

					// Number of retries
					let retries = 5;

					// Retry incase of error
					while (retries > 0) {
						await this.writeFile(mapId, reader.result, z, x, y).then(() => {
							retries = 0;
						}).catch((e) => {
							// console.log('Failed while writing to file:', retries, z, x, y, e);
						});

						retries--;
					}
				};
			}
		);
	}

	/**
	 * Returns true if file exists and false if not.
	 *
	 * @param z zoom of tile
	 * @param x x pos of tile
	 * @param y y pos of tile
	 */
	private async TileExists(mapId: string, z: number, x: number, y: number): Promise<boolean> {

		let stat: StatResult;

		try {
			stat = await Filesystem.stat({
				directory: this.FILESYSTEM_DIRECTORY,
				path: `maps/${mapId}/mapTiles/${z}/${x}/${y}/${this.MAP_TILE_NAME}`
			});
		} catch (e) {
			stat = null;
		}

		return stat === null ? false : true;
	}

	private getTileCoordinates(pos: Coordinate, zoom: number): [number, number] {
		const latRad = pos.lat * ( Math.PI / 180 );
		const n = Math.pow(2.0, zoom);
		const xTile = Math.round((pos.lng + 180.0) / 360.0 * n);
		const yTile = Math.round((1.0 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2.0 * n);
		return [xTile, yTile];
	}

	private updateOfflineMapMetaData(mapId: string, offlineMapMetaData: OfflineMapMetaData): Promise<FileWriteResult> {
		const data: any = offlineMapMetaData;

		return Filesystem.writeFile({
			path: `maps/${mapId}/metaData/`,
			data,
			directory: this.FILESYSTEM_DIRECTORY,
			encoding: FilesystemEncoding.UTF8,
			recursive: true
		});
	}

	/**
	 * Retrieves size of saved offline map in bytes.
	 *
	 * @param mapIds Id of map(s)
	 * @param depth Used for recursive iteration
	 * @param prevPath Used for recursive iteration
	 */
	private async getMapSize(mapIds: string[], depth: number = 0, prevPath: string = ''): Promise<number> {
		const maxDepth = 3;
		let fileSize = 0;

		if (depth === 0) {
			mapIds = mapIds.map(mapId => {
				return `maps/${mapId}/mapTiles`;
			});
		}

		for (const path of mapIds) {
			await Filesystem.readdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path: `${prevPath}/${path}`
			}).then(async (res) => {
				if (depth >= maxDepth) {
					await Filesystem.stat({
						directory: this.FILESYSTEM_DIRECTORY,
						path: `${prevPath}/${path}/${this.MAP_TILE_NAME}`
					}).then(stat => {
						if (stat) {
							fileSize += stat.size;
						}
					});
				} else if (res) {
					fileSize += await this.getMapSize(res.files, depth + 1, `${prevPath}/${path}`);
				}
			});
		}

		return fileSize;
	}

	private getTotalTiles(startPos: Coordinate, endPos: Coordinate): number {
		let totalTileNumber = 0;

		for (const z of this.ZOOM_LEVELS) {
			const startXY = this.getTileCoordinates(startPos, z);
			const endXY = this.getTileCoordinates(endPos, z);
			const startX = startXY[0];
			const startY = startXY[1];
			const endX = endXY[0];
			const endY = endXY[1];

			// +1 because iteration for loop in downloadTileMapArea uses "<="
			const diffX = (endX - startX) + 1;
			const diffY = (endY - startY) + 1;

			totalTileNumber += diffX * diffY;
		}

		return totalTileNumber;
	}

	private showDownloadFinishedNotification(mapName: string) {
		LocalNotifications.schedule({
			notifications: [
			  {
				title: 'Kartutsnitt ferdig nedlastet',
				body: `${mapName} har blitt lastet ned og er klart for bruk.`,
				id: Date.now(),
				schedule: { at: new Date(Date.now() + 1000 * 2) }
			  }
			]
		});
	}

	private delayedRetry(delayMs: number, maxRetry = this.MAX_HTTP_RETRIES) {
		let retries = maxRetry;

		return (src: Observable<any>) =>
			src.pipe(
				retryWhen((errors: Observable<any>) => errors.pipe(
					delay(delayMs),
					mergeMap(error => retries-- > 0 ? of(error) : throwError(this.getErrorMessage(maxRetry)))
				)
			)
		);
	}

	private async finishDownloadingAndDeleting() {
		await this.getOfflineMapsMetaData().then(async metaDatas => {
			for (const metaData of metaDatas) {
				if (!metaData.downloadFinished && !metaData.deleted) {
					await this.startMapTileAreaDownload(metaData);
				}

				if (metaData.deleted) {
					await this.deleteOfflineMap(metaData.id);
				}
			}
		});
	}

	private getErrorMessage(maxRetry: number): string {
		return`Tried to download map tile for ${maxRetry} times without success. Giving up.`;
	}
}
