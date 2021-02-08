import { CollarColour, EarTag, SheepColour, SheepType, TotalSheep } from '../classes/Category';

export interface SheepInfoModel {
	totalSheep: TotalSheep;
	sheepColour: SheepColour;
	sheepType: SheepType;
	collarColour: CollarColour;
	earTag: EarTag;
}
