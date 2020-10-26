import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/shared/enums/Category';
import { SheepInfoType } from 'src/app/shared/enums/SheepInfoType';
import { SetCurrentSheepInfoCategory, SetCurrentSheepInfoType } from 'src/app/shared/store/appInfo.actions';
import { DecrementSheepInfoCount, IncrementSheepInfoCount } from 'src/app/shared/store/sheepInfo.actions';

@Injectable({
  	providedIn: 'root'
})
export class RegistrationService {

	categories: Category[] = [
		Category.TotalSheepCategory,
		Category.SheepColourCategory,
		Category.SheepTypeCategory,
		Category.CollarColourCategory
	];

	sheepInfo: SheepInfoType[][] = [
		[
			SheepInfoType.TotalSheepInfo
		],
		[
			SheepInfoType.WhiteSheepInfo,
			SheepInfoType.BlackSheepInfo,
			SheepInfoType.BrownSheepInfo
		],
		[
			SheepInfoType.EweInfo,
			SheepInfoType.LambInfo
		],
		[
			SheepInfoType.BlueCollarInfo,
			SheepInfoType.GreenCollarInfo,
			SheepInfoType.YellowCollarInfo,
			SheepInfoType.RedCollarInfo,
			SheepInfoType.MissingCollarInfo
		]
	];

	currentCategoryIndex = 0;
	currentSheepInfoIndex = 0;
	currentCategory: Category;
	currentSheepInfo: SheepInfoType;

	sheepInfoCountInCurrentCategory: BehaviorSubject<number>;

	constructor(private store: Store) {
		this.currentCategory = this.categories[this.currentCategoryIndex];
		this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
		this.sheepInfoCountInCurrentCategory = new BehaviorSubject<number>(this.sheepInfo[this.currentCategoryIndex].length);
	}

	increment(): void {
		this.store.dispatch(new IncrementSheepInfoCount({ category: this.currentCategory, sheepInfoType: this.currentSheepInfo }));
	}

	decrement(): void {
		this.store.dispatch(new DecrementSheepInfoCount({ category: this.currentCategory, sheepInfoType: this.currentSheepInfo }));
	}

	nextCategory(): boolean {
		if (this.currentCategoryIndex + 1 >= this.categories.length) {
			return false;
		} else {
			this.currentCategoryIndex++;
			this.currentSheepInfoIndex = 0;

			this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
			this.currentCategory = this.categories[this.currentCategoryIndex];
		}

		this.sheepInfoCountInCurrentCategory.next(this.sheepInfo[this.currentCategoryIndex].length);
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentCategory));
		this.store.dispatch(new SetCurrentSheepInfoType(this.currentSheepInfo));
		return true;
	}

	prevCategroy(): boolean {
		if (this.currentCategoryIndex - 1 < 0) {
			return false;
		} else {
			this.currentCategoryIndex--;
			this.currentSheepInfoIndex = 0;

			this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
			this.currentCategory = this.categories[this.currentCategoryIndex];
		}

		this.sheepInfoCountInCurrentCategory.next(this.sheepInfo[this.currentCategoryIndex].length);
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentCategory));
		this.store.dispatch(new SetCurrentSheepInfoType(this.currentSheepInfo));
		return true;
	}

	nextSheepInfo(): void {
		if (this.currentSheepInfoIndex + 1 >= this.sheepInfo[this.currentCategoryIndex].length) {
			this.currentSheepInfoIndex = 0;
		} else {
			this.currentSheepInfoIndex++;
		}

		this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
		this.store.dispatch(new SetCurrentSheepInfoType(this.currentSheepInfo));
	}

	prevSheepInfo(): void {
		if (this.currentSheepInfoIndex <= 0) {
			this.currentSheepInfoIndex = this.sheepInfo[this.currentCategoryIndex].length - 1;
		} else {
			this.currentSheepInfoIndex--;
		}

		this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
		this.store.dispatch(new SetCurrentSheepInfoType(this.currentSheepInfo));
	}

	getSheepInfoCountInCurrentCategory(): Observable<number> {
		return this.sheepInfoCountInCurrentCategory.asObservable();
	}

	complete(): void {
		this.resetState();
	}

	cancel(): void {
		this.resetState();
	}

	private resetState(): void {
		this.currentCategoryIndex = 0;
		this.currentSheepInfoIndex = 0;
		this.currentCategory = this.categories[this.currentCategoryIndex];
		this.currentSheepInfo = this.sheepInfo[this.currentCategoryIndex][this.currentSheepInfoIndex];
		this.sheepInfoCountInCurrentCategory.next(this.sheepInfo[this.currentCategoryIndex].length);
		this.store.dispatch(new SetCurrentSheepInfoType(this.currentSheepInfo));
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentCategory));
	}
}
