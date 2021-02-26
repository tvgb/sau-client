import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Network } from '@capacitor/core';
import { NavController, Platform } from '@ionic/angular';
import * as L from 'leaflet';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GpsService } from '../map/services/gps.service';
import { MapService } from '../map/services/map.service';

@Component({
	selector: 'app-download-map',
	templateUrl: './download-map.page.html',
	styleUrls: ['./download-map.page.scss'],
})
export class DownloadMapPage implements AfterViewInit {

	private map;
	alertNoInternetHeader = 'Ikke tilkoblet internett';
	alertNoInternetMessage = 'Applikasjonen må være tilkoblet internett for å kunne laste ned kartutsnitt. Vennligst koble til internett og prøv igjen.';


	@ViewChild('downloadArea') downloadArea: ElementRef;

	constructor(
		private mapService: MapService,
		private gpsService: GpsService,
		private platform: Platform,
		private navController: NavController,
		private alertService: AlertService) { }

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	async downloadMapArea() {
		if ((await Network.getStatus()).connected){
			const offsetHeight = this.downloadArea.nativeElement.offsetHeight;
			const offsetWidth = this.downloadArea.nativeElement.offsetWidth;
			const offsetTop = this.downloadArea.nativeElement.offsetTop;
			const offsetLeft = this.downloadArea.nativeElement.offsetLeft;

			const startPos = this.map.containerPointToLatLng(L.point(offsetLeft, offsetTop));
			const endPos = this.map.containerPointToLatLng(L.point(offsetWidth + offsetLeft, offsetTop + offsetHeight)) ;

			this.mapService.startMapTileAreaDownload({startPos, endPos, downloadFinished: false, deleted: false} as OfflineMapMetaData);
			this.navController.navigateBack('/offline-maps');
		} else {
			if (this.platform.is('mobileweb')) {
				console.log('Alert: Connect to the Internet');
			} else {
				this.alertService.basicAlert(this.alertNoInternetHeader, this.alertNoInternetMessage);
			}

		}
	}


	initMap(): void {
		this.gpsService.getCurrentPosition().then((res) => {
			this.map = L.map('map', {
				center: [ res.coords.latitude, res.coords.longitude ],
				zoom: 11,
				zoomControl: false,
				attributionControl: false
			});

			L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
				{
					attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
				}).addTo(this.map);
		});
	}

	cancelButtonClicked(): void {
		this.navController.navigateBack('/offline-maps');
	}
}
