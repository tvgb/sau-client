import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineMapsPage } from './offline-maps.page';

const routes: Routes = [
	{
		path: '',
		component: OfflineMapsPage
	},  {
    path: 'options-modal',
    loadChildren: () => import('./options-modal/options-modal.module').then( m => m.OptionsModalPageModule)
  }

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OfflineMapsPageRoutingModule {}
