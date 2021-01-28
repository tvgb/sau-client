import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { TotalSheep, SheepColour, SheepType, CollarColour } from './Category';

export class SheepInfo implements SheepInfoModel {
	totalSheep: TotalSheep;
	sheepColour: SheepColour;
	sheepType: SheepType;
	collarColour: CollarColour;
}
