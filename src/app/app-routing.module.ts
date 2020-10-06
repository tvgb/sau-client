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
		path: 'registration/total-sheep-count',
		loadChildren: () => import('./pages/registration/total-sheep-count/total-sheep-count.module').then( m => m.TotalSheepCountPageModule)
	},
	{
		path: 'registration/sheep-colour-count',
		loadChildren: () => import('./pages/registration/sheep-colour-count/sheep-colour-count.module').then( m => m.SheepColourCountPageModule)
	},
  	{
		path: 'registration/summary',
		loadChildren: () => import('./pages/registration/summary/summary.module').then( m => m.SummaryPageModule)
  	},
	{
		path: 'registration/sheep-type-count',
		loadChildren: () => import('./pages/registration/sheep-type-count/sheep-type-count.module').then( m => m.SheepTypeCountPageModule)
	},
	{
		path: 'registration/collar-colour-count',
		loadChildren: () => import('./pages/registration/collar-colour-count/collar-colour-count.module').then( m => m.CollarColourCountPageModule)
	},  {
    path: 'register',
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
