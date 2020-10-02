import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SheepColour } from 'src/app/shared/enums/SheepColour';

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

	constructor() { }

	ngOnInit() {

	}

	// checkRequiredFields(input: string[]) {
	// 	if (input === undefined) {
	// 		throw new Error('Input directive "categories" is required.');
	// 	}
	// }
}
