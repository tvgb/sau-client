import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';

export class SetCurrentMainCategoryId {
	static readonly type = '[Registration Page] SetCurrentMainCategoryId';
	constructor(public mainCategoryId: MainCategoryId) {}
}

export class SetCurrentSubCategoryId {
	static readonly type = '[Registration Page] SetCurrentSubCategoryId';
	constructor(public subCategoryId: SubCategoryId) {}
}
