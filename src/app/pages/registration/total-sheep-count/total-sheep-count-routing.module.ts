import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalSheepCountPage } from './total-sheep-count.page';

const routes: Routes = [
	{
		path: '',
		component: TotalSheepCountPage
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalSheepCountPageRoutingModule {}
