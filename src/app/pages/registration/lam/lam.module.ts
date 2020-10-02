import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LamPageRoutingModule } from './lam-routing.module';

import { LamPage } from './lam.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LamPageRoutingModule
	],
	declarations: [LamPage]
})
export class LamPageModule {}
