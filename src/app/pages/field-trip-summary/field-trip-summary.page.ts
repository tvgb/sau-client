import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

@Component({
  selector: 'app-field-trip-summary',
  templateUrl: './field-trip-summary.page.html',
  styleUrls: ['./field-trip-summary.page.scss'],
})

export class FieldTripSummaryPage implements AfterViewInit {

	private mapUrl = '/map';
	private trackedRouteSub: Subscription;
	private map;
	private testTrackedRoute = [new L.LatLng(63.428202, 10.392846), new L.LatLng(63.428018, 10.403417),
		new L.LatLng(63.422071, 10.399155), new L.LatLng(63.422756, 10.394511), new L.LatLng(63.428202, 10.392846)];

	constructor(private navController: NavController, private statusBarService: StatusbarService ) { }

	ionViewWillEnter(): void {
		this.statusBarService.changeStatusBar(false, true);
// 	  this.trackedRouteSub = this.gpsService.getTrackedRoute().subscribe((res) => {
// 		  if (this.map) {
// 				L.polyline(res).addTo(this.map);
// 		  }
// 	  });
  	}

	ngAfterViewInit(): void {
		setTimeout(_ => {
			this.initMap();
		});
	}

	initMap(): void {
		this.map = L.map('summary-map', {
			zoomControl: false,
			attributionControl: false
		});
		L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
		}).addTo(this.map);

		const polyline = L.polyline(this.testTrackedRoute);
		polyline.addTo(this.map);
		this.map.fitBounds(polyline.getBounds());
	}

	navigateBack(): void {
		this.navController.navigateBack(this.mapUrl);
	}

	ionViewWillLeave(): void {
	// this.trackedRouteSub.unsubscribe();
	}
}
