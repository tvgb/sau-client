import { Registration } from './Registration';

export class FieldTripInfo {
	fieldTripId: string;
	overseerName: string;
	participants: number;
	description: string;
	registrations: Registration[];
	dateTimeStarted: number;
	dateTimeEnded: number;
	trackedRoute: [];

	constructor({ fieldtripId, overseerName, participants, description, dateTimeStarted }:
		{ fieldtripId: string; overseerName: string; participants: number; description: string; dateTimeStarted: number; }) {
		this.fieldTripId = fieldtripId;
		this.overseerName = overseerName;
		this.participants = participants;
		this.description = description;
		this.dateTimeStarted = dateTimeStarted;
	}
}

export class UpdateFieldTripInfoObject {
	dateTimeEnded?: number;
	trackedRoute?: [];
}


