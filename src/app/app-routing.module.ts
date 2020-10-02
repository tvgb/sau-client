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
		path: 'register/ewe',
		loadChildren: () => import('./pages/registration/ewe/ewe.module').then( m => m.EwePageModule)
	},
	{
		path: 'register/collar',
		loadChildren: () => import('./pages/registration/collar/collar.module').then( m => m.CollarPageModule)
	},
	{
		path: 'register/lamb',
		loadChildren: () => import('./pages/registration/lamb/lamb.module').then( m => m.LambPageModule)
	},
	{
		path: 'register/total-sheep-count',
		loadChildren: () => import('./pages/registration/total-sheep-count/total-sheep-count.module').then( m => m.TotalSheepCountPageModule)
	},
	{
		path: 'register/sheep-colour-count',
		loadChildren: () => import('./pages/registration/sheep-colour-count/sheep-colour-count.module').then( m => m.SheepColourCountPageModule)
	}


];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
