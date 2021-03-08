import { Injectable } from '@angular/core';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { DeadSheepRegistration, InjuredSheepRegistration, SheepRegistration } from 'src/app/shared/classes/Registration';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';

@Injectable({
	providedIn: 'root'
})
export class FieldTripsService {

	private selectedFieldTrip: FieldTripInfo;

	constructor() { }

	getRegisteredSheepCount(fieldTrip: FieldTripInfo): number {
		return fieldTrip.registrations
			.filter(f => f.registrationType === RegistrationType.Sheep)
			.reduce((acc, registration) => {
				return acc + (registration as SheepRegistration).sheepInfo.totalSheep.totalSheep.count;
			}, 0);
	}

	getInjuredSheepCount(fieldTrip: FieldTripInfo): number {
		return fieldTrip.registrations
			.filter(f => f.registrationType === RegistrationType.Injured)
			.reduce((acc, registration) => {
				return acc + (registration as InjuredSheepRegistration).count;
			}, 0);
	}

	getDeadSheepCount(fieldTrip: FieldTripInfo): number {
		return fieldTrip.registrations
			.filter(f => f.registrationType === RegistrationType.Dead)
			.reduce((acc, registration) => {
				return acc + (registration as DeadSheepRegistration).count;
			}, 0);
	}

	getPredatorCount(fieldTrip: FieldTripInfo): number {
		return fieldTrip.registrations.filter(f => f.registrationType === RegistrationType.Predator).length;
	}

	setSelectedFieldTrip(fieldTrip: FieldTripInfo): void {
		this.selectedFieldTrip = fieldTrip;
	}

	getSelectedFieldTrip(): FieldTripInfo {
		return this.selectedFieldTrip;
	}
}
