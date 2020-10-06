import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Page } from '../enums/Page';
import { AppInfoModel } from '../interfaces/AppInfoModel';
import { UpdateCurrentPage, UpdatePrevPage } from './appInfo.actions';



@State<AppInfoModel>({
	name: 'appInfo',
	defaults: {
		currentPage: Page.MapPage,
		prevPage: Page.MapPage,
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
}
