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
	Registrations: Registration[];

	constructor(fieldtripId: string, overseerName: string, fNumber: number,
		           bNumber: number, municipality: string, participants: number, weather: string, description: string) {
		this.fieldTripId = fieldtripId;
		this.overseerName = overseerName;
		this.fNumber = fNumber;
		this.bNumber = bNumber;
		this.municipality = municipality;
		this.participants = participants;
		this.weather = weather;
		this.description = description;
	}
}


