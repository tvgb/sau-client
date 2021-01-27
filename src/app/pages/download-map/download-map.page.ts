import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { GpsService } from '../map/services/gps.service';
import { MapService } from '../map/services/map.service';

@Component({
	selector: 'app-download-map',
	templateUrl: './download-map.page.html',
	styleUrls: ['./download-map.page.scss'],
})
export class DownloadMapPage implements AfterViewInit {

	private map;

	@ViewChild('downloadArea') downloadArea: ElementRef;

	constructor(private mapService: MapService, private gpsService: GpsService, private navController: NavController) { }

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	downloadMapArea(): void {
		const offsetHeight = this.downloadArea.nativeElement.offsetHeight;
		const offsetWidth = this.downloadArea.nativeElement.offsetWidth;
		const offsetTop = this.downloadArea.nativeElement.offsetTop;
		const offsetLeft = this.downloadArea.nativeElement.offsetLeft;

		const startPos = this.map.containerPointToLatLng(L.point(offsetLeft, offsetTop));
		const endPos = this.map.containerPointToLatLng(L.point(offsetWidth + offsetLeft, offsetTop + offsetHeight)) ;

		this.mapService.downloadMapTileArea(startPos, endPos);
		this.navController.navigateBack('/offline-maps');
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
