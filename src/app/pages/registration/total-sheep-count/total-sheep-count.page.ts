import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TotalSheepCount } from 'src/app/shared/classes/TotalSheepCount';
import { DecrementTotalSheepCount, IncrementTotalSheepCount } from '../../../shared/store/sheepInfo.actions';
import { SheepInfoState } from '../../../shared/store/sheepInfo.state';

@Component({
	selector: 'app-total-sheep-count',
	templateUrl: './total-sheep-count.page.html',
	styleUrls: ['./total-sheep-count.page.scss'],
})
export class TotalSheepCountPage implements OnInit {

	totalSheepCount = 0;
	nextRoute = '/registration/sheep-colour-count';
	categories: any[] = [];
	selectedCategory = 'ANTALL SAU';

	@Select(SheepInfoState.getTotalSheepCount) totalSheepCount$: Observable<number>;

	constructor(private store: Store) { }

	ngOnInit(): void {
		this.totalSheepCount$.subscribe(res => {
			console.log('totalSheepCount:', res);
			this.totalSheepCount = res;
		});
	}

	onIncrement(): void {
		this.store.dispatch(new IncrementTotalSheepCount(this.totalSheepCount));
	}

	onDecrement(): void {
		this.store.dispatch(new DecrementTotalSheepCount(this.totalSheepCount));
	}
}
