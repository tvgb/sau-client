import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CounterComponent } from './components/counter/counter.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountOverviewComponent } from './components/count-overview/count-overview.component';

@NgModule({
	declarations: [NavigationComponent, CounterComponent, CountOverviewComponent],
	imports: [
		CommonModule,
		RouterModule,
		IonicModule.forRoot(),
	],
	exports: [
		NavigationComponent,
		CounterComponent,
		CountOverviewComponent
	]
})
export class RegistrationModule { }
