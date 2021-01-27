import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NewFieldTripPageRoutingModule } from './new-field-trip-routing.module';
import { NewFieldTripPage } from './new-field-trip.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
	SharedModule,
	CommonModule,
	ReactiveFormsModule,
	IonicModule,
	NewFieldTripPageRoutingModule
  ],
  declarations: [NewFieldTripPage]
})
export class NewFieldTripPageModule {}
