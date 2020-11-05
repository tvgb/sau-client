import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SheepInfo } from 'src/app/shared/classes/SheepInfo';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { Platform } from '@ionic/angular';
import { Category } from 'src/app/shared/enums/Category';
import { TimeTakingService } from '../services/time-taking.service';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { SheepInfoCategory } from 'src/app/shared/classes/SheepInfoCategory';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

	currentSheepInfo: SheepInfo;
	currentSheepInfoCategory: any;
	category = Category;
	currentCategory: Category;

	sheepInfoCountInCurrentCategory: number;
	totalTMID = 'totalTMID';

	@Select(SheepInfoState.getCurrentSheepInfo) currentSheepInfo$: Observable<SheepInfo>;
	@Select(SheepInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<any>;
	@Select(AppInfoState.getCurrentSheepInfoCategory) currentCategory$: Observable<Category>;

	currentSheepInfoSub: Subscription;
	currentSheepInfoCategorySub: Subscription;
	currentCategorySub: Subscription;
	sheepInfoCountInCurrentCategorySub: Subscription;

	constructor(
		private store: Store,
		private registrationService: RegistrationService,
		private tts: TextToSpeechService,
		private router: Router,
		private platform: Platform,
		private timeTakingService: TimeTakingService) {

		this.platform.backButton.subscribeWithPriority(10, () => {
			this.onPrevCategory();
		});
	}

	ionViewWillEnter() {
		this.currentSheepInfoSub = this.currentSheepInfo$.subscribe((res: SheepInfo) => {
			if (res) {
				this.currentSheepInfo = res;
			}
		});

		this.sheepInfoCountInCurrentCategorySub = this.registrationService.getSheepInfoCountInCurrentCategory().subscribe((res: number) => {
			if (res) {
				this.sheepInfoCountInCurrentCategory = res;
			}
		});

		this.currentSheepInfoCategorySub = this.currentSheepInfoCategory$.subscribe((res: SheepInfoCategory) => {
			if (res) {
				this.currentSheepInfoCategory = res;
			}
		});

		this.currentCategorySub = this.currentCategory$.subscribe((res: Category) => {
			if (this.currentCategory && this.currentCategory !== res) {
				this.timeTakingService.stopStopWatch(this.currentCategory);
			}

			this.currentCategory = res;
			this.timeTakingService.startNewStopWatch(this.currentCategory);
		});
	}

	ionViewDidEnter() {
		this.timeTakingService.startNewStopWatch(this.totalTMID);
		this.timeTakingService.startNewStopWatch(this.currentSheepInfoCategory.category);
	}

	onIncrement(): void {
		this.registrationService.increment();
		this.tts.speak(`${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onDecrement(): void {
		this.registrationService.decrement();
		this.tts.speak(`${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onSheepInfoRight(): void {
		this.registrationService.prevSheepInfo();
		this.tts.speak(`${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onSheepInfoLeft(): void {
		this.registrationService.nextSheepInfo();
		this.tts.speak(`${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onNextCategory(): void {
		if (!this.registrationService.nextCategory()) {
			this.router.navigate(['/registration/summary']);
		} else {
			this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}, ${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
		}
	}

	onPrevCategory(): void {
		if (!this.registrationService.prevCategroy()) {
			this.router.navigate(['/map']);
		} else {
			this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}, ${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
		}
	}

	onComplete(): void {

	}

	onCancel(): void {
		this.timeTakingService.clearTimeTakings();
		this.registrationService.cancel();
	}

	ionViewWillLeave(): void {
		this.timeTakingService.stopStopWatch(this.totalTMID);
		this.timeTakingService.stopStopWatch(this.currentCategory);

		this.currentSheepInfoSub.unsubscribe();
		this.sheepInfoCountInCurrentCategorySub.unsubscribe();
		this.currentSheepInfoCategorySub.unsubscribe();
		this.currentCategorySub.unsubscribe();
	}
}
