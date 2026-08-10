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
import { PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS_WAS_ATTACKED, PROPERTY_STATUS_DEFEATED_CREATURE, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, PROPERTY_PROTECTION, PROPERTY_CREATURE_NAME, PROPERTY_CONTROLLING_PLAYER, CALCULATION_SET, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, STATUS_BURROWED, } from './const.js';
import performCalculation from './helpers/performCalculation.js';
// ─── LayeredModificationEngine ───────────────────────────────────────────────
var LayeredModificationEngine = /** @class */ (function () {
    function LayeredModificationEngine() {
    }
    LayeredModificationEngine.prototype.getByProperty = function (target, property, subProperty) {
        var _a, _b, _c, _d;
        if (subProperty === void 0) { subProperty = null; }
        switch (property) {
            case PROPERTY_ID:
                return target.id;
            case PROPERTY_TYPE:
                return target.card.type;
            case PROPERTY_CREATURE_TYPES:
                return target.card.name.split(' ');
            case PROPERTY_CREATURE_NAME:
                return target.card.name;
            case PROPERTY_MAGI_NAME:
                return target.card.name;
            case PROPERTY_CONTROLLER:
                return target.data.controller;
            case PROPERTY_ENERGY_COUNT:
                return target.data.energy;
            case PROPERTY_ATTACKS_PER_TURN:
                return target.modifiedCard ?
                    target.modifiedCard.data.attacksPerTurn :
                    target.card.data.attacksPerTurn;
            case PROPERTY_COST:
                return target.modifiedCard ?
                    target.modifiedCard.cost :
                    target.card.cost;
            case PROPERTY_ENERGIZE:
                return target.modifiedCard ?
                    target.modifiedCard.data.energize :
                    target.card.data.energize;
            case PROPERTY_REGION:
                return target.card.region;
            case PROPERTY_CAN_ATTACK_MAGI_DIRECTLY:
                return target.modifiedCard ?
                    target.modifiedCard.data.canAttackMagiDirectly :
                    target.card.data.canAttackMagiDirectly;
            case PROPERTY_MAGI_STARTING_ENERGY:
                return target.modifiedCard ?
                    target.modifiedCard.data.startingEnergy :
                    target.card.data.startingEnergy;
            case PROPERTY_POWER_COST: {
                var powers = target.modifiedCard ? (_a = target.modifiedCard.data) === null || _a === void 0 ? void 0 : _a.powers : target.card.data.powers;
                return (powers && powers.length) ? (_b = powers.find(function (_a) {
                    var name = _a.name;
                    return name === subProperty;
                })) === null || _b === void 0 ? void 0 : _b.cost : 0;
            }
            case PROPERTY_STATUS_WAS_ATTACKED:
                return target.data.wasAttacked || false;
            case PROPERTY_CAN_BE_ATTACKED:
                return target.modifiedCard.data.canBeAttacked;
            case PROPERTY_STATUS_DEFEATED_CREATURE:
                return target.data.defeatedCreature || false;
            case PROPERTY_PROTECTION:
                return target.modifiedCard ?
                    target.modifiedCard.data.protection :
                    target.card.data.protection;
            case PROPERTY_STATUS: {
                switch (subProperty) {
                    case STATUS_BURROWED:
                        return Object.hasOwnProperty.call(target.data, 'burrowed') ?
                            target.data.burrowed :
                            target.card.data.burrowed;
                    default:
                        return false;
                }
            }
            // These properties can only be modified by static abilities / continuous effects
            case PROPERTY_ENERGY_LOSS_THRESHOLD:
                return target.modifiedCard ?
                    target.modifiedCard.data.energyLossThreshold : 0;
            case PROPERTY_ABLE_TO_ATTACK: {
                var defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : defaultValue;
            }
            case PROPERTY_CONTROLLING_PLAYER:
                return (_d = (_c = target.modifiedCard) === null || _c === void 0 ? void 0 : _c.data.controllingPlayer) !== null && _d !== void 0 ? _d : 0;
        }
    };
    LayeredModificationEngine.prototype.getByPropertyAny = function (target, property, subProperty) {
        if (subProperty === void 0) { subProperty = null; }
        return this.getByProperty(target, property, subProperty);
    };
    // ── layeredDataReducer ───────────────────────────────────────────────────
    LayeredModificationEngine.prototype.layeredDataReducer = function (currentCard, staticAbility) {
        var _this = this;
        if (!this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
            return currentCard;
        }
        switch (staticAbility.property) {
            case PROPERTY_COST: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_COST);
                var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                if (typeof initialValue !== 'number') {
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: initialValue }) });
                }
                var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: resultValue }) });
            }
            case PROPERTY_ENERGIZE: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                var _b = staticAbility.modifier, operator = _b.operator, operandOne = _b.operandOne;
                var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energize: resultValue }) }) });
            }
            case PROPERTY_ATTACKS_PER_TURN: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
                var _c = staticAbility.modifier, operator = _c.operator, operandOne = _c.operandOne;
                var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { attacksPerTurn: resultValue }) }) });
            }
            case PROPERTY_ENERGY_LOSS_THRESHOLD: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                var _d = staticAbility.modifier, operator = _d.operator, operandOne = _d.operandOne;
                var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energyLossThreshold: resultValue }) }) });
            }
            case PROPERTY_ABLE_TO_ATTACK: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
                var _e = staticAbility.modifier, operator = _e.operator, operandOne = _e.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { ableToAttack: resultValue }) }) });
                }
                else {
                    return __assign({}, currentCard);
                }
            }
            case PROPERTY_CAN_BE_ATTACKED: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
                var _f = staticAbility.modifier, operator = _f.operator, operandOne = _f.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { canBeAttacked: resultValue }) }) });
                }
                else {
                    return __assign({}, currentCard);
                }
            }
            case PROPERTY_CONTROLLER: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
                var _g = staticAbility.modifier, operator = _g.operator, operandOne = _g.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'number') {
                    return __assign(__assign({}, currentCard), { data: __assign(__assign({}, currentCard.data), { controller: resultValue }) });
                }
                else {
                    return __assign({}, currentCard);
                }
            }
            case PROPERTY_STATUS: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty);
                var _h = staticAbility.modifier, operator = _h.operator, operandOne = _h.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    switch (staticAbility.subProperty) {
                        case STATUS_BURROWED: {
                            return __assign(__assign({}, currentCard), { data: __assign(__assign({}, currentCard.data), { burrowed: resultValue }) });
                        }
                        default: {
                            return currentCard;
                        }
                    }
                }
                else {
                    return __assign({}, currentCard);
                }
            }
            case PROPERTY_PROTECTION: {
                var initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
                var _j = staticAbility.modifier, operator = _j.operator, operandOne = _j.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'object' && 'from' in resultValue) {
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { protection: resultValue }) }) });
                }
                else {
                    return __assign({}, currentCard);
                }
            }
            case PROPERTY_CONTROLLING_PLAYER: {
                var _k = staticAbility.modifier, operator = _k.operator, operandOne = _k.operandOne;
                var resultValue = (operator === CALCULATION_SET) ? operandOne : 0;
                if (typeof resultValue === 'number') {
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { controllingPlayer: resultValue }) }) });
                }
                return currentCard;
            }
            case PROPERTY_POWER_COST: {
                if (currentCard.modifiedCard.data.powers) {
                    var updatedPowers = currentCard.modifiedCard.data.powers.map(function (power) {
                        var initialValue = _this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
                        var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                        var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                            performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                        return __assign(__assign({}, power), { cost: resultValue });
                    });
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { powers: updatedPowers }) }) });
                }
                return currentCard;
            }
            default: {
                return currentCard;
            }
        }
    };
    // ── Helper methods ───────────────────────────────────────────────────────
    /**
     * Check if a card is affected by a static ability based on its selector
     * Must be implemented by subclass
     */
    LayeredModificationEngine.prototype.isCardAffectedByStaticAbility = function (card, staticAbility) {
        throw new Error('isCardAffectedByStaticAbility must be implemented by subclass');
    };
    return LayeredModificationEngine;
}());
export { LayeredModificationEngine };
//# sourceMappingURL=LayeredModificationEngine.js.map