import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LambPageRoutingModule } from './lamb-routing.module';

import { LambPage } from './lamb.page';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CounterComponent } from '../components/counter/counter.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LambPageRoutingModule
	],
	declarations: [LambPage, CounterComponent, NavigationComponent]
})
export class LambPageModule {}
