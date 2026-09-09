import { PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS_WAS_ATTACKED, PROPERTY_STATUS_DEFEATED_CREATURE, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, PROPERTY_PROTECTION, PROPERTY_CREATURE_NAME, PROPERTY_CONTROLLING_PLAYER, PROPERTY_ABLE_TO_USE_POWERS, CALCULATION_SET, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, STATUS_BURROWED, } from './const.js';
import performCalculation from './helpers/performCalculation.js';
// ─── LayeredModificationEngine ───────────────────────────────────────────────
export class LayeredModificationEngine {
    getByProperty(target, property, subProperty = null) {
        var _a, _b, _c, _d;
        var _e, _f;
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
                const powers = target.modifiedCard ? (_a = target.modifiedCard.data) === null || _a === void 0 ? void 0 : _a.powers : target.card.data.powers;
                return (powers && powers.length) ? (_b = powers.find(({ name }) => name === subProperty)) === null || _b === void 0 ? void 0 : _b.cost : 0;
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
                const defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : defaultValue;
            }
            case PROPERTY_CONTROLLING_PLAYER:
                return (_e = (_c = target.modifiedCard) === null || _c === void 0 ? void 0 : _c.data.controllingPlayer) !== null && _e !== void 0 ? _e : 0;
            case PROPERTY_ABLE_TO_USE_POWERS:
                return (_f = (_d = target.modifiedCard) === null || _d === void 0 ? void 0 : _d.data.ableToUsePowers) !== null && _f !== void 0 ? _f : true;
        }
    }
    getByPropertyAny(target, property, subProperty = null) {
        return this.getByProperty(target, property, subProperty);
    }
    // ── layeredDataReducer ───────────────────────────────────────────────────
    layeredDataReducer(currentCard, staticAbility) {
        if (!this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
            return currentCard;
        }
        switch (staticAbility.property) {
            case PROPERTY_COST: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_COST);
                const { operator, operandOne } = staticAbility.modifier;
                if (typeof initialValue !== 'number') {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { cost: initialValue }) });
                }
                const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { cost: resultValue }) });
            }
            case PROPERTY_ENERGIZE: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { energize: resultValue }) }) });
            }
            case PROPERTY_ATTACKS_PER_TURN: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { attacksPerTurn: resultValue }) }) });
            }
            case PROPERTY_ENERGY_LOSS_THRESHOLD: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { energyLossThreshold: resultValue }) }) });
            }
            case PROPERTY_ABLE_TO_ATTACK: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { ableToAttack: resultValue }) }) });
                }
                else {
                    return Object.assign({}, currentCard);
                }
            }
            case PROPERTY_CAN_BE_ATTACKED: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { canBeAttacked: resultValue }) }) });
                }
                else {
                    return Object.assign({}, currentCard);
                }
            }
            case PROPERTY_CONTROLLER: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'number') {
                    return Object.assign(Object.assign({}, currentCard), { data: Object.assign(Object.assign({}, currentCard.data), { controller: resultValue }) });
                }
                else {
                    return Object.assign({}, currentCard);
                }
            }
            case PROPERTY_STATUS: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    switch (staticAbility.subProperty) {
                        case STATUS_BURROWED: {
                            return Object.assign(Object.assign({}, currentCard), { data: Object.assign(Object.assign({}, currentCard.data), { burrowed: resultValue }) });
                        }
                        default: {
                            return currentCard;
                        }
                    }
                }
                else {
                    return Object.assign({}, currentCard);
                }
            }
            case PROPERTY_PROTECTION: {
                const initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'object' && 'from' in resultValue) {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { protection: resultValue }) }) });
                }
                else {
                    return Object.assign({}, currentCard);
                }
            }
            case PROPERTY_CONTROLLING_PLAYER: {
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : 0;
                if (typeof resultValue === 'number') {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { controllingPlayer: resultValue }) }) });
                }
                return currentCard;
            }
            case PROPERTY_ABLE_TO_USE_POWERS: {
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === CALCULATION_SET) ? operandOne : true;
                if (typeof resultValue === 'boolean') {
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { ableToUsePowers: resultValue }) }) });
                }
                return currentCard;
            }
            case PROPERTY_POWER_COST: {
                if (currentCard.modifiedCard.data.powers) {
                    const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
                        const initialValue = this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
                        const { operator, operandOne } = staticAbility.modifier;
                        const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                            performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                        return Object.assign(Object.assign({}, power), { cost: resultValue });
                    });
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { powers: updatedPowers }) }) });
                }
                return currentCard;
            }
            default: {
                return currentCard;
            }
        }
    }
    // ── Helper methods ───────────────────────────────────────────────────────
    /**
     * Check if a card is affected by a static ability based on its selector
     * Must be implemented by subclass
     */
    isCardAffectedByStaticAbility(card, staticAbility) {
        throw new Error('isCardAffectedByStaticAbility must be implemented by subclass');
    }
}
//# sourceMappingURL=LayeredModificationEngine.js.map