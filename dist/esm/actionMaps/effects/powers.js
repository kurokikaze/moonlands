var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { PROPERTY_CONTROLLER, PROPERTY_POWER_COST, } from "../../const.js";
export var applyExecutePowerEffects = function (action) {
    var power = this.getMetaValue(action.power, action.generatedBy);
    var sourceRaw = this.getMetaValue(action.source, action.generatedBy);
    // Some selectors will give us arrays anyway
    var source = sourceRaw instanceof Array ? sourceRaw[0] : sourceRaw;
    var sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);
    var powerCost = this.modifyByStaticAbilities(source, PROPERTY_POWER_COST, power.name || '');
    var enrichAction = function (effect) { return (__assign(__assign({ source: source, player: sourceController }, effect), { power: true, generatedBy: source.id })); };
    if ('effects' in power && power.effects) {
        var effects = power.effects;
        var preparedActions = effects.map(enrichAction);
        var allPromptsAreDoable = this.checkPrompts(source, preparedActions, true);
        if (allPromptsAreDoable) {
            var mustSetUsage = !('setUsage' in action) || action.setUsage == true;
            if (mustSetUsage && !source.wasActionUsed(power.name)) {
                source.setActionUsed(power.name);
            }
            this.transformIntoActions.apply(this, preparedActions);
        }
    }
};
//# sourceMappingURL=powers.js.map