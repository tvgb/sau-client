import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import { SheepInfoCategoryGrouping } from 'src/app/shared/classes/SheepInfoCategoryGrouping';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	sheepInfo: SheepInfoModel;
	currentCategoryGrouping: SheepInfoCategoryGrouping;

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;
	@Select(AppInfoState.getCurrentSheepInfoCategoryGrouping) currentCategoryGrouping$: Observable<SheepInfoCategoryGrouping>;

  	constructor(private navController: NavController, private tts: TextToSpeechService, private store: Store, private alertController: AlertController, private router: Router) { }

	ngOnInit() {
		this.tts.speak('Oppsummering');

		this.sheepInfo$.subscribe(res => {
			this.sheepInfo = res;
		});

		this.currentCategoryGrouping$.subscribe(res => {
			this.currentCategoryGrouping = res;
		});
	}

	navigateBack() {
		this.tts.speak(`Registrer ${this.currentCategoryGrouping.name}`);
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
