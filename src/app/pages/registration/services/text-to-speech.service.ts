import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Injectable({
  providedIn: 'root'
})

export class TextToSpeechService {

	private readonly LANGUAGE = 'nb-NO';

  	constructor(private tts: TextToSpeech) { }

  	speakTotalCount(totalCount) {
		this.tts.speak({
			text: totalCount + 'sau',
			locale: this.LANGUAGE,
		});
	  }

  	speakColor(colorCount, type) {
		  this.tts.speak({
			  text: colorCount + type + 'sau',
			  locale: this.LANGUAGE,
		  });
	  }
}
