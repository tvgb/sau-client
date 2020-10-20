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
			speakText: '',

			totalSheep: {
				sheepInfoType: SheepInfoType.TotalSheepInfo,
				name: 'Sau totalt',
				speakText: '',
				count: 0
			}
		},

		sheepColour: {
			category: Category.SheepColourCategory,
			name: 'Farge',
			speakText: 'sau',

			whiteSheep: {
				sheepInfoType: SheepInfoType.WhiteSheepInfo,
				name: 'Hvit',
				speakText: 'hvit',
				count: 0
			},
			blackSheep: {
				sheepInfoType: SheepInfoType.BlackSheepInfo,
				name: 'Svart',
				speakText: 'svart',
				count: 0
			},
			brownSheep: {
				sheepInfoType: SheepInfoType.BrownSheepInfo,
				name: 'Brun',
				speakText: 'brun',
				count: 0
			}
		},

		sheepType: {
			category: Category.SheepTypeCategory,
			name: 'Type',
			speakText: '',

			ewe: {
				sheepInfoType: SheepInfoType.EweInfo,
				name: 'Søye',
				speakText: 'søye',
				count: 0
			},
			lamb: {
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
				sheepInfoType: SheepInfoType.BlueCollarInfo,
				name: 'Blå',
				speakText: 'blå',
				count: 0
			},
			greenCollar: {
				sheepInfoType: SheepInfoType.GreenCollarInfo,
				name: 'Grønn',
				speakText: 'grønn',
				count: 0
			},
			yellowCollar: {
				sheepInfoType: SheepInfoType.YellowCollarInfo,
				name: 'Gul',
				speakText: 'gul',
				count: 0
			},
			redCollar: {
				sheepInfoType: SheepInfoType.RedCollarInfo,
				name: 'Rød',
				speakText: 'rød',
				count: 0
			},
			missingCollar: {
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
