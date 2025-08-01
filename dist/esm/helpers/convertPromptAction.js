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
import { PROMPT_TYPE_NUMBER, ACTION_EFFECT, EFFECT_TYPE_PROMPT_ENTERED, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER_OF_CREATURES, PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_SINGLE_MAGI, ZONE_TYPE_IN_PLAY } from "../const.js";
var convertCard = function (cardInGame) { return ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
}); };
export default function convertPromptActionToEffect(action, state) {
    var player = state.getMetaValue(action.player, action.generatedBy);
    switch (action.promptType) {
        case PROMPT_TYPE_NUMBER: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, promptParams: {
                    min: state.getMetaValue(action.promptParams.min, action.generatedBy),
                    max: state.getMetaValue(action.promptParams.max, action.generatedBy),
                }, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_ALTERNATIVE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, source: state.getMetaValue(action.source, action.generatedBy), generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_CHOOSE_CARDS: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            var restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            var zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            var zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            var numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            var cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            var maxNumberOfCards = Math.min(numberOfCards, cards.length);
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, promptParams: {
                    zone: zone,
                    zoneOwner: zoneOwner,
                    restrictions: restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                }, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            var restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);
            var zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            var zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            var numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            var cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;
            var maxNumberOfCards = Math.min(numberOfCards, cards.length);
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', promptParams: {
                    zone: zone,
                    zoneOwner: zoneOwner,
                    restrictions: restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                }, player: player });
            return effect;
        }
        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptParams: {
                    amount: state.getMetaValue(action.promptParams.amount, action.generatedBy),
                }, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_MAY_ABILITY: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: PROMPT_TYPE_MAY_ABILITY, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, promptType: action.promptType, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_PAYMENT_SOURCE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_PLAYER: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, promptType: PROMPT_TYPE_PLAYER, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_POWER_ON_MAGI: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, promptParams: __assign(__assign({}, action.promptParams), { zone: state.getMetaValue(action.promptParams.zone, action.generatedBy), zoneOwner: state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy), numberOfCards: state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy) }), effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_RELIC: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_SINGLE_CREATURE: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            var restrictions = [];
            if ('restrictions' in action.promptParams) {
                restrictions = action.promptParams.restrictions.map(function (_a) {
                    var type = _a.type, value = _a.value;
                    return ({
                        type: type,
                        value: state.getMetaValue(value, action.generatedBy),
                    });
                });
            }
            else if ('restriction' in action.promptParams) {
                restrictions = [
                    {
                        type: action.promptParams.restriction,
                        value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                    }
                ];
            }
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, generatedBy: action.generatedBy || 'the-game', player: player });
            if (restrictions.length) {
                effect.promptParams = {
                    restrictions: restrictions,
                };
            }
            return effect;
        }
        case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
        case PROMPT_TYPE_SINGLE_MAGI: {
            var effect = __assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_PROMPT_ENTERED, promptType: action.promptType, generatedBy: action.generatedBy || 'the-game', player: player });
            return effect;
        }
    }
}
//# sourceMappingURL=convertPromptAction.js.map