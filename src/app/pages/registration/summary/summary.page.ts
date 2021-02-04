import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable, Subscription } from 'rxjs';
import { MainCategory } from 'src/app/shared/classes/Category';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AddRegistration } from 'src/app/shared/store/fieldTripInfo.actions';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { RegistrationService } from '../services/registration.service';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage {


	currentSheepInfo: SheepInfoModel;
	currentMainCategory: MainCategory;
	mainCategoryIds = MainCategoryId;
	private totalSheep = 0;
	missingLambText = '';

	alertHeader = 'Fullfør registrering';
	alertMessage = 'Ønsker du å fullføre registrering av sau?';
	mapLink = '/map';

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;
	@Select(SheepInfoState.getCurrentMainCategory) currentMainCategory$: Observable<MainCategory>;

	sheepInfoSub: Subscription;
	currentMainCategorySub: Subscription;

  	constructor(
		private alertService: AlertService,
		private navController: NavController,
		private tts: TextToSpeechService,
		private registrationService: RegistrationService) { }

	ionViewWillEnter(): void {
		this.tts.speak('Oppsummering');
		this.sheepInfoSub = this.sheepInfo$.subscribe(res => {
			this.currentSheepInfo = res;
		});

		this.currentMainCategorySub = this.currentMainCategory$.subscribe(res => {
			if (res) {
				this.currentMainCategory = res;
			}
		});
	}

	navigateBack() {
		this.tts.speak(`Registrer ${this.currentMainCategory.name}`);
		this.navController.back();
	}

	checkTotalSheep(): boolean {
		this.totalSheep = this.currentSheepInfo.sheepType.ewe.count + this.currentSheepInfo.sheepType.lamb.count;
		if (this.totalSheep === this.currentSheepInfo.totalSheep.totalSheep.count) {
			return true;
		}
		return false;
	}

	checkCollarNumber(): boolean {
		const totalLambs = this.currentSheepInfo.collarColour.greenCollar.count +
		this.currentSheepInfo.collarColour.yellowCollar.count * 2 + this.currentSheepInfo.collarColour.redCollar.count * 3;
		const missingLambs = totalLambs - this.currentSheepInfo.sheepType.lamb.count;

		const registeredCollars =
			this.currentSheepInfo.collarColour.blueCollar.count +
			this.currentSheepInfo.collarColour.greenCollar.count +
			this.currentSheepInfo.collarColour.yellowCollar.count +
			this.currentSheepInfo.collarColour.redCollar.count +
			this.currentSheepInfo.collarColour.missingCollar.count;

		if (registeredCollars === 0) {
			return true;
		}
		if (missingLambs > 0) {
			this.missingLambText = `Registrerte slips tilsier at det mangler ${missingLambs} lam.`;
			return false;
		}
		else if (missingLambs < 0) {
			this.missingLambText =  `Registrerte slips tilsier at det er ${missingLambs * -1} lam for mye.`;
			return false;
		}
		return true;
	}

	onCompleteRegistration() {
		this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.confirmHandler);
	}

	confirmHandler() {
		this.registrationService.completeRegistration(this.currentSheepInfo);
		// this.registrationService.complete();
		this.navController.navigateBack(this.mapLink);
	}

	ionViewWillLeave(): void {
		this.sheepInfoSub.unsubscribe();
		this.currentMainCategorySub.unsubscribe();
	}
}
