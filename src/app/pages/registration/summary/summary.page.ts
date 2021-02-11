import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MainCategory } from 'src/app/shared/classes/Category';
import { MainCategoryId } from 'src/app/shared/enums/MainCategoryId';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { AlertService } from 'src/app/shared/services/alert.service';
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
	missingLambText = '';
	inconsistencies: string[] = [];

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
			this.checkForInconsistencies();
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

	checkForInconsistencies(): void {
		this.inconsistencies = [];

		const totalLambsFromCollars =
			this.currentSheepInfo.collarColour.greenCollar.count +
			this.currentSheepInfo.collarColour.yellowCollar.count * 2 +
			this.currentSheepInfo.collarColour.redCollar.count * 3;

		const missingLambs = totalLambsFromCollars - this.currentSheepInfo.sheepType.lamb.count;
		const totalEwes = this.currentSheepInfo.sheepType.ewe.count;
		const totalLambs = this.currentSheepInfo.sheepType.lamb.count;

		const registeredCollars =
			this.currentSheepInfo.collarColour.blueCollar.count +
			this.currentSheepInfo.collarColour.greenCollar.count +
			this.currentSheepInfo.collarColour.yellowCollar.count +
			this.currentSheepInfo.collarColour.redCollar.count +
			this.currentSheepInfo.collarColour.missingCollar.count;

		const registeredColours =
			this.currentSheepInfo.sheepColour.blackSheep.count +
			this.currentSheepInfo.sheepColour.brownSheep.count +
			this.currentSheepInfo.sheepColour.whiteSheep.count;

		const totalSheep = this.currentSheepInfo.totalSheep.totalSheep.count;

		if (registeredColours !== 0 && totalSheep !== registeredColours) {
			this.inconsistencies.push(`Antall registrerte farger (${registeredColours}) samsvarer ikke med totalt antall registrerte sau (${totalSheep}).`);
		}

		if (totalLambs + totalEwes !== 0 && totalSheep !== totalLambs + totalEwes) {
			this.inconsistencies.push(`Antall registrerte søyer og lam (${totalLambs + totalEwes}) samsvarer ikke med totalt antall registrerte sau (${totalSheep}).`);
		}

		if (registeredCollars !== 0 && registeredCollars !== totalEwes) {
			this.inconsistencies.push(`Registrerte slips (${registeredCollars}) samsvarer ikke med antall søyer (${totalEwes}).`);
		}

		if (registeredCollars !== 0 && missingLambs > 0) {
			this.inconsistencies.push(`Registrerte slips tilsier at det mangler ${missingLambs} lam.`);
		} else if (registeredCollars !== 0 && missingLambs < 0) {
			this.inconsistencies.push(`Registrerte slips tilsier at det er ${missingLambs * -1} lam for mye.`);
		}
	}

	onCompleteRegistration() {
		this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.confirmHandler);
	}

	confirmHandler() {
		this.registrationService.completeRegistration(this.currentSheepInfo);
		this.navController.navigateBack(this.mapLink);
	}

	ionViewWillLeave(): void {
		this.sheepInfoSub.unsubscribe();
		this.currentMainCategorySub.unsubscribe();
	}
}
