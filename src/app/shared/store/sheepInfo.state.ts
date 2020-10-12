import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { DecrementSheepInfoCount, IncrementSheepInfoCount } from './sheepInfo.actions';
import { AppInfoState } from './appInfo.state';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { SheepInfo } from '../classes/SheepInfo';
import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';
import { SheepInfoCategory } from '../classes/SheepInfoCategory';


@State<SheepInfoModel>({
	name: 'sheepInfo',
	defaults: {

		totalSheep: {
			category: Category.TotalSheepCategory,
			name: 'Sau totalt',
			speakText: 'sau totalt',

			totalSheep: {
				sheepInfoCategory: Category.TotalSheepCategory,
				sheepInfoType: SheepInfoType.TotalSheepInfo,
				name: 'Sau totalt',
				speakText: 'sau totalt',
				count: 0
			}
		},

		sheepColour: {
			category: Category.SheepColourCategory,
			name: 'Farge',
			speakText: 'farge',

			blackSheep: {
				sheepInfoCategory: Category.SheepColourCategory,
				sheepInfoType: SheepInfoType.BlackSheepInfo,
				name: 'Svart',
				speakText: 'svart',
				count: 0
			},
			greyWhiteSheep: {
				sheepInfoCategory: Category.SheepColourCategory,
				sheepInfoType: SheepInfoType.GreyWhiteSheepInfo,
				name: 'Grå og hvit',
				speakText: 'grå og hvit',
				count: 0
			},
			brownSheep: {
				sheepInfoCategory: Category.SheepColourCategory,
				sheepInfoType: SheepInfoType.BrownSheepInfo,
				name: 'Brun',
				speakText: 'brun',
				count: 0
			},
			whiteBlackHeadSheep: {
				sheepInfoCategory: Category.SheepColourCategory,
				sheepInfoType: SheepInfoType.WhiteBlackHeadSheepInfo,
				name: 'Hvit, svart hode',
				speakText: 'hvit, svart hode',
				count: 0
			},
		},

		sheepType: {
			category: Category.SheepTypeCategory,
			name: 'Type',
			speakText: 'type',

			ewe: {
				sheepInfoCategory: Category.SheepTypeCategory,
				sheepInfoType: SheepInfoType.EweInfo,
				name: 'Søy',
				speakText: 'søy',
				count: 0
			},
			lamb: {
				sheepInfoCategory: Category.SheepTypeCategory,
				sheepInfoType: SheepInfoType.LambInfo,
				name: 'Lam',
				speakText: 'lam',
				count: 0
			},
		},

		collarColour: {
			category: Category.CollarColourCategory,
			name: 'Slips',
			speakText: 'slips',

			blueCollar: {
				sheepInfoCategory: Category.CollarColourCategory,
				sheepInfoType: SheepInfoType.BlueCollarInfo,
				name: 'Blå',
				speakText: 'blå',
				count: 0
			},
			greenCollar: {
				sheepInfoCategory: Category.CollarColourCategory,
				sheepInfoType: SheepInfoType.GreenCollarInfo,
				name: 'Grønn',
				speakText: 'grønn',
				count: 0
			},
			yellowCollar: {
				sheepInfoCategory: Category.CollarColourCategory,
				sheepInfoType: SheepInfoType.YellowCollarInfo,
				name: 'Gul',
				speakText: 'gul',
				count: 0
			},
			redCollar: {
				sheepInfoCategory: Category.CollarColourCategory,
				sheepInfoType: SheepInfoType.RedCollarInfo,
				name: 'Rød',
				speakText: 'rød',
				count: 0
			},
			missingCollar: {
				sheepInfoCategory: Category.CollarColourCategory,
				sheepInfoType: SheepInfoType.MissingCollarInfo,
				name: 'Mangler',
				speakText: 'mangler',
				count: 0
			}
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
		const currentSheepInfoType = appInfoState.currentSheepInfoType;

		return state[currentCategory][currentSheepInfoType];
	}

	@Selector([AppInfoState])
	static getCurrentSheepInfoCategory(state: SheepInfoModel, appInfoState: AppInfoModel): SheepInfoCategory {
		const currentCategory = appInfoState.currentCategory;

		return state[currentCategory];
	}

	@Action(IncrementSheepInfoCount)
	incrementSheepInfoCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepInfoCount) {
		const state = ctx.getState();

		const currentCategory = state[action.payload.category];
		const currentSheepInfo = currentCategory[action.payload.sheepInfoType];

		ctx.patchState({
			...state,
			[action.payload.category]: {
				...currentCategory,
				[action.payload.sheepInfoType]: {
					...currentSheepInfo,
					count: currentSheepInfo.count + 1
				}
			}
		});
	}

	@Action(DecrementSheepInfoCount)
	decrementSheepInfoCategoryCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepInfoCount) {
		const state = ctx.getState();

		const currentCategory = state[action.payload.category];
		const currentSheepInfo = currentCategory[action.payload.sheepInfoType];

		if (currentSheepInfo.count <= 0) { return; }

		ctx.patchState({
			...state,
			[action.payload.category]: {
				...currentCategory,
				[action.payload.sheepInfoType]: {
					...currentSheepInfo,
					count: currentSheepInfo.count - 1
				}
			}
		});
	}
}
