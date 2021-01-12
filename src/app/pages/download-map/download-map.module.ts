import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadMapPageRoutingModule } from './download-map-routing.module';

import { DownloadMapPage } from './download-map.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DownloadMapPageRoutingModule
	],
	declarations: [DownloadMapPage]
})
export class DownloadMapPageModule {}
