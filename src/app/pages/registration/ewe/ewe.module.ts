import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EwePageRoutingModule } from './ewe-routing.module';

import { EwePage } from './ewe.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EwePageRoutingModule
	],
	declarations: [EwePage, CounterComponent, NavigationComponent]
})
export class EwePageModule {}
