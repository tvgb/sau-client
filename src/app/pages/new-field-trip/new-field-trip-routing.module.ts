import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewFieldTripPage } from './new-field-trip.page';

const routes: Routes = [
  {
    path: '',
    component: NewFieldTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewFieldTripPageRoutingModule {}
