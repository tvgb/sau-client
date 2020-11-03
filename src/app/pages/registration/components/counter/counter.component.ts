import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

	private vibrationEnabled = false;

	@Input() sheepInfosCount: number;
	@Input() selectedSheepInfo: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() sheepInfoRight = new EventEmitter();
	@Output() sheepInfoLeft = new EventEmitter();

	constructor(private vibration: Vibration) { }

	ngOnInit() {

	}

	onSwipeLeft(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoLeft.emit(e);
			this.vibrate();
		}
	}

	onSwipeRight(e): void {
		if (this.sheepInfosCount > 1) {
			this.sheepInfoRight.emit(e);
			this.vibrate();
		}
	}

	onSwipeUp(e): void {
		this.increment.emit(e);
		this.vibrate();
	}

	onSwipeDown(e): void {
		this.decrement.emit(e);
		this.vibrate();
	}

	private vibrate(): void {
		if (this.vibrationEnabled) {
			this.vibration.vibrate(200);
		}
	}

	// checkRequiredFields(input: string[]) {
	// 	if (input === undefined) {
	// 		throw new Error('Input directive "categories" is required.');
	// 	}
	// }
}
