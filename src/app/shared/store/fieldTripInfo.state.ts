import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FieldTripInfoModel } from '../interfaces/FieldTripInfoModel';
import { SetCurrentFieldTrip } from './fieldTripInfo.actions';



@State<FieldTripInfoModel>({
	name: 'fieldTripInfo',
})

@Injectable()
export class FieldTripInfoState {

	constructor() {}

	@Selector()
	static getCurrentFieldTripInfo(state: FieldTripInfoModel) {
		return state;
	}

	@Action(SetCurrentFieldTrip)
	setCurrentFieldTripId(ctx: StateContext<FieldTripInfoModel>, action: SetCurrentFieldTrip) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			fieldTripInfo: action.fieldTripInfo,
		});
	}
}
