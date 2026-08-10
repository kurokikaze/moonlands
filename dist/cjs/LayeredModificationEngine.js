"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayeredModificationEngine = void 0;
const const_1 = require("./const");
const performCalculation_1 = __importDefault(require("./helpers/performCalculation"));
// ─── LayeredModificationEngine ───────────────────────────────────────────────
class LayeredModificationEngine {
    getByProperty(target, property, subProperty = null) {
        switch (property) {
            case const_1.PROPERTY_ID:
                return target.id;
            case const_1.PROPERTY_TYPE:
                return target.card.type;
            case const_1.PROPERTY_CREATURE_TYPES:
                return target.card.name.split(' ');
            case const_1.PROPERTY_CREATURE_NAME:
                return target.card.name;
            case const_1.PROPERTY_MAGI_NAME:
                return target.card.name;
            case const_1.PROPERTY_CONTROLLER:
                return target.data.controller;
            case const_1.PROPERTY_ENERGY_COUNT:
                return target.data.energy;
            case const_1.PROPERTY_ATTACKS_PER_TURN:
                return target.modifiedCard ?
                    target.modifiedCard.data.attacksPerTurn :
                    target.card.data.attacksPerTurn;
            case const_1.PROPERTY_COST:
                return target.modifiedCard ?
                    target.modifiedCard.cost :
                    target.card.cost;
            case const_1.PROPERTY_ENERGIZE:
                return target.modifiedCard ?
                    target.modifiedCard.data.energize :
                    target.card.data.energize;
            case const_1.PROPERTY_REGION:
                return target.card.region;
            case const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY:
                return target.modifiedCard ?
                    target.modifiedCard.data.canAttackMagiDirectly :
                    target.card.data.canAttackMagiDirectly;
            case const_1.PROPERTY_MAGI_STARTING_ENERGY:
                return target.modifiedCard ?
                    target.modifiedCard.data.startingEnergy :
                    target.card.data.startingEnergy;
            case const_1.PROPERTY_POWER_COST: {
                const powers = target.modifiedCard ? target.modifiedCard.data?.powers : target.card.data.powers;
                return (powers && powers.length) ? powers.find(({ name }) => name === subProperty)?.cost : 0;
            }
            case const_1.PROPERTY_STATUS_WAS_ATTACKED:
                return target.data.wasAttacked || false;
            case const_1.PROPERTY_CAN_BE_ATTACKED:
                return target.modifiedCard.data.canBeAttacked;
            case const_1.PROPERTY_STATUS_DEFEATED_CREATURE:
                return target.data.defeatedCreature || false;
            case const_1.PROPERTY_PROTECTION:
                return target.modifiedCard ?
                    target.modifiedCard.data.protection :
                    target.card.data.protection;
            case const_1.PROPERTY_STATUS: {
                switch (subProperty) {
                    case const_1.STATUS_BURROWED:
                        return Object.hasOwnProperty.call(target.data, 'burrowed') ?
                            target.data.burrowed :
                            target.card.data.burrowed;
                    default:
                        return false;
                }
            }
            // These properties can only be modified by static abilities / continuous effects
            case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD:
                return target.modifiedCard ?
                    target.modifiedCard.data.energyLossThreshold : 0;
            case const_1.PROPERTY_ABLE_TO_ATTACK: {
                const defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : defaultValue;
            }
            case const_1.PROPERTY_CONTROLLING_PLAYER:
                return target.modifiedCard?.data.controllingPlayer ?? 0;
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
            case const_1.PROPERTY_COST: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_COST);
                const { operator, operandOne } = staticAbility.modifier;
                if (typeof initialValue !== 'number') {
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            cost: initialValue,
                        },
                    };
                }
                const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    (0, performCalculation_1.default)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    (0, performCalculation_1.default)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return {
                    ...currentCard,
                    modifiedCard: {
                        ...currentCard.modifiedCard,
                        cost: resultValue,
                    },
                };
            }
            case const_1.PROPERTY_ENERGIZE: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    (0, performCalculation_1.default)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    (0, performCalculation_1.default)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return {
                    ...currentCard,
                    modifiedCard: {
                        ...currentCard.modifiedCard,
                        data: {
                            ...currentCard.modifiedCard.data,
                            energize: resultValue,
                        },
                    },
                };
            }
            case const_1.PROPERTY_ATTACKS_PER_TURN: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ATTACKS_PER_TURN);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    (0, performCalculation_1.default)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    (0, performCalculation_1.default)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return {
                    ...currentCard,
                    modifiedCard: {
                        ...currentCard.modifiedCard,
                        data: {
                            ...currentCard.modifiedCard.data,
                            attacksPerTurn: resultValue,
                        },
                    },
                };
            }
            case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                    (0, performCalculation_1.default)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                    (0, performCalculation_1.default)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                return {
                    ...currentCard,
                    modifiedCard: {
                        ...currentCard.modifiedCard,
                        data: {
                            ...currentCard.modifiedCard.data,
                            energyLossThreshold: resultValue,
                        },
                    },
                };
            }
            case const_1.PROPERTY_ABLE_TO_ATTACK: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ABLE_TO_ATTACK);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                ableToAttack: resultValue,
                            },
                        },
                    };
                }
                else {
                    return { ...currentCard };
                }
            }
            case const_1.PROPERTY_CAN_BE_ATTACKED: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CAN_BE_ATTACKED);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                canBeAttacked: resultValue,
                            },
                        },
                    };
                }
                else {
                    return {
                        ...currentCard,
                    };
                }
            }
            case const_1.PROPERTY_CONTROLLER: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CONTROLLER);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'number') {
                    return {
                        ...currentCard,
                        data: {
                            ...currentCard.data,
                            controller: resultValue,
                        },
                    };
                }
                else {
                    return { ...currentCard };
                }
            }
            case const_1.PROPERTY_STATUS: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_STATUS, staticAbility.subProperty);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'boolean') {
                    switch (staticAbility.subProperty) {
                        case const_1.STATUS_BURROWED: {
                            return {
                                ...currentCard,
                                data: {
                                    ...currentCard.data,
                                    burrowed: resultValue,
                                },
                            };
                        }
                        default: {
                            return currentCard;
                        }
                    }
                }
                else {
                    return { ...currentCard };
                }
            }
            case const_1.PROPERTY_PROTECTION: {
                const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_PROTECTION);
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                if (typeof resultValue == 'object' && 'from' in resultValue) {
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                protection: resultValue,
                            },
                        },
                    };
                }
                else {
                    return {
                        ...currentCard,
                    };
                }
            }
            case const_1.PROPERTY_CONTROLLING_PLAYER: {
                const { operator, operandOne } = staticAbility.modifier;
                const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : 0;
                if (typeof resultValue === 'number') {
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                controllingPlayer: resultValue,
                            },
                        },
                    };
                }
                return currentCard;
            }
            case const_1.PROPERTY_POWER_COST: {
                if (currentCard.modifiedCard.data.powers) {
                    const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
                        const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_POWER_COST, power.name);
                        const { operator, operandOne } = staticAbility.modifier;
                        const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                            (0, performCalculation_1.default)(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                            (0, performCalculation_1.default)(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                        return {
                            ...power,
                            cost: resultValue,
                        };
                    });
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                powers: updatedPowers,
                            },
                        },
                    };
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
exports.LayeredModificationEngine = LayeredModificationEngine;
//# sourceMappingURL=LayeredModificationEngine.js.map