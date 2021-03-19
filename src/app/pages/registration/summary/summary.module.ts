import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummaryPageRoutingModule } from './summary-routing.module';

import { SummaryPage } from './summary.page';
import { RegistrationModule } from '../registration.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		SharedModule,
		FormsModule,
		IonicModule,
		SummaryPageRoutingModule
	],
	declarations: [SummaryPage]
})
export class SummaryPageModule {}
