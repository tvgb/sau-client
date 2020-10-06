import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Location } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { Observable } from 'rxjs';
import { Pages } from 'src/app/shared/classes/Pages';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Input() nextRouteUri: string;

	completeRoute = '/registration/summary';
	cancelRoute = '/map';
	currentPage;
	prevPage;

	@Select(AppInfoState.getCurrentPage) currentPage$: Observable<Pages>;
	@Select(AppInfoState.getPrevPage) prevPage$: Observable<Pages>;

	constructor(private vibration: Vibration, private ttsService: TextToSpeechService, private router: Router, private location: Location,
		           private store: Store) { }

	ngOnInit(): void {
		console.log('init nav');
		this.currentPage$.subscribe(res => {
			this.currentPage = res;
		});
		this.prevPage.subscribe(res => {
			this.prevPage = res;
		});
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
