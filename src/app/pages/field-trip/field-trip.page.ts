import { Component } from '@angular/core';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import * as L from 'leaflet';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { MapUIService } from 'src/app/shared/services/map-ui.service';
import { FieldTripsService } from '../field-trips/field-trips.service';
import { Registration, SheepRegistration } from 'src/app/shared/classes/Registration';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { NgIf } from '@angular/common';
import { NavController } from '@ionic/angular';


@Component({
	selector: 'app-field-trip',
	templateUrl: './field-trip.page.html',
	styleUrls: ['./field-trip.page.scss'],
})
export class FieldTripPage {

	private map: any;

	registrationType = RegistrationType;
	sheepIconPath: string;
	injuredSheepIconPath: string;
	deadSheepIconPath: string;
	predatorIconPath: string;
	fieldTrip: FieldTripInfo;
	openInfoBox: RegistrationType;
	pinIdRegistrationDateTimeMap: Map<number, number> = new Map();
	selectedRegistration = -1;

	constructor(private mapUiService: MapUIService, public fieldTripsService: FieldTripsService, private navController: NavController) {
		const iconPaths = mapUiService.getIconPaths();
		this.sheepIconPath = iconPaths.sheep;
		this.injuredSheepIconPath = iconPaths.injured;
		this.deadSheepIconPath = iconPaths.dead;
		this.predatorIconPath = iconPaths.predator;
	}

	ionViewWillEnter(): void {
		this.fieldTrip = this.fieldTripsService.getSelectedFieldTrip();
	}

	ionViewDidEnter(): void {
		if (this.fieldTrip) {
			setTimeout(() => {
				this.initMap(this.fieldTrip);
			});
		}
	}

	getRegistrationByType(registrations: Registration[], registrationType: RegistrationType) {
		return registrations.filter(registration => registration.registrationType === registrationType);
	}

	onOpenInfoBox(registrationType: RegistrationType): void {
		if (this.openInfoBox === registrationType) {
			this.openInfoBox = null;
			this.selectedRegistration = -1;
		} else {
			this.openInfoBox = registrationType;
		}
	}

	selectRegistration(registration: Registration) {
		this.selectedRegistration = registration.dateTime;
		this.map.panTo((registration.registrationPos), {animate: true, duration: 1.0, easeLinearity: 0.2, noMoveStart: true});
	}

	navBack(): void {
		this.navController.navigateBack('/field-trips');
	}

	async initMap(fieldTrip: FieldTripInfo): Promise<void> {

		this.map = L.map('field-trip-map', {
			zoomControl: false,
			attributionControl: false,
		});

		if (fieldTrip.trackedRoute.length > 0) {
			const trackedRoutePolyline = L.polyline(fieldTrip.trackedRoute, {smoothFactor: 10});
			const fitBoundsCoords: Coordinate[] = [...fieldTrip.trackedRoute];
			trackedRoutePolyline.addTo(this.map);

			if (fieldTrip.registrations) {
				fieldTrip.registrations.forEach(registration => {
					fitBoundsCoords.push(registration.registrationPos);

					const {pin, polyline} = this.mapUiService.createRegistrationPin(
						registration.registrationPos,
						registration.gpsPos,
						registration.registrationType,
						true
					);


					pin.addTo(this.map);
					this.pinIdRegistrationDateTimeMap.set(pin._leaflet_id, registration.dateTime);
					pin.addEventListener('mousedown', this.selectRegistrationWithPin.bind(this));
					polyline.addTo(this.map);
				});
			}
			this.map.fitBounds(L.polyline(fitBoundsCoords).getBounds());
		}

		const onlineTileLayer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
		{
			attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
		});

		this.map.addLayer(onlineTileLayer);
	}

	showSheepColourInfo(registration: SheepRegistration): boolean {
		return 	registration.sheepInfo.sheepColour.whiteSheep.count > 0 ||
				registration.sheepInfo.sheepColour.blackSheep.count > 0 ||
				registration.sheepInfo.sheepColour.brownSheep.count > 0;
	}

	showCollarColourInfo(registration: SheepRegistration): boolean {
		return 	registration.sheepInfo.collarColour.blueCollar.count > 0 ||
				registration.sheepInfo.collarColour.greenCollar.count > 0 ||
				registration.sheepInfo.collarColour.yellowCollar.count > 0 ||
				registration.sheepInfo.collarColour.redCollar.count > 0 ||
				registration.sheepInfo.collarColour.missingCollar.count > 0;
	}

	private selectRegistrationWithPin(event: any) {
		this.selectedRegistration = this.pinIdRegistrationDateTimeMap.get(event.target._leaflet_id);
		const registration = this.fieldTrip.registrations.find(r => r.dateTime === this.selectedRegistration);
		this.openInfoBox = registration.registrationType;
		setTimeout(() => {
			document.getElementById(`${registration.dateTime}`).scrollIntoView();
		});
	}
}
