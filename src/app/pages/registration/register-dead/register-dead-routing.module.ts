import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterDeadPage } from './register-dead.page';

const routes: Routes = [
	{
		path: '',
		component: RegisterDeadPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RegisterDeadPageRoutingModule {}
