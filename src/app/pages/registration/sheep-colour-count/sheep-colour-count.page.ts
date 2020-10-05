import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoState } from '../../../shared/store/sheepInfo.state';
import { DecrementSheepColourCount, IncrementSheepColourCount } from '../../../shared/store/sheepInfo.actions';
import { SheepColour } from '../../../shared/enums/SheepColour';
import { SheepColourCount } from '../../../shared/classes/SheepColourCount';
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

	@Select(SheepInfoState.getSheepColourCount) sheepColourCount$: Observable<SheepColourCount>;

	constructor(private store: Store, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.sheepColourCount$.subscribe(res => {
			console.log('sheepColourCount:', res);

		});
	}

  	onIncrement(): void {
		const num = this.store.dispatch(new IncrementSheepColourCount(this.categories[this.selectedCategoryIndex]));
		num.subscribe(res => {
			console.log(res);
		});

		this.tts.speakColor(num, this.selectedCategoryText());
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
