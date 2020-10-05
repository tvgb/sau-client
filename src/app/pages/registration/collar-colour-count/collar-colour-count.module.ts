import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollarColourCountPageRoutingModule } from './collar-colour-count-routing.module';

import { CollarColourCountPage } from './collar-colour-count.page';
import { RegistrationModule } from '../registration.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		FormsModule,
		IonicModule,
		CollarColourCountPageRoutingModule
	],
	declarations: [CollarColourCountPage]
})
export class CollarColourCountPageModule {}
