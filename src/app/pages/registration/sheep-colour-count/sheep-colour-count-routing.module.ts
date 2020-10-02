import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SheepColourCountPage } from './sheep-colour-count.page';

const routes: Routes = [
	{
		path: '',
		component: SheepColourCountPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SheepColourCountPageRoutingModule {}
