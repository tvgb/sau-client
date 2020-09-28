import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlipsPageRoutingModule } from './slips-routing.module';

import { SlipsPage } from './slips.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SlipsPageRoutingModule
	],
	declarations: [SlipsPage]
})
export class SlipsPageModule {}
