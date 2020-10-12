import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

export interface AppInfoModel {
	// currentPage: Page;
	// prevPage: Page;
	currentCategory: Category;
	currentSheepInfoType: SheepInfoType;
}
