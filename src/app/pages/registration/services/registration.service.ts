import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coordinate } from 'src/app/shared/classes/Coordinate';
import { DeadSheepRegistration, InjuredSheepRegistration, PredatorRegistration, Registration, SheepRegistration } from 'src/app/shared/classes/Registration';
import { SheepInfo } from 'src/app/shared/classes/SheepInfo';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { PredatorType } from 'src/app/shared/enums/PredatorType';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { SubCategoryId } from 'src/app/shared/enums/SubCategoryId';
import { SetCurrentMainCategoryId, SetCurrentSubCategoryId } from 'src/app/shared/store/appInfo.actions';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { AddRegistration } from 'src/app/shared/store/fieldTripInfo.actions';
import { DecrementSubCategoryCount, IncrementSubCategoryCount } from 'src/app/shared/store/sheepInfo.actions';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';

@Injectable({
  	providedIn: 'root'
})
export class RegistrationService {

	gpsPosition: Coordinate;
	registrationPosition: Coordinate;
	registrationType;
	count: number;
	comment: string;

	mainCategoryIds: MainCategoryId[] = [
		MainCategoryId.TotalSheep,
		MainCategoryId.SheepColour,
		MainCategoryId.SheepType,
		MainCategoryId.CollarColour,
		MainCategoryId.EarTag
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
		],
		[
			SubCategoryId.EarTag
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

	completeRegistration(sheepInfo?: SheepInfo, count?: number, comment?: string, predatorType?: PredatorType): void {
		const reg = this.createRegistration(
			this.registrationType,
			this.gpsPosition,
			this.registrationPosition,
			sheepInfo,
			count,
			comment,
			predatorType);
		this.registrationPosition = undefined;
		this.gpsPosition = undefined;
		this.registrationType = undefined;
		this.store.dispatch(new AddRegistration(reg));
		this.store.dispatch(new StateReset(SheepInfoState, AppInfoState));
		this.complete();
	}

	createRegistration(
		registrationType: RegistrationType,
		gpsPos: Coordinate,
		registrationPos: Coordinate,
		sheepInfo: SheepInfo = null,
		count?: number,
		comment?: string,
		predatorType?: PredatorType): Registration
	{
		switch (registrationType) {
			case RegistrationType.Sheep:
				return {dateTime: Date.now(), gpsPos, registrationPos, registrationType, sheepInfo} as SheepRegistration;

			case RegistrationType.Predator:
				return {dateTime: Date.now(), gpsPos, registrationPos, registrationType, predatorType, comment} as PredatorRegistration;

			case RegistrationType.Injured:
				return {dateTime: Date.now(), gpsPos, registrationPos, registrationType, count, comment} as InjuredSheepRegistration;

			case RegistrationType.Dead:
				return {dateTime: Date.now(), gpsPos, registrationPos, registrationType, count, comment} as DeadSheepRegistration;
		}
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
