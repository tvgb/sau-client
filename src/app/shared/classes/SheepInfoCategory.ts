import { Category } from '../enums/Category';
import { SheepInfo } from './SheepInfo';

interface ISheepInfoCategory {
	category: Category;
	name: string;
	speakText: string;
}

export class SheepInfoCategory implements ISheepInfoCategory {
	category: Category;
	name: string;
	speakText: string;
}

export class TotalSheepCategory extends SheepInfoCategory {
	totalSheep: SheepInfo;
}

export class SheepColourCategory extends SheepInfoCategory {
	greyWhiteSheep: SheepInfo;
	blackSheep: SheepInfo;
	brownSheep: SheepInfo;
	whiteBlackHeadSheep: SheepInfo;
}

export class SheepTypeCategory extends SheepInfoCategory {
	ewe: SheepInfo;
	lamb: SheepInfo;
}

export class CollarColourCategory extends SheepInfoCategory {
	blueCollar: SheepInfo;
	greenCollar: SheepInfo;
	yellowCollar: SheepInfo;
	redCollar: SheepInfo;
	missingCollar: SheepInfo;
}
