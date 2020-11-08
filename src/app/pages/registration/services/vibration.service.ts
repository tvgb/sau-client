import { Injectable } from '@angular/core';
import { HapticsImpactStyle, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Haptics } = Plugins;

@Injectable({
	providedIn: 'root'
})
export class VibrationService {

	private options = { style: HapticsImpactStyle.Heavy };

	constructor(private platform: Platform) { }

	vibrate(): void {

		if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			console.log('Bzz bzz, vibrating');
		} else {
			Haptics.impact(this.options);
		}
	}
}
