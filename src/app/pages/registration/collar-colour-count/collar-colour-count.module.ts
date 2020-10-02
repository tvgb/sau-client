import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollarColourCountPageRoutingModule } from './collar-colour-count-routing.module';

import { CollarColourCountPage } from './collar-colour-count.page';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CounterComponent } from '../components/counter/counter.component';

@NgModule({
	entryComponents: [NavigationComponent, CounterComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CollarColourCountPageRoutingModule
	],
	declarations: [CollarColourCountPage, NavigationComponent, CounterComponent]
})
export class CollarColourCountPageModule {}
