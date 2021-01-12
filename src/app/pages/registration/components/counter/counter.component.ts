import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { count } from 'rxjs/operators';
import { VibrationService } from '../../services/vibration.service';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {

	@Input() subCategoryCount: number;
	@Input() currentSubCategoryName: string;

	@Output() increment = new EventEmitter();
	@Output() decrement = new EventEmitter();
	@Output() subCategoryRight = new EventEmitter();
	@Output() subCategoryLeft = new EventEmitter();
	@Output() holdForReadout = new EventEmitter();

	@ViewChild("counterContainer") counterContainer: ElementRef;

	constructor(private vibration: VibrationService) { }

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

	onTap(e): void {
		const y = e.center.y;
		const containerHeight = this.counterContainer.nativeElement.clientHeight;
		const offsetTop = this.counterContainer.nativeElement.offsetTop;

		if (y - (containerHeight / 2 + offsetTop) < 0) {
			this.increment.emit(e);
		} else {
			this.decrement.emit(e);
		}

	}

	onHold(e): void {
		this.vibration.vibrate();
		this.holdForReadout.emit(e);
	}

	// checkRequiredFields(input: string[]) {
	// 	if (input === undefined) {
	// 		throw new Error('Input directive "categories" is required.');
	// 	}
	// }
}
