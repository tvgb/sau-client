import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Input() nextRoute: string;
	completeRoute = '/registration/summary';

	constructor() { }

	ngOnInit() {}

}
