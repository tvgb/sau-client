import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

	@Input() categories: [];
	@Input() selectedCategory: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() categoryRight = new EventEmitter();
	@Output() categoryLeft = new EventEmitter();

	constructor(private vibration: Vibration) { }

	ngOnInit() {

	}

	onSwipeLeft(e): void {
		if (this.categories.length > 1) {
			this.categoryLeft.emit(e);
			this.vibration.vibrate(200);
		}
	}

	onSwipeRight(e): void {
		if (this.categories.length > 1) {
			this.categoryRight.emit(e);
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

	// checkRequiredFields(input: string[]) {
	// 	if (input === undefined) {
	// 		throw new Error('Input directive "categories" is required.');
	// 	}
	// }
}
