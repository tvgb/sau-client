import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FieldTripSummaryPageRoutingModule } from './field-trip-summary-routing.module';

import { FieldTripSummaryPage } from './field-trip-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FieldTripSummaryPageRoutingModule
  ],
  declarations: [FieldTripSummaryPage]
})
export class FieldTripSummaryPageModule {}
