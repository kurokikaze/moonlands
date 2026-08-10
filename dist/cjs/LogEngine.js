"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogEngine = void 0;
const const_1 = require("./const");
class LogEngine {
    context;
    constructor(context) {
        this.context = context;
    }
    addActionToLog(action) {
        const { getMetaValue, getLog, getPromptType } = this.context;
        var newLogEntry = false;
        try {
            switch (action.type) {
                case const_1.ACTION_PLAY: {
                    if ('payload' in action) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_PLAY,
                            card: action.payload.card.card.name,
                            player: action.player,
                        };
                    }
                    else {
                        const metaValue = getMetaValue(action.card, action.generatedBy);
                        const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_PLAY,
                            card: metaCard.card.name,
                            player: Number(action.player),
                        };
                    }
                    break;
                }
                case const_1.ACTION_POWER: {
                    newLogEntry = {
                        type: const_1.LOG_ENTRY_POWER_ACTIVATION,
                        card: action.source.card.name,
                        name: action.power.name,
                        player: action.player,
                    };
                    break;
                }
                case const_1.ACTION_EFFECT: {
                    switch (action.effectType) {
                        case const_1.EFFECT_TYPE_DRAW: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_DRAW,
                                player: getMetaValue(action.player, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    for (let i = 0; i < target.length - 1; i++) {
                                        const tgt = target[i];
                                        getLog().push({
                                            type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                            card: tgt.card.name,
                                            amount: getMetaValue(action.amount, action.generatedBy),
                                        });
                                    }
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                        card: target[target.length - 1].card.name,
                                        amount: getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_MAGI_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DIE_ROLLED: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_DIE_ROLLED,
                                result: action.result,
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_MAGI_ENERGY_GAIN,
                                        card: target[0].card.name,
                                        amount: getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_FIND_STARTING_CARDS: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_CHOOSES_STARTING_CARDS,
                                player: action.player || 0,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (!Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            const target = getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                        card: target[0].card.name,
                                        player: action.player,
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_MAGI_DEFEATED,
                                card: getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATURE_ATTACKS: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_ATTACK,
                                source: getMetaValue(action.source, action.generatedBy).card.name,
                                target: getMetaValue(action.target, action.generatedBy).card.name,
                                packHuntAttack: Boolean(action.packHuntAttack),
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
                                card: getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player || 1,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                            break;
                        }
                    }
                    break;
                }
                case const_1.ACTION_RESOLVE_PROMPT: {
                    if ((getPromptType() === const_1.PROMPT_TYPE_SINGLE_CREATURE ||
                        getPromptType() === const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
                        getPromptType() === const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
                        getPromptType() === const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE ||
                        getPromptType() === const_1.PROMPT_TYPE_SINGLE_MAGI) && 'target' in action) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_TARGETING,
                            card: action.target?.card?.name || 'unknown card',
                            player: action.player,
                        };
                    }
                    if (getPromptType() === const_1.PROMPT_TYPE_NUMBER && 'number' in action) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_NUMBER_CHOICE,
                            number: (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10),
                            player: action.player,
                        };
                    }
                    break;
                }
            }
        }
        catch (e) {
            console.error('Log entry creation failed');
            console.dir(action);
        }
        if (newLogEntry) {
            getLog().push(newLogEntry);
        }
    }
}
exports.LogEngine = LogEngine;
//# sourceMappingURL=LogEngine.js.map