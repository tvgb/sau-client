import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SheepType } from 'src/app/shared/enums/SheepType';
import { DecrementSheepTypeCount, IncrementSheepTypeCount } from 'src/app/shared/store/sheepInfo.actions';

@Component({
  selector: 'app-sheep-type-count',
  templateUrl: './sheep-type-count.page.html',
  styleUrls: ['./sheep-type-count.page.scss'],
})
export class SheepTypeCountPage implements OnInit {

	categories: SheepType[] = [
		SheepType.Ewe,
		SheepType.Lamb
	];
	selectedCategoryIndex = 0;
	nextRoute = '/registration/collar-colour-count';

	constructor(private store: Store) { }

	ngOnInit() {
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementSheepTypeCount(this.categories[this.selectedCategoryIndex]));
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepTypeCount(this.categories[this.selectedCategoryIndex]));
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
	}

	selectedCategoryText(): string {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepType.Ewe):
				return 'SØY';

			case(SheepType.Lamb):
				return 'LAM';
		}
	}

}
