import { FieldTripId } from '../enums/FieldTripId';

export class SetCurrentFieldTripId {
	static readonly type = '[New Field Trip Page] SetCurrentFieldTripId';
	constructor(public fieldTripId: FieldTripId) {}
}
