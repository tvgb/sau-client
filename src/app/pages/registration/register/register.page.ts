import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfo } from 'src/app/shared/classes/SheepInfo';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { Platform } from '@ionic/angular';
import { Category } from 'src/app/shared/enums/Category';
import { TimeTakingService } from '../services/time-taking.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	currentSheepInfo: SheepInfo;
	currentSheepInfoCategory: any;
	category = Category;

	sheepInfoCountInCurrentCategory: number;
	totalTMID = 'totalTMID';

	@Select(SheepInfoState.getCurrentSheepInfo) currentSheepInfo$: Observable<SheepInfo>;
	@Select(SheepInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<any>;

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

	ngOnInit() {
		this.currentSheepInfo$.subscribe(res => {
			if (res) {
				this.currentSheepInfo = res;
			}
		});

		this.registrationService.getSheepInfoCountInCurrentCategory().subscribe(res => {
			if (res) {
				this.sheepInfoCountInCurrentCategory = res;
			}
		});

		this.currentSheepInfoCategory$.subscribe(res => {
			if (res) {
				if (this.currentSheepInfoCategory && this.currentSheepInfoCategory.category !== res.category) {
					this.timeTakingService.stopStopWatch(this.currentSheepInfoCategory.category);
					this.timeTakingService.startNewStopWatch(res.category);
				} else if (!this.currentSheepInfoCategory) {
					this.timeTakingService.startNewStopWatch(res.category);
				}

				this.currentSheepInfoCategory = res;
			}
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
			this.timeTakingService.stopStopWatch(this.totalTMID);
			this.timeTakingService.stopStopWatch(this.currentSheepInfoCategory.category);
			this.router.navigate(['/registration/summary']);
		}
		this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}, ${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onPrevCategory(): void {
		if (!this.registrationService.prevCategroy()) {
			this.router.navigate(['/map']);
		}
		this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}, ${this.currentSheepInfo.count} ${this.currentSheepInfo.name} ${this.currentSheepInfoCategory.speakText}`);
	}

	onComplete(): void {

	}

	onCancel(): void {
		this.timeTakingService.clearTimeTakings();
		this.registrationService.cancel();
	}
}
