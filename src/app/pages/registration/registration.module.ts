import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CounterComponent } from './components/counter/counter.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountOverviewComponent } from './components/count-overview/count-overview.component';
import { CounterJoystickComponent } from './components/counter-joystick/counter-joystick.component';

@NgModule({
	declarations: [NavigationComponent, CounterComponent, CounterJoystickComponent, CountOverviewComponent],
	imports: [
		CommonModule,
		RouterModule,
		IonicModule.forRoot(),
	],
	exports: [
		NavigationComponent,
		CounterComponent,
		CounterJoystickComponent,
		CountOverviewComponent
	]
})
export class RegistrationModule { }
