export class FieldTripInfo {
	overseerName: string;
	farmNumber: number;
	bruksNumber: number;
	participants: number;
	weather: string;
	description: string;

	constructor(overseerName: string, farmNumber: number, bruksNumber: number, participants: number, weather: string, description: string) {
		this.overseerName = overseerName;
		this.farmNumber = farmNumber;
		this.bruksNumber = bruksNumber;
		this.participants = participants;
		this.weather = weather;
		this.description = description;
	}
}
