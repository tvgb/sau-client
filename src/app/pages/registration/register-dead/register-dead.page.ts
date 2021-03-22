import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../services/registration.service';
import { Plugins, CameraResultType} from '@capacitor/core';

const { Camera} = Plugins;

@Component({
	selector: 'app-register-dead',
	templateUrl: './register-dead.page.html',
	styleUrls: ['./register-dead.page.scss'],
})

export class RegisterDeadPage {

	removeAlertHeader = 'Fjerne bilde';
	removeAlertMessage = 'Ønsker du å fjerne bilde fra registrering?';
	images = [];
	capturedImage: any;
	base64Url = 'data:image/jpeg;base64, ';
	submitAttempt = false;
	registerDeadForm: FormGroup;
	invalidText = 'Obligatorisk felt';

	constructor(
		private navController: NavController,
		private alertController: AlertController,
		private cdr: ChangeDetectorRef,
		private formbuilder: FormBuilder,
		private statusBarService: StatusbarService,
		private regService: RegistrationService) {
		this.registerDeadForm = this.formbuilder.group({
			deadCount: ['', Validators.required],
			comment: [''],
		});
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	async addPhoto() {
		const image = await Camera.getPhoto({
			quality: 20,
			allowEditing: false,
			resultType: CameraResultType.Base64
		});
		this.capturedImage = this.base64Url + image.base64String;

		this.images.push(this.capturedImage);
		this.cdr.detectChanges();
	}

	async confirmPhotoRemoval(index: number) {
		const alert = await this.alertController.create({
			cssClass: 'alertConfirm',
			header: this.removeAlertHeader,
			backdropDismiss: true,
			message: this.removeAlertMessage,
			buttons: [
				{
					text: 'Nei',
					role: 'cancel',
					handler: () => {}
				}, {
					text: 'Ja',
					handler: () => {
						this.images.splice(index, 1);
						this.cdr.detectChanges();
					}
				}
			]
		});
		await alert.present();
	}

	onCompleteRegistration() {
		this.submitAttempt = true;
		if (this.registerDeadForm.valid) {
			this.regService.completeRegistration(
			undefined,
			this.registerDeadForm.controls.deadCount.value,
			this.registerDeadForm.controls.comment.value,
			undefined,
			this.images);
			this.navController.back();
		}
	}

	navigateBack() {
		this.navController.back();
	}
}
