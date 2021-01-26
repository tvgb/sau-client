import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SheepInfoState } from './shared/store/sheepInfo.state';
import { IonicGestureConfig } from './shared/classes/hammer-config';
import { AppInfoState } from './shared/store/appInfo.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { SharedModule} from './shared/shared.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		SharedModule,
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		NgxsModule.forRoot([
			SheepInfoState,
			AppInfoState
		], { developmentMode: true }),
		HammerModule,
		NgxsResetPluginModule.forRoot()
	],
	providers: [
		StatusBar,
		SplashScreen,
		Geolocation,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }
	],
	bootstrap: [AppComponent],

	exports: [SharedModule]
})
export class AppModule {}
