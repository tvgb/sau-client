import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { DecrementSubCategoryCount, IncrementSubCategoryCount } from './sheepInfo.actions';
import { AppInfoState } from './appInfo.state';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';
import { MainCategory, SubCategory } from '../classes/Category';


@State<SheepInfoModel>({
	name: 'sheepInfo',
	defaults: {

		totalSheep: {
			id: MainCategoryId.TotalSheep,
			name: 'Sau totalt',
			speakText: '',

			totalSheep: {
				id: SubCategoryId.TotalSheep,
				name: 'Sau totalt',
				speakText: '',
				count: 0
			}
		},

		sheepColour: {
			id: MainCategoryId.SheepColour,
			name: 'Farge',
			speakText: 'sau',

			whiteSheep: {
				id: SubCategoryId.WhiteSheep,
				name: 'Hvit',
				speakText: 'hvit',
				count: 0
			},
			blackSheep: {
				id: SubCategoryId.BlackSheep,
				name: 'Svart',
				speakText: 'svart',
				count: 0
			},
			brownSheep: {
				id: SubCategoryId.BrownSheep,
				name: 'Brun',
				speakText: 'brun',
				count: 0
			}
		},

		sheepType: {
			id: MainCategoryId.SheepType,
			name: 'Type',
			speakText: '',

			ewe: {
				id: SubCategoryId.Ewe,
				name: 'Søye',
				speakText: 'søye',
				count: 0
			},
			lamb: {
				id: SubCategoryId.Lamb,
				name: 'Lam',
				speakText: 'lam',
				count: 0
			},
		},

		collarColour: {
			id: MainCategoryId.CollarColour,
			name: 'Slips',
			speakText: 'slips',

			blueCollar: {
				id: SubCategoryId.BlueCollar,
				name: 'Blå',
				speakText: 'blå',
				count: 0
			},
			greenCollar: {
				id: SubCategoryId.GreenCollar,
				name: 'Grønn',
				speakText: 'grønn',
				count: 0
			},
			yellowCollar: {
				id: SubCategoryId.YellowCollar,
				name: 'Gul',
				speakText: 'gul',
				count: 0
			},
			redCollar: {
				id: SubCategoryId.RedCollar,
				name: 'Rød',
				speakText: 'rød',
				count: 0
			},
			missingCollar: {
				id: SubCategoryId.MissingCollar,
				name: 'Mangler',
				speakText: 'mangler',
				count: 0
			}
		},

		earTag: {
			id: MainCategoryId.EarTag,
			name: 'Øremerker',
			speakText: 'øremerker',
			earTagInfos: []
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
	static getCurrentSubCategory(state: SheepInfoModel, appInfoState: AppInfoModel): SubCategory {
		const currentMainCategoryId = appInfoState.currentMainCategoryId;
		const currrentSubCategoryId = appInfoState.currentSubCategoryId;

		return state[currentMainCategoryId][currrentSubCategoryId];
	}

	@Selector([AppInfoState])
	static getCurrentMainCategory(state: SheepInfoModel, appInfoState: AppInfoModel): MainCategory {
		const currentMainCategoryId = appInfoState.currentMainCategoryId;

		return state[currentMainCategoryId];
	}

	@Action(IncrementSubCategoryCount)
	incrementSubCategoryCount(ctx: StateContext<SheepInfoModel>, action: IncrementSubCategoryCount) {
		const state = ctx.getState();

		const currentMainCategoryId = state[action.payload.mainCategoryId];
		const currentSubCategoryId = currentMainCategoryId[action.payload.subCategoryId];

		ctx.patchState({
			...state,
			[action.payload.mainCategoryId]: {
				...currentMainCategoryId,
				[action.payload.subCategoryId]: {
					...currentSubCategoryId,
					count: currentSubCategoryId.count + 1
				}
			}
		});
	}

	@Action(DecrementSubCategoryCount)
	decrementSubCategoryCount(ctx: StateContext<SheepInfoModel>, action: DecrementSubCategoryCount) {
		const state = ctx.getState();

		const currentMainCategoryId = state[action.payload.mainCategoryId];
		const currentSubCategoryId = currentMainCategoryId[action.payload.subCategoryId];

		if (currentSubCategoryId.count <= 0) { return; }

		ctx.patchState({
			...state,
			[action.payload.mainCategoryId]: {
				...currentMainCategoryId,
				[action.payload.subCategoryId]: {
					...currentSubCategoryId,
					count: currentSubCategoryId.count - 1
				}
			}
		});
	}
}
