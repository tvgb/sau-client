import { Injectable } from '@angular/core';
import { HapticsImpactStyle, Plugins } from '@capacitor/core';
import 'tts-plugin';

const { TtsPlugin, Haptics } = Plugins;

// declare var TTS: any;

@Injectable({
  	providedIn: 'root'
})

export class TextToSpeechService {

	private readonly LANGUAGE = 'nb-NO';
	private speed = 1.0;
	private isSpeaking = false;

	constructor() { }

	speak(speakText) {
		Haptics.impact({ style: HapticsImpactStyle.Heavy });
		TtsPlugin.speak({speakText});

		// this.tts.speak({
		// 	text: '',
		// 	locale: this.LANGUAGE,
		// 	rate: this.speed
		// }).then(() => {

		// });
	}

	// speakNextRoute(route: string): void {
	// 	this.tts.speak({
	// 		text: route,
	// 		locale: this.LANGUAGE
	// 	});
	// }

  	// speakTotalCount(totalCount) {
	// 	this.tts.speak({
	// 	text: `${totalCount} sau`,
	// 		locale: this.LANGUAGE,
	// 	});
	// }

  	// speakColor(colorCount, type) {
	// 	this.tts.speak({
	// 	text: `${colorCount} ${type} sau `,
	// 		locale: this.LANGUAGE,
	// 	});
	// }

	// speakType(typeCount, type) {
	// 	this.tts.speak({
	// 		text: `${typeCount} ${type}`,
	// 		locale: this.LANGUAGE,
	// 	});
	// }

	// speakCollar(collarCount, type) {
	// 	this.tts.speak({
	// 	text: `${collarCount} ${type} slips`,
	// 		locale: this.LANGUAGE,
	// 	});
	// }

	// speakRegistration(category) {
	// 	this.tts.speak({
	// 		text: `Registrer ${category}`,
	// 		locale: this.LANGUAGE,
	// 	});
	// }
}

export class HapticsExample {
	hapticsImpact(style = HapticsImpactStyle.Heavy) {
	  Haptics.impact({
		style
	  });
	}

	hapticsImpactMedium(style) {
	  this.hapticsImpact(HapticsImpactStyle.Medium);
	}

	hapticsImpactLight(style) {
	  this.hapticsImpact(HapticsImpactStyle.Light);
	}

	hapticsVibrate() {
	  Haptics.vibrate();
	}

	hapticsSelectionStart() {
	  Haptics.selectionStart();
	}

	hapticsSelectionChanged() {
	  Haptics.selectionChanged();
	}

	hapticsSelectionEnd() {
	  Haptics.selectionEnd();
	}
  }
