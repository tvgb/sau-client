import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterInjuredPage } from './register-injured.page';

const routes: Routes = [
	{
		path: '',
		component: RegisterInjuredPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RegisterInjuredPageRoutingModule {}
