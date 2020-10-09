import { SheepInfoCategoryGrouping } from '../classes/SheepInfoCategoryGrouping';
import { Page } from '../enums/Page';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';

export interface AppInfoModel {
	currentPage: Page;
	prevPage: Page;
	currentCategory: SheepInfoCategory;
	currentCategoryGrouping: SheepInfoCategoryGrouping;
}
