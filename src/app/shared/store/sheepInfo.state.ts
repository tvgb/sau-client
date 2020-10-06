import { Action, createSelector, Select, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { throwError } from 'rxjs';
import { SheepColour } from '../enums/SheepColour';
import { CollarColour } from '../enums/CollarColour';
import { SheepType } from '../enums/SheepType';
import { DecrementCollarColourCount,
		DecrementSheepColourCount,
		DecrementSheepTypeCount,
		DecrementTotalSheepCount,
		IncrementCollarColourCount,
		IncrementSheepColourCount,
		IncrementSheepTypeCount,
		IncrementTotalSheepCount } from './sheepInfo.actions';


@State<SheepInfoModel>({
	name: 'sheepInfo',
	defaults: {
		totalSheep: {
			name: 'Sau totalt',
			count: 0
		},

		blackSheep: {
			name: 'Svart',
			count: 0,
			sheepColour: SheepColour.Black
		},
		greyWhiteSheep: {
			name: 'Grå og hvit',
			count: 0,
			sheepColour: SheepColour.GreyWhite
		},
		brownSheep: {
			name: 'Brun',
			count: 0,
			sheepColour: SheepColour.Brown
		},
		whiteBlackHeadSheep: {
			name: 'Hvit, svart hode',
			count: 0,
			sheepColour: SheepColour.WhiteBlackHead
		},

		ewe: {
			name: 'Søy',
			count: 0,
			sheepType: SheepType.Ewe
		},
		lamb: {
			name: 'Lam',
			count: 0,
			sheepType: SheepType.Lamb
		},

		blueCollar: {
			name: 'Blå',
			count: 0,
			collarColour: CollarColour.Blue
		},
		greenCollar: {
			name: 'Grønn',
			count: 0,
			collarColour: CollarColour.Green
		},
		yellowCollar: {
			name: 'Gul',
			count: 0,
			collarColour: CollarColour.Yellow
		},
		redCollar: {
			name: 'Rød',
			count: 0,
			collarColour: CollarColour.Red
		},
		missingCollar: {
			name: 'Mangler',
			count: 0,
			collarColour: CollarColour.Missing
		}
	}
})

@Injectable()
export class SheepInfoState {

	@Selector()
	static getTotalSheepCount(state: SheepInfoModel) {
		return state.totalSheep;
	}

	@Selector()
	static getSheepColourCounts(state: SheepInfoModel) {
		return {
			blackSheepCount: state.blackSheep,
			greyWhiteSheepCount: state.greyWhiteSheep,
			brownSheepCount: state.brownSheep,
			whiteBlackHeadSheepCount: state.whiteBlackHeadSheep
		};
	}

	@Selector()
	static getSheepTypeCount(state: SheepInfoModel) {
		return {
			eweCount: state.ewe,
			lambCount: state.lamb
		};
	}

	@Selector()
	static getCollarColour(state: SheepInfoModel) {
		return {
			blueCollarCount: state.blueCollar,
			greenCollarCount: state.greenCollar,
			yellowCollarCount: state.yellowCollar,
			redCollarCount: state.redCollar,
			missingCollarCount: state.missingCollar
		};
	}

	@Action(IncrementTotalSheepCount)
	incrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
		const state = ctx.getState();

		ctx.setState({
			...state,
			totalSheep: {
				name: state.totalSheep.name,
				count: state.totalSheep.count + 1
			}
		});
	}

	@Action(DecrementTotalSheepCount)
	decrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
		const state = ctx.getState();

		if (state.totalSheep.count > 0) {
			ctx.setState({
				...state,
				totalSheep: {
					name: state.totalSheep.name,
					count: state.totalSheep.count - 1
				}
			});

		} else {
			throwError(new Error('Cannot decrement. Count already at 0'));
		}
	}

	@Action(IncrementSheepColourCount)
	incrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepColourCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepColour === action.sheepColour) {
				ctx.patchState({
					[key]: {
						name: value.name,
						count: value.count + 1,
						sheepColour: value.sheepColour
					}
				});

				return;
			}
		});
	}

	@Action(DecrementSheepColourCount)
	decrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepColourCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepColour === action.sheepColour ) {

				if (value.count > 0) {
					ctx.patchState({
						[key]: {
							name: value.name,
							count: value.count - 1,
							sheepColour: value.sheepColour
						}
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}

				return;
			}
		});
	}

	@Action(IncrementSheepTypeCount)
	incrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepTypeCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepType === action.sheepType) {
				ctx.patchState({
					[key]: {
						name: value.name,
						count: value.count + 1,
						sheepType: value.sheepType
					}
				});

				return;
			}
		});
	}

	@Action(DecrementSheepTypeCount)
	decrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepTypeCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepType === action.sheepType) {
				if (value.count > 0) {
					ctx.patchState({
						[key]: {
							name: value.name,
							count: value.count - 1,
							sheepType: value.sheepType
						}
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}

				return;
			}
		});
	}

	@Action(IncrementCollarColourCount)
	incrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementCollarColourCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.collarColour === action.collarColour) {
				ctx.patchState({
					[key]: {
						name: value.name,
						count: value.count + 1,
						collarColour: value.collarColour
					}
				});

				return;
			}
		});
	}

	@Action(DecrementCollarColourCount)
	decrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementCollarColourCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.collarColour === action.collarColour) {
				if (value.count > 0) {
					ctx.patchState({
						[key]: {
							name: value.name,
							count: value.count + 1,
							collarColour: value.collarColour
						}
					});

				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}

				return;
			}
		});
	}
}
