var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { TYPE_CREATURE, TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_RELIC, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, COST_X, PROPERTY_CONTROLLER, ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI, ACTION_GET_PROPERTY_VALUE, ACTION_ENTER_PROMPT, } from './const.js';
var PromptValidator = /** @class */ (function () {
    function PromptValidator(context) {
        this.context = context;
    }
    PromptValidator.prototype.checkPrompts = function (source, preparedActions, isPower, powerCost) {
        if (isPower === void 0) { isPower = false; }
        if (powerCost === void 0) { powerCost = 0; }
        var _a = this.context, getZone = _a.getZone, modifyByStaticAbilities = _a.modifyByStaticAbilities, getOpponent = _a.getOpponent, getMetaValue = _a.getMetaValue, checkAnyCardForRestrictions = _a.checkAnyCardForRestrictions, checkAnyCardForRestriction = _a.checkAnyCardForRestriction;
        var testedActions = __spreadArray([], preparedActions, true);
        // Calculate if prompts are resolvable
        // If source is Magi, it will not be filtered out, being in another zone
        var creatureWillSurvive = !isPower || source.data.energy > powerCost;
        var ourCardsInPlay = getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return (creatureWillSurvive ? true : card.id !== source.id) && modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === source.data.controller; });
        var allCardsInPlay = getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return creatureWillSurvive ? true : card.id !== source.id; });
        var metaValues = {
            '$source': source,
            '$sourceCreature': source,
        };
        while (testedActions.length && testedActions[0].type === ACTION_GET_PROPERTY_VALUE) {
            var valueGetter = testedActions[0];
            testedActions.shift();
            var multiTarget = valueGetter.source;
            var target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
            var property = getMetaValue(valueGetter.property, valueGetter.generatedBy || '');
            var modifiedResult = modifyByStaticAbilities(target, property);
            var variable = valueGetter.variable || 'result';
            metaValues["$".concat(variable)] = modifiedResult;
        }
        // powerPromptsDoable
        var testablePrompts = [
            PROMPT_TYPE_SINGLE_CREATURE,
            PROMPT_TYPE_RELIC,
            PROMPT_TYPE_OWN_SINGLE_CREATURE,
            PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
            PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
            PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
            PROMPT_TYPE_POWER_ON_MAGI,
        ];
        var testablePromptFilter = function (action) {
            return action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
        };
        var allPrompts = testedActions.filter(testablePromptFilter);
        var allPromptsAreDoable = allPrompts.every(function (promptAction) {
            switch (promptAction.promptType) {
                case PROMPT_TYPE_SINGLE_CREATURE:
                    return allCardsInPlay.some(function (card) { return card.card.type === TYPE_CREATURE; });
                case PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    var opponent = getOpponent(source.data.controller);
                    var magi = __spreadArray(__spreadArray([], getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, true), getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards, true);
                    return magi.some(function (magi) { return !allCardsInPlay.some(function (card) { return card.card.type === TYPE_CREATURE && modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === magi.data.controller; }); });
                case PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(function (card) { return card.card.type === TYPE_RELIC; });
                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(function (card) { return card.card.type === TYPE_CREATURE; });
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return getZone(ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.id !== source.id; });
                }
                case PROMPT_TYPE_POWER_ON_MAGI: {
                    var magi_1 = getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards;
                    return magi_1.some(function (magi) { return magi.card.data.powers && magi.card.data.powers.some(function (power) { return power.cost === COST_X || (power.cost <= magi.data.energy + 2); }); });
                }
                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if ('restrictions' in promptAction.promptParams && promptAction.promptParams.restrictions) {
                        var restrictionsWithValues = promptAction.promptParams.restrictions.map(function (_a) {
                            var type = _a.type, value = _a.value;
                            var restrictionValue = (typeof value === 'string' &&
                                value in metaValues) ? metaValues[value] : value;
                            return {
                                type: type,
                                value: restrictionValue,
                            };
                        });
                        return checkAnyCardForRestrictions(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), restrictionsWithValues);
                    }
                    else if ('restriction' in promptAction.promptParams) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                var restrictionValue = (typeof promptAction.promptParams.restrictionValue === 'string' &&
                                    promptAction.promptParams.restrictionValue in metaValues) ? metaValues[promptAction.promptParams.restrictionValue] : promptAction.promptParams.restrictionValue;
                                return checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    var zoneOwner = getMetaValue(promptAction.promptParams.zoneOwner, source.id);
                    var cardsInZone = getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    var numberOfCards = getMetaValue(promptAction.promptParams.numberOfCards, source.id);
                    // if (cardsInZone.length < numberOfCards) {
                    //	 return false;
                    // }
                    if (promptAction.promptParams.restrictions) {
                        return checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    var zoneOwner = getMetaValue(promptAction.promptParams.zoneOwner, source.id);
                    var cardsInZone = getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    if (promptAction.promptParams.restrictions) {
                        return checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                return checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                default:
                    return true;
            }
        });
        return allPromptsAreDoable;
    };
    return PromptValidator;
}());
export { PromptValidator };
//# sourceMappingURL=PromptValidator.js.map