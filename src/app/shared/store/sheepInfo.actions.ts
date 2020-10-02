import { CollarColour } from '../enums/CollarColour';
import { SheepColour } from '../enums/SheepColour';

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

export class IncrementEweCount {
	static readonly type = '[SheepTypeCount Page] IncrementEweCount';
}

export class DecrementEweCount {
	static readonly type = '[SheepTypeCount Page] DecrementEweCount';
}

export class IncrementLambCount {
	static readonly type = '[SheepTypeCount Page] IncrementLambCount';
}

export class DecrementLambCount {
	static readonly type = '[SheepTypeCount Page] DecrementLambCount';
}

export class IncrementCollarColourCount {
	static readonly type = '[CollarColourCount Page] IncrementCollarColourCount';
	constructor(public collarColour: CollarColour) {}
}

export class DecrementCollarColourCount {
	static readonly type = '[CollarColourCount Page] DecrementCollarColourCount';
	constructor(public collarColour: CollarColour) {}
}
