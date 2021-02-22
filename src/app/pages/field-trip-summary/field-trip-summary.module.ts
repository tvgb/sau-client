import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FieldTripSummaryPageRoutingModule } from './field-trip-summary-routing.module';
import { FieldTripSummaryPage } from './field-trip-summary.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		FieldTripSummaryPageRoutingModule,
		SharedModule
	],
	declarations: [FieldTripSummaryPage]
})

export class FieldTripSummaryPageModule {}
