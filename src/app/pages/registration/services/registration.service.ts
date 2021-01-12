import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubCategory } from 'src/app/shared/classes/Category';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { SubCategoryId } from 'src/app/shared/enums/SubCategoryId';
import { SetCurrentMainCategoryId, SetCurrentSubCategoryId } from 'src/app/shared/store/appInfo.actions';
import { DecrementSubCategoryCount, IncrementSubCategoryCount } from 'src/app/shared/store/sheepInfo.actions';

@Injectable({
  	providedIn: 'root'
})
export class RegistrationService {

	mainCategoryIds: MainCategoryId[] = [
		MainCategoryId.TotalSheep,
		MainCategoryId.SheepColour,
		MainCategoryId.SheepType,
		MainCategoryId.CollarColour
	];

	subCategoryIds: SubCategoryId[][] = [
		[
			SubCategoryId.TotalSheep
		],
		[
			SubCategoryId.WhiteSheep,
			SubCategoryId.BlackSheep,
			SubCategoryId.BrownSheep
		],
		[
			SubCategoryId.Ewe,
			SubCategoryId.Lamb
		],
		[
			SubCategoryId.BlueCollar,
			SubCategoryId.GreenCollar,
			SubCategoryId.YellowCollar,
			SubCategoryId.RedCollar,
			SubCategoryId.MissingCollar
		]
	];

	currentMainCategoryIndex = 0;
	currentSubCategoryIndex = 0;
	currentMainCategoryId: MainCategoryId;
	currentSubCategoryId: SubCategoryId;

	subCategoryCountInCurrentMainCategory: BehaviorSubject<number>;

	constructor(private store: Store) {
		this.currentMainCategoryId = this.mainCategoryIds[this.currentMainCategoryIndex];
		this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
		this.subCategoryCountInCurrentMainCategory = new BehaviorSubject<number>(this.subCategoryIds[this.currentMainCategoryIndex].length);
	}

	increment(): void {
		this.store.dispatch(
			new IncrementSubCategoryCount({ mainCategoryId: this.currentMainCategoryId, subCategoryId: this.currentSubCategoryId }));
	}

	decrement(): void {
		this.store.dispatch(
			new DecrementSubCategoryCount({ mainCategoryId: this.currentMainCategoryId, subCategoryId: this.currentSubCategoryId }));
	}

	nextMainCategory(): boolean {
		if (this.currentMainCategoryIndex + 1 >= this.mainCategoryIds.length) {
			return false;
		} else {
			this.currentMainCategoryIndex++;
			this.currentSubCategoryIndex = 0;

			this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
			this.currentMainCategoryId = this.mainCategoryIds[this.currentMainCategoryIndex];
		}

		this.subCategoryCountInCurrentMainCategory.next(this.subCategoryIds[this.currentMainCategoryIndex].length);
		this.store.dispatch(new SetCurrentMainCategoryId(this.currentMainCategoryId));
		this.store.dispatch(new SetCurrentSubCategoryId(this.currentSubCategoryId));
		return true;
	}

	prevMainCategroy(): boolean {
		if (this.currentMainCategoryIndex - 1 < 0) {
			return false;
		} else {
			this.currentMainCategoryIndex--;
			this.currentSubCategoryIndex = 0;

			this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
			this.currentMainCategoryId = this.mainCategoryIds[this.currentMainCategoryIndex];
		}

		this.subCategoryCountInCurrentMainCategory.next(this.subCategoryIds[this.currentMainCategoryIndex].length);
		this.store.dispatch(new SetCurrentMainCategoryId(this.currentMainCategoryId));
		this.store.dispatch(new SetCurrentSubCategoryId(this.currentSubCategoryId));
		return true;
	}

	nextSubCategory(): void {
		if (this.currentSubCategoryIndex + 1 >= this.subCategoryIds[this.currentMainCategoryIndex].length) {
			this.currentSubCategoryIndex = 0;
		} else {
			this.currentSubCategoryIndex++;
		}

		this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
		this.store.dispatch(new SetCurrentSubCategoryId(this.currentSubCategoryId));
	}

	prevSubCategory(): void {
		if (this.currentSubCategoryIndex <= 0) {
			this.currentSubCategoryIndex = this.subCategoryIds[this.currentMainCategoryIndex].length - 1;
		} else {
			this.currentSubCategoryIndex--;
		}

		this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
		this.store.dispatch(new SetCurrentSubCategoryId(this.currentSubCategoryId));
	}

	getSubCategoryCountInCurrentMainCategory(): Observable<number> {
		return this.subCategoryCountInCurrentMainCategory.asObservable();
	}

	complete(): void {
		this.resetState();
	}

	cancel(): void {
		this.resetState();
	}

	private resetState(): void {
		this.currentMainCategoryIndex = 0;
		this.currentSubCategoryIndex = 0;
		this.currentMainCategoryId = this.mainCategoryIds[this.currentMainCategoryIndex];
		this.currentSubCategoryId = this.subCategoryIds[this.currentMainCategoryIndex][this.currentSubCategoryIndex];
		this.subCategoryCountInCurrentMainCategory.next(this.subCategoryIds[this.currentMainCategoryIndex].length);
		this.store.dispatch(new SetCurrentSubCategoryId(this.currentSubCategoryId));
		this.store.dispatch(new SetCurrentMainCategoryId(this.currentMainCategoryId));
	}
}
