import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

	private loginUrl = '/login';

	constructor(private authService: AuthService, private navController: NavController) { }

	signOutButtonPressed(): void {
		this.authService.signOut().then((signOutSucceeded) => {
			if (signOutSucceeded) {
				this.navController.navigateForward(this.loginUrl);
			} else {
				// Gi beskjed om at det ikke fungerte!
			}
		});
	}
}
