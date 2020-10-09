import { Page } from '../enums/Page';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';

export class UpdateCurrentPage {
	static readonly type = '[Registration Page] UpdateCurrentPage ';
	constructor(public currentPage: Page ) {}
}

export class UpdatePrevPage {
	static readonly type = '[Registration Page] UpdatePrevPage';
	constructor(public prevPage: Page ) {}
}

export class SetCurrentSheepInfoCategory {
	static readonly type = '[Registration Page] SetCurrentSheepInfoCategory';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}
