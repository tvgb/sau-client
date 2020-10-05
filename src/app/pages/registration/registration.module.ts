import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CounterComponent } from './components/counter/counter.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SwipeGesturesDirective } from './directives/swipe-gestures.directive';

@NgModule({
	declarations: [NavigationComponent, CounterComponent, SwipeGesturesDirective],
	imports: [
		CommonModule,
		RouterModule,
		IonicModule.forRoot(),
	],
	exports: [
		NavigationComponent,
		CounterComponent,
		SwipeGesturesDirective
	]
})
export class RegistrationModule { }
