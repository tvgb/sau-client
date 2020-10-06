import { CollarColourCountPageRoutingModule } from 'src/app/pages/registration/collar-colour-count/collar-colour-count-routing.module';
import { CollarColourInfo } from '../classes/CollarColourInfo';
import { SheepColourInfo } from '../classes/SheepColourInfo';
import { SheepInfo } from '../classes/SheepInfo';
import { SheepTypeInfo } from '../classes/SheepTypeInfo';
import { SheepColour } from '../enums/SheepColour';
import { SheepType } from '../enums/SheepType';

export interface SheepInfoModel {

	totalSheep: SheepInfo;

	blackSheep: SheepColourInfo;
	greyWhiteSheep: SheepColourInfo;
	brownSheep: SheepColourInfo;
	whiteBlackHeadSheep: SheepColourInfo;

	lamb: SheepTypeInfo;
	ewe: SheepTypeInfo;

	blueCollar: CollarColourInfo;
	greenCollar: CollarColourInfo;
	yellowCollar: CollarColourInfo;
	redCollar: CollarColourInfo;
	missingCollar: CollarColourInfo;
}
