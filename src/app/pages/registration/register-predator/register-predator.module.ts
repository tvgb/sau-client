import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPredatorPageRoutingModule } from './register-predator-routing.module';

import { RegisterPredatorPage } from './register-predator.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RegisterPredatorPageRoutingModule
	],
	declarations: [RegisterPredatorPage]
})
export class RegisterPredatorPageModule {}
