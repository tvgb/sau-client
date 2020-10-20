import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeMeasurementsPageRoutingModule } from './time-measurements-routing.module';

import { TimeMeasurementsPage } from './time-measurements.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TimeMeasurementsPageRoutingModule
	],
	declarations: [TimeMeasurementsPage]
})
export class TimeMeasurementsPageModule {}
