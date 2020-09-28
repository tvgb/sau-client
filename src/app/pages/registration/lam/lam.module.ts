import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LamPageRoutingModule } from './lam-routing.module';

import { LamPage } from './lam.page';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CounterComponent } from '../components/counter/counter.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LamPageRoutingModule
	],
	declarations: [LamPage, CounterComponent, NavigationComponent]
})
export class LamPageModule {}
