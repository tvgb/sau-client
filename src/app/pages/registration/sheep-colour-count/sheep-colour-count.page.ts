import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoState } from '../../../shared/store/sheepInfo.state';
import { DecrementSheepColourCount, IncrementSheepColourCount } from '../../../shared/store/sheepInfo.actions';
import { SheepColour } from '../../../shared/enums/SheepColour';
import { SheepColourCounts } from '../../../shared/classes/SheepColourCounts';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-sheep-colour-count',
  templateUrl: './sheep-colour-count.page.html',
  styleUrls: ['./sheep-colour-count.page.scss'],
})
export class SheepColourCountPage implements OnInit {

	categories: SheepColour[] = [
		SheepColour.Black,
		SheepColour.GreyWhite,
		SheepColour.Brown,
		SheepColour.WhiteBlackHead
	];

	selectedCategoryIndex = 0;
	nextRoute = '/registration/sheep-type-count';
	sheepColourCount;

	sheepColourCounts: SheepColourCounts;

	@Select(SheepInfoState.getSheepColourCounts) sheepColourCounts$: Observable<SheepColourCounts>;

	constructor(private store: Store, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.tts.speakRegistration(' farge');
		this.sheepColourCounts$.subscribe(res => {
			this.sheepColourCounts = res;
		});
	}

  	onIncrement(): void {
		this.store.dispatch(new IncrementSheepColourCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepColourCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
		this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
		this.tts.speakColor(this.selectCategoryCount(), this.selectedCategoryText());

	}

	selectedCategoryText(): string {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepColour.Black):
				return 'SVART';

			case(SheepColour.GreyWhite):
				return 'GRÅ / HVIT';

			case(SheepColour.Brown):
				return 'BRUN';

			case(SheepColour.WhiteBlackHead):
				return 'HVIT MED SVART HODE';
		}
	}

	selectCategoryCount(): number {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepColour.Black):
				return this.sheepColourCounts.blackSheepCount;

			case(SheepColour.GreyWhite):
				return this.sheepColourCounts.greyWhiteSheepCount;

			case(SheepColour.Brown):
				return this.sheepColourCounts.brownSheepCount;

			case(SheepColour.WhiteBlackHead):
				return this.sheepColourCounts.whiteBlackHeadSheepCount;
		}
	}
}
