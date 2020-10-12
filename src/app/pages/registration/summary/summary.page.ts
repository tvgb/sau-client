import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import { SheepInfoCategory } from 'src/app/shared/classes/SheepInfoCategory';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	currentSheepInfo: SheepInfoModel;
	currentSheepInfoCategory: SheepInfoCategory;

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;
	@Select(SheepInfoState.getCurrentSheepInfoCategory) currentSheepInfoCategory$: Observable<SheepInfoCategory>;

  	constructor(
		private navController: NavController,
		private tts: TextToSpeechService,
		private store: Store,
		private alertController: AlertController,
		private router: Router) { }

	ngOnInit() {
		this.tts.speak('Oppsummering');

		this.sheepInfo$.subscribe(res => {
			this.currentSheepInfo = res;
		});

		this.currentSheepInfoCategory$.subscribe(res => {
			if (res) {
				this.currentSheepInfoCategory = res;
			}
		});
	}

	navigateBack() {
		this.tts.speak(`Registrer ${this.currentSheepInfoCategory.name}`);
		this.navController.back();
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
						this.router.navigate(['/map']);
						console.log('Returning to map page, clearing state');
					}
				}
			]
		});
		await alert.present();
	}
}
