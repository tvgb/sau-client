import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LambPage } from './lamb.page';

const routes: Routes = [
	{
		path: '',
		component: LambPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LambPageRoutingModule {}
