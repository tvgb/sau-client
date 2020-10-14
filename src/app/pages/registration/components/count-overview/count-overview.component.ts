import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/enums/Category';

@Component({
	selector: 'app-count-overview',
	templateUrl: './count-overview.component.html',
	styleUrls: ['./count-overview.component.scss'],
})
export class CountOverviewComponent implements OnInit {

	@Input() category: Category;
	@Input() colours: string[];
	@Input() infoTypes: string[];
	@Input() counts: number[];

	constructor() { }

	ngOnInit() {}

	getTextStyle(text: string): string {
		if (text.toLowerCase() === 'mangler') {
			return 'font-size: 12px';
		}

		if (this.category === Category.TotalSheepCategory || this.category === Category.SheepTypeCategory) {
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
