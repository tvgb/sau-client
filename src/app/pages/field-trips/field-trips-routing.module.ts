import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldTripsPage } from './field-trips.page';

const routes: Routes = [
	{
		path: '',
		component: FieldTripsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FieldTripsPageRoutingModule {}
