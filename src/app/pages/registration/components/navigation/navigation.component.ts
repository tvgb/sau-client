import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Select } from '@ngxs/store';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { Observable } from 'rxjs';
import { Pages } from 'src/app/shared/classes/Pages';
import { Page } from 'src/app/shared/enums/Page';
import { UpdateCurrentPage, UpdatePrevPage } from 'src/app/shared/store/appInfo.actions';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Output() nextGrouping = new EventEmitter();
	@Output() prevGrouping = new EventEmitter();
	@Output() cancelRegistration = new EventEmitter();
	@Output() completeRegistration = new EventEmitter();

	pages: Page[] = [
		Page.MapPage,
		Page.TotalSheepPage,
		Page.SheepColourPage,
		Page.SheepTypePage,
		Page.CollarColourPage
	];

	selectedPageIndex = 0;
	completeRoute = '/registration/summary';
	cancelRoute = '/map';

	@Select(AppInfoState.getCurrentPage) currentPage$: Observable<Page>;
	@Select(AppInfoState.getPrevPage) prevPage$: Observable<Page>;

	constructor(private vibration: Vibration, private ttsService: TextToSpeechService, private router: Router) { }

	ngOnInit(): void {}

	nextGroupingClick() {
		this.vibration.vibrate(200);
		this.nextGrouping.emit();
	}

	prevGroupingClick() {
		this.vibration.vibrate(200);
		this.prevGrouping.emit();
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
