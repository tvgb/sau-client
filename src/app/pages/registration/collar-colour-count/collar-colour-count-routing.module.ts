import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollarColourCountPage } from './collar-colour-count.page';

const routes: Routes = [
  {
    path: '',
    component: CollarColourCountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollarColourCountPageRoutingModule {}
