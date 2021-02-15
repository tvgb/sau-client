import { FieldTripInfo, UpdateFieldTripInfoObject } from '../classes/FieldTripInfo';
import { Registration } from '../classes/Registration';

export class SetCurrentFieldTrip {
	static readonly type = '[New Field Trip Page] SetCurrentFieldTrip';
	constructor(public fieldTripInfo: FieldTripInfo) {}
}

export class SetDateTimeEnded {
	static readonly type = '[Map Page] SetDateTimeEnded';
	constructor(public changes: UpdateFieldTripInfoObject) {}
}

export class AddRegistration {
	static readonly type = '[Summary Page] addRegistration';
	constructor(public registration: Registration) {}
}
