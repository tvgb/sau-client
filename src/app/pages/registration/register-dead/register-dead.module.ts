import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterDeadPageRoutingModule } from './register-dead-routing.module';

import { RegisterDeadPage } from './register-dead.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RegisterDeadPageRoutingModule
	],
	declarations: [RegisterDeadPage]
	})

export class RegisterDeadPageModule {}
