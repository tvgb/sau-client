import { SheepInfoCategory } from '../enums/SheepInfoCategory';

export class IncrementSheepInfoCategoryCount {
	static readonly type = '[Register Page] IncrementSheepInfoCategoryCount';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}

export class DecrementSheepInfoCategoryCount {
	static readonly type = '[Register Page] DecrementSheepInfoCategoryCount';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}
