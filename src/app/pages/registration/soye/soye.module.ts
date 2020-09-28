import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoyePageRoutingModule } from './soye-routing.module';

import { SoyePage } from './soye.page';
import { CounterComponent } from '../components/counter/counter.component';

@NgModule({
	entryComponents: [CounterComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SoyePageRoutingModule
	],
	declarations: [SoyePage, CounterComponent]
})
export class SoyePageModule {}
