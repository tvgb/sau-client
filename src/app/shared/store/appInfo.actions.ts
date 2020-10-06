import { Page } from '../enums/Page';

export class UpdateCurrentPage {
	static readonly type = '[Page] UpdateCurrentPage';
	constructor(public currentPage: Page ) {}
}

export class UpdatePrevPage {
	static readonly type = '[Page] UpdatePrevPage';
	constructor(public prevPage: Page ) {}
}
