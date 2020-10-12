import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfo } from 'src/app/shared/classes/SheepInfo';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { SheepInfoCategory } from '../../../shared/classes/SheepInfoCategory';
import { Platform } from '@ionic/angular';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	sheepInfo: SheepInfo;
	sheepInfoCategory: SheepInfoCategory;
	sheepInfoCountInCurrentCategory: number;

	@Select(SheepInfoState.getCurrentSheepInfo) currentSheepInfo$: Observable<SheepInfo>;
	@Select(AppInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<SheepInfoCategory>;

	constructor(
		private store: Store,
		private registrationService: RegistrationService,
		private tts: TextToSpeechService,
		private router: Router,
		private platform: Platform) {
		this.platform.backButton.subscribeWithPriority(10, () => {
			this.onPrevCategory();
			});
	}

	ngOnInit() {
		this.currentSheepInfo$.subscribe(res => {
			if (res) {
				this.sheepInfo = res;
			}
		});

		this.registrationService.getSheepInfoCountInCurrentCategory().subscribe(res => {
			if (res) {
				this.sheepInfoCountInCurrentCategory = res;
			}
		});

		this.currentSheepInfoCategory$.subscribe(res => {
			if (res) {
				this.sheepInfoCategory = res;
			}
		});
	}

	onIncrement(): void {
		this.registrationService.increment();
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.sheepInfoCategory.speakText}`);
	}

	onDecrement(): void {
		this.registrationService.decrement();
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.sheepInfoCategory.speakText}`);
	}

	onSheepInfoRight(): void {
		this.registrationService.nextSheepInfo();
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.sheepInfoCategory.speakText}`);
	}

	onSheepInfoLeft(): void {
		this.registrationService.prevSheepInfo();
		this.tts.speak(`${this.sheepInfo.count} ${this.sheepInfo.name} ${this.sheepInfoCategory.speakText}`);
	}

	onNextCategory(): void {
		if (!this.registrationService.nextCategory()) {
			this.router.navigate(['/registration/summary']);
		}
	}

	onPrevCategory(): void {
		if (!this.registrationService.prevCategroy()) {
			this.router.navigate(['/map']);
		}
	}

	onComplete(): void {

	}

	onCancel(): void {
		this.registrationService.cancel();
	}
}
