import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CollarColourCount } from 'src/app/shared/classes/CollarColourCount';
import { SheepColourCount } from 'src/app/shared/classes/SheepColourCount';
import { SheepTypeCount } from 'src/app/shared/classes/SheepTypeCount';
import { CollarColour } from 'src/app/shared/enums/CollarColour';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	sheepColourCount: SheepColourCount;
	totalSheepCount: number;
	collarColour: CollarColourCount;
	sheepType: SheepTypeCount;

	@Select(SheepInfoState.getSheepColourCount) sheepColourCount$: Observable<SheepColourCount>;
	@Select(SheepInfoState.getTotalSheepCount) totalSheepCount$: Observable<number>;
	@Select(SheepInfoState.getCollarColour) collarColour$: Observable<CollarColourCount>;
	@Select(SheepInfoState.getSheepTypeCount) sheepTypeCount$: Observable<SheepTypeCount>;

  	constructor(private navController: NavController) { }

	ngOnInit() {
		this.sheepColourCount$.subscribe(res => {
			this.sheepColourCount = res;
		});
		this.totalSheepCount$.subscribe(res => {
			this.totalSheepCount = res;
		});
		this.collarColour$.subscribe(res => {
			this.collarColour = res;
		});
		this.sheepTypeCount$.subscribe(res => {
			this.sheepType = res;
		});
	}

	navigateBack() {
		this.navController.back();
	}
}
