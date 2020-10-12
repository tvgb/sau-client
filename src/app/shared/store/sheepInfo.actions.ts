import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

export class IncrementSheepInfoCount {
	static readonly type = '[Register Page] IncrementSheepInfoCount';
	constructor(public payload: { category: Category, sheepInfoType: SheepInfoType }) {}
}

export class DecrementSheepInfoCount {
	static readonly type = '[Register Page] DecrementSheepInfoCount';
	constructor(public payload: { category: Category, sheepInfoType: SheepInfoType }) {}
}
