import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable, Subscription } from 'rxjs';
import { SheepInfoCategory } from 'src/app/shared/classes/SheepInfoCategory';
import { Category } from 'src/app/shared/enums/Category';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
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
	currentSheepInfoCategory: SheepInfoCategory;
	category = Category;
	private totalSheep = 0;
	missingLambText = '';

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;
	@Select(SheepInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<any>;

	sheepInfoSub: Subscription;
	currentSheepInfoCategorySub: Subscription;

  	constructor(
		private navController: NavController,
		private tts: TextToSpeechService,
		private store: Store,
		private alertController: AlertController,
		private router: Router,
		private registrationService: RegistrationService) { }

	ionViewWillEnter(): void {
		this.tts.speak('Oppsummering');


		this.sheepInfoSub = this.sheepInfo$.subscribe(res => {
			this.currentSheepInfo = res;
		});

		this.currentSheepInfoCategorySub = this.currentSheepInfoCategory$.subscribe(res => {
			if (res) {
				this.currentSheepInfoCategory = res;
			}
		});
	}

	navigateBack() {
		this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}`);
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
		// const one = 1;
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

	completeRegistration() {
		this.presentConfirmAlert();
	}

	async presentConfirmAlert() {
		const alert = await this.alertController.create({
			cssClass: 'alertConfirm',
			header: 'Fullfør registrering',
			backdropDismiss: true,
			message: 'Ønsker du å fullføre registrering av sau?',
			buttons: [
				{
					text: 'Nei',
					role: 'cancel',
					handler: () => {}
				}, {
					text: 'Ja',
					handler: () => {
						this.store.dispatch(new StateResetAll());
						this.registrationService.complete();


						this.router.navigate(['/registration/time-measurements']);
					}
				}
			]
		});
		await alert.present();
	}

	ionViewWillLeave(): void {
		this.sheepInfoSub.unsubscribe();
		this.currentSheepInfoCategorySub.unsubscribe();
	}
}
