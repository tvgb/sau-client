import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SheepType } from '../../../../app/shared/enums/SheepType';
import { DecrementSheepTypeCount, IncrementSheepTypeCount } from '../../../shared/store/sheepInfo.actions';
import { SheepInfoState } from '../../../../app/shared/store/sheepInfo.state';
import { Observable } from 'rxjs';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-sheep-type-count',
  templateUrl: './sheep-type-count.page.html',
  styleUrls: ['./sheep-type-count.page.scss'],
})
export class SheepTypeCountPage implements OnInit {

	categories: SheepType[] = [
		SheepType.Ewe,
		SheepType.Lamb
	];

	selectedCategoryIndex = 0;
	sheepTypeCount;
	nextRouteUri = '/registration/collar-colour-count';

	@Select(SheepInfoState.getSheepTypeCount) sheepTypeCount$: Observable<object>;

	constructor(private store: Store, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.tts.speakRegistration(' type');
		this.sheepTypeCount$.subscribe(res => {
			console.log('sheepTypeCount:', res);
			this.sheepTypeCount = res;
		});
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementSheepTypeCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakType(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementSheepTypeCount(this.categories[this.selectedCategoryIndex]));
		this.tts.speakType(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onCategoryRight(): void {
		this.selectedCategoryIndex >= this.categories.length - 1 ? this.selectedCategoryIndex = 0 : this.selectedCategoryIndex++;
		this.tts.speakType(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	onCategoryLeft(): void {
		this.selectedCategoryIndex <= 0 ? this.selectedCategoryIndex = this.categories.length - 1 : this.selectedCategoryIndex--;
		this.tts.speakType(this.selectedCategoryCount(), this.selectedCategoryText());
	}

	selectedCategoryText(): string {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepType.Ewe):
				return 'SØYE';

			case(SheepType.Lamb):
				return 'LAM';
		}
	}

	selectedCategoryCount(): number {
		switch (this.categories[this.selectedCategoryIndex]) {
			case(SheepType.Ewe):
				return this.sheepTypeCount.eweCount;

			case(SheepType.Lamb):
				return this.sheepTypeCount.lambCount;
		}
	}

}
