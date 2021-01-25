
export class FieldTripInfo {
	fieldTripId: string;
	overseerName: string;
	farmNumber: number;
	bruksNumber: number;
	kommune: string;
	participants: number;
	weather: string;
	description: string;

	constructor(fieldtripId: string, overseerName: string, farmNumber: number,
		           bruksNumber: number, kommune: string, participants: number, weather: string, description: string) {
		this.fieldTripId = fieldtripId;
		this.overseerName = overseerName;
		this.farmNumber = farmNumber;
		this.bruksNumber = bruksNumber;
		this.kommune = kommune;
		this.participants = participants;
		this.weather = weather;
		this.description = description;
	}
}


