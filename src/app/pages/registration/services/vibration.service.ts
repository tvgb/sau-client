import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Platform } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class VibrationService {

	private options = { style: ImpactStyle.Heavy };

	constructor(private platform: Platform) { }

	vibrate(): void {

		if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			console.log('Bzz bzz, vibrating');
		} else if (this.platform.is('ios')) {
			Haptics.impact(this.options);
		} else {
			Haptics.vibrate();
		}
	}
}
