import { Component, Input, OnInit } from '@angular/core';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';

@Component({
	selector: 'app-count-overview',
	templateUrl: './count-overview.component.html',
	styleUrls: ['./count-overview.component.scss'],
})
export class CountOverviewComponent {

	@Input() mainCategoryId: MainCategoryId;
	@Input() colours: string[];
	@Input() subCategories: string[];
	@Input() counts: number[];

	constructor() { }

	getTextStyle(text: string): string {
		if (text.toLowerCase() === 'mangler') {
			return 'font-size: 12px';
		}

		if (this.mainCategoryId === MainCategoryId.TotalSheep || this.mainCategoryId === MainCategoryId.SheepType) {
			return 'font-size: 20px';
		}
	}

	getBarStyle(index: number): string {
		if (this.colours) {
			return `background-color: #${this.colours[index]}`;
		} else {
			return `background-color: #FFFFFF; opacity: 0.07;`;
		}
	}

}
