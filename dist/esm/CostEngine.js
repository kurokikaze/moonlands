import { PROPERTY_COST, REGION_UNIVERSAL, } from './const.js';
var CostEngine = /** @class */ (function () {
    function CostEngine(context) {
        this.context = context;
    }
    CostEngine.prototype.calculateTotalCost = function (card) {
        var activeMagiSelected = this.context.getOwnMagi(card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            var activeMagi = activeMagiSelected[0];
            var baseCost = this.context.modifyByStaticAbilities(card, PROPERTY_COST);
            var regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return 0;
    };
    return CostEngine;
}());
export { CostEngine };
//# sourceMappingURL=CostEngine.js.map