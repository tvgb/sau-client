import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VibrationService } from '../../services/vibration.service';

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

	constructor(private vibration: VibrationService) { }

	ngOnInit() {}

	onSwipeLeft(e): void {
		if (this.sheepInfosCount > 1) {
			this.vibration.vibrate();
			this.sheepInfoLeft.emit();
		}
	}

	onSwipeRight(e): void {
		if (this.sheepInfosCount > 1) {
			this.vibration.vibrate();
			this.sheepInfoRight.emit();
		}
	}

	onPlussTap(e): void {
		this.increment.emit(e);
		this.vibration.vibrate();
	}

	onMinusTap(e): void {
		this.decrement.emit(e);
		this.vibration.vibrate();
	}
}
