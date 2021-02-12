import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

@Component({
	selector: 'app-register-dead',
	templateUrl: './register-dead.page.html',
	styleUrls: ['./register-dead.page.scss'],
})

export class RegisterDeadPage {

	registerDeadForm: FormGroup;

	constructor(private navController: NavController, private formbuilder: FormBuilder, private statusBarService: StatusbarService) {
		this.registerDeadForm = this.formbuilder.group({
			deadCount: [''],
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
