import {
	PROPERTY_COST,
	REGION_UNIVERSAL,
	COST_X,
	COST_X_PLUS_ONE,
	COST_X_PLUS_FOUR,
} from './const.js';

import CardInGame from './classes/CardInGame.js';
import { PropertyType } from './types/index.js';

export const variableCostOffsets = {
	[COST_X]: 0,
	[COST_X_PLUS_ONE]: 1,
	[COST_X_PLUS_FOUR]: 4,
};

export interface CostEngineContext {
	getOwnMagi(player: number): CardInGame[];
	modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null): any;
}

export class CostEngine {
	private context: CostEngineContext;

	constructor(context: CostEngineContext) {
		this.context = context;
	}

	calculateTotalCost(card: CardInGame): number {
		const activeMagiSelected = this.context.getOwnMagi(card.owner);
		if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
			const activeMagi = activeMagiSelected[0];
			const baseCost = this.context.modifyByStaticAbilities(card, PROPERTY_COST);
			const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;

			const offset = variableCostOffsets[baseCost as keyof typeof variableCostOffsets];
			return (offset === undefined ? baseCost : offset + 1) + regionPenalty;
		}

		return 0;
	}
}
