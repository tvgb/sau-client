import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SheepColourCountPageRoutingModule } from './sheep-colour-count-routing.module';

import { SheepColourCountPage } from './sheep-colour-count.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SheepColourCountPageRoutingModule
	],
	declarations: [SheepColourCountPage, CounterComponent, NavigationComponent]
})
export class SheepColourCountPageModule {}
