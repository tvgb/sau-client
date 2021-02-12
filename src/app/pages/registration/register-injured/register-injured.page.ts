import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { RegistrationService } from '../services/registration.service';

@Component({
	selector: 'app-register-injured',
	templateUrl: './register-injured.page.html',
	styleUrls: ['./register-injured.page.scss'],
})

export class RegisterInjuredPage {

	registerInjuredForm: FormGroup;

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) fieldTripInfo$: Observable<FieldTripInfo>;

	private unsubscribe$: Subject<void> = new Subject<void>();

	constructor(private navController: NavController,
				         private formbuilder: FormBuilder,
				         private statusBarService: StatusbarService,
				         private regService: RegistrationService) {
		this.registerInjuredForm = this.formbuilder.group({
			injuredCount: [''],
			comment: [''],
		});
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	navigateBack(): void {
		this.navController.back();
	}

	onCompleteRegistration() {
		this.regService.completeRegistration(undefined,
			this.registerInjuredForm.controls.injuredCount.value,
			this.registerInjuredForm.controls.comment.value);
		this.navController.back();
	}

	ionViewWillLeave(): void {
		this.unsubscribe$.next();
	}
}
