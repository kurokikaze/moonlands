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
import { PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, ZONE_TYPE_IN_PLAY, } from "../../const.js";
var convertCard = function (cardInGame) { return ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
}); };
export var applyPromptEnteredEffect = function (action) {
    var _this = this;
    if (!('player' in action)) {
        throw new Error('Prompt without player!');
    }
    var promptParams = {};
    var promptPlayer = this.getMetaValue(action.player, action.generatedBy);
    switch (action.promptType) {
        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            promptParams = {
                source: this.getMetaValue(action.source, action.generatedBy),
            };
            break;
        }
        case PROMPT_TYPE_MAY_ABILITY: {
            promptParams = action.promptParams;
            break;
        }
        case PROMPT_TYPE_ALTERNATIVE: {
            promptParams = {
                alternatives: action.promptParams.alternatives,
            };
            break;
        }
        case PROMPT_TYPE_PAYMENT_SOURCE: {
            promptParams = {
                paymentAmount: action.promptParams.amount,
                paymentType: action.promptParams.paymentType,
                cards: action.promptParams.cards.map(convertCard),
            };
            break;
        }
        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            if (action.promptParams.restriction && action.promptParams.restrictions) {
                throw new Error('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
            }
            var restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: this.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : null);
            var zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
            var zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            var numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
            var cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;
            var maxNumberOfCards = Math.min(numberOfCards, cards.length);
            if (maxNumberOfCards > 0) {
                promptParams = {
                    zone: zone,
                    zoneOwner: zoneOwner,
                    restrictions: restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                };
            }
            break;
        }
        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            if (action.promptParams.restriction && action.promptParams.restrictions) {
                throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
            }
            var restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: this.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : null);
            var zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
            var zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            var numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
            var cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;
            var maxNumberOfCards = Math.min(numberOfCards, cards.length);
            if (maxNumberOfCards > 0) {
                promptParams = {
                    zone: zone,
                    zoneOwner: zoneOwner,
                    restrictions: restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                };
            }
            break;
        }
        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
            var zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
            var zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            var numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = this.getZone(zone, zoneOwner).cards;
            var cards = zoneContent.slice(0, numberOfCards);
            promptParams = {
                zone: zone,
                zoneOwner: zoneOwner,
                numberOfCards: numberOfCards,
                cards: cards.map(convertCard),
            };
            break;
        }
        case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            if ('restrictions' in action.promptParams && action.promptParams.restrictions) {
                var restrictionsWithValues = action.promptParams.restrictions.map(function (_a) {
                    var type = _a.type, value = _a.value;
                    return ({
                        type: type,
                        value: _this.getMetaValue(value, action.generatedBy),
                    });
                });
                promptParams = {
                    restrictions: restrictionsWithValues,
                };
            }
            else if ('restriction' in action.promptParams && action.promptParams.restriction && 'restrictionValue' in action.promptParams) {
                promptParams = {
                    restrictions: [
                        {
                            type: action.promptParams.restriction,
                            value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                        }
                    ],
                };
            }
            break;
        }
        case PROMPT_TYPE_CHOOSE_CARDS: {
            promptParams = action.promptParams;
            break;
        }
        case PROMPT_TYPE_NUMBER: {
            promptParams = {
                min: this.getMetaValue(action.promptParams.min, action.generatedBy),
                max: this.getMetaValue(action.promptParams.max, action.generatedBy),
            };
            break;
        }
        case PROMPT_TYPE_POWER_ON_MAGI: {
            promptParams = {
                magi: this.getMetaValue(action.promptParams.magi, action.generatedBy),
            };
            break;
        }
        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
            if (action.promptParams.restriction) {
                promptParams = {
                    amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                    restrictions: [
                        {
                            type: action.promptParams.restriction,
                            value: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                        },
                    ],
                };
            }
            else {
                promptParams = {
                    amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                };
            }
            break;
        }
        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
            if (action.promptParams.restriction) {
                promptParams = {
                    amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                    restrictions: [
                        {
                            type: action.promptParams.restriction,
                            value: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                        },
                    ],
                };
            }
            else {
                promptParams = {
                    amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
                };
            }
            break;
        }
        case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
            // console.dir(this.getSpellMetadata(action.generatedBy))
            var sourceZone = this.getMetaValue(action.promptParams.sourceZone, action.generatedBy);
            var sourceZoneOwner = this.getMetaValue(action.promptParams.sourceZoneOwner, action.generatedBy);
            var numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
            var zoneContent = this.getZone(sourceZone, sourceZoneOwner).cards;
            var cards = zoneContent.slice(0, numberOfCards);
            promptParams = {
                sourceZone: sourceZone,
                sourceZoneOwner: sourceZoneOwner,
                numberOfCards: numberOfCards,
                cards: cards.map(convertCard),
                targetZones: action.promptParams.targetZones,
            };
            break;
        }
    }
    this.state = __assign(__assign({}, this.state), { prompt: true, promptMessage: ('message' in action) ? action.message : '', promptPlayer: promptPlayer, promptType: action.promptType, promptVariable: action.variable, promptGeneratedBy: action.generatedBy, promptParams: promptParams });
};
//# sourceMappingURL=prompt.js.map