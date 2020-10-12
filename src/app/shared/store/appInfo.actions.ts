import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';

// export class UpdateCurrentPage {
// 	static readonly type = '[Registration Page] UpdateCurrentPage ';
// 	constructor(public currentPage: Page ) {}
// }

// export class UpdatePrevPage {
// 	static readonly type = '[Registration Page] UpdatePrevPage';
// 	constructor(public prevPage: Page ) {}
// }

export class SetCurrentSheepInfoCategory {
	static readonly type = '[Registration Page] SetCurrentSheepInfoCategory';
	constructor(public sheepInfoCategory: Category) {}
}

export class SetCurrentSheepInfoType {
	static readonly type = '[Registration Page] SetCurrentSheepInfoType';
	constructor(public sheepInfoType: SheepInfoType) {}
}
