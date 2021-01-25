import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, delay, mergeMap, retryWhen } from 'rxjs/operators';
import { FilesystemDirectory, FilesystemEncoding, Filesystem, FileReadResult, StatResult, RmdirResult, FileWriteResult } from '@capacitor/core';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { DownloadProgressionData } from 'src/app/shared/classes/DownloadProgressionData';
import { v4 as uuidv4 } from 'uuid';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { GpsService } from './gps.service';

@Injectable({
	providedIn: 'root'
})
export class MapService {
	private readonly ZOOM_LEVELS = [8, 9, 10, 11, 12];
	private readonly DOWNLOAD_DELAY = 200;
	private readonly FILESYSTEM_DIRECTORY = FilesystemDirectory.External;
	private readonly MAX_HTTP_RETRIES = 5;
	private downloads: BehaviorSubject<DownloadProgressionData[]> = new BehaviorSubject([] as DownloadProgressionData[]);
	private mapsUpdated$: Subject<any> = new Subject();
	private mapId: string;
	private lastTrackedPosition: Coordinate;

	private readonly BASE_URLS = [
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache2.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache3.statkart.no/gatekeeper/gk/gk.open_gmaps',
	];

	private readonly MAP_LAYER = 'norges_grunnkart';

	constructor(private http: HttpClient, private gpsService: GpsService) {
		gpsService.getLastTrackedPosition().subscribe(pos => {
			if (pos) {
				console.log('NEW POS:', pos);
				this.lastTrackedPosition = pos;
				this.setOfflineMapId(this.lastTrackedPosition);
			}
		});
	}

	getMaxZoom(): number {
		return this.ZOOM_LEVELS[this.ZOOM_LEVELS.length - 1];
	}

	getMinZoom(): number {
		return this.ZOOM_LEVELS[0];
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
		const img = this.readFile(`/${this.mapId}/${z}/${x}/${y}/imagefile.png`);

		return img;
	}

