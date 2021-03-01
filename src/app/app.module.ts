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

import { SheepInfoState } from './shared/store/sheepInfo.state';
import { IonicGestureConfig } from './shared/classes/hammer-config';
import { AppInfoState } from './shared/store/appInfo.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { SharedModule} from './shared/shared.module';
import { FieldTripInfoState } from './shared/store/fieldTripInfo.state';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		SharedModule,
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebaseConfig), // imports firebase/app needed for everything
		AngularFireAuthModule,
		AngularFirestoreModule,
		NgxsModule.forRoot([
			SheepInfoState,
			AppInfoState,
			FieldTripInfoState,
		], { developmentMode: true }),
		HammerModule,
		NgxsResetPluginModule.forRoot()
	],
	providers: [
		StatusBar,
		SplashScreen,
		AngularFireAuth,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }
	],
	bootstrap: [AppComponent],

	exports: [SharedModule]
})
export class AppModule {}
