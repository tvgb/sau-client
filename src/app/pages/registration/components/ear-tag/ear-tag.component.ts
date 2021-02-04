import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EarTagInfo } from 'src/app/shared/classes/EarTagInfo';

@Component({
	selector: 'app-ear-tag',
	templateUrl: './ear-tag.component.html',
	styleUrls: ['./ear-tag.component.scss'],
})
export class EarTagComponent implements OnInit {

	@Input() formWidth: number;

	colour: string;
	pickingColour = false;
	coloursPicked: string[] = [];
	newEarTagForm: FormGroup;

	checkAbleEartags: any[] = [];


	constructor(private formBuilder: FormBuilder) {
		this.newEarTagForm = this.formBuilder.group({
			owner: ['', Validators.required],
		});
	}

	ngOnInit() {
		const earTags: EarTagInfo[] = [
			{
				owner: 'Svein-Olaf Hvassohovd',
				colours: ['#FF0000']
			}
		];

		for (const earTagInfo of earTags) {
			const checkableEarTag: any = {
				owner: earTagInfo.owner,
				colours: earTagInfo.colours,
				isChecked: false
			};

			this.checkAbleEartags.push(checkableEarTag);
		}
	}

	onColourPicked(): void {
		this.coloursPicked.push(this.colour);
		this.colour = undefined;
		this.pickingColour = false;
	}

	onSaveNewEarTagButtonClicked(): void {
		console.log(this.checkAbleEartags);

		if (this.newEarTagForm.valid) {
			const newEarTag = {
				owner: this.newEarTagForm.controls.owner.value,
				colours: this.coloursPicked
			};

			this.checkAbleEartags.push(newEarTag);

			this.coloursPicked = [];
			this.newEarTagForm.reset();
		}
	}

	pickedColourClicked(colour) {
		this.coloursPicked = this.coloursPicked.filter(c => c !== colour);
	}
}
