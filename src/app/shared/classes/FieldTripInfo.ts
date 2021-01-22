
export class FieldTripInfo {
	fieldTripId: string;
	overseerName: string;
	farmNumber: number;
	bruksNumber: number;
	participants: number;
	weather: string;
	description: string;

	constructor(fieldtripId, overseerName, farmNumber, bruksNumber, participants, weather, description) {
		this.fieldTripId = fieldtripId;
		this.overseerName = overseerName;
		this.farmNumber = farmNumber;
		this.bruksNumber = bruksNumber;
		this.participants = participants;
		this.weather = weather;
		this.description = description;
	}
}


