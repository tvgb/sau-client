import { ChangeDetectorRef, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { FieldTripInfoState } from 'src/app/shared/store/fieldTripInfo.state';
import { SetCurrentFieldTrip } from 'src/app/shared/store/fieldTripInfo.actions';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { StatusbarService } from 'src/app/shared/services/statusbar.service';
import { FieldTripInfoModel } from 'src/app/shared/interfaces/FieldTripInfoModel';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';

const { Keyboard } = Plugins;

@Component({
	selector: 'app-new-field-trip',
	templateUrl: './new-field-trip.page.html',
	styleUrls: ['./new-field-trip.page.scss'],
})

export class NewFieldTripPage {

	fieldTripId: string;
	participants: string[] = [];
	participantName: string;
	description: string;
	overseerName: string;

	public addAttempt = false;

	currentFieldTripSub: Subscription;
	currentFieldTripInfo: FieldTripInfo;

	invalidText = 'Obligatorisk felt.';

	mapUrl = '/map';

	@Select(FieldTripInfoState.getCurrentFieldTripInfo) currentFieldTripInfo$: Observable<FieldTripInfoModel>;

	constructor(
		private store: Store,
		private navController: NavController,
		private statusBarService: StatusbarService,
		private authService: AuthService,
		private firestoreService: FirestoreService,
		private cdr: ChangeDetectorRef) {}

	ionViewWillEnter() {
		this.statusBarService.changeStatusBar(false, true);
	}

	async createNewFieldTrip() {
		// Keyboard.hide();
		this.fieldTripId = uuidv4();
		await this.firestoreService.getCurrentUser(this.authService.getUserId()).then((res) => {
			this.overseerName = res['name'];
		});

		this.currentFieldTripInfo = new FieldTripInfo(
			{
				fieldtripId: this.fieldTripId,
				overseerName: this.overseerName,
				participants: this.participants,
				description: this.description,
				dateTimeStarted: Date.now()
			});

		console.log(JSON.stringify(this.currentFieldTripInfo));
		this.store.dispatch(new SetCurrentFieldTrip(this.currentFieldTripInfo));
		this.navController.navigateForward(this.mapUrl);
	}

	addParticipant(): void {
			if (!!this.participantName.trim()) {
				this.participants.push(this.participantName);
				this.participantName = '';
				this.cdr.detectChanges();
			}
		}

	deleteParticipant(index: number): void {
			this.participants.splice(index, 1);
			this.cdr.detectChanges();
		}
	}
