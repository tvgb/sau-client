import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilesystemDirectory, FilesystemEncoding, Filesystem, FileReadResult, StatResult } from '@capacitor/core';

@Injectable({providedIn: 'root'})
export class MapService {
	private readonly ZOOM_LEVELS = [13, 14, 15, 16, 17, 18];
	private readonly DOWNLOAD_DELAY = 200;
	private readonly FILESYSTEM_DIRECTORY = FilesystemDirectory.External;

	private readonly BASE_URLS = [
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache2.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache3.statkart.no/gatekeeper/gk/gk.open_gmaps',
	];

	private readonly MAP_LAYER = 'norges_grunnkart';

	constructor(private http: HttpClient) {}

	getTile(z: number, x: number, y: number): Promise<FileReadResult> {
		const img = this.readFile(`/${z}/${x}/${y}/imagefile.png`);
		return img;
	}

	private async readFile(path: string): Promise<FileReadResult> {
		const contents = await Filesystem.readFile({
			path: path,
			directory: FilesystemDirectory.External,
			encoding: FilesystemEncoding.UTF8
		});
		return contents;
	}

	private async fileWrite(data: any, z: number, x: number, y: number) {

		await Filesystem.stat({
			directory: this.FILESYSTEM_DIRECTORY,
			path: `/${z}/${x}/${y}/imagefile.png`
		}).catch((e) => {
			Filesystem.writeFile({
				path: `/${z}/${x}/${y}/imagefile.png`,
				data: data,
				directory: FilesystemDirectory.External,
				encoding: FilesystemEncoding.UTF8,
				recursive: true
			}).catch((e) => {
				console.log('Could not write to file:', e);
			});
		});
	}

	/**
	 * startLat and startLng needs to be north west, while endLat and endLng needs to be south east.
	 */
	async downloadMapTileArea(startLat: number, startLng: number, endLat: number, endLng: number) {
		let currentUrl = 0;

		for (const z of this.ZOOM_LEVELS) {
			const startXY = this.getTileCoordinates(startLat, startLng, z);
			const endXY = this.getTileCoordinates(endLat, endLng, z);
			const startX = startXY[0];
			const startY = startXY[1];
			const endX = endXY[0];
			const endY = endXY[1];

			for (let x = startX; x <= endX; x++) {
				for (let y = startY; y <= endY; y++) {
					if (!(await this.TileExists(z, x, y))) {
						this.downloadTile(z, x, y, this.BASE_URLS[currentUrl]);
						console.log('Downloaded tile:', z, x, y);
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
	}

	private downloadTile(z: number, x: number, y: number, baseUrl: string): void {

		this.http.get(`${baseUrl}?layers=${this.MAP_LAYER}&zoom=${z}&x=${x}&y=${y}`,
		{
			responseType: 'blob'
		}).pipe(
			map(blob => {

				const reader = new FileReader();
				reader.readAsDataURL(blob);

				// Convert tile to base64 image
				reader.onloadend = () => {
					this.fileWrite(reader.result, z, x, y);
				};

			})
		).subscribe();
	}

	/**
	 * Returns true if file exists and false if not.
	 *
	 * @param z zoom of tile
	 * @param x x pos of tile
	 * @param y y pos of tile
	 */
	private async TileExists(z: number, x: number, y: number): Promise<boolean> {

		let stat: StatResult;

		try {
			stat = await Filesystem.stat({
				directory: this.FILESYSTEM_DIRECTORY,
				path: `/${z}/${x}/${y}/imagefile.png`
			});
		} catch (e) {
			stat = null;
		}

		return stat === null ? false : true;
	}

	private getTileCoordinates(lat: number, lng: number, zoom: number): [number, number] {
		const latRad = lat * ( Math.PI / 180 );
		const n = Math.pow(2.0, zoom);
		const xTile = Math.round((lng + 180.0) / 360.0 * n);
		const yTile = Math.round((1.0 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2.0 * n);
		return [xTile, yTile];
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
