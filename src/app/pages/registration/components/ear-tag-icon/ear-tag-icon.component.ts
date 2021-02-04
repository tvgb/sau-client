import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-ear-tag-icon',
	templateUrl: './ear-tag-icon.component.html',
	styleUrls: ['./ear-tag-icon.component.scss'],
})
export class EarTagIconComponent {

	@Input() coloursPicked: string[] = [];
	@Input() colour: string;
	@Input() smallVersion = true;

	getColour(side: string): string {
		if (this.coloursPicked.length === 1) {
			if (side.toLocaleUpperCase() === 'LEFT') {
				return this.coloursPicked[0];
			} else {
				if (this.colour) {
					return this.colour;
				} else {
					return this.coloursPicked[0];
				}
			}
		} else if (this.coloursPicked.length === 2) {
			if (side.toLocaleUpperCase() === 'LEFT') {
				return this.coloursPicked[0];
			} else {
				return this.coloursPicked[1];
			}
		} else {
			if (this.colour) {
				return this.colour;
			}
		}

		return 'transparent';
	}

}
