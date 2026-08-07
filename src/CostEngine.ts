import {
	SELECTOR_OWN_MAGI,
	PROPERTY_COST,
	REGION_UNIVERSAL,
} from './const';

import CardInGame from './classes/CardInGame';
import { PropertyType } from './types';

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

			return baseCost + regionPenalty;
		}

		return 0;
	}
}
