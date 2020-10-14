import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
	selector: 'app-counter-joystick',
	templateUrl: './counter-joystick.component.html',
	styleUrls: ['./counter-joystick.component.scss'],
})
export class CounterJoystickComponent implements OnInit {

	@Input() sheepInfosCount: number;
	@Input() selectedSheepInfo: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() sheepInfoRight = new EventEmitter();
	@Output() sheepInfoLeft = new EventEmitter();


	constructor(private vibration: Vibration) { }

	ngOnInit() {}

	onSwipeLeft(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoLeft.emit(e);
			this.vibration.vibrate(200);
		}
	}

	onSwipeRight(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoRight.emit(e);
			this.vibration.vibrate(200);
		}
	}

	onSwipeUp(e): void {
		this.increment.emit(e);
		this.vibration.vibrate(200);
	}

	onSwipeDown(e): void {
		this.decrement.emit(e);
		this.vibration.vibrate(200);
	}

}
