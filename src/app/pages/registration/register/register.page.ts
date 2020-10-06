import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	constructor(private store: Store, private tts: TextToSpeechService) { }

	ngOnInit() {
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

}
