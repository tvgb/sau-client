import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineMapsPage } from './offline-maps.page';

const routes: Routes = [
	{
		path: '',
		component: OfflineMapsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OfflineMapsPageRoutingModule {}
