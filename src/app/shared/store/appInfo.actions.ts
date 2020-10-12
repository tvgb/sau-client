import { SheepInfoCategoryGrouping } from '../classes/SheepInfoCategoryGrouping';
import { Page } from '../enums/Page';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';

export class UpdateCurrentPage {
	static readonly type = '[Page] UpdateCurrentPage';
	constructor(public currentPage: Page ) {}
}

export class UpdatePrevPage {
	static readonly type = '[Page] UpdatePrevPage';
	constructor(public prevPage: Page ) {}
}

export class SetCurrentSheepInfoCategory {
	static readonly type = '[Registration Page] SetCurrentSheepInfoCategory';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}

export class SetCurrentSheepInfoCategoryGrouping {
	static readonly type = '[Registration Page] SetCurrentSheepInfoCategoryGrouping';
	constructor(public sheepInfoCategoryGrouping: SheepInfoCategoryGrouping) {}
}
