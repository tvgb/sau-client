import { throwError } from 'rxjs';

export class SheepInfo {

	private totalSheepCount: number;

	private blackSheepCount: number;
	private greyWhiteSheepCount: number;
	private brownSheepCount: number;
	private whiteBlackHeadSheepCount: number;

	private lambCount: number;
	private eweCount: number;

	private blueCollarCount: number;
	private greenCollarCount: number;
	private yellowCollarCount: number;
	private redCollarCount: number;
	private missingCollarCount: number;

	private totalSheepCountRegistered = false;
	private sheepColourCountRegistered = false;
	private sheepTypeCountRegistered = false;
	private sheepCollarColourCountRegistered = false;

	public incrementTotalSheepCount(): void {
		this.totalSheepCount++;
		this.totalSheepCountRegistered = true;
	}

	public decrementTotalSheepCount(): void {
		if (this.totalSheepCount > 0) {
			this.totalSheepCount--;
		} else {
			throwError('Total sheep count already at 0.');
		}
	}

}
