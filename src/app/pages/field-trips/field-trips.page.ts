import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FieldTripInfo } from 'src/app/shared/classes/FieldTripInfo';
import { DeadSheepRegistration, InjuredSheepRegistration, SheepRegistration } from 'src/app/shared/classes/Registration';
import { RegistrationType } from 'src/app/shared/enums/RegistrationType';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { FieldTripsService } from './field-trips.service';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
	selector: 'app-field-trips',
	templateUrl: './field-trips.page.html',
	styleUrls: ['./field-trips.page.scss'],
	})
export class FieldTripsPage {

	private iconPath = 'assets/icon';
	sheepIconPath = `${this.iconPath}/add_sheep_btn.png`;
	predatorIconPath = `${this.iconPath}/add_predator_btn.png`;
	injuredSheepIconPath = `${this.iconPath}/add_injured_sheep_btn.png`;
	deadSheepIconPath = `${this.iconPath}/add_dead_sheep_btn.png`;

	loading = true;
	error = false;
	noInternet = false;
	fieldTrips: FieldTripInfo[] = [];

	networkHandler: PluginListenerHandle;

	constructor(private firestore: FirestoreService, private navController: NavController, public fieldTripsService: FieldTripsService) { }

	ionViewWillEnter() {
		Network.getStatus().then((status) => {
			this.noInternet = !status.connected;
		});

		Network.addListener('networkStatusChange', (status) => {
			this.noInternet = !status.connected;
		}).then((pluginListenerHandle) => {
			this.networkHandler = pluginListenerHandle;
		});

		this.firestore.getFieldTrips().then((fieldTrips) => {
			if (fieldTrips) {
				this.loading = false;
				this.fieldTrips = fieldTrips.sort(this.fieldTripsCompareFn);
			}
		}).catch((error) => {
			this.loading = false;
			this.error = true;
		});
	}

	navigateToFieldTrip(fieldTrip: FieldTripInfo): void {
		this.fieldTripsService.setSelectedFieldTrip(fieldTrip);
		this.navController.navigateForward('/field-trip');
	}

	getDateAndDuration(startDate: number, endDate: number): string {
		let delta = Math.abs(endDate - startDate) / 1000;

		const days = Math.floor(delta / 86400);
		delta -= days * 86400;

		const hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		const min = Math.floor(delta / 60) % 60;
		delta -= min * 60;

		return hours > 0 ? `${hours} t  ${min} min` : `${min} min`;
	}

	private fieldTripsCompareFn(a: FieldTripInfo, b: FieldTripInfo): number {
		if (a.dateTimeStarted > b.dateTimeStarted) {
			return -1;
		} else if (a.dateTimeStarted < b.dateTimeStarted) {
			return 1;
		}

		return 0;
	}

	ionViewWillLeave(): void {
		this.networkHandler.remove();
	}
}
