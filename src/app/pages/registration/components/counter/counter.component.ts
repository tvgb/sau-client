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

	@ViewChild('counterContainer') counterContainer: ElementRef;

	constructor(private vibration: VibrationService) { }

	onSwipeLeft(e): void {
		if (this.subCategoryCount > 1) {
			this.vibration.vibrate();
			this.subCategoryLeft.emit(e);
		}
	}

	onSwipeRight(e): void {
		if (this.subCategoryCount > 1) {
			this.vibration.vibrate();
			this.subCategoryRight.emit(e);
		}
	}

	onSwipeUp(e): void {
		this.vibration.vibrate();
		this.increment.emit(e);
	}

	onSwipeDown(e): void {
		this.vibration.vibrate();
		this.decrement.emit(e);
	}

	onTap(e): void {
		const y = e.center.y;
		const containerHeight = this.counterContainer.nativeElement.clientHeight;
		const offsetTop = this.counterContainer.nativeElement.offsetTop;
		this.vibration.vibrate();
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
