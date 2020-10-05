import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SheepInfoState } from './shared/store/sheepInfo.state';
import {  TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { IonicGestureConfig } from './shared/classes/hammer-config';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		NgxsModule.forRoot([
			SheepInfoState
		], { developmentMode: true }),
		HammerModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		Geolocation,
		TextToSpeech,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
