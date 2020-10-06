import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CollarColourCount } from 'src/app/shared/classes/CollarColourCount';
import { SheepColourCounts } from 'src/app/shared/classes/SheepColourCounts';
import { SheepTypeCount } from 'src/app/shared/classes/SheepTypeCount';
import { CollarColour } from 'src/app/shared/enums/CollarColour';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	sheepColourCounts: SheepColourCounts;
	totalSheepCount: number;
	collarColour: CollarColourCount;
	sheepType: SheepTypeCount;

	@Select(SheepInfoState.getSheepColourCounts) sheepColourCounts$: Observable<SheepColourCounts>;
	@Select(SheepInfoState.getTotalSheepCount) totalSheepCount$: Observable<number>;
	@Select(SheepInfoState.getCollarColour) collarColour$: Observable<CollarColourCount>;
	@Select(SheepInfoState.getSheepTypeCount) sheepTypeCount$: Observable<SheepTypeCount>;

  	constructor(private navController: NavController) { }

	ngOnInit() {
		this.sheepColourCounts$.subscribe(res => {
			this.sheepColourCounts = res;
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
