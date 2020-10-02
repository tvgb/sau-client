import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DecrementTotalSheepCount, IncrementTotalSheepCount } from '../../../shared/store/sheepInfo.actions';
import { SheepInfoState } from '../../../shared/store/sheepInfo.state';

@Component({
	selector: 'app-total-sheep-count',
	templateUrl: './total-sheep-count.page.html',
	styleUrls: ['./total-sheep-count.page.scss'],
})
export class TotalSheepCountPage implements OnInit {


	nextRoute = '/registration/sheep-colour-count';
	categories: any[] = [];
	selectedCategory = 'ANTALL SAU';

	@Select(SheepInfoState.getTotalSheepCount) totalSheepCount$: Observable<number>;

	constructor(private store: Store) { }

	ngOnInit(): void {
		this.totalSheepCount$.subscribe(res => {
			console.log('totalSheepCount:', res);
		});
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementTotalSheepCount());
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementTotalSheepCount());
	}
}
