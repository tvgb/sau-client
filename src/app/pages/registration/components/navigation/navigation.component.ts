import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Select, Store } from '@ngxs/store';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/enums/Page';
import { StateResetAll } from 'ngxs-reset-plugin';
import {AlertController} from '@ionic/angular';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Output() nextGrouping = new EventEmitter();
	@Output() prevGrouping = new EventEmitter();
	@Output() cancelRegistration = new EventEmitter();
	@Output() completeRegistration = new EventEmitter();

	pages: Page[] = [
		Page.MapPage,
		Page.TotalSheepPage,
		Page.SheepColourPage,
		Page.SheepTypePage,
		Page.CollarColourPage
	];

	selectedPageIndex = 0;
	completeRoute = '/registration/summary';
	cancelRoute = '/map';

	@Select(AppInfoState.getCurrentPage) currentPage$: Observable<Page>;
	@Select(AppInfoState.getPrevPage) prevPage$: Observable<Page>;

	constructor(private vibration: Vibration, private router: Router, private store: Store, private alertController: AlertController) { }

	ngOnInit(): void {}

	nextGroupingClick() {
		this.vibration.vibrate(200);
		this.nextGrouping.emit();
	}

	prevGroupingClick() {
		this.vibration.vibrate(200);
		this.prevGrouping.emit();
	}

	cancel(): void {
		this.presentConfirmAlert();
	}

	complete(): void {
		this.router.navigate([this.completeRoute]);
		this.completeRegistration.emit();
	}

	async presentConfirmAlert() {
		const alert = await this.alertController.create({
			cssClass: 'alertConfirm',
			header: 'Avbryt',
			backdropDismiss: true,
			message: 'Ønsker du å avbryte registrering av sau?',
			buttons: [
				{
					text: 'Nei',
					role: 'cancel',
					handler: () => {
						console.log('alert confirm:  nei');
					}
				}, {
					text: 'Ja',
					handler: () => {
						console.log('Bekreft ja!');
						this.router.navigate([this.cancelRoute]);
						console.log('Returning to map page, clearing state');
						this.store.dispatch(new StateResetAll());
						this.cancelRegistration.emit();
					}
				}
			]
		});
		await alert.present();
	}
}
