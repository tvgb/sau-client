import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalSheepCountPageRoutingModule } from './total-sheep-count-routing.module';

import { TotalSheepCountPage } from './total-sheep-count.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TotalSheepCountPageRoutingModule
	],
	declarations: [TotalSheepCountPage, CounterComponent, NavigationComponent]
})
export class TotalSheepCountPageModule {}
