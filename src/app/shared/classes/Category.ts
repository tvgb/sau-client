import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';

export interface Category {
	name: string;
	speakText: string;
}

export class MainCategory implements Category {
	id: MainCategoryId;
	name: string;
	speakText: string;
}

export class SubCategory implements Category {
	id: SubCategoryId;
	name: string;
	speakText: string;
	count: number;
}

export class TotalSheep extends MainCategory {
	totalSheep: SubCategory;
}

export class SheepColour extends MainCategory {
	whiteSheep: SubCategory;
	blackSheep: SubCategory;
	brownSheep: SubCategory;
}

export class SheepType extends MainCategory {
	ewe: SubCategory;
	lamb: SubCategory;
}

export class CollarColour extends MainCategory {
	blueCollar: SubCategory;
	greenCollar: SubCategory;
	yellowCollar: SubCategory;
	redCollar: SubCategory;
	missingCollar: SubCategory;
}
