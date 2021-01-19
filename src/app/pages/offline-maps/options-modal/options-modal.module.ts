import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionsModalPageRoutingModule } from './options-modal-routing.module';

import { OptionsModalPage } from './options-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionsModalPageRoutingModule
  ],
  declarations: [OptionsModalPage]
})
export class OptionsModalPageModule {}
