import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-sheep-routing.module';

import { RegisterPage } from './register-sheep.page';
import { RegistrationModule } from '../registration.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		RegistrationModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RegisterPageRoutingModule,
		ReactiveFormsModule,
		SharedModule
	],
	declarations: [RegisterPage]
})
export class RegisterPageModule {}
