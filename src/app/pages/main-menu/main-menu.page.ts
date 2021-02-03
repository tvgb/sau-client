import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.page.html',
	styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage {

	private offlineMapUrl = '/offline-maps';
	private newFieldTripUrl = '/new-field-trip';

	constructor(private navController: NavController, private statusBarService: StatusbarService) { }

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	// changeStatusBarTextColor(): void {
	// 	StatusBar.setOverlaysWebView({
	// 		overlay: false
	// 	});
	// 	StatusBar.setStyle({
	// 		style: StatusBarStyle.Dark
	// 	});
	// 	StatusBar.setBackgroundColor({
	// 		color: '#1C262F'
	// 	});
	// }

	newFieldTripButtonClicked(): void {
		this.navController.navigateForward(this.newFieldTripUrl);
	}

	offlineMapsButtonClicked(): void {
		this.navController.navigateForward(this.offlineMapUrl);
	}
}
