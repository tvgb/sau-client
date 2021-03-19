import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadMapPageRoutingModule } from './download-map-routing.module';

import { DownloadMapPage } from './download-map.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SharedModule,
		DownloadMapPageRoutingModule
	],
	declarations: [DownloadMapPage]
})
export class DownloadMapPageModule {}
