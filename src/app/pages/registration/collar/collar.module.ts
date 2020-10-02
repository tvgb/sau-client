import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollarPageRoutingModule } from './collar-routing.module';

import { CollarPage } from './collar.page';
import { CounterComponent } from '../components/counter/counter.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

@NgModule({
	entryComponents: [CounterComponent, NavigationComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CollarPageRoutingModule
	],
	declarations: [CollarPage, CounterComponent, NavigationComponent]
})
export class CollarPageModule {}
