import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EwePage } from './ewe.page';

const routes: Routes = [
	{
		path: '',
		component: EwePage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EwePageRoutingModule {}
