import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoyePage } from './soye.page';

const routes: Routes = [
	{
		path: '',
		component: SoyePage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SoyePageRoutingModule {}
