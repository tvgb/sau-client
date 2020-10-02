import { RegistrationInfo } from './RegistrationInfo';
import { SheepInfo } from './SheepInfo';

export class Registration {

	registrationInfo: RegistrationInfo;
	sheepInfo: SheepInfo;

	constructor(registrationInfo: RegistrationInfo) {
		this.registrationInfo = registrationInfo;
		this.sheepInfo = new SheepInfo();
	}
}
