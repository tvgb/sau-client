import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlipsPageRoutingModule } from './slips-routing.module';

import { SlipsPage } from './slips.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SlipsPageRoutingModule
	],
	declarations: [SlipsPage, CounterComponent, NavigationComponent]
})
export class SlipsPageModule {}
