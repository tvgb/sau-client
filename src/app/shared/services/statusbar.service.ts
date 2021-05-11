import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

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
				this.style = Style.Dark;
				StatusBar.setBackgroundColor({color: '#1C262F'});
			} else {this.style = Style.Light; }

			StatusBar.setStyle({
				style: this.style
			});
		}
	}
}
