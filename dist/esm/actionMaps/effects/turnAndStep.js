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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ACTION_EFFECT, ACTION_ENTER_PROMPT, ACTION_PASS, ACTION_SELECT, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, EFFECT_TYPE_DRAW, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, NO_PRIORITY, PRIORITY_ATTACK, PRIORITY_CREATURES, PRIORITY_PRS, PROMPT_TYPE_CHOOSE_CARDS, PROPERTY_MAGI_STARTING_ENERGY, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_MAGI, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE, } from "../../const.js";
import { oneOrSeveral, updateContinuousEffects } from "../actionMapUtils.js";
var steps = [
    {
        name: 'Energize',
        priority: NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: ACTION_SELECT,
                selector: SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
                variable: 'energize',
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_ENERGIZE,
                target: '$energize',
            },
        ],
    },
    {
        name: 'Powers/Relics/Spells',
        priority: PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Attack',
        priority: PRIORITY_ATTACK,
        automatic: false,
    },
    {
        name: 'Play Dream Creatures',
        priority: PRIORITY_CREATURES,
        automatic: false,
    },
    {
        name: 'Powers/Relics/Spells',
        priority: PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Draw',
        priority: NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
                numberOfCards: 2,
            },
        ],
    },
];
export var applyStartTurnEffect = function (action, transform) {
    if (this.turn === null) {
        this.turn = 0;
    }
    else {
        this.turn += 1;
    }
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_START_STEP,
        player: action.player,
        step: 0,
        generatedBy: action.generatedBy,
    }, {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_START_OF_TURN,
        player: action.player,
        generatedBy: action.generatedBy,
    });
    this.state = __assign(__assign({}, this.state), { continuousEffects: this.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean), activePlayer: action.player, step: 0 });
};
export var applyDrawCardsInDrawStep = function (action, transform) {
    var numberOfCards = action.numberOfCards;
    var draws = (new Array(numberOfCards)).fill({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DRAW,
        stepEffect: true,
        player: action.player,
        generatedBy: action.generatedBy,
    });
    transform.apply(void 0, draws);
};
export var applyStartOfTurnEffect = function (action, transform) {
    var _a, _b;
    if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
        this.getZone(ZONE_TYPE_MAGI_PILE, action.player).length > 0) {
        var topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards[0];
        var availableCards = this.getAvailableCards(action.player, topMagi);
        var firstMagi = this.getZone(ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;
        var actionsToTake = [
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_MAGI_FLIPPED,
                target: topMagi,
            },
            {
                type: ACTION_SELECT,
                selector: SELECTOR_OWN_MAGI,
                variable: 'ownMagi',
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
                target: '$ownMagi',
            },
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_CHOOSE_CARDS,
                promptParams: {
                    startingCards: topMagi.card.data.startingCards || [],
                    availableCards: availableCards,
                },
                variable: 'startingCards',
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_FIND_STARTING_CARDS,
                cards: '$startingCards',
            }
        ];
        if (firstMagi) {
            actionsToTake.push({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DRAW_REST_OF_CARDS,
                drawnCards: '$foundCards',
            });
        }
        var actions = actionsToTake.map(function (preAction) { return (__assign(__assign({}, preAction), { player: action.player, generatedBy: action.generatedBy })); });
        transform.apply(void 0, actions);
    }
    // Reset creatures' actions and attacks
    var creatures = this.getZone(ZONE_TYPE_IN_PLAY).cards
        .filter(function (card) { return card.card.type === TYPE_CREATURE && card.data.controller === action.player; });
    if (creatures.length > 0) {
        creatures.forEach(function (creature) {
            creature.clearAttackMarkers();
            creature.clearActionsUsed();
        });
    }
    // Reset relics' actions
    var relics = this.getZone(ZONE_TYPE_IN_PLAY).cards
        .filter(function (card) { return card.card.type === TYPE_RELIC && card.data.controller === action.player; });
    if (relics.length > 0) {
        relics.forEach(function (relic) { return relic.clearActionsUsed(); });
    }
    // if magi is active, reset its actions used too
    if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
        (_b = (_a = this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player)) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.clearActionsUsed();
    }
};
export var applyStartStepEffect = function (action) {
    var _a, _b;
    // Player who goes first do not energize on first turn
    var isFirstEnergize = this.turn === 0 &&
        action.player === this.state.goesFirst &&
        action.step === 0;
    if (steps[action.step].effects && !isFirstEnergize) {
        var transformedActions = ((_b = (_a = steps[action.step]) === null || _a === void 0 ? void 0 : _a.effects) === null || _b === void 0 ? void 0 : _b.map(function (effect) {
            return (__assign(__assign({}, effect), { player: action.player, generatedBy: action.generatedBy }));
        })) || [];
        this.addActions.apply(this, transformedActions);
    }
    if (steps[action.step].automatic) {
        this.addActions({
            type: ACTION_PASS,
            player: action.player,
        });
    }
    if (action.step === 1 && this.timerEnabled) {
        this.startTurnTimer();
    }
    this.state = __assign(__assign({}, this.state), { step: action.step });
};
export var applyAddDelayedTriggerEffect = function (action, _transform, _state, seeded_nanoid) {
    var metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    if ('source' in metaData || 'new_card' in metaData) {
        var self = metaData.source || metaData.new_card;
        this.state = __assign(__assign({}, this.state), { delayedTriggers: __spreadArray(__spreadArray([], this.state.delayedTriggers, true), [
                __assign({ id: seeded_nanoid(), self: self }, action.delayedTrigger)
            ], false) });
    }
};
export var applyFindStartingCardsEffect = function (action, transform) {
    var cardsToFind = this.getMetaValue(action.cards, action.generatedBy);
    var foundCards = [];
    if (cardsToFind.length) {
        var deck_1 = this.getZone(ZONE_TYPE_DECK, action.player);
        var discard_1 = this.getZone(ZONE_TYPE_DISCARD, action.player);
        cardsToFind.forEach(function (cardName) {
            if (discard_1.cards.some(function (_a) {
                var card = _a.card;
                return card.name == cardName;
            })) {
                var card = discard_1.cards.find(function (_a) {
                    var card = _a.card;
                    return card.name == cardName;
                });
                if (!card) {
                    return true;
                }
                foundCards.push(cardName);
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    target: card,
                    sourceZone: ZONE_TYPE_DISCARD,
                    destinationZone: ZONE_TYPE_HAND,
                    generatedBy: action.generatedBy,
                    bottom: false,
                });
            }
            else if (deck_1.cards.some(function (_a) {
                var card = _a.card;
                return card.name == cardName;
            })) {
                var card = deck_1.cards.find(function (_a) {
                    var card = _a.card;
                    return card.name == cardName;
                });
                if (!card) {
                    return true;
                }
                foundCards.push(cardName);
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    target: card,
                    sourceZone: ZONE_TYPE_DECK,
                    destinationZone: ZONE_TYPE_HAND,
                    generatedBy: action.generatedBy,
                    bottom: false,
                });
            }
        });
    }
    this.setSpellMetaDataField('foundCards', foundCards, action.generatedBy);
};
export var applyDrawRestOfCardsEffect = function (action, transform) {
    var foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
    var number = 5 - foundCards.length;
    if (number > 0) {
        for (var i = 0; i < number; i++) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DRAW,
                player: action.player,
                generatedBy: action.generatedBy,
            });
        }
    }
};
export var applyMagiFlippedEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_MAGI_PILE,
        destinationZone: ZONE_TYPE_ACTIVE_MAGI,
        bottom: false,
        target: action.target,
        generatedBy: action.generatedBy,
    });
};
export var applyAddStartingEnergyToMagiEffect = function (action, transform) {
    var _this = this;
    var magiTargets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(magiTargets, function (magiTarget) {
        var startingEnergy = _this.modifyByStaticAbilities(magiTarget, PROPERTY_MAGI_STARTING_ENERGY);
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: magiTarget,
            amount: startingEnergy,
            generatedBy: action.generatedBy,
        });
    });
};
//# sourceMappingURL=turnAndStep.js.map