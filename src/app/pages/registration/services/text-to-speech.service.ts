import { Injectable } from '@angular/core';
import { Options, CapacitorTts } from 'capacitor-tts-plugin';

@Injectable({
  	providedIn: 'root'
})

export class TextToSpeechService {

	private readonly LANGUAGE = 'nb-NO';
	private speed = 1.0;

	constructor() {	}

	speak(text: string): void {
		const options: Options = {
			text,
			locale: this.LANGUAGE
		};

		CapacitorTts.speak(options).catch(error => {
			console.log(`Error when speaking: ${error}`);
		});
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
