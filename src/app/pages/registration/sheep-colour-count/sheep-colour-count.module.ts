import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SheepColourCountPageRoutingModule } from './sheep-colour-count-routing.module';

import { SheepColourCountPage } from './sheep-colour-count.page';
import { RegistrationModule } from '../registration.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		FormsModule,
		IonicModule,
		SheepColourCountPageRoutingModule
	],
	declarations: [SheepColourCountPage]
})
export class SheepColourCountPageModule {}
