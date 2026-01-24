"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = convertPromptActionToEffect;
const const_1 = require("../const");
const convertCard = (cardInGame) => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
});
function convertPromptActionToEffect(action, state) {
    const player = state.getMetaValue(action.player, action.generatedBy);
    switch (action.promptType) {
        case const_1.PROMPT_TYPE_NUMBER: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                promptParams: {
                    min: state.getMetaValue(action.promptParams.min, action.generatedBy),
                    max: state.getMetaValue(action.promptParams.max, action.generatedBy),
                },
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_ALTERNATIVE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                source: state.getMetaValue(action.source, action.generatedBy),
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_CHOOSE_CARDS: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            const zoneContent = (zone === const_1.ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                promptParams: {
                    zone,
                    zoneOwner,
                    restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                },
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            const zoneContent = (zone === const_1.ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                promptParams: {
                    zone,
                    zoneOwner,
                    restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                },
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptParams: {
                    amount: state.getMetaValue(action.promptParams.amount, action.generatedBy),
                },
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_MAY_ABILITY: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: const_1.PROMPT_TYPE_MAY_ABILITY,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_NUMBER_OF_CREATURES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                promptType: action.promptType,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_PAYMENT_SOURCE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_PLAYER: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                promptType: const_1.PROMPT_TYPE_PLAYER,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                promptParams: {
                    ...action.promptParams,
                    zone: state.getMetaValue(action.promptParams.zone, action.generatedBy),
                    zoneOwner: state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy),
                    numberOfCards: state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy),
                },
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_RELIC: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_SINGLE_CREATURE: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            let restrictions = [];
            if ('restrictions' in action.promptParams) {
                restrictions = action.promptParams.restrictions.map(({ type, value }) => ({
                    type,
                    value: state.getMetaValue(value, action.generatedBy),
                }));
            }
            else if ('restriction' in action.promptParams) {
                restrictions = [
                    {
                        type: action.promptParams.restriction,
                        value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                    }
                ];
            }
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            if (restrictions.length) {
                effect.promptParams = {
                    restrictions,
                };
            }
            return effect;
        }
        case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case const_1.PROMPT_TYPE_SINGLE_MAGI: {
            const effect = {
                ...action,
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
    }
}
//# sourceMappingURL=convertPromptAction.js.map