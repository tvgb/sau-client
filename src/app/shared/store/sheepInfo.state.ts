import { Action, createSelector, Select, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { throwError } from 'rxjs';
import { SheepColour } from '../enums/SheepColour';
import { CollarColour } from '../enums/CollarColour';
import { SheepType } from '../enums/SheepType';
import { DecrementCollarColourCount,
		DecrementSheepColourCount,
		DecrementSheepInfoCategoryCount,
		DecrementSheepTypeCount,
		DecrementTotalSheepCount,
		IncrementCollarColourCount,
		IncrementSheepColourCount,
		IncrementSheepInfoCategoryCount,
		IncrementSheepTypeCount,
		IncrementTotalSheepCount } from './sheepInfo.actions';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';


@State<SheepInfoModel>({
	name: 'sheepInfo',
	defaults: {
		totalSheep: {
			sheepInfoCategory: SheepInfoCategory.totalSheepInfo,
			name: 'Sau totalt',
			count: 0
		},

		blackSheep: {
			sheepInfoCategory: SheepInfoCategory.blackSheepInfo,
			name: 'Svart',
			count: 0,
			sheepColour: SheepColour.Black
		},
		greyWhiteSheep: {
			sheepInfoCategory: SheepInfoCategory.greyWhiteSheepInfo,
			name: 'Grå og hvit',
			count: 0,
			sheepColour: SheepColour.GreyWhite
		},
		brownSheep: {
			sheepInfoCategory: SheepInfoCategory.brownSheepInfo,
			name: 'Brun',
			count: 0,
			sheepColour: SheepColour.Brown
		},
		whiteBlackHeadSheep: {
			sheepInfoCategory: SheepInfoCategory.whiteBlackHeadSheepInfo,
			name: 'Hvit, svart hode',
			count: 0,
			sheepColour: SheepColour.WhiteBlackHead
		},

		ewe: {
			sheepInfoCategory: SheepInfoCategory.eweInfo,
			name: 'Søy',
			count: 0,
			sheepType: SheepType.Ewe
		},
		lamb: {
			sheepInfoCategory: SheepInfoCategory.lambInfo,
			name: 'Lam',
			count: 0,
			sheepType: SheepType.Lamb
		},

		blueCollar: {
			sheepInfoCategory: SheepInfoCategory.blueCollarInfo,
			name: 'Blå',
			count: 0,
			collarColour: CollarColour.Blue
		},
		greenCollar: {
			sheepInfoCategory: SheepInfoCategory.greenCollarInfo,
			name: 'Grønn',
			count: 0,
			collarColour: CollarColour.Green
		},
		yellowCollar: {
			sheepInfoCategory: SheepInfoCategory.yellowCollarInfo,
			name: 'Gul',
			count: 0,
			collarColour: CollarColour.Yellow
		},
		redCollar: {
			sheepInfoCategory: SheepInfoCategory.redCollarInfo,
			name: 'Rød',
			count: 0,
			collarColour: CollarColour.Red
		},
		missingCollar: {
			sheepInfoCategory: SheepInfoCategory.missingCollarInfo,
			name: 'Mangler',
			count: 0,
			collarColour: CollarColour.Missing
		}
	}
})

@Injectable()
export class SheepInfoState {

	@Selector

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

	@Action(IncrementSheepInfoCategoryCount)
	incrementSheepInfoCategoryCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepInfoCategoryCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepInfoCategory === action.sheepInfoCategory) {
				ctx.patchState({
					[key]: {
						sheepInfoCategory: value.sheepInfoCategory,
						name: value.name,
						count: value.count + 1,
						sheepColour: value.sheepColour
					}
				});

				return;
			}
		});
	}

	@Action(DecrementSheepInfoCategoryCount)
	decrementSheepInfoCategoryCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepInfoCategoryCount) {
		const state = ctx.getState();

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepInfoCategory === action.sheepInfoCategory) {

				if (value.count > 0) {
					ctx.patchState({
						[key]: {
							sheepInfoCategory: value.sheepInfoCategory,
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

	// @Action(IncrementTotalSheepCount)
	// incrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
	// 	const state = ctx.getState();

	// 	ctx.setState({
	// 		...state,
	// 		totalSheep: {
	// 			name: state.totalSheep.name,
	// 			count: state.totalSheep.count + 1
	// 		}
	// 	});
	// }

	// @Action(DecrementTotalSheepCount)
	// decrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
	// 	const state = ctx.getState();

	// 	if (state.totalSheep.count > 0) {
	// 		ctx.setState({
	// 			...state,
	// 			totalSheep: {
	// 				name: state.totalSheep.name,
	// 				count: state.totalSheep.count - 1
	// 			}
	// 		});

	// 	} else {
	// 		throwError(new Error('Cannot decrement. Count already at 0'));
	// 	}
	// }

	// @Action(IncrementSheepColourCount)
	// incrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepColourCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.sheepColour === action.sheepColour) {
	// 			ctx.patchState({
	// 				[key]: {
	// 					name: value.name,
	// 					count: value.count + 1,
	// 					sheepColour: value.sheepColour
	// 				}
	// 			});

	// 			return;
	// 		}
	// 	});
	// }

	// @Action(DecrementSheepColourCount)
	// decrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepColourCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.sheepColour === action.sheepColour ) {

	// 			if (value.count > 0) {
	// 				ctx.patchState({
	// 					[key]: {
	// 						name: value.name,
	// 						count: value.count - 1,
	// 						sheepColour: value.sheepColour
	// 					}
	// 				});
	// 			} else {
	// 				throwError(new Error('Cannot decrement. Count already at 0'));
	// 			}

	// 			return;
	// 		}
	// 	});
	// }

	// @Action(IncrementSheepTypeCount)
	// incrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepTypeCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.sheepType === action.sheepType) {
	// 			ctx.patchState({
	// 				[key]: {
	// 					name: value.name,
	// 					count: value.count + 1,
	// 					sheepType: value.sheepType
	// 				}
	// 			});

	// 			return;
	// 		}
	// 	});
	// }

	// @Action(DecrementSheepTypeCount)
	// decrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepTypeCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.sheepType === action.sheepType) {
	// 			if (value.count > 0) {
	// 				ctx.patchState({
	// 					[key]: {
	// 						name: value.name,
	// 						count: value.count - 1,
	// 						sheepType: value.sheepType
	// 					}
	// 				});
	// 			} else {
	// 				throwError(new Error('Cannot decrement. Count already at 0'));
	// 			}

	// 			return;
	// 		}
	// 	});
	// }

	// @Action(IncrementCollarColourCount)
	// incrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementCollarColourCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.collarColour === action.collarColour) {
	// 			ctx.patchState({
	// 				[key]: {
	// 					name: value.name,
	// 					count: value.count + 1,
	// 					collarColour: value.collarColour
	// 				}
	// 			});

	// 			return;
	// 		}
	// 	});
	// }

	// @Action(DecrementCollarColourCount)
	// decrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementCollarColourCount) {
	// 	const state = ctx.getState();

	// 	Object.entries(state).forEach(([key, value]) => {
	// 		if (value.collarColour === action.collarColour) {
	// 			if (value.count > 0) {
	// 				ctx.patchState({
	// 					[key]: {
	// 						name: value.name,
	// 						count: value.count + 1,
	// 						collarColour: value.collarColour
	// 					}
	// 				});

	// 			} else {
	// 				throwError(new Error('Cannot decrement. Count already at 0'));
	// 			}

	// 			return;
	// 		}
	// 	});
	// }
}
