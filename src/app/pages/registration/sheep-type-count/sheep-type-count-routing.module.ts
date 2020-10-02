import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SheepTypeCountPage } from './sheep-type-count.page';

const routes: Routes = [
  {
    path: '',
    component: SheepTypeCountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SheepTypeCountPageRoutingModule {}
