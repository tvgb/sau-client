import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { throwError } from 'rxjs';
import { SheepColour } from '../enums/SheepColour';
import { CollarColour } from '../enums/CollarColour';
import { SheepType } from '../enums/SheepType';
import { DecrementSheepInfoCategoryCount, IncrementSheepInfoCategoryCount } from './sheepInfo.actions';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';
import { AppInfoState } from './appInfo.state';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { SheepInfo } from '../classes/SheepInfo';


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

	constructor() {}

	@Selector()
	static getSheepInfo(state: SheepInfoModel) {
		return state;
	}

	@Selector([AppInfoState])
	static getCurrentSheepInfo(state: SheepInfoModel, appInfoState: AppInfoModel): SheepInfo {
		const currentCategory = appInfoState.currentCategory;
		let currentSheepInfo: SheepInfo;

		Object.entries(state).forEach(([key, value]) => {
			if (value.sheepInfoCategory === currentCategory) {
				currentSheepInfo = state[key];
			}
		});

		return currentSheepInfo;
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
}
