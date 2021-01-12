import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VibrationService } from '../../services/vibration.service';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

	@Input() subCategoryCount: number;
	@Input() currentSubCategoryName: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() subCategoryRight = new EventEmitter();
	@Output() subCategoryLeft = new EventEmitter();

	constructor(private vibration: VibrationService) { }

	ngOnInit() {

	}

	onSwipeLeft(e): void {
		if (this.subCategoryCount > 1) {
			this.subCategoryLeft.emit(e);
			this.vibration.vibrate();
		}
	}

	onSwipeRight(e): void {
		if (this.subCategoryCount > 1) {
			this.subCategoryRight.emit(e);
			this.vibration.vibrate();
		}
	}

	onSwipeUp(e): void {
		this.increment.emit(e);
		this.vibration.vibrate();
	}

	onSwipeDown(e): void {
		this.decrement.emit(e);
		this.vibration.vibrate();
	}

	// checkRequiredFields(input: string[]) {
	// 	if (input === undefined) {
	// 		throw new Error('Input directive "categories" is required.');
	// 	}
	// }
}
