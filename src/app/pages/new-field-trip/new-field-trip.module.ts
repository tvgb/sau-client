import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewFieldTripPageRoutingModule } from './new-field-trip-routing.module';

import { NewFieldTripPage } from './new-field-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewFieldTripPageRoutingModule
  ],
  declarations: [NewFieldTripPage]
})
export class NewFieldTripPageModule {}
