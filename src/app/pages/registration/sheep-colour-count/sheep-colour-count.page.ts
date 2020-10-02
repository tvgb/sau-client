import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoState } from '../../../shared/store/sheepInfo.state';
import { DecrementSheepColourCount, IncrementSheepColourCount } from '../../../shared/store/sheepInfo.actions';
import { SheepColour } from 'src/app/shared/enums/SheepColour';
import { SheepColourCount } from 'src/app/shared/classes/SheepColourCount';

@Component({
  selector: 'app-sheep-colour-count',
  templateUrl: './sheep-colour-count.page.html',
  styleUrls: ['./sheep-colour-count.page.scss'],
})
export class SheepColourCountPage implements OnInit {

	nextRoute = '/register/sheep-type-ount';

	categories: SheepColour[] = [
		SheepColour.Black,
		SheepColour.GreyWhite,
		SheepColour.Brown,
		SheepColour.WhiteBlackHead
	];

	selectedCategoryIndex = 0;

	@Select(SheepInfoState.getSheepColourCount) sheepColourCount$: Observable<SheepColourCount>;

	constructor(private store: Store) { }

	ngOnInit() {
		this.sheepColourCount$.subscribe(res => {
			console.log('sheepColourCount:', res);
		});
	}

  	onIncrement(): void {
		this.store.dispatch(new IncrementSheepColourCount(this.categories[this.selectedCategoryIndex]));
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepColourCount(this.categories[this.selectedCategoryIndex]));
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
	}

	selectedCategoryText(): string {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepColour.Black):
				return 'SVART';

			case(SheepColour.GreyWhite):
				return 'GRÅ/HVIT';

			case(SheepColour.Brown):
				return 'BRUN';

			case(SheepColour.WhiteBlackHead):
				return 'HVIT, SVART HODE';
		}
	}

}
