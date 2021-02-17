import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../services/registration.service';
import { Plugins, CameraResultType} from '@capacitor/core';
import { AlertService } from 'src/app/shared/services/alert.service';

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
	submitAttempt = false;
	registerDeadForm: FormGroup;
	invalidText = 'Obligatorisk felt';

	constructor(
		private navController: NavController,
		private formbuilder: FormBuilder,
		private statusBarService: StatusbarService,
		private regService: RegistrationService,
		private alertService: AlertService) {
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
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64
		});
		this.capturedImage = image.base64String;
		this.images.push(this.capturedImage);
	}

	async confirmPhotoRemoval(index: number) {
		this.alertService.confirmAlert(this.removeAlertHeader, this.removeAlertMessage, this, this.removePhoto, index);
	}

	removePhoto(index: number) {
		this.images.splice(index, 1);
	}

	onCompleteRegistration() {
		this.submitAttempt = true;
		if (this.registerDeadForm.valid) {
			this.regService.completeRegistration(undefined,
			this.registerDeadForm.controls.deadCount.value,
			this.registerDeadForm.controls.comment.value);
			this.navController.back();
		}
	}

	navigateBack() {
		this.navController.back();
	}
}
