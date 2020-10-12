import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Select } from '@ngxs/store';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { Observable } from 'rxjs';
import { Pages } from 'src/app/shared/classes/Pages';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Output() nextCategory = new EventEmitter();
	@Output() prevCategory = new EventEmitter();
	@Output() cancelRegistration = new EventEmitter();
	@Output() completeRegistration = new EventEmitter();

	completeRoute = '/registration/summary';
	cancelRoute = '/map';

	constructor(private vibration: Vibration, private ttsService: TextToSpeechService, private router: Router) { }

	ngOnInit(): void {}

	nextCategoryClick() {
		this.vibration.vibrate(200);
		this.nextCategory.emit();
	}

	prevCategoryClick() {
		this.vibration.vibrate(200);
		this.prevCategory.emit();
	}

	cancel(): void {
		this.router.navigate([this.cancelRoute]);
		this.cancelRegistration.emit();
	}

	complete(): void {
		this.router.navigate([this.completeRoute]);
		this.completeRegistration.emit();
	}
}
