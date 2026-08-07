"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostEngine = void 0;
const const_1 = require("./const");
class CostEngine {
    context;
    constructor(context) {
        this.context = context;
    }
    calculateTotalCost(card) {
        const activeMagiSelected = this.context.getOwnMagi(card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            const activeMagi = activeMagiSelected[0];
            const baseCost = this.context.modifyByStaticAbilities(card, const_1.PROPERTY_COST);
            const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return 0;
    }
}
exports.CostEngine = CostEngine;
//# sourceMappingURL=CostEngine.js.map