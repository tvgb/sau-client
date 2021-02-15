import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterDeadPageRoutingModule } from './register-dead-routing.module';

import { RegisterDeadPage } from './register-dead.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		IonicModule,
		RegisterDeadPageRoutingModule
	],
	declarations: [RegisterDeadPage]
	})

export class RegisterDeadPageModule {}
