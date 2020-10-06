import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SheepInfoModel } from 'src/app/shared/interfaces/SheepInfoModel';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

	sheepInfo: SheepInfoModel;

	@Select(SheepInfoState.getSheepInfo) sheepInfo$: Observable<SheepInfoModel>;

  	constructor(private navController: NavController, private tts: TextToSpeechService) { }

	ngOnInit() {
		this.tts.speak('Oppsummering');

		this.sheepInfo$.subscribe(res => {
			this.sheepInfo = res;
		});
	}

	navigateBack() {
		this.navController.back();
	}
}
