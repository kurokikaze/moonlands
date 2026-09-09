import { PROMPT_TYPE_NUMBER, ACTION_EFFECT, EFFECT_TYPE_PROMPT_ENTERED, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER_OF_CREATURES, PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_SINGLE_MAGI, ZONE_TYPE_IN_PLAY } from "../const.js";
const convertCard = (cardInGame) => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
});
export default function convertPromptActionToEffect(action, state) {
    const player = state.getMetaValue(action.player, action.generatedBy);
    switch (action.promptType) {
        case PROMPT_TYPE_NUMBER: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                promptParams: {
                    min: state.getMetaValue(action.promptParams.min, action.generatedBy),
                    max: state.getMetaValue(action.promptParams.max, action.generatedBy),
                },
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_ALTERNATIVE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                source: state.getMetaValue(action.source, action.generatedBy),
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_CHOOSE_CARDS: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
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
        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
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
        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptParams: {
                    amount: state.getMetaValue(action.promptParams.amount, action.generatedBy),
                },
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_DISTRIBUTE_CARDS_IN_ZONES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_MAY_ABILITY: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_MAY_ABILITY,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                promptType: action.promptType,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_PAYMENT_SOURCE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_PLAYER: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                promptType: PROMPT_TYPE_PLAYER,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_POWER_ON_MAGI: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                promptParams: {
                    ...action.promptParams,
                    zone: state.getMetaValue(action.promptParams.zone, action.generatedBy),
                    zoneOwner: state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy),
                    numberOfCards: state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy),
                },
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_RELIC: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_SINGLE_CREATURE: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
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
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
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
        case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
        case PROMPT_TYPE_SINGLE_MAGI: {
            const effect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            };
            return effect;
        }
    }
}
//# sourceMappingURL=convertPromptAction.js.map