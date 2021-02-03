import { Injectable } from '@angular/core';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { StatusBar} = Plugins;

@Injectable({
  providedIn: 'root'
})

export class StatusbarService {

	private style;

	constructor(private platform: Platform) {}

	changeStatusBar(overlayStyle: boolean, styleDark: boolean): void {
		if (!this.platform.is('mobileweb')) {
			StatusBar.setOverlaysWebView({
				overlay: overlayStyle
			});

			if (styleDark) {
				this.style = StatusBarStyle.Dark;
				StatusBar.setBackgroundColor({color: '#1C262F'});
			} else {this.style = StatusBarStyle.Light; }

			StatusBar.setStyle({
				style: this.style
			});
		}
	}
}
