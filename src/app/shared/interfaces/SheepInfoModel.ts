import { CollarColourInfo } from '../classes/CollarColourInfo';
import { SheepColourInfo } from '../classes/SheepColourInfo';
import { SheepInfo } from '../classes/SheepInfo';
import { SheepTypeInfo } from '../classes/SheepTypeInfo';


export interface SheepInfoModel {

	totalSheep: SheepInfo;

	blackSheep: SheepColourInfo;
	greyWhiteSheep: SheepColourInfo;
	brownSheep: SheepColourInfo;
	whiteBlackHeadSheep: SheepColourInfo;

	lamb: SheepTypeInfo;
	ewe: SheepTypeInfo;

	blueCollar: CollarColourInfo;
	greenCollar: CollarColourInfo;
	yellowCollar: CollarColourInfo;
	redCollar: CollarColourInfo;
	missingCollar: CollarColourInfo;
}

export interface SheepInfoModel {
	totalSheep: SheepInfo;

	blackSheep: SheepColourInfo;
	greyWhiteSheep: SheepColourInfo;
	brownSheep: SheepColourInfo;
	whiteBlackHeadSheep: SheepColourInfo;

	lamb: SheepTypeInfo;
	ewe: SheepTypeInfo;

	blueCollar: CollarColourInfo;
	greenCollar: CollarColourInfo;
	yellowCollar: CollarColourInfo;
	redCollar: CollarColourInfo;
	missingCollar: CollarColourInfo;
}
