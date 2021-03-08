import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { SetCurrentFieldTrip } from 'src/app/shared/store/fieldTripInfo.actions';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { FieldTripInfoModel } from 'src/app/shared/interfaces/FieldTripInfoModel';
import { Registration } from 'src/app/shared/classes/Registration';

const { Keyboard } = Plugins;

@Component({
	selector: 'app-new-field-trip',
	templateUrl: './new-field-trip.page.html',
	styleUrls: ['./new-field-trip.page.scss'],
})

export class NewFieldTripPage {

	newFieldTripForm: FormGroup;
	fieldTripId: string;

	public submitAttempt = false;

	currentFieldTripSub: Subscription;
	currentFieldTripInfo: FieldTripInfo;

	invalidText = 'Obligatorisk felt.';

	mapUrl = '/map';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) currentFieldTripInfo$: Observable<FieldTripInfoModel>;

	constructor(
		private store: Store,
		private navController: NavController,
		private formbuilder: FormBuilder,
		private statusBarService: StatusbarService) {
		this.newFieldTripForm = this.formbuilder.group({
			overseerName: ['Kari Nordmann', Validators.required],
			fNumber: ['22', Validators.required],
			bNumber: ['12', Validators.required],
			municipality: ['Trondheim', Validators.required],
			participants: ['1', Validators.required],
			weather: [''],
			description: [''],
		});
	}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	createNewFieldTrip() {
		this.submitAttempt = true;
		if (this.newFieldTripForm.valid) {
			Keyboard.hide();
			this.fieldTripId = uuidv4();
			this.currentFieldTripInfo = {
				fieldTripId: this.fieldTripId,
				overseerName: this.newFieldTripForm.controls.overseerName.value,
				fNumber: this.newFieldTripForm.controls.fNumber.value,
				bNumber: this.newFieldTripForm.controls.bNumber.value,
				municipality: this.newFieldTripForm.controls.municipality.value,
				participants: this.newFieldTripForm.controls.participants.value,
				weather: this.newFieldTripForm.controls.weather.value,
				description: this.newFieldTripForm.controls.description.value,
				dateTimeStarted: Date.now(),
				registrations: [],
				overseerId: '',
				trackedRoute: []
			} as FieldTripInfo;
			this.store.dispatch(new SetCurrentFieldTrip(this.currentFieldTripInfo));
			this.navController.navigateForward(this.mapUrl);
		}
	}
}
