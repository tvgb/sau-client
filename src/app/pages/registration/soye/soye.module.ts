import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoyePageRoutingModule } from './soye-routing.module';

import { SoyePage } from './soye.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SoyePageRoutingModule
	],
	declarations: [SoyePage, CounterComponent, NavigationComponent]
})
export class SoyePageModule {}
