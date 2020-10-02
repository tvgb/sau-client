import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollarPage } from './collar.page';

const routes: Routes = [
	{
		path: '',
		component: CollarPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CollarPageRoutingModule {}
