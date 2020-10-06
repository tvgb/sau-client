import { Page } from '../enums/Page';

export class UpdateCurrentPage {
	static readonly type = '[Registration Page] UpdateCurrentPage ';
	constructor(public currentPage: Page ) {}
}

export class UpdatePrevPage {
	static readonly type = '[Registration Page] UpdatePrevPage';
	constructor(public prevPage: Page ) {}
}
