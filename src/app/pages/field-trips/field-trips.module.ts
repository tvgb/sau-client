import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FieldTripsPageRoutingModule } from './field-trips-routing.module';

import { FieldTripsPage } from './field-trips.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		FieldTripsPageRoutingModule,
		SharedModule
	],
	declarations: [FieldTripsPage]
})
export class FieldTripsPageModule {}
