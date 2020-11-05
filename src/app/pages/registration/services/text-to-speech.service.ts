import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import 'tts-plugin';

const { TtsPlugin } = Plugins;

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
