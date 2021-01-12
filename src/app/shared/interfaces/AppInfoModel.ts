import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';

export interface AppInfoModel {
	currentMainCategoryId: MainCategoryId;
	currentSubCategoryId: SubCategoryId;
}
