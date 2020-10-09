import { Component, OnInit } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfo } from 'src/app/shared/classes/SheepInfo';
import { SheepInfoCategoryGrouping } from 'src/app/shared/classes/SheepInfoCategoryGrouping';
import { SheepInfoCategory } from 'src/app/shared/enums/SheepInfoCategory';
import { SetCurrentSheepInfoCategory, SetCurrentSheepInfoCategoryGrouping } from 'src/app/shared/store/appInfo.actions';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { DecrementSheepInfoCategoryCount, IncrementSheepInfoCategoryCount } from 'src/app/shared/store/sheepInfo.actions';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	categoryGroupings: SheepInfoCategoryGrouping[] = [
		{
			name: 'Sau totalt',
			speakText: '',
			sheepInfoCategories: [
				SheepInfoCategory.totalSheepInfo
			]
		},
		{
			name: 'Farge',
			speakText: 'sau',
			sheepInfoCategories: [
				SheepInfoCategory.greyWhiteSheepInfo,
				SheepInfoCategory.whiteBlackHeadSheepInfo,
				SheepInfoCategory.blackSheepInfo,
				SheepInfoCategory.brownSheepInfo
			]
		},
		{
			name: 'Type',
			speakText: '',
			sheepInfoCategories: [
				SheepInfoCategory.eweInfo,
				SheepInfoCategory.lambInfo
			]
		},
		{
			name: 'Slips',
			speakText: 'slips',
			sheepInfoCategories: [
				SheepInfoCategory.blueCollarInfo,
				SheepInfoCategory.greenCollarInfo,
				SheepInfoCategory.yellowCollarInfo,
				SheepInfoCategory.redCollarInfo,
				SheepInfoCategory.missingCollarInfo
			]
		},
	];

	currentGroupingIndex: number;
	currentCategoryIndex: number;
	currentGrouping: SheepInfoCategoryGrouping;
	categoryCount: number;
	sheepInfo: SheepInfo;

	@Select(SheepInfoState.getCurrentSheepInfo) currentSheepInfo$: Observable<SheepInfo>;
	@Select(AppInfoState.getCurrentSheepInfoCategoryGrouping) currentCategoryGrouping$: Observable<SheepInfoCategoryGrouping>;

	constructor(private store: Store, private tts: TextToSpeechService, private router: Router) { }

	ngOnInit() {
		this.currentGroupingIndex = 0;
		this.currentCategoryIndex = 0;

		this.currentGrouping = this.categoryGroupings[this.currentCategoryIndex];
		this.categoryCount = this.currentGrouping.sheepInfoCategories.length;

		this.currentSheepInfo$.subscribe(res => {
			this.sheepInfo = res;
		});
		this.currentCategoryGrouping$.subscribe(res => {
			this.currentGrouping = res;
		});
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementSheepInfoCategoryCount(this.currentGrouping.sheepInfoCategories[this.currentCategoryIndex]));
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.currentGrouping.speakText}`);
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepInfoCategoryCount(this.currentGrouping.sheepInfoCategories[this.currentCategoryIndex]));
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.currentGrouping.speakText}`);
	}

	onCategoryRight(): void {
		this.currentCategoryIndex >= this.categoryCount - 1 ? this.currentCategoryIndex = 0 : this.currentCategoryIndex++;
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentGrouping.sheepInfoCategories[this.currentCategoryIndex]));
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.currentGrouping.speakText}`);
	}

	onCategoryLeft(): void {
		this.currentCategoryIndex <= 0 ? this.currentCategoryIndex = this.categoryCount - 1 : this.currentCategoryIndex--;
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentGrouping.sheepInfoCategories[this.currentCategoryIndex]));
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.currentGrouping.speakText}`);
	}

	onNextGrouping(): void {
		if (this.currentGroupingIndex >= this.categoryGroupings.length - 1) {
			this.router.navigate(['/registration/summary']);
		} else {
			this.currentGroupingIndex++;
			this.changeGrouping();
		}
	}

	onPrevGrouping(): void {
		if (this.currentGroupingIndex <= 0) {
			this.router.navigate(['/map']);
		} else {
			this.currentGroupingIndex--;
			this.changeGrouping();
		}
	}

	changeGrouping(): void {
		this.currentGrouping = this.categoryGroupings[this.currentGroupingIndex];
		this.currentCategoryIndex = 0;
		this.categoryCount = this.currentGrouping.sheepInfoCategories.length;
		this.store.dispatch(new SetCurrentSheepInfoCategory(this.currentGrouping.sheepInfoCategories[this.currentCategoryIndex]));
		this.store.dispatch(new SetCurrentSheepInfoCategoryGrouping(this.currentGrouping));
		this.tts.speak(`Registrer ${this.currentGrouping.name}`);
	}

	onComplete(): void {

	}

	onCancel(): void {
		this.currentGroupingIndex = 0;
		this.currentCategoryIndex = 0;

		this.currentGrouping = this.categoryGroupings[this.currentCategoryIndex];
		this.categoryCount = this.currentGrouping.sheepInfoCategories.length;
		this.store.dispatch(new SetCurrentSheepInfoCategory(SheepInfoCategory.totalSheepInfo));
	}
}
