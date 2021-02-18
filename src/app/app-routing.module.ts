import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'main-menu',
		pathMatch: 'full',
		canActivate: [ AuthGuard ]
	},
	{
		path: 'main-menu',
		loadChildren: () => import('./pages/main-menu/main-menu.module').then( m => m.MainMenuPageModule),
		canActivate: [ AuthGuard ]
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
		path: 'registration/register-sheep',
		loadChildren: () => import('./pages/registration/register-sheep/register-sheep.module').then( m => m.RegisterPageModule)
	},
	{
		path: 'registration/register-injured',
		loadChildren: () => import('./pages/registration/register-injured/register-injured.module').then( m => m.RegisterInjuredPageModule)
	},
	{
		path: 'registration/register-dead',
		loadChildren: () => import('./pages/registration/register-dead/register-dead.module').then( m => m.RegisterDeadPageModule)
	},
	{
		path: 'registration/register-predator',
		loadChildren: () => import('./pages/registration/register-predator/register-predator.module').then( m => m.RegisterPredatorPageModule)
	},
	{
		path: 'offline-maps',
		loadChildren: () => import('./pages/offline-maps/offline-maps.module').then( m => m.OfflineMapsPageModule)
	},
	{
		path: 'download-map',
		loadChildren: () => import('./pages/download-map/download-map.module').then( m => m.DownloadMapPageModule)
	},
  	{
		path: 'new-field-trip',
		loadChildren: () => import('./pages/new-field-trip/new-field-trip.module').then( m => m.NewFieldTripPageModule)
  	},
  	{
		path: 'field-trip-summary',
		loadChildren: () => import('./pages/field-trip-summary/field-trip-summary.module').then( m => m.FieldTripSummaryPageModule)
  	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
	},
	{
		path: 'settings',
		loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
