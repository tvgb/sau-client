import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';

export class IncrementSubCategoryCount {
	static readonly type = '[Register Page] IncrementSubCategoryCount';
	constructor(public payload: { mainCategoryId: MainCategoryId, subCategoryId: SubCategoryId }) {}
}

export class DecrementSubCategoryCount {
	static readonly type = '[Register Page] DecrementSubCategoryCount';
	constructor(public payload: { mainCategoryId: MainCategoryId, subCategoryId: SubCategoryId }) {}
}
