
import * as L from 'leaflet';
import { Injectable } from '@angular/core';
import { Coordinate } from '../classes/Coordinate';
import { RegistrationType } from '../enums/RegistrationType';

@Injectable({
	providedIn: 'root'
})
export class MapUIService {

	private iconPath = 'assets/icon';
	private sheepPinPath = 'sheep_pin_v5.png';
	private predatorPinPath = 'predator_pin_v3.png';
	private InjuredSheepPinPath = 'injured_sheep_pin_v3.png';
	private deadSheepPinPath = 'dead_sheep_pin_v3.png';

	private sheepPinColour = '#719AAB';
	private predatorPinColour = '#C26B69';
	private injuredSheepPinColour = '#FFAE69';
	private deadSheepPinColour = '#5A5A5A';

	constructor() { }

	createRegistrationPin(
		registrationPos: Coordinate,
		gpsPos: Coordinate, type: RegistrationType,
		smallPin: boolean = false): {pin: any, polyline: any}
	{
		let newPin: any;
		let color: string;

		switch (type) {
			case RegistrationType.Sheep:
				newPin = this.createPin(this.sheepPinPath, smallPin);
				color = this.sheepPinColour;
				break;

			case RegistrationType.Predator:
				newPin = this.createPin(this.predatorPinPath, smallPin);
				color = this.predatorPinColour;
				break;

			case RegistrationType.Injured:
				newPin = this.createPin(this.InjuredSheepPinPath, smallPin);
				color = this.injuredSheepPinColour;
				break;

			case RegistrationType.Dead:
				newPin = this.createPin(this.deadSheepPinPath, smallPin);
				color = this.deadSheepPinColour;
				break;
		}

		const pin = L.marker([registrationPos.lat, registrationPos.lng], {icon: newPin});
		const polyline = L.polyline([registrationPos, gpsPos], {color});

		return {pin, polyline};
	}

	private createPin(pinFileName: string, smallPin: boolean): any {
		if (smallPin) {
			return new L.Icon({
				iconUrl: `${this.iconPath}/${pinFileName}`,
				iconSize: [41 / 2, 55 / 2],
				iconAnchor: [20.5 / 2, 55 / 2]
			});
		} else {
			return new L.Icon({
				iconUrl: `${this.iconPath}/${pinFileName}`,
				iconSize: [41, 55],
				iconAnchor: [20.5, 55]
			});
		}
	}
}
