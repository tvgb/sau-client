import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PredatorType } from 'src/app/shared/enums/PredatorType';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { RegistrationService } from '../services/registration.service';

@Component({
	selector: 'app-register-predator',
	templateUrl: './register-predator.page.html',
	styleUrls: ['./register-predator.page.scss'],
})

export class RegisterPredatorPage {

	registerPredatorForm: FormGroup;
	predatorTypes = [];
	submitAttempt = false;

	constructor(private navController: NavController, private formbuilder: FormBuilder, private statusBarService: StatusbarService, private regService: RegistrationService) {
		this.registerPredatorForm = this.formbuilder.group({
			predatorType: ['', Validators.required],
			comment: ['']
		});
	}

	ionViewWillEnter() {
		this.getPredatorTypes();
	}

	ionViewDidEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}


	getPredatorTypes(): void {
		const keys = Object.values(PredatorType);
		keys.forEach((types) => {
			this.predatorTypes.push(types);
		});
	}
	onCompleteRegistration(): void {
		if (this.submitAttempt) {
			console.log('hei');
		}
	}
	navigateBack() {
		this.navController.back();
	}

}
