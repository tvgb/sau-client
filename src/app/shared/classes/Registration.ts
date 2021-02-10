import { RegistrationType } from '../enums/RegistrationType';
import { Coordinate } from './Coordinate';
import { SheepInfo } from './SheepInfo';

export class Registration {
	dateTime: Date;
	pos: Coordinate;
	sheepInfo: SheepInfo;
	registrationType: RegistrationType;

	constructor(dateTime: Date, pos: Coordinate, sheepInfo: SheepInfo, registrationType: RegistrationType) {
		this.dateTime = dateTime;
		this.pos = pos;
		this.sheepInfo = sheepInfo;
		this.registrationType = registrationType;
	}
}
