import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadMapPage } from './download-map.page';

const routes: Routes = [
	{
		path: '',
		component: DownloadMapPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DownloadMapPageRoutingModule {}
