import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { FieldTripId } from 'src/app/shared/enums/FieldTripId';

@Injectable({
  providedIn: 'root'
})
export class FieldTripInfoService {

	FieldTripIds: FieldTripId[] = [
		FieldTripId.OverseerName,
		FieldTripId.FarmNumber,
		FieldTripId.BruksNumber,
		FieldTripId.Participants,
		FieldTripId.Weather,
		FieldTripId.Description
	];

  constructor(private store: Store) {
   }

   getCurrentFieldTripInfo(): void {
	   this.store.dispatch(
		   new
   }
}
