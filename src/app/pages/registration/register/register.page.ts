import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SheepInfoCategory } from 'src/app/shared/enums/SheepInfoCategory';
import { DecrementSheepInfoCategoryCount, IncrementSheepColourCount, IncrementSheepInfoCategoryCount } from 'src/app/shared/store/sheepInfo.actions';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	categoryGroupings: SheepInfoCategory[][] = [
		[
			SheepInfoCategory.totalSheepInfo
		],
		[
			SheepInfoCategory.greyWhiteSheepInfo,
			SheepInfoCategory.whiteBlackHeadSheepInfo,
			SheepInfoCategory.blackSheepInfo,
			SheepInfoCategory.brownSheepInfo
		],
		[
			SheepInfoCategory.eweInfo,
			SheepInfoCategory.lambInfo
		],
		[
			SheepInfoCategory.blueCollarInfo,
			SheepInfoCategory.greenCollarInfo,
			SheepInfoCategory.yellowCollarInfo,
			SheepInfoCategory.redCollarInfo,
			SheepInfoCategory.missingCollarInfo,
		]
	];

	currentGroupingIndex: number;
	currentCategoryIndex: number;

	currentGrouping: SheepInfoCategory[];

	categoryCount: number;

	nextRouteUri = 'lol';

	@Select(SheepInfoState.getSheepColourCounts) sheepColourCounts$: Observable<SheepColourCounts>;


	constructor(private store: Store, private tts: TextToSpeechService) {
		this.currentGroupingIndex = 0;
		this.currentCategoryIndex = 0;

		this.currentGrouping = this.categoryGroupings[this.currentCategoryIndex];
		this.categoryCount = this.categoryGroupings[this.currentCategoryIndex].length;
	}

	ngOnInit() {
		console.log(this.currentGrouping[this.currentCategoryIndex]);
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementSheepInfoCategoryCount(this.currentGrouping[this.currentCategoryIndex]));
		// this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepInfoCategoryCount(this.currentGrouping[this.currentCategoryIndex]));
		// this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onCategoryRight(): void {
		this.currentCategoryIndex >= this.categoryCount - 1 ? this.currentCategoryIndex = 0 : this.currentCategoryIndex++;
		// this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onCategoryLeft(): void {
		this.currentCategoryIndex <= 0 ? this.currentCategoryIndex = this.categoryCount - 1 : this.currentCategoryIndex--;
		// this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	selectedCategoryText(): string {
		switch (this.currentGrouping[this.currentCategoryIndex]) {
			case(SheepInfoCategory.blackSheepInfo):
				return 'SVART';

			case(SheepInfoCategory.greyWhiteSheepInfo):
				return 'GRÅ / HVIT';

			case(SheepColour.Brown):
				return 'BRUN';

			case(SheepColour.WhiteBlackHead):
				return 'HVIT MED SVART HODE';
		}
	}

}
