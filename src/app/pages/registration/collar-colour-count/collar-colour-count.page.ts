import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CollarColour } from '../../../shared/enums/CollarColour';
import { DecrementCollarColourCount, IncrementCollarColourCount } from '../../../shared/store/sheepInfo.actions';

@Component({
  selector: 'app-collar-colour-count',
  templateUrl: './collar-colour-count.page.html',
  styleUrls: ['./collar-colour-count.page.scss'],
})
export class CollarColourCountPage implements OnInit {

	categories: CollarColour[] = [
		CollarColour.Blue,
		CollarColour.Green,
		CollarColour.Yellow,
		CollarColour.Red,
		CollarColour.Missing
	];
	selectedCategoryIndex = 0;
	nextRouteUri = '/registration/summary';


	constructor(private store: Store) { }

	ngOnInit() {
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementCollarColourCount(this.categories[this.selectedCategoryIndex]));
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementCollarColourCount(this.categories[this.selectedCategoryIndex]));
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
	}

	selectedCategoryText(): string {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(CollarColour.Blue):
				return 'BLÅ';

			case(CollarColour.Green):
				return 'GRØNN';

			case(CollarColour.Yellow):
				return 'GUL';

			case(CollarColour.Red):
				return 'RØD';

			case(CollarColour.Missing):
				return 'MANGLER';
		}
	}
}
