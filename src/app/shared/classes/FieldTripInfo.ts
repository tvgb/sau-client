import { Registration } from './Registration';

export class FieldTripInfo {
	fieldTripId: string;
	overseerName: string;
	fNumber: number;
	bNumber: number;
	municipality: string;
	participants: number;
	weather: string;
	description: string;
	registrations: Registration[];
	dateTimeStarted: number;
	dateTimeEnded: number;
	trackedRoute: [];

	constructor({ fieldtripId, overseerName, fNumber, bNumber, municipality, participants, weather, description, dateTimeStarted }:
		{ fieldtripId: string; overseerName: string; fNumber: number; bNumber: number;
			 municipality: string; participants: number; weather: string; description: string; dateTimeStarted: number; }) {
		this.fieldTripId = fieldtripId;
		this.overseerName = overseerName;
		this.fNumber = fNumber;
		this.bNumber = bNumber;
		this.municipality = municipality;
		this.participants = participants;
		this.weather = weather;
		this.description = description;
		this.dateTimeStarted = dateTimeStarted;
	}
}

export class UpdateFieldTripInfoObject {
	dateTimeEnded?: number;
	trackedRoute?: [];
}


