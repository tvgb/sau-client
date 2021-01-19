import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.page.html',
	styleUrls: ['./main-menu.page.scss'],
})
export class MainMenuPage {

	constructor(private router: Router) { }

	offlineMapsButtonClicked(): void {
		this.router.navigateByUrl('offline-maps');
	}
}
