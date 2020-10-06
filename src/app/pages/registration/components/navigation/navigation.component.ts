import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Input() nextRouteUri: string;

	completeRoute = '/registration/summary';
	cancelRoute = '/map';

	constructor(private vibration: Vibration, private ttsService: TextToSpeechService, private router: Router, private location: Location) { }

	ngOnInit(): void {
		console.log('init nav');
	}

	prevRoute(): void {
		this.vibration.vibrate(200);
		this.location.back();
	}

	nextRoute(): void {
		this.vibration.vibrate(200);
		this.router.navigate([this.nextRouteUri]);
	}
}
