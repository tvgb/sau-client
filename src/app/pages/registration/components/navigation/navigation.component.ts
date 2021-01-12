import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StateResetAll } from 'ngxs-reset-plugin';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { VibrationService } from '../../services/vibration.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Output() nextMainCategory = new EventEmitter();
	@Output() prevMainCategory = new EventEmitter();
	@Output() cancelRegistration = new EventEmitter();
	@Output() completeRegistration = new EventEmitter();

	completeRoute = '/registration/summary';
	cancelRoute = '/map';

	constructor(
		private vibration: VibrationService,
		private router: Router,
		private store: Store,
		private alertController: AlertController) { }

	ngOnInit(): void {}

	nextMainCategoryClick() {
		this.vibration.vibrate();
		this.nextMainCategory.emit();
	}

	prevMainCategoryClick() {
		this.vibration.vibrate();
		this.prevMainCategory.emit();
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
