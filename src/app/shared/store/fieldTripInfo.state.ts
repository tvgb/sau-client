import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FieldTripInfoModel } from '../interfaces/FieldTripInfoModel';
import { AddRegistration, SetCurrentFieldTrip } from './fieldTripInfo.actions';

@State<FieldTripInfoModel>({
	name: 'fieldTripInfo',
})

@Injectable()
export class FieldTripInfoState {

	constructor() {}

	@Selector()
	static getCurrentFieldTripInfo(state: FieldTripInfoModel) {
		return state.fieldTripInfo;
	}

	@Action(SetCurrentFieldTrip)
	setCurrentFieldTrip(ctx: StateContext<FieldTripInfoModel>, action: SetCurrentFieldTrip) {
		ctx.setState({
			fieldTripInfo: action.fieldTripInfo,
		});
	}

	@Action(AddRegistration)
	addRegistration(ctx: StateContext<FieldTripInfoModel>, action: AddRegistration) {
		const state = ctx.getState();
		if (state.fieldTripInfo.registrations) {
			ctx.setState({
			...state,
				fieldTripInfo: {
					...state.fieldTripInfo,
					registrations: [...state.fieldTripInfo.registrations, action.registration]
				}
			});
		} else {
			ctx.setState({
				...state,
				fieldTripInfo: {
					...state.fieldTripInfo,
					registrations: [action.registration]
				}
			});
		}
	}
}
