import { CollarColourCategory, SheepColourCategory, SheepTypeCategory, TotalSheepCategory } from '../classes/SheepInfoCategory';

export interface SheepInfoModel {

	totalSheep: TotalSheepCategory;
	sheepColour: SheepColourCategory;
	sheepType: SheepTypeCategory;
	collarColour: CollarColourCategory;
}
