import { FieldTripInfo } from '../classes/FieldTripInfo';

export class SetCurrentFieldTrip {
	static readonly type = '[New Field Trip Page] SetCurrentFieldTrip';
	constructor(public fieldTripInfo: FieldTripInfo) {}
}
