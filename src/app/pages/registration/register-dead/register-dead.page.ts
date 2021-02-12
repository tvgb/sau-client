import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../services/registration.service';

@Component({
	selector: 'app-register-dead',
	templateUrl: './register-dead.page.html',
	styleUrls: ['./register-dead.page.scss'],
})

export class RegisterDeadPage {

	registerDeadForm: FormGroup;

	constructor(private navController: NavController,
				         private formbuilder: FormBuilder,
				         private statusBarService: StatusbarService,
				         private regService: RegistrationService) {
		this.registerDeadForm = this.formbuilder.group({
			deadCount: [''],
			comment: [''],
		});
	}

	ionViewDidEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	onCompleteRegistration() {
		this.regService.completeRegistration(undefined,
			this.registerDeadForm.controls.deadCount.value,
			this.registerDeadForm.controls.comment.value);
		this.navController.back();
	}

	navigateBack() {
		this.navController.back();
	}
}
