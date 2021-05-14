import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage {

	private mainMenuUrl = '/main-menu';

	loginAttempted = false;
	loginForm: FormGroup;

	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private navController: NavController
	) {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	loginButtonPressed(): void {
		this.loginForm.clearValidators();


		if (this.loginForm.valid) {
			this.authService.signIn(this.loginForm.controls.email.value.trim(), this.loginForm.controls.password.value)
				.then((loginSucceeded) => {
					if (loginSucceeded) {
						this.loginAttempted = false;
						this.loginForm.controls.email.setErrors(null);
						this.loginForm.controls.password.setErrors(null);
						this.navController.navigateForward(this.mainMenuUrl);
					} else {
						this.loginAttempted = true;
						this.loginForm.controls.email.setErrors({wrongEmail: true});
						this.loginForm.controls.password.setErrors({wrongPassword: true});
					}
				});
		}
	}
}
