import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SheepTypeCountPageRoutingModule } from './sheep-type-count-routing.module';

import { SheepTypeCountPage } from './sheep-type-count.page';
import { RegistrationModule } from '../registration.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		FormsModule,
		IonicModule,
		SheepTypeCountPageRoutingModule
	],
	declarations: [SheepTypeCountPage]
})
export class SheepTypeCountPageModule {}
