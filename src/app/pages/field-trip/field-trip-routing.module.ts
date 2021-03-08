import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldTripPage } from './field-trip.page';

const routes: Routes = [
	{
		path: '',
		component: FieldTripPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FieldTripPageRoutingModule {}
