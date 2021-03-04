import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FieldTripPageRoutingModule } from './field-trip-routing.module';

import { FieldTripPage } from './field-trip.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		FieldTripPageRoutingModule,
		SharedModule
	],
	declarations: [FieldTripPage]
})
export class FieldTripPageModule {}
