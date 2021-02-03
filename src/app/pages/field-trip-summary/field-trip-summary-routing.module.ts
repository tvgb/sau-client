import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldTripSummaryPage } from './field-trip-summary.page';

const routes: Routes = [
  {
    path: '',
    component: FieldTripSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldTripSummaryPageRoutingModule {}
