import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { Location } from '@angular/common';
import { Select, Store } from '@ngxs/store';
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

	@Input() nextRouteUri: string;

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
	currentPage;
	prevPage;

	@Select(AppInfoState.getCurrentPage) currentPage$: Observable<Page>;
	@Select(AppInfoState.getPrevPage) prevPage$: Observable<Page>;

	constructor(private vibration: Vibration, private ttsService: TextToSpeechService, private router: Router, private location: Location,
		           private store: Store) { }

	ngOnInit(): void {
		console.log('init nav');
		this.currentPage$.subscribe(res => {
			this.currentPage = res;
			console.log('currentPage: ' + this.currentPage);
		});
		this.prevPage$.subscribe(res => {
			this.prevPage = res;
			console.log('prevPage: ' + this.prevPage);
		});
	}

	prevRoute(): void {
		this.vibration.vibrate(200);
		this.location.back();
		console.log(this.location.back());
	}

	nextRoute(): void {
		this.store.dispatch(new UpdatePrevPage(this.pages[this.selectedPageIndex]));
		this.selectedPageIndex++;
		this.store.dispatch(new UpdateCurrentPage(this.pages[this.selectedPageIndex]));
		this.vibration.vibrate(200);
		this.ttsService.speakRegistration(this.selectedPageText());
		this.router.navigate([this.nextRouteUri]);
	}

	selectedPageText(): string {
		switch (this.pages[this.selectedPageIndex]) {
			case(Page.MapPage):
				return 'kart';
			case(Page.TotalSheepPage):
				return 'antall sau';

			case(Page.SheepColourPage):
				return 'farge';

			case(Page.SheepTypePage):
				return 'type';

			case(Page.CollarColourPage):
				return 'slips';
		}
	}
}
