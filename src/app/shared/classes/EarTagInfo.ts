export class EarTagInfo {
	id: string;
	owner: string;
	colours: string[];
}

export class CheckableEarTag extends EarTagInfo {
	isChecked: boolean;
}
