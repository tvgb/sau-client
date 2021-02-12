import { Component, ElementRef, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { NavController, Platform } from '@ionic/angular';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { MainCategory, SubCategory } from 'src/app/shared/classes/Category';
import { StateReset } from 'ngxs-reset-plugin';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
	@ViewChild('colourInput') colourInput: ElementRef;
	@ViewChild('registerContainer') registerContainer: ElementRef;

	summaryUrl = '/registration/summary';
	mapUrl = '/map';

	currentSubCategory: SubCategory;
	currentMainCategory: any;
	mainCategoryId = MainCategoryId;
	currentMainCategoryId: MainCategoryId;

	subCategoryCountInCurrentMainCategory: number;
	totalTMID = 'totalTMID';

	formWidth: number;

	@Select(SheepInfoState.getCurrentSubCategory) currentSubCategory$: Observable<SubCategory>;
	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;
	@Select(AppInfoState.getCurrentMainCategoryId) currentCategory$: Observable<MainCategoryId>;

	currentSubCategorySub: Subscription;
	currentMainCategorySub: Subscription;
	currentMainCategoryIdSub: Subscription;
	subCategoryCountInCurrentMainCategorySub: Subscription;

	private unsubscribe$: Subject<void> = new Subject();

	constructor(
		private store: Store,
		private statusBarService: StatusbarService,
		private registrationService: RegistrationService,
		private tts: TextToSpeechService,
		private navController: NavController,
		private platform: Platform) {

		this.platform.backButton.subscribeWithPriority(10, () => {
			this.onPrevMainCategory();
		});
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
		this.currentSubCategorySub = this.currentSubCategory$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((res: SubCategory) => {
			if (res) {
				this.currentSubCategory = res;
			}
		});

		this.subCategoryCountInCurrentMainCategorySub = this.registrationService.getSubCategoryCountInCurrentMainCategory().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(
			(res: number) => {
				if (res) {
					this.subCategoryCountInCurrentMainCategory = res;
				}
		});

		this.currentMainCategorySub = this.currentMainCategory$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((res: MainCategory) => {
			if (res) {
				this.currentMainCategory = res;
			}
		});

		this.currentMainCategoryIdSub = this.currentCategory$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((res: MainCategoryId) => {
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
			this.navController.navigateForward(this.summaryUrl);
		} else if (this.currentMainCategoryId === MainCategoryId.EarTag) {
			this.setFormWitdh();
			this.tts.speak(`Registrer ${this.currentMainCategory.name}`);
		} else {
			this.tts.speak(`Registrer ${this.currentMainCategory.name}, ${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
		}
	}

	onPrevMainCategory(): void {
		if (!this.registrationService.prevMainCategroy()) {
			this.onCancel();
			this.navController.navigateBack(this.mapUrl);
		} else if (this.currentMainCategoryId === MainCategoryId.EarTag) {
			this.setFormWitdh();
			this.tts.speak(`Registrer ${this.currentMainCategory.name}`);
		} else {
			this.tts.speak(`Registrer ${this.currentMainCategory.name}, ${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
		}
	}

	onHoldForReadout(): void {
		this.tts.speak(`${this.currentSubCategory.count} ${this.currentSubCategory.name} ${this.currentMainCategory.speakText}`);
	}

	onCancel(): void {
		this.registrationService.cancel();
		this.store.dispatch(new StateReset(SheepInfoState, AppInfoState));
	}

	private setFormWitdh(): void {
		if (this.registerContainer) {
			this.formWidth = this.registerContainer.nativeElement.clientWidth * 0.9; // Fordi elementene har 90% width. Ja dette er en hack.
		} else {
			this.formWidth = 300;
		}
	}

	ionViewWillLeave(): void {
		this.unsubscribe$.next();
	}
}
