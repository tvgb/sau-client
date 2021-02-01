import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StateResetAll } from 'ngxs-reset-plugin';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { VibrationService } from '../../services/vibration.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

	@Output() nextMainCategory = new EventEmitter();
	@Output() prevMainCategory = new EventEmitter();
	@Output() cancelRegistration = new EventEmitter();
	@Output() completeRegistration = new EventEmitter();

	completeNavLink = '/registration/summary';
	cancelNavLink = '/map';
	alertHeader = 'Avbryt';
	alertMessage = 'Ønsker du å avbryte registrering av sau?';

	constructor(
		private vibration: VibrationService,
		private router: Router,
		private alertService: AlertService,
		private navController: NavController,
		private store: Store) { }

	ngOnInit(): void {}

	nextMainCategoryClick() {
		this.vibration.vibrate();
		this.nextMainCategory.emit();
	}

	prevMainCategoryClick() {
		this.vibration.vibrate();
		this.prevMainCategory.emit();
	}

	cancel(): void {
		this.alertService.confirmAlert(this.alertHeader, this.alertMessage, this, this.confirmHandler);
	}

	complete(): void {
		this.router.navigate([this.completeNavLink]);
		this.completeRegistration.emit();
	}

	confirmHandler() {
		this.navController.navigateBack(this.cancelNavLink);
		this.store.dispatch(new StateResetAll());
		this.cancelRegistration.emit();
	}
}
