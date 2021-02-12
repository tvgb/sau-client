import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterInjuredPageRoutingModule } from './register-injured-routing.module';

import { RegisterInjuredPage } from './register-injured.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RegisterInjuredPageRoutingModule
	],
	declarations: [RegisterInjuredPage]
})

export class RegisterInjuredPageModule {}
