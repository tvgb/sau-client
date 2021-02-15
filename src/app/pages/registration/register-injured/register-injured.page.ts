import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../services/registration.service';

@Component({
	selector: 'app-register-injured',
	templateUrl: './register-injured.page.html',
	styleUrls: ['./register-injured.page.scss'],
})

export class RegisterInjuredPage {

	submitAttempt = false;
	registerInjuredForm: FormGroup;
	invalidText = 'Obligatorisk felt';

	constructor(private navController: NavController,
				         private formbuilder: FormBuilder,
				         private statusBarService: StatusbarService,
				         private regService: RegistrationService) {
		this.registerInjuredForm = this.formbuilder.group({
			injuredCount: [''],
			comment: [''],
		});
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	onCompleteRegistration() {
		this.submitAttempt = true;
		if (this.registerInjuredForm.valid) {
			this.regService.completeRegistration(undefined,
			this.registerInjuredForm.controls.injuredCount.value,
			this.registerInjuredForm.controls.comment.value);
			this.navController.back();
		}
	}

	navigateBack(): void {
		this.navController.back();
	}
}
