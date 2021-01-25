import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Plugins, StatusBarStyle} from '@capacitor/core';

const {StatusBar} = Plugins;

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.page.html',
	styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage {

	constructor(private router: Router) { }

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
	offlineMapsButtonClicked(): void {
		this.router.navigateByUrl('offline-maps');
	}
}
