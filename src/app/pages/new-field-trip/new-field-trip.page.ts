import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { SetCurrentFieldTrip } from 'src/app/shared/store/fieldTripInfo.actions';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Plugins, StatusBarStyle} from '@capacitor/core';

const {StatusBar} = Plugins;

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

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) currentFieldTripInfo$: Observable<FieldTripInfo>;

	constructor(private store: Store, private navController: NavController, private formbuilder: FormBuilder) {
		this.newFieldTripForm = this.formbuilder.group({
			overseerName: ['', Validators.required],
			fNumber: ['', Validators.required],
			bNumber: ['', Validators.required],
			municipality: ['', Validators.required],
			participants: ['', Validators.required],
			weather: [''],
			description: [''],
		});
	}

	changeStatusBarTextColor(): void {
		StatusBar.setOverlaysWebView({
			overlay: false
		});
		StatusBar.setStyle({
			style: StatusBarStyle.Dark
		});
		StatusBar.setBackgroundColor({
			color: '#1C262F'
		});
	}

	ionViewWillEnter() {
		this.changeStatusBarTextColor();
		this.currentFieldTripSub = this.currentFieldTripInfo$.subscribe((res: FieldTripInfo) => {
			if (res) {
				this.currentFieldTripInfo = res;
			}
		});
	}

	createNewFieldTrip() {
		this.submitAttempt = true;
		if (this.newFieldTripForm.valid) {
			this.fieldTripId = uuidv4();
			this.currentFieldTripInfo = new FieldTripInfo(
				this.fieldTripId, this.newFieldTripForm.controls.overseerName.value, this.newFieldTripForm.controls.fNumber.value,
				this.newFieldTripForm.controls.bNumber.value, this.newFieldTripForm.controls.municipality.value,
				this.newFieldTripForm.controls.participants.value,
				this.newFieldTripForm.controls.weather.value, this.newFieldTripForm.controls.description.value);
			console.log(JSON.stringify(this.currentFieldTripInfo));
			this.store.dispatch(new SetCurrentFieldTrip(this.currentFieldTripInfo));
			this.navController.navigateForward(this.mapUrl);
		}
	}

	ionViewWillLeave(): void {
		this.currentFieldTripSub.unsubscribe();
	}
}
