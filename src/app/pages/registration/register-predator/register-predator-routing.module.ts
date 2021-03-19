import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPredatorPage } from './register-predator.page';

const routes: Routes = [
	{
		path: '',
		component: RegisterPredatorPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RegisterPredatorPageRoutingModule {}
