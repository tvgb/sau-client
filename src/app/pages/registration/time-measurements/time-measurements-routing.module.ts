import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeMeasurementsPage } from './time-measurements.page';

const routes: Routes = [
	{
		path: '',
		component: TimeMeasurementsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TimeMeasurementsPageRoutingModule {}
