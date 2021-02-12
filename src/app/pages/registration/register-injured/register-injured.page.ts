import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

@Component({
	selector: 'app-register-injured',
	templateUrl: './register-injured.page.html',
	styleUrls: ['./register-injured.page.scss'],
})

export class RegisterInjuredPage {

	registerInjuredForm: FormGroup;

	constructor(private navController: NavController, private formbuilder: FormBuilder, private statusBarService: StatusbarService) {
		this.registerInjuredForm = this.formbuilder.group({
			injuredCount: [''],
			comment: [''],
		});
	}

	ionViewDidEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	navigateBack() {
		this.navController.back();
	}
}
