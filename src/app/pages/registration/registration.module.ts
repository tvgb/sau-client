import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CounterComponent } from './components/counter/counter.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountOverviewComponent } from './components/count-overview/count-overview.component';
import { EarTagComponent } from './components/ear-tag/ear-tag.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EarTagIconComponent } from './components/ear-tag-icon/ear-tag-icon.component';

@NgModule({
	declarations: [
		NavigationComponent,
		CounterComponent,
		CountOverviewComponent,
		EarTagComponent,
		EarTagIconComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		IonicModule.forRoot(),
		ReactiveFormsModule,
		FormsModule
	],
	exports: [
		NavigationComponent,
		CounterComponent,
		CountOverviewComponent,
		EarTagComponent,
		EarTagIconComponent
	]
})
export class RegistrationModule { }
