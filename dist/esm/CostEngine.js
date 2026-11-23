import { PROPERTY_COST, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, COST_X_PLUS_FOUR, } from './const.js';
export const variableCostOffsets = {
    [COST_X]: 0,
    [COST_X_PLUS_ONE]: 1,
    [COST_X_PLUS_FOUR]: 4,
};
export class CostEngine {
    constructor(context) {
        this.context = context;
    }
    calculateTotalCost(card) {
        const activeMagiSelected = this.context.getOwnMagi(card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            const activeMagi = activeMagiSelected[0];
            const baseCost = this.context.modifyByStaticAbilities(card, PROPERTY_COST);
            const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;
            const offset = variableCostOffsets[baseCost];
            return (offset === undefined ? baseCost : offset + 1) + regionPenalty;
        }
        return 0;
    }
}
//# sourceMappingURL=CostEngine.js.map