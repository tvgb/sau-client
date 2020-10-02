import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SheepTypeCountPageRoutingModule } from './sheep-type-count-routing.module';

import { SheepTypeCountPage } from './sheep-type-count.page';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CounterComponent } from '../components/counter/counter.component';

@NgModule({
	entryComponents: [NavigationComponent, CounterComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SheepTypeCountPageRoutingModule
	],
	declarations: [SheepTypeCountPage, NavigationComponent, CounterComponent]
})
export class SheepTypeCountPageModule {}
