import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MapOptions, latLng, tileLayer, Map, popup, marker, icon, LatLng, LatLngBounds, latLngBounds, Projection, Transformation } from 'leaflet';
import { throwError, Observable } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
// import { File } from '@ionic-native/file/ngx';
import { Plugins, FilesystemDirectory, FilesystemEncoding, Filesystem, FileReadResult } from '@capacitor/core';
import { cordovaInstance } from '@ionic-native/core';

@Injectable({providedIn: 'root'})
export class MapService {
	private http: HttpClient;
	private zoomLevels = [14, 15, 16];

	private baseUrls = [
		'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache2.statkart.no/gatekeeper/gk/gk.open_gmaps',
		'https://opencache3.statkart.no/gatekeeper/gk/gk.open_gmaps',
	];

	private mapLayer = 'norges_grunnkart';

	constructor(http: HttpClient) {
		this.http = http;

		// this.readFile();
		// this.fileWrite();

		// console.log(this.file.writeFile('./', 'test.file', 'hello this is a test');

		// this.file.checkDir(this.file.dataDirectory, 'mydir').then(_ => console.log('Directory exists')).catch(err =>
		// 	console.log('Directory doesn\'t exist')
		// );
	}

	getTileTest(x: number, y: number, z: number): Promise<FileReadResult> {
		const img = this.readFile(`/${z}/${x}/${y}/imagefile.png`);
		return img;
	}

	private async readFile(path: string): Promise<FileReadResult> {
		const contents = await Filesystem.readFile({
			path: path,
			directory: FilesystemDirectory.Documents,
			encoding: FilesystemEncoding.UTF8
		});
		return contents;
	}

	private async fileWrite(data: any, x: number, y: number, z: number) {

		try {
			const result = await Filesystem.writeFile({
			path: `/${z}/${x}/${y}/imagefile.png`,
			data: data,
			directory: FilesystemDirectory.Documents,
			encoding: FilesystemEncoding.UTF8,
			recursive: true
		});
			console.log('Wrote file', result);
		} catch (e) {
			console.error('Unable to write file', e);
		}
	}

	/**
	 * startLat and startLng needs to be north west, while endLat and endLng needs to be south east.
	 */
	async downloadMapTileArea(startLat: number, startLng: number, endLat: number, endLng: number) {
		let currentUrl = 0;

		// let counter = 0;

		for (const z of this.zoomLevels) {
			const startXY = this.getTileCoordinates(startLat, startLng, z);
			const endXY = this.getTileCoordinates(endLat, endLng, z);
			const startX = startXY[0];
			const startY = startXY[1];
			const endX = endXY[0];
			const endY = endXY[1];

			for (let x = startX; x <= endX; x++) {
				for (let y = startY; y <= endY; y++) {
					this.getTile(x, y, z, this.baseUrls[currentUrl]);
					// console.log(x, y, z);
					// counter++;
					if (currentUrl < 2) {
						currentUrl++;
					} else {
						currentUrl = 0;
						await new Promise(r => setTimeout(r, 200));
					}
				}
			}
		}

		// console.log(counter);

	}

	private getTile(x: number, y: number, z: number, baseUrl: string): void {

		this.http.get(`${baseUrl}?layers=${this.mapLayer}&zoom=${z}&x=${x}&y=${y}`,
		{
			responseType: 'blob'
		}).pipe(
			map(blob => {
				// let blob = new Blob([result], {type: result.type});
				// console.log(blob.prototype.text);
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					this.fileWrite(reader.result, x, y, z);
				};
				// result.text().then(blobtext => {
				// 	this.fileWrite(blobtext, x, y, z);
				// });
				// this.fileWrite(res, x, y, z);
			})
		).subscribe();
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
