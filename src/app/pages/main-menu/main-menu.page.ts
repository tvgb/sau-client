import { Component } from '@angular/core';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.page.html',
	styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage {

	private offlineMapUrl = '/offline-maps';
	private newFieldTripUrl = '/new-field-trip';
	private settingsUrl = '/settings';
	private fieldTripsUrl = '/field-trips';

	constructor(private navController: NavController, private statusBarService: StatusbarService, private routerOutlet: IonRouterOutlet) {
		this.routerOutlet.swipeGesture = false;
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	newFieldTripButtonClicked(): void {
		this.navController.navigateForward(this.newFieldTripUrl);
	}

	offlineMapsButtonClicked(): void {
		this.navController.navigateForward(this.offlineMapUrl);
	}

	fieldTripsButtonClicked(): void {
		this.navController.navigateForward(this.fieldTripsUrl);
	}

	settingsButtonClicked(): void {
		this.navController.navigateForward(this.settingsUrl);
	}

	testPageButtonClicked(): void {
		this.navController.navigateForward('/test-page')
	}
}
