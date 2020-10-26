import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
	selector: 'app-swipe-and-tap-counter',
	templateUrl: './swipe-and-tap-counter.component.html',
	styleUrls: ['./swipe-and-tap-counter.component.scss'],
})
export class SwipeAndTapCounterComponent implements OnInit {

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
			this.vibration.vibrate(200);
			this.sheepInfoLeft.emit();
		}
	}

	onSwipeRight(e): void {
		if (this.sheepInfosCount > 1) {
			this.vibration.vibrate(200);
			this.sheepInfoRight.emit();
		}
	}

	onPlussTap(e): void {
		this.increment.emit(e);
		this.vibration.vibrate(200);
	}

	onMinusTap(e): void {
		this.decrement.emit(e);
		this.vibration.vibrate(200);
	}
}
