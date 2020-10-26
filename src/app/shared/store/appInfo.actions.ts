import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

export class SetCurrentSheepInfoCategory {
	static readonly type = '[Registration Page] SetCurrentSheepInfoCategory';
	constructor(public sheepInfoCategory: Category) {}
}

export class SetCurrentSheepInfoType {
	static readonly type = '[Registration Page] SetCurrentSheepInfoType';
	constructor(public sheepInfoType: SheepInfoType) {}
}
