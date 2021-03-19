
import * as L from 'leaflet';
import { Injectable } from '@angular/core';
import { Coordinate } from '../classes/Coordinate';
import { RegistrationType } from '../enums/RegistrationType';

@Injectable({
	providedIn: 'root'
})
export class MapUIService {

	private iconPath = 'assets/icon';
	private sheepPinPath = 'sheep_pin.png';
	private predatorPinPath = 'predator_pin.png';
	private InjuredSheepPinPath = 'injured_sheep_pin.png';
	private deadSheepPinPath = 'dead_sheep_pin.png';

	private sheepIconPath = `${this.iconPath}/add_sheep_btn.png`;
	private predatorIconPath = `${this.iconPath}/add_predator_btn.png`;
	private injuredSheepIconPath = `${this.iconPath}/add_injured_sheep_btn.png`;
	private deadSheepIconPath = `${this.iconPath}/add_dead_sheep_btn.png`;

	private sheepPinColour = '#719AAB';
	private predatorPinColour = '#C26B69';
	private injuredSheepPinColour = '#FFAE69';
	private deadSheepPinColour = '#5A5A5A';

	constructor() { }

	getIconPaths(): {sheep: string, predator: string, dead: string, injured: string} {
		return {
			sheep: this.sheepIconPath,
			predator: this.predatorIconPath,
			dead: this.deadSheepIconPath,
			injured: this.injuredSheepIconPath
		};
	}

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
		console.log('GPS POS:');
		console.log(JSON.stringify(registrationPos));
		const polyline = L.polyline([registrationPos, gpsPos], {color, dashArray: '10, 5'});

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
