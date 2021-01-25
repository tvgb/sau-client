import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})

export class PageHeaderComponent implements OnInit {
	@Input() pageHeaderText: string;
	@Input() navUrl: string;

	constructor(private navController: NavController) { }

	ngOnInit() {}

	backButtonClicked() {
		this.navController.navigateBack(this.navUrl);
	}
}
