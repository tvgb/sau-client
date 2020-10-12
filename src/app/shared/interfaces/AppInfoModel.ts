import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

export interface AppInfoModel {
	currentCategory: Category;
	currentSheepInfoType: SheepInfoType;
}
