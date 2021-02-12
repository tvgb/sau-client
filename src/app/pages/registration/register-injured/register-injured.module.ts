import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterInjuredPageRoutingModule } from './register-injured-routing.module';

import { RegisterInjuredPage } from './register-injured.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		IonicModule,
		RegisterInjuredPageRoutingModule
	],
	declarations: [RegisterInjuredPage]
})

export class RegisterInjuredPageModule {}
