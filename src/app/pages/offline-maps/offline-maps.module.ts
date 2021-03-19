import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineMapsPageRoutingModule } from './offline-maps-routing.module';

import { OfflineMapsPage } from './offline-maps.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		SharedModule,
		CommonModule,
		FormsModule,
		IonicModule,
		OfflineMapsPageRoutingModule
	],
	declarations: [OfflineMapsPage]
})
export class OfflineMapsPageModule {}
