import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FieldTripId } from '../enums/FieldTripId';
import { FieldTripInfoModel } from '../interfaces/FieldTripInfoModel';
import { SetCurrentFieldTripId } from './fieldTripInfo.actions';



@State<FieldTripInfoModel>({
	name: 'fieldTripInfo',
	defaults: {
		currentFieldTripId: FieldTripId.OverseerName
	}
})

@Injectable()
export class FieldTripInfoState {
	@Selector()
	static getCurrentFieldTripId(state: FieldTripInfoModel) {
		return state.currentFieldTripId;
	}

	@Action(SetCurrentFieldTripId)
	setCurrentFieldTripId(ctx: StateContext<FieldTripInfoModel>, action: SetCurrentFieldTripId) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentFieldTripId: action.fieldTripId,
		});
	}
}
