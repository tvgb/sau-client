import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})

export class TextToSpeechService {

	private readonly LANGUAGE = 'nb-NO';

  	constructor(private tts: TextToSpeech) { }

  	speak(speakText) {
	this.tts.speak({
		text: speakText,
		locale: this.LANGUAGE,
	});
  }
}
