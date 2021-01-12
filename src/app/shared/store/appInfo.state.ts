import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MainCategoryId } from '../enums/MainCategoryId';
import { SubCategoryId } from '../enums/SubCategoryId';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { SetCurrentMainCategoryId, SetCurrentSubCategoryId } from './appInfo.actions';


@State<AppInfoModel>({
	name: 'appInfo',
	defaults: {
		currentMainCategoryId: MainCategoryId.TotalSheep,
		currentSubCategoryId: SubCategoryId.TotalSheep
	}
})

@Injectable()
export class AppInfoState {
	@Selector()
	static getCurrentMainCategoryId(state: AppInfoModel) {
		return state.currentMainCategoryId;
	}

	@Action(SetCurrentMainCategoryId)
	setCurrentMainCategoryId(ctx: StateContext<AppInfoModel>, action: SetCurrentMainCategoryId) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentMainCategoryId: action.mainCategoryId,
		});
	}

	@Action(SetCurrentSubCategoryId)
	setCurrentSubCategoryId(ctx: StateContext<AppInfoModel>, action: SetCurrentSubCategoryId) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentSubCategoryId: action.subCategoryId,
		});
	}
}