	/**
	 * startLat and startLng needs to be north west, while endLat and endLng needs to be south east.
	 */
	async downloadMapTileArea(startPos: Coordinate, endPos: Coordinate, mapId: string = null, mapName: string = null) {

		if (!mapId) {
			mapId = uuidv4();
		}

		if (!mapName) {
			mapName = `Nytt kart - ${new Date().toLocaleDateString()}`;
		}

		const offlineMapMetaData = await this.saveMapMetaData(mapId, mapName, startPos, endPos, false);
		this.mapsUpdated$.next();

		this.downloads.next([...this.downloads.getValue(), ({
			totalTiles: this.getTotalTiles(startPos, endPos),
			downloadedTiles: 0,
			offlineMapMetaData
		} as DownloadProgressionData)]);

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
					if (!(await this.TileExists(mapId, z, x, y))) {
						this.downloadTile(mapId, z, x, y, this.BASE_URLS[currentUrl]);
						this.downloads.next([...this.downloads.getValue().map((d) => {
							if (d.offlineMapMetaData.id === mapId) {
								d.downloadedTiles++;
							}

							return d;
						})]);
					} else {
						continue;
					}

					if (currentUrl < 2) {
						currentUrl++;
					} else {
						currentUrl = 0;
						await new Promise(r => setTimeout(r, this.DOWNLOAD_DELAY));
					}
				}
			}
		}

		await this.saveMapMetaData(mapId, mapName, startPos, endPos);
		this.mapsUpdated$.next();
		this.downloads.next([...this.downloads.getValue().filter(d => d.offlineMapMetaData.id !== mapId)]);
		console.log('Map download sequence ended!');
	}

	async changeMapName(mapId: string, newMapName: string): Promise<FileWriteResult> {
		const offlineMapMetaData = await this.getOfflineMapMetaData(mapId);
		offlineMapMetaData.name = newMapName;
		return this.updateOfflineMapMetaData(mapId, offlineMapMetaData);
	}

	async updateOfflineMap(mapId: string) {
		const offlineMapMetaData = await this.getOfflineMapMetaData(mapId);
		await this.deleteOfflineMap(mapId);
		await this.downloadMapTileArea(
			offlineMapMetaData.startPos,
			offlineMapMetaData.endPos,
			offlineMapMetaData.id,
			offlineMapMetaData.name);
	}

	mapsUpdated(): Observable<any> {
		return this.mapsUpdated$.asObservable();
	}

	async getOfflineMapsMetaData(): Promise<OfflineMapMetaData[]> {

		const offlineMapsMetaData: OfflineMapMetaData[] = [];

		await Filesystem.readdir({
			directory: this.FILESYSTEM_DIRECTORY,
			path: ''
		}).then(async res => {
			if (res) {
				for (const path of res.files) {
					await Filesystem.readFile({
						directory: this.FILESYSTEM_DIRECTORY,
						path: `${path}/metaData`
					}).then(metaData => {
						if (metaData) {
							offlineMapsMetaData.push(metaData.data as unknown as OfflineMapMetaData);
						}
					});
				}
			}
		});

		return offlineMapsMetaData;
	}

	async getOfflineMapMetaData(mapId: string): Promise<OfflineMapMetaData> {
		return await Filesystem.readFile({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `${mapId}/metaData`
		}).then(metaData => {
			if (metaData) {
				return metaData.data as unknown as OfflineMapMetaData;
			}
		});
	}

	async deleteOfflineMap(mapId: string): Promise<RmdirResult> {
		return Filesystem.rmdir({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `/${mapId}`,
			recursive: true
		});
	}

	async saveMapMetaData(mapId: string, mapName: string, startPos: Coordinate, endPos: Coordinate, saveSize: boolean = true)
		: Promise<OfflineMapMetaData> {

		const mapSize = saveSize ? await this.getMapSize([mapId]) : 0;

		const downloadDate = Date.now();

		const offlineMapMetaData: OfflineMapMetaData = {
			id: mapId,
			name: mapName,
			size: mapSize,
			downloadDate,
			startPos,
			endPos
		};

		const data: any = offlineMapMetaData;

		await Filesystem.writeFile({
			path: `/${mapId}/metaData/`,
			data,
			directory: FilesystemDirectory.External,
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
			directory: FilesystemDirectory.External,
			encoding: FilesystemEncoding.UTF8
		});
		return contents;
	}

	private async writeFile(id: string, data: any, z: number, x: number, y: number): Promise<void> {

		await Filesystem.stat({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `/${id}/${z}/${x}/${y}/imagefile.png`
		}).catch(() => {
			return Filesystem.writeFile({
				path: `/${id}/${z}/${x}/${y}/imagefile.png`,
				data,
				directory: FilesystemDirectory.External,
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
							console.log('Failed while writing to file:', retries, z, x, y, e);
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
				path: `/${mapId}/${z}/${x}/${y}/imagefile.png`
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
			path: `/${mapId}/metaData/`,
			data,
			directory: FilesystemDirectory.External,
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

		for (const path of mapIds) {
			await Filesystem.readdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path: `${prevPath}/${path}`
			}).then( async res => {
				if (depth >= maxDepth) {
					await Filesystem.stat({
						directory: this.FILESYSTEM_DIRECTORY,
						path: `${prevPath}/${path}/imagefile.png`
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

	private delayedRetry(delayMs: number, maxRetry = this.MAX_HTTP_RETRIES) {
		let retries = maxRetry;

		return (src: Observable<any>) =>
			src.pipe(
				retryWhen((errors: Observable<any>) => errors.pipe(
					delay(delayMs),
					mergeMap(error => retries-- > 0 ? of(error) : throwError(this.getErrorMessage(maxRetry)))
				))
			);
	}

	private getErrorMessage(maxRetry: number): string {
		return`Tried to download map tile for ${maxRetry} times without success. Giving up.`;
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
			`Backend returned code ${error.status}, ` +
			`body was: ${error.error}`);
		}

		// return an observable with a user-facing error message
		return throwError('Something bad happened; please try again later.');
	}

}
