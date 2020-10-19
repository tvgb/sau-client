import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-button-counter',
  templateUrl: './button-counter.component.html',
  styleUrls: ['./button-counter.component.scss'],
})
export class ButtonCounterComponent implements OnInit {

	@Input() sheepInfosCount: number;
	@Input() selectedSheepInfo: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() sheepInfoRight = new EventEmitter();
	@Output() sheepInfoLeft = new EventEmitter();

  constructor(private vibration: Vibration) { }

  	ngOnInit() {}

	onTapLeft(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoLeft.emit(e);
			this.vibration.vibrate(200);
		}
	}

	onTapRight(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoRight.emit(e);
			this.vibration.vibrate(200);
		}
	}

	onTapUp(e): void {
		this.increment.emit(e);
		this.vibration.vibrate(200);
	}

	onTapDown(e): void {
		this.decrement.emit(e);
		this.vibration.vibrate(200);
	}
}
