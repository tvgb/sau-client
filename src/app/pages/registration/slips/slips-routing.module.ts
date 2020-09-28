import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlipsPage } from './slips.page';

const routes: Routes = [
	{
		path: '',
		component: SlipsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SlipsPageRoutingModule {}
