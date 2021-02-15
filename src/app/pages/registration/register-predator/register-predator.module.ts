import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPredatorPageRoutingModule } from './register-predator-routing.module';

import { RegisterPredatorPage } from './register-predator.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SharedModule,
		ReactiveFormsModule,
		RegisterPredatorPageRoutingModule
	],
	declarations: [RegisterPredatorPage]
})
export class RegisterPredatorPageModule {}
