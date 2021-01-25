import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { Platform } from '@ionic/angular';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { MainCategory, SubCategory } from 'src/app/shared/classes/Category';
import { Plugins, StatusBarStyle} from '@capacitor/core';
import { StateResetAll } from 'ngxs-reset-plugin';

const {StatusBar} = Plugins;

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

	currentSubCategory: SubCategory;
	currentMainCategory: any;
	mainCategoryId = MainCategoryId;
	currentMainCategoryId: MainCategoryId;

	subCategoryCountInCurrentMainCategory: number;
	totalTMID = 'totalTMID';

	@Select(SheepInfoState.getCurrentSubCategory) currentSubCategory$: Observable<SubCategory>;
	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;
	@Select(AppInfoState.getCurrentMainCategoryId) currentCategory$: Observable<MainCategoryId>;

	currentSubCategorySub: Subscription;
	currentMainCategorySub: Subscription;
	currentMainCategoryIdSub: Subscription;
	subCategoryCountInCurrentMainCategorySub: Subscription;

	constructor(
		private store: Store,
		private registrationService: RegistrationService,
		private tts: TextToSpeechService,
		private router: Router,
		private platform: Platform) {

		this.platform.backButton.subscribeWithPriority(10, () => {
			this.onPrevMainCategory();
		});
	}

	changeStatusBarTextColor(): void {
		StatusBar.setOverlaysWebView({
			overlay: false
		});
		StatusBar.setStyle({
			style: StatusBarStyle.Dark
		});
		StatusBar.setBackgroundColor({
			color: '#1C262F'
		});
	}

	ionViewWillEnter() {
		this.changeStatusBarTextColor();
		this.currentSubCategorySub = this.currentSubCategory$.subscribe((res: SubCategory) => {
			if (res) {
				this.currentSubCategory = res;
			}
		});

		this.subCategoryCountInCurrentMainCategorySub = this.registrationService.getSubCategoryCountInCurrentMainCategory().subscribe(
			(res: number) => {
				if (res) {
					this.subCategoryCountInCurrentMainCategory = res;
				}
		});

		this.currentMainCategorySub = this.currentMainCategory$.subscribe((res: MainCategory) => {
			if (res) {
				this.currentMainCategory = res;
			}
		});

		this.currentMainCategoryIdSub = this.currentCategory$.subscribe((res: MainCategoryId) => {
			if (res) {
				this.currentMainCategoryId = res;
			}
		});
	}

	onIncrement(): void {
		this.registrationService.increment();
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onDecrement(): void {
		this.registrationService.decrement();
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onSubCategoryRight(): void {
		this.registrationService.prevSubCategory();
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onSubCategoryLeft(): void {
		this.registrationService.nextSubCategory();
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onNextMainCategory(): void {
		if (!this.registrationService.nextMainCategory()) {
			this.router.navigate(['/registration/summary']);
		} else {
			this.tts.speak(`Registrer ${this.currentMainCategory.name}, ${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
		}
	}

	onPrevMainCategory(): void {
		if (!this.registrationService.prevMainCategroy()) {
			this.onCancel();
			this.router.navigate(['/map']);
		} else {
			this.tts.speak(`Registrer ${this.currentMainCategory.name}, ${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
		}
	}

	onHoldForReadout(): void {
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onCancel(): void {
		this.registrationService.cancel();
		this.store.dispatch(new StateResetAll());
	}

	ionViewWillLeave(): void {
		this.currentSubCategorySub.unsubscribe();
		this.subCategoryCountInCurrentMainCategorySub.unsubscribe();
		this.currentMainCategorySub.unsubscribe();
		this.currentMainCategoryIdSub.unsubscribe();
	}
}
