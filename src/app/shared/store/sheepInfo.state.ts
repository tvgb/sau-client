import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SheepInfoModel } from '../interfaces/SheepInfoModel';
import { throwError } from 'rxjs';
import { SheepColour } from '../enums/SheepColour';
import { CollarColour } from '../enums/CollarColour';
import { DecrementCollarColourCount,
		DecrementSheepColourCount,
		DecrementSheepTypeCount,
		DecrementTotalSheepCount,
		IncrementCollarColourCount,
		IncrementSheepColourCount,
		IncrementSheepTypeCount,
		IncrementTotalSheepCount } from './sheepInfo.actions';
import { SheepType } from '../enums/SheepType';


@State<SheepInfoModel>({
	name: 'sheepInfo',
	defaults: {
		totalSheepCount: 0,

		blackSheepCount: 0,
		greyWhiteSheepCount: 0,
		brownSheepCount: 0,
		whiteBlackHeadSheepCount: 0,

		lambCount: 0,
		eweCount: 0,

		blueCollarCount: 0,
		greenCollarCount: 0,
		yellowCollarCount: 0,
		redCollarCount: 0,
		missingCollarCount: 0,
	}
})

@Injectable()
export class SheepInfoState {

	@Selector()
	static getTotalSheepCount(state: SheepInfoModel) {
		return state.totalSheepCount;
	}

	@Selector()
	static getSheepColourCount(state: SheepInfoModel) {
		return {
			blackSheepCount: state.blackSheepCount,
			greyWhiteSheepCount: state.greyWhiteSheepCount,
			brownSheepCount: state.brownSheepCount,
			whiteBlackHeadSheepCount: state.whiteBlackHeadSheepCount
		};
	}

	@Selector()
	static getSheepTypeCount(state: SheepInfoModel) {
		return {
			eweCount: state.eweCount,
			lambCount: state.lambCount
		};
	}

	@Selector()
	static getCollarColour(state: SheepInfoModel) {
		return {
			blueCollarCount: state.blueCollarCount,
			greenCollarCount: state.greenCollarCount,
			yellowCollarCount: state.yellowCollarCount,
			redCollarCount: state.redCollarCount,
			missingCollarCount: state.missingCollarCount
		};
	}

	@Action(IncrementTotalSheepCount)
	incrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
		const state = ctx.getState();

		ctx.setState({
			...state,
			totalSheepCount: state.totalSheepCount + 1
		});
	}

	@Action(DecrementTotalSheepCount)
	decrementTotalSheepCount(ctx: StateContext<SheepInfoModel>) {
		const state = ctx.getState();

		if (state.totalSheepCount > 0) {
			ctx.setState({
				...state,
				totalSheepCount: state.totalSheepCount - 1
			});

		} else {
			throwError(new Error('Cannot decrement. Count already at 0'));
		}
	}

	@Action(IncrementSheepColourCount)
	incrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepColourCount) {
		const state = ctx.getState();

		switch (action.sheepColour) {

			case SheepColour.Black:
				ctx.setState({
					...state,
					blackSheepCount: state.blackSheepCount + 1
				});
				break;

			case SheepColour.Brown:
				ctx.setState({
					...state,
					brownSheepCount: state.brownSheepCount + 1
				});
				break;

			case SheepColour.GreyWhite:
				ctx.setState({
					...state,
					greyWhiteSheepCount: state.greyWhiteSheepCount + 1
				});
				break;

			case SheepColour.WhiteBlackHead:
				ctx.setState({
					...state,
					whiteBlackHeadSheepCount: state.whiteBlackHeadSheepCount + 1
				});
				break;
		}
	}

	@Action(DecrementSheepColourCount)
	decrementSheepColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepColourCount) {
		const state = ctx.getState();

		switch (action.sheepColour) {

			case SheepColour.Black:
				if (state.blackSheepCount > 0) {
					ctx.setState({
						...state,
						blackSheepCount: state.blackSheepCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}

				break;

			case SheepColour.Brown:
				if (state.brownSheepCount > 0) {
					ctx.setState({
						...state,
						brownSheepCount: state.brownSheepCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case SheepColour.GreyWhite:
				if (state.greyWhiteSheepCount > 0) {
					ctx.setState({
						...state,
						greyWhiteSheepCount: state.greyWhiteSheepCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case SheepColour.WhiteBlackHead:
				if (state.whiteBlackHeadSheepCount > 0) {
					ctx.setState({
						...state,
						whiteBlackHeadSheepCount: state.whiteBlackHeadSheepCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;
		}
	}

	@Action(IncrementSheepTypeCount)
	incrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: IncrementSheepTypeCount) {
		const state = ctx.getState();

		switch (action.sheepType) {
			case(SheepType.Ewe):
				ctx.setState({
					...state,
					eweCount: state.eweCount + 1,
				});
				break;

			case(SheepType.Lamb):
				ctx.setState({
					...state,
					lambCount: state.lambCount + 1,
				});
				break;
		}
	}

	@Action(DecrementSheepTypeCount)
	decrementSheepTypeCount(ctx: StateContext<SheepInfoModel>, action: DecrementSheepTypeCount) {
		const state = ctx.getState();

		switch (action.sheepType) {
			case(SheepType.Ewe):
				if (state.eweCount > 0) {
					ctx.setState({
						...state,
						eweCount: state.eweCount - 1
					});

				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case(SheepType.Lamb): {
				if (state.lambCount > 0) {
					ctx.setState({
						...state,
						lambCount: state.lambCount - 1
					});

				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;
			}
		}
	}

	@Action(IncrementCollarColourCount)
	incrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: IncrementCollarColourCount) {
		const state = ctx.getState();

		switch (action.collarColour) {

			case CollarColour.Blue:
				ctx.setState({
					...state,
					blueCollarCount: state.blueCollarCount + 1
				});
				break;

			case CollarColour.Green:
				ctx.setState({
					...state,
					greenCollarCount: state.greenCollarCount + 1
				});
				break;

			case CollarColour.Yellow:
				ctx.setState({
					...state,
					yellowCollarCount: state.yellowCollarCount + 1
				});
				break;

			case CollarColour.Red:
				ctx.setState({
					...state,
					redCollarCount: state.redCollarCount + 1
				});
				break;

			case CollarColour.Missing:
				ctx.setState({
					...state,
					missingCollarCount: state.missingCollarCount + 1
				});
				break;
		}
	}

	@Action(DecrementCollarColourCount)
	decrementCollarColourCount(ctx: StateContext<SheepInfoModel>, action: DecrementCollarColourCount) {
		const state = ctx.getState();

		switch (action.collarColour) {

			case CollarColour.Blue:
				if (state.blueCollarCount > 0) {
					ctx.setState({
						...state,
						blueCollarCount: state.blueCollarCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}

				break;

			case CollarColour.Green:
				if (state.greenCollarCount > 0) {
					ctx.setState({
						...state,
						greenCollarCount: state.greenCollarCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case CollarColour.Yellow:
				if (state.yellowCollarCount > 0) {
					ctx.setState({
						...state,
						yellowCollarCount: state.yellowCollarCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case CollarColour.Red:
				if (state.redCollarCount > 0) {
					ctx.setState({
						...state,
						redCollarCount: state.redCollarCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;

			case CollarColour.Missing:
				if (state.missingCollarCount > 0) {
					ctx.setState({
						...state,
						missingCollarCount: state.missingCollarCount - 1
					});
				} else {
					throwError(new Error('Cannot decrement. Count already at 0'));
				}
				break;
		}
	}
}
