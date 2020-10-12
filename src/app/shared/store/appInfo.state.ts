import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Category } from '../enums/Category';
import { SheepInfoType } from '../enums/SheepInfoType';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { SetCurrentSheepInfoCategory, SetCurrentSheepInfoType } from './appInfo.actions';



@State<AppInfoModel>({
	name: 'appInfo',
	defaults: {
		currentCategory: Category.TotalSheepCategory,
		currentSheepInfoType: SheepInfoType.TotalSheepInfo
	}
})

@Injectable()
export class AppInfoState {

	// @Selector()
	// static getCurrentPage(state: AppInfoModel) {
	// 	return state.currentPage;
	// }

	// @Selector()
	// static getPrevPage(state: AppInfoModel) {
	// 	return state.prevPage;
	// }

	@Selector()
	static getCurrentSheepInfoCategory(state: AppInfoModel) {
		return state.currentCategory;
	}

	// @Action(UpdateCurrentPage)
	// updateCurrentPage(ctx: StateContext<AppInfoModel>, action: UpdateCurrentPage){
	// 	const state = ctx.getState();
	// 	ctx.setState({
	// 		...state,
	// 		currentPage: action.currentPage,
	// 	});
	// }

	// @Action(UpdatePrevPage)
	// updatePrevPage(ctx: StateContext<AppInfoModel>, action: UpdatePrevPage) {
	// 	const state = ctx.getState();
	// 	ctx.setState({
	// 		...state,
	// 		prevPage: action.prevPage,
	// 	});
	// }

	@Action(SetCurrentSheepInfoCategory)
	setCurrentSheepInfoCategory(ctx: StateContext<AppInfoModel>, action: SetCurrentSheepInfoCategory) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentCategory: action.sheepInfoCategory,
		});
	}

	@Action(SetCurrentSheepInfoType)
	setCurrentSheepInfoType(ctx: StateContext<AppInfoModel>, action: SetCurrentSheepInfoType) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentSheepInfoType: action.sheepInfoType,
		});
	}
}
