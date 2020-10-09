import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoCategoryGrouping } from 'src/app/shared/classes/SheepInfoCategoryGrouping';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { AppInfoState } from 'src/app/shared/store/appInfo.state';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	sheepInfo: SheepInfoModel;
	currentCategoryGrouping: SheepInfoCategoryGrouping;

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;
	@Select(AppInfoState.getCurrentSheepInfoCategoryGrouping) currentCategoryGrouping$: Observable<SheepInfoCategoryGrouping>;

  	constructor(private navController: NavController, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.tts.speak('Oppsummering');

		this.sheepInfo$.subscribe(res => {
			this.sheepInfo = res;
		});

		this.currentCategoryGrouping$.subscribe(res => {
			this.currentCategoryGrouping = res;
		});
	}

	navigateBack() {
		this.tts.speak(`Registrer ${this.currentCategoryGrouping.speakText}`);
		this.navController.back();
	}
}
