import { RegistrationType } from '../enums/RegistrationType';
import { Coordinate } from './Coordinate';
import { SheepInfo } from './SheepInfo';

export class Registration {
	dateTime: number;
	gpsPos: Coordinate;
	registrationPos: Coordinate;
	registrationType: RegistrationType;
}

export class SheepRegistration extends Registration {
	sheepInfo: SheepInfo;
}

export class PredatorRegistration extends Registration {
	// Eventuelle ting som trengs her
}

export class InjuredSheepRegistration extends Registration {
	// Eventuelle ting som trengs her
}

export class DeadSheepRegistration extends Registration {
	// Eventuelle ting som trengs her
}
