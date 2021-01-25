import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { SetCurrentFieldTrip } from 'src/app/shared/store/fieldTripInfo.actions';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-field-trip',
  templateUrl: './new-field-trip.page.html',
  styleUrls: ['./new-field-trip.page.scss'],
})

export class NewFieldTripPage {

	fieldTripId: string;
	overseerName: string;
	farmNumber: number;
	bruksNumber: number;
	participants: number;
	weather: string;
	description: string;

	currentFieldTripSub: Subscription;
	currentFieldTripInfo: FieldTripInfo;

	mapUrl = '/map';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) currentFieldTripInfo$: Observable<FieldTripInfo>;

	constructor(private store: Store, private navController: NavController) { }

	ionViewWillEnter() {
		this.currentFieldTripSub = this.currentFieldTripInfo$.subscribe((res: FieldTripInfo) => {
			if (res) {
				this.currentFieldTripInfo = res;
			}
		});
	}

	createNewFieldTrip() {
		this.fieldTripId = uuidv4();
		this.currentFieldTripInfo = new FieldTripInfo(
			this.fieldTripId, this.overseerName, this.farmNumber,
			this.bruksNumber, this.participants,
			this.weather, this.description);
		this.store.dispatch(new SetCurrentFieldTrip(this.currentFieldTripInfo));
		this.navController.navigateForward(this.mapUrl);
	}

	ionViewWillLeave(): void {
		this.currentFieldTripSub.unsubscribe();
	}
}
