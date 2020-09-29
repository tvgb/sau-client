import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OppsummeringPage } from './oppsummering.page';

const routes: Routes = [
  {
	path: '',
	component: OppsummeringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OppsummeringPageRoutingModule {}
