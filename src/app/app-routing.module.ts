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
		path: 'register/soye',
		loadChildren: () => import('./pages/registration/soye/soye.module').then( m => m.SoyePageModule)
	},
	{
		path: 'register/slips',
		loadChildren: () => import('./pages/registration/slips/slips.module').then( m => m.SlipsPageModule)
	},
	{
		path: 'register/lam',
		loadChildren: () => import('./pages/registration/lam/lam.module').then( m => m.LamPageModule)
	},
  	{
		path: 'register/oppsummering',
		loadChildren: () => import('./pages/registration/oppsummering/oppsummering.module').then( m => m.OppsummeringPageModule)
  }

];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
