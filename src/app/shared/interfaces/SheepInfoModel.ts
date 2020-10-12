import { CollarColourCategory, SheepColourCategory, SheepTypeCategory, TotalSheepCategory } from '../classes/SheepInfoCategory';

export interface SheepInfoModel {

	totalSheep: TotalSheepCategory;
	sheepColour: SheepColourCategory;
	sheepType: SheepTypeCategory;
	collarColour: CollarColourCategory;

	// totalSheep: SheepInfo;

	// blackSheep: SheepInfo;
	// greyWhiteSheep: SheepInfo;
	// brownSheep: SheepInfo;
	// whiteBlackHeadSheep: SheepInfo;

	// lamb: SheepInfo;
	// ewe: SheepInfo;

	// blueCollar: SheepInfo;
	// greenCollar: SheepInfo;
	// yellowCollar: SheepInfo;
	// redCollar: SheepInfo;
	// missingCollar: SheepInfo;
}
