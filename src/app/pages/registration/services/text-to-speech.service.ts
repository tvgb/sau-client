import { Injectable } from '@angular/core';

declare var TTS: any;

@Injectable({
  	providedIn: 'root'
})

export class TextToSpeechService {

	private readonly LANGUAGE = 'nb-NO';
	private speed = 1.0;
	private isSpeaking = false;

	constructor() { }

	speak(speakText) {

		if (this.isSpeaking) {
			( window as any).TTS.stop().then(function() {
				console.log('hello');
				this.isSpeaking = true;
				( window as any).TTS.speak({
					text: speakText,
					locale: this.LANGUAGE,
					cancel: true
				}).then(function() {
					this.isSpeaking = false;
				});
			});
		} else {
			this.isSpeaking = true;
			( window as any).TTS.speak({
				text: speakText,
				locale: this.LANGUAGE,
				cancel: true
			}).then( function() {
				this.isSpeaking = false;
			});
		}


		// if (this.isSpeaking) {
		// 	this.tts.stop().then(() => {
		// 		this.isSpeaking = true;
		// 		this.tts.speak({
		// 			text: speakText,
		// 			locale: this.LANGUAGE,
		// 			rate: this.speed,
		// 		}).then(() => {
		// 			this.isSpeaking = false;
		// 			console.log('SUCCESS!');
		// 		}).catch((error: any) => {
		// 			console.log('Error while speaking:', error);
		// 		});
		// 	}).catch((error: any) => {
		// 		console.log('Error while stopping:', error);
		// 	});

		// } else {
		// 	this.isSpeaking = true;
		// 	this.tts.speak({
		// 		text: speakText,
		// 		locale: this.LANGUAGE,
		// 		rate: this.speed,
		// 	}).then(() => {
		// 		this.isSpeaking = false;
		// 		console.log('SUCCESS!');
		// 	}).catch((error: any) => {
		// 		console.log('Error while speaking:', error);
		// 	});
		// }


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
