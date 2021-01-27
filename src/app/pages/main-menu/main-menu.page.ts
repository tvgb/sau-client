import { Component } from '@angular/core';
import {Plugins, StatusBarStyle} from '@capacitor/core';
import { NavController } from '@ionic/angular';

const {StatusBar} = Plugins;

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.page.html',
	styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage {

	private offlineMapUrl = '/offline-maps';
	private newFieldTripUrl = '/new-field-trip';

	constructor(private navController: NavController) { }

	ionViewWillEnter() {
		this.changeStatusBarTextColor();
	}

	changeStatusBarTextColor(): void {
		StatusBar.setOverlaysWebView({
			overlay: false
		});
		StatusBar.setStyle({
			style: StatusBarStyle.Dark
		});
		StatusBar.setBackgroundColor({
			color: '#1C262F'
		});
	}

	newFieldTripButtonClicked(): void {
		this.navController.navigateForward(this.newFieldTripUrl);
	}

	offlineMapsButtonClicked(): void {
		this.navController.navigateForward(this.offlineMapUrl);
	}
}
