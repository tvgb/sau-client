import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ColourPickerComponent } from './components/colour-picker/colour-picker.component';

@NgModule({
	declarations: [PageHeaderComponent, ColourPickerComponent],
	imports: [
		CommonModule,
		RouterModule,
		IonicModule.forRoot(),
	],
	exports: [
		PageHeaderComponent,
		ColourPickerComponent
	]
})
export class SharedModule {}
