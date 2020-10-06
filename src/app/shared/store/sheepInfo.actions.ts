import { CollarColour } from '../enums/CollarColour';
import { SheepColour } from '../enums/SheepColour';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';
import { SheepType } from '../enums/SheepType';

export class IncrementSheepInfoCategoryCount {
	static readonly type = '[Register Page] IncrementSheepInfoCategoryCount';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}

export class DecrementSheepInfoCategoryCount {
	static readonly type = '[Register Page] DecrementSheepInfoCategoryCount';
	constructor(public sheepInfoCategory: SheepInfoCategory) {}
}

export class IncrementTotalSheepCount {
	static readonly type = '[TotalSheepCount Page] IncrementTotalSheepCount';
}

export class DecrementTotalSheepCount {
	static readonly type = '[TotalSheepCount Page] DecrementTotalSheepCount';
}

export class IncrementSheepColourCount {
	static readonly type = '[SheepColourCount Page] IncrementSheepColourCount';
	constructor(public sheepColour: SheepColour) {}
}

export class DecrementSheepColourCount {
	static readonly type = '[SheepColourCount Page] DecrementSheepColourCount';
	constructor(public sheepColour: SheepColour) {}
}

export class IncrementSheepTypeCount {
	static readonly type = '[SheepTypeCount Page] IncrementSheepTypeCount';
	constructor(public sheepType: SheepType) {}
}

export class DecrementSheepTypeCount {
	static readonly type = '[SheepTypeCount Page] DecrementSheepTypeCount';
	constructor(public sheepType: SheepType) {}
}

export class IncrementCollarColourCount {
	static readonly type = '[CollarColourCount Page] IncrementCollarColourCount';
	constructor(public collarColour: CollarColour) {}
}

export class DecrementCollarColourCount {
	static readonly type = '[CollarColourCount Page] DecrementCollarColourCount';
	constructor(public collarColour: CollarColour) {}
}
