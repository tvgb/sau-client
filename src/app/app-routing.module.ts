import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'map',
		pathMatch: 'full'
	},
	{
		path: 'map',
		loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
	},
  	{
		path: 'registration/summary',
		loadChildren: () => import('./pages/registration/summary/summary.module').then( m => m.SummaryPageModule)
  	},
	{
		path: 'registration/register',
		loadChildren: () => import('./pages/registration/register/register.module').then( m => m.RegisterPageModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
