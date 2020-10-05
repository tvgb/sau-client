import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalSheepCountPageRoutingModule } from './total-sheep-count-routing.module';

import { TotalSheepCountPage } from './total-sheep-count.page';
import { RegistrationModule } from '../registration.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		FormsModule,
		IonicModule,
		TotalSheepCountPageRoutingModule
	],
	declarations: [TotalSheepCountPage]
})
export class TotalSheepCountPageModule {}
