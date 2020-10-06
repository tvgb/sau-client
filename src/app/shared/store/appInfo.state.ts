import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SheepInfoCategory } from '../enums/SheepInfoCategory';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { SetCurrentSheepInfoCategory, UpdateCurrentPage, UpdatePrevPage } from './appInfo.actions';



@State<AppInfoModel>({
	name: 'appInfo',
	defaults: {
		currentPage: 0,
		prevPage: 0,
		currentCategory: SheepInfoCategory.totalSheepInfo
	}
})

@Injectable()
export class AppInfoState {

	@Selector()
	static getCurrentPage(state: AppInfoModel) {
		return state.currentPage;
	}

	@Selector()
	static getPrevPage(state: AppInfoModel) {
		return state.prevPage;
	}

	@Selector()
	static getCurrentSheepInfoCategory(state: AppInfoModel) {
		return state.currentCategory;
	}

	@Action(UpdateCurrentPage)
	updateCurrentPage(ctx: StateContext<AppInfoModel>, action: UpdateCurrentPage){
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentPage: action.currentPage,
		});
	}

	@Action(UpdatePrevPage)
	updatePrevPage(ctx: StateContext<AppInfoModel>, action: UpdatePrevPage) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			prevPage: action.prevPage,
		});
	}

	@Action(SetCurrentSheepInfoCategory)
	setCurrentSheepInfo(ctx: StateContext<AppInfoModel>, action: SetCurrentSheepInfoCategory) {
		const state = ctx.getState();
		ctx.setState({
			...state,
			currentCategory: action.sheepInfoCategory,
		});
	}
}
