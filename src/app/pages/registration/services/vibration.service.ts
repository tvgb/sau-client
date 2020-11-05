import { Injectable } from '@angular/core';
import { HapticsImpactStyle, Plugins } from '@capacitor/core';
import 'tts-plugin';

const { Haptics } = Plugins;

@Injectable({
	providedIn: 'root'
})
export class VibrationService {

	private options = { style: HapticsImpactStyle.Heavy };

	constructor() { }

	vibrate(): void {
		Haptics.impact(this.options);
	}
}
