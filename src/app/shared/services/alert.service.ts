import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  	providedIn: 'root'
})

export class AlertService {

	constructor(private alertController: AlertController) { }

	async confirmAlert(alertHeader: string, alertMessage: string, context: object, confirmFunction) {
		const alert = await this.alertController.create({
			cssClass: 'alertConfirm',
			header: alertHeader,
			backdropDismiss: true,
			message: alertMessage,
			buttons: [
				{
					text: 'Nei',
					role: 'cancel',
					handler: () => {}
				}, {
					text: 'Ja',
					handler: confirmFunction.bind(context)
				}
			]
		});
		await alert.present();
	}
}
