import { PROPERTY_COST, REGION_UNIVERSAL, } from './const.js';
export class CostEngine {
    context;
    constructor(context) {
        this.context = context;
    }
    calculateTotalCost(card) {
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
//# sourceMappingURL=CostEngine.js.map