import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  	providedIn: 'root'
})

export class AlertService {


	private toastNoNetworkMessage =  'kke tilkoblet internett. Bruker nå offline kartutsnitt.';
	private toastNetworkMessage =  'Tilkoblet internett. Bruker online kart.';
	private TOAST_DURATION = 2000;

	constructor(private alertController: AlertController, private toastController: ToastController) { }

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

	async presentNetworkToast(internet: boolean) {
		let toastMessage = '';
		internet ? toastMessage = this.toastNetworkMessage : toastMessage = this.toastNoNetworkMessage;
		const toast = await this.toastController.create({
			message: toastMessage,
			duration: this.TOAST_DURATION
		});
		toast.present();
	}
}
