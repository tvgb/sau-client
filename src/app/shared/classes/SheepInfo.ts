import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

interface ISheepInfo {
	sheepInfoCategory: Category;
	sheepInfoType: SheepInfoType;
	name: string;
	speakText: string;
	count: number;
}

export class SheepInfo implements ISheepInfo {
	sheepInfoCategory: Category;
	sheepInfoType: SheepInfoType;
	name: string;
	speakText: string;
	count: number;
}
