import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { CollarColour } from '../../../shared/enums/CollarColour';
import { DecrementCollarColourCount, IncrementCollarColourCount } from '../../../shared/store/sheepInfo.actions';
import { TextToSpeechService } from '../services/text-to-speech.service';

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
	collarColourCount;
	nextRouteUri = '/registration/summary';

	@Select(SheepInfoState.getCollarColour) collarColourCount$: Observable<CollarColour>;

	constructor(private store: Store, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.collarColourCount$.subscribe(res => {
			this.collarColourCount = res;
		});
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementCollarColourCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakCollar(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementCollarColourCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakCollar(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
		this.tts.speakCollar(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
		this.tts.speakCollar(this.selectedCategoryCount(), this.selectedCategoryText());
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

	selectedCategoryCount(): number {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(CollarColour.Blue):
				return this.collarColourCount.blueCollarCount;

			case(CollarColour.Green):
				return this.collarColourCount.greenCollarCount;

			case(CollarColour.Yellow):
				return this.collarColourCount.yellowCollarCount;

			case(CollarColour.Red):
				return this.collarColourCount.redCollarCount;

			case(CollarColour.Missing):
				return this.collarColourCount.missingCollarCount;
		}
	}
}
