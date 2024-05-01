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
var _a;
import { nanoid } from "nanoid";
import CardInGame from "../classes/CardInGame";
import { ACTION_CALCULATE, ACTION_EFFECT, ACTION_ENTER_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_PASS, ACTION_PLAYER_WINS, ACTION_SELECT, CALCULATION_SET, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_ATTACK, EFFECT_TYPE_ATTACKER_DAMAGE_DEALT, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, EFFECT_TYPE_CARD_ATTACHED_TO_CARD, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFEAT_MAGI, EFFECT_TYPE_DEFENDER_DAMAGE_DEALT, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_DISCARD_RESHUFFLED, EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_DRAW, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_DRAW_N_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, NO_PRIORITY, PRIORITY_ATTACK, PRIORITY_CREATURES, PRIORITY_PRS, PROMPT_TYPE_CHOOSE_CARDS, PROPERTY_CONTROLLER, PROPERTY_ENERGIZE, PROPERTY_ENERGY_COUNT, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_ID, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_POWER_COST, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_ID, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CREATURES, SELECTOR_OWN_MAGI, TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE } from "../const";
import { oneOrSeveral, updateContinuousEffects } from "./actionMapUtils";
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
var applyStartTurnEffect = function (action, transform) {
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
var applyDrawCardsInDrawStep = function (action, transform) {
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
var applyStartOfTurnEffect = function (action, transform) {
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
var applyStartStepEffect = function (action) {
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
var applyAddDelayedTriggerEffect = function (action) {
    var metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    if ('source' in metaData || 'new_card' in metaData) {
        var self = metaData.source || metaData.new_card;
        this.state = __assign(__assign({}, this.state), { delayedTriggers: __spreadArray(__spreadArray([], this.state.delayedTriggers, true), [
                __assign({ id: nanoid(), self: self }, action.delayedTrigger)
            ], false) });
    }
};
var applyFindStartingCardsEffect = function (action, transform) {
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
var applyDrawRestOfCardsEffect = function (action, transform) {
    var foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
    var number = 5 - foundCards.length;
    if (number > 0) { // who knows
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
var applyMagiFlippedEffect = function (action, transform) {
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
var applyDiscardCardsEffect = function (action, transform) {
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) {
        return target && transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
            target: target,
            generatedBy: action.generatedBy,
            player: action.player,
        });
    });
};
var applyDiscardCardEffect = function (action, transform) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    if (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_DISCARD,
            bottom: false,
            target: target,
            generatedBy: action.generatedBy,
        });
    }
};
var applyReturnCreatureDiscardingEnergyEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
var applyReturnCreatureReturningEnergyEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        var ownersMagi = this.useSelector(SELECTOR_OWN_MAGI, card.owner)[0];
        transform({
            type: ACTION_GET_PROPERTY_VALUE,
            property: PROPERTY_ENERGY_COUNT,
            target: card,
            variable: 'creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: ownersMagi,
            amount: '$creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
var applyDrawNCardsEffect = function (action, transform) {
    var numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
    for (var i = 0; i < numberOfCards; i++) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DRAW,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
var applyDrawEffect = function (action, transform) {
    var player = this.getMetaValue(action.player, action.generatedBy);
    var deck = this.getZone(ZONE_TYPE_DECK, player);
    var discard = this.getZone(ZONE_TYPE_DISCARD, player);
    if (deck.length > 0) {
        var card = deck.cards[0];
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: card,
            sourceZone: ZONE_TYPE_DECK,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            player: player,
            generatedBy: action.generatedBy,
        });
    }
    else if (discard.length > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_RESHUFFLE_DISCARD,
            player: player,
            generatedBy: action.generatedBy,
        }, action);
    }
};
var applyReshuffleDiscardEffect = function (action, transform) {
    var player = this.getMetaValue(action.player, action.generatedBy);
    var deck = this.getZone(ZONE_TYPE_DECK, player);
    var discard = this.getZone(ZONE_TYPE_DISCARD, player);
    var newCards = discard.cards.map(function (card) { return new CardInGame(card.card, card.owner); });
    deck.add(newCards);
    deck.shuffle();
    discard.empty();
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_RESHUFFLED,
        cards: newCards.map(function (_a) {
            var id = _a.id;
            return id;
        }),
        player: player,
        generatedBy: action.generatedBy,
    });
};
var applyAttackEffect = function (action, transform) {
    var source = this.getMetaValue(action.source, action.generatedBy);
    var target = this.getMetaValue(action.target, action.generatedBy);
    var additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);
    var attackSequence = [
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CREATURE_ATTACKS,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_BEFORE_DAMAGE,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DAMAGE_STEP,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            packHuntAttack: false,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_AFTER_DAMAGE,
            source: source,
            target: target,
            generatedBy: source.id,
        },
    ];
    if (additionalAttackers) {
        var preparedEffects = additionalAttackers.map(function (card) { return [
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_CREATURE_ATTACKS,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_BEFORE_DAMAGE,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DAMAGE_STEP,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_AFTER_DAMAGE,
                source: card,
                packHuntAttack: true,
                target: target,
                generatedBy: source.id,
            },
        ]; }).flat();
        for (var _i = 0, preparedEffects_1 = preparedEffects; _i < preparedEffects_1.length; _i++) {
            var effect = preparedEffects_1[_i];
            attackSequence.push(effect);
        }
    }
    transform.apply(void 0, attackSequence);
};
var applyBeforeDamageEffect = function (action) {
    action.source.markAttackDone();
    action.target.markAttackReceived();
};
var applyDamageStepEffect = function (action, transform) {
    // Here we finalize damage amount from both creatures' energy
    var attackSource = action.source;
    var attackTarget = action.target;
    var damageByAttacker = attackSource.data.energy;
    var damageByDefender = (attackTarget.card.type === TYPE_CREATURE) ?
        attackTarget.data.energy :
        0;
    var attackerDamageActions = [{
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
            source: attackSource,
            sourceAtStart: action.sourceAtStart,
            target: attackTarget,
            targetAtStart: action.targetAtStart,
            sourceBeforeDamage: attackSource.copy(),
            targetBeforeDamage: attackTarget.copy(),
            amount: damageByAttacker,
            generatedBy: attackSource.id,
        },
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
            source: attackSource,
            sourceAtStart: action.sourceAtStart,
            target: attackTarget,
            targetAtStart: action.targetAtStart,
            sourceBeforeDamage: attackSource.copy(),
            targetBeforeDamage: attackTarget.copy(),
            amount: '$damageDealt',
            generatedBy: attackSource.id,
        }
    ];
    var damageActions = (attackTarget.card.type === TYPE_CREATURE && !action.packHuntAttack) ? __spreadArray(__spreadArray([], attackerDamageActions, true), [
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
            source: attackTarget,
            sourceAtStart: action.targetAtStart,
            target: attackSource,
            amount: damageByDefender,
            targetAtStart: action.sourceAtStart,
            sourceBeforeDamage: attackTarget.copy(),
            targetBeforeDamage: attackSource.copy(),
            generatedBy: attackSource.id,
        },
        {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
            source: attackTarget,
            sourceAtStart: action.targetAtStart,
            target: attackSource,
            amount: '$damageDealt',
            targetAtStart: action.sourceAtStart,
            sourceBeforeDamage: attackTarget.copy(),
            targetBeforeDamage: attackSource.copy(),
            generatedBy: attackSource.id,
        }
    ], false) : attackerDamageActions;
    transform.apply(void 0, damageActions);
};
var applyAttackerDealsDamageEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
var applyDefenderDealsDamageEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
var applyDealDamageEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
        target: action.target,
        source: action.source,
        amount: action.amount,
        attack: true,
        variable: 'damageDealt',
        generatedBy: action.generatedBy,
    });
};
var applyAfterDamageEffect = function (action, transform) {
    if (action.source.data.energy === 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.target,
            target: action.source,
            attack: true,
            asAttacker: false,
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.source,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
    if (action.target.data.energy === 0 && action.target.card.type === TYPE_CREATURE) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.source,
            target: action.target,
            attack: true,
            asAttacker: true,
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.target,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
};
var applyCreatureDefeatsCreatureEffect = function (action, transform) {
    if (action.target.data.energy === 0) {
        action.source.markDefeatedCreature();
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
            source: action.source,
            target: action.target,
            attack: true,
            player: action.player || 0,
            generatedBy: action.generatedBy,
        });
    }
};
var applyRollDieEffect = function (action, transform) {
    // @ts-ignore
    var randomValue = this.twister ? this.twister.random() : Math.random();
    var result = action.result ||
        (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DIE_ROLLED,
        result: result,
        player: action.player,
        generatedBy: action.generatedBy,
    });
};
var applyDieRolledEffect = function (action) {
    this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
};
var applyExecutePowerEffects = function (action) {
    var power = this.getMetaValue(action.power, action.generatedBy);
    var sourceRaw = this.getMetaValue(action.source, action.generatedBy);
    // Some selectors will give us arrays anyway
    var source = sourceRaw instanceof Array ? sourceRaw[0] : sourceRaw;
    var sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);
    var powerCost = this.modifyByStaticAbilities(source, PROPERTY_POWER_COST, power.name || '');
    var enrichAction = function (effect) { return (__assign(__assign({ source: source, player: sourceController }, effect), { power: true, generatedBy: source.id })); };
    if ('effects' in power && power.effects) {
        var effects = power.effects;
        var preparedActions = effects.map(enrichAction);
        var allPromptsAreDoable = this.checkPrompts(source, preparedActions, true);
        if (allPromptsAreDoable) {
            if (!('setUsage' in action) || action.setUsage == true) {
                source.setActionUsed(power.name);
            }
            this.addActions.apply(this, preparedActions);
        }
    }
};
var applyEnergizeEffect = function (action, transform) {
    var _this = this;
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) {
        var amount = _this.modifyByStaticAbilities(target, PROPERTY_ENERGIZE);
        var type = target.card.type;
        transform({
            type: ACTION_EFFECT,
            effectType: (type == TYPE_CREATURE) ? EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: target,
            source: undefined,
            amount: amount,
            generatedBy: action.generatedBy,
        });
    });
};
var applyPayingEnergyForRelicEffect = function (action, transform) {
    var payingTarget = this.getMetaValue(action.from, action.generatedBy);
    var payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
var applyPayingEnergyForSpellEffect = function (action, transform) {
    var payingTarget = this.getMetaValue(action.from, action.generatedBy);
    var payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
var applyPayingEnergyForCreatureEffect = function (action, transform) {
    var payingTarget = this.getMetaValue(action.from, action.generatedBy);
    var payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        if (payingTarget instanceof CardInGame) {
            if (this.modifyByStaticAbilities(payingTarget, PROPERTY_CONTROLLER) == action.player) {
                var correctEffectType = payingTarget.card.type === TYPE_MAGI ? EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI : EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
                transform({
                    type: ACTION_EFFECT,
                    effectType: correctEffectType,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            else {
                throw new Error('Trying to pay for the creature from non-controlled Orathan');
            }
        }
    }
};
var applyPlayRelicEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_HAND,
        destinationZone: ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: ACTION_GET_PROPERTY_VALUE,
        property: PROPERTY_ID,
        target: '$new_card',
        variable: 'relic_created',
        generatedBy: action.generatedBy,
    });
};
var applyPlayCreatureEffect = function (action, transform) {
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_HAND,
        destinationZone: ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: ACTION_CALCULATE,
        operator: CALCULATION_SET,
        operandOne: '$new_card',
        variable: 'creature_created',
        generatedBy: action.generatedBy,
    });
};
// Should rework into continuous effect with duration
var applyForbidAttackToCreatureEffect = function (action, transform) {
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) { return target.forbidAttacks(); });
};
var applyConditionalEffect = function (action, transform) {
    var _this = this;
    var metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    var self = metaData.source || metaData.new_card || action.triggerSource;
    if (!self) {
        return;
    }
    // checkCondition(action, self, condition)
    var results = action.conditions.map(function (condition) {
        return _this.checkCondition(action, self, condition);
    });
    var enrichAction = function (effect) { return (__assign(__assign({ source: self, player: self.data.controller }, effect), { generatedBy: action.generatedBy })); };
    if (results.every(function (result) { return result === true; })) {
        if (action.thenEffects) {
            var preparedEffects = action.thenEffects
                .map(enrichAction);
            transform.apply(void 0, preparedEffects);
        }
    }
    else {
        if (action.elseEffects) {
            var preparedEffects = action.elseEffects
                .map(enrichAction);
            transform.apply(void 0, preparedEffects);
        }
    }
};
var applyMoveCardsBetweenZonesEffect = function (action, transform) {
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    var zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy) || [];
    if (!zoneChangingTargets) {
        console.dir(zoneChangingTargets);
        console.dir(this.getSpellMetadata(action.generatedBy));
    }
    if (zoneChangingTargets.length) {
        // We assume all cards changing zones are in one zone initially
        var zoneOwner = zoneChangingTargets[0].owner;
        var sourceZoneType_1 = this.getMetaValue(action.sourceZone, action.generatedBy);
        var sourceZone_1 = this.getZone(sourceZoneType_1, sourceZoneType_1 === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        var destinationZoneType_1 = this.getMetaValue(action.destinationZone, action.generatedBy);
        var destinationZone_1 = this.getZone(destinationZoneType_1, destinationZoneType_1 === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        var newCards_1 = [];
        oneOrSeveral(zoneChangingTargets, function (zoneChangingCard) {
            var newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner);
            if (action.bottom) {
                destinationZone_1.add([newObject]);
            }
            else {
                destinationZone_1.addToTop([newObject]);
            }
            sourceZone_1.removeById(zoneChangingCard.id);
            newCards_1.push(newObject);
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                sourceCard: zoneChangingCard,
                sourceZone: sourceZoneType_1,
                destinationCard: newObject,
                destinationZone: destinationZoneType_1,
                generatedBy: action.generatedBy,
            });
        });
        this.setSpellMetaDataField('new_cards', newCards_1, action.generatedBy);
    }
};
var applyMoveCardBetweenZonesEffect = function (action, transform) {
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    var zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
    var zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
    if (zoneChangingCard) {
        var sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
        var destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
        var destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        var sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        var newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner);
        if (action.bottom) {
            destinationZone.add([newObject]);
        }
        else {
            destinationZone.addToTop([newObject]);
        }
        sourceZone.removeById(zoneChangingCard.id);
        if (sourceZoneType == ZONE_TYPE_IN_PLAY && destinationZoneType !== ZONE_TYPE_IN_PLAY) {
            if (zoneChangingCard.id in this.state.cardsAttached) {
                // Queue the removal of the attached cards
                for (var _i = 0, _a = this.state.cardsAttached[zoneChangingCard.id]; _i < _a.length; _i++) {
                    var attachmentId = _a[_i];
                    var attachedCard = this.getZone(ZONE_TYPE_IN_PLAY).byId(attachmentId);
                    if (attachedCard) {
                        transform({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: attachedCard,
                            sourceZone: ZONE_TYPE_IN_PLAY,
                            destinationZone: ZONE_TYPE_DISCARD,
                            generatedBy: action.generatedBy,
                            bottom: false,
                        });
                    }
                    else {
                        console.log("Cannot find the card ".concat(attachmentId, " in play"));
                    }
                }
                // This cleans up the attachments
                this.removeAttachments(zoneChangingCard.id);
            }
        }
        this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
            sourceCard: zoneChangingCard,
            sourceZone: sourceZoneType,
            destinationCard: newObject,
            destinationZone: destinationZoneType,
            generatedBy: action.generatedBy,
        });
    }
};
var applyStartingEnergyOnCreatureEffect = function (action, transform) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
        target: target,
        source: undefined,
        amount: this.getMetaValue(action.amount, action.generatedBy),
        generatedBy: action.generatedBy,
    });
};
var applyMoveEnergyEffect = function (action, transform) {
    var moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
    var moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
    var moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    var moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
    var amountToMove = this.getMetaValue(action.amount, action.generatedBy);
    if (moveSource.data.energy >= amountToMove) {
        moveSource.removeEnergy(amountToMove);
        moveTarget.addEnergy(amountToMove);
        if (moveSource.data.energy === 0) {
            switch (moveSource.card.type) {
                case TYPE_CREATURE: {
                    // Creature goes to discard
                    transform({
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: ZONE_TYPE_IN_PLAY,
                        destinationZone: ZONE_TYPE_DISCARD,
                        bottom: false,
                        target: moveSource,
                        player: action.player,
                        generatedBy: action.generatedBy,
                    });
                    break;
                }
            }
        }
    }
};
var applyAddEnergyToCreatureOrMagiEffect = function (action, transform) {
    var addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(addMiltiTarget, function (target) {
        switch (target.card.type) {
            case TYPE_CREATURE:
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                    amount: action.amount,
                    target: target,
                    source: undefined,
                    generatedBy: action.generatedBy,
                });
                break;
            case TYPE_MAGI:
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                    amount: action.amount,
                    target: target,
                    generatedBy: action.generatedBy,
                });
                break;
        }
    });
};
export var applyDiscardEnergyFromCreatureOrMagiEffect = function (action, transform) {
    var discardMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    var source = action.source;
    if (!source) {
        return;
    }
    oneOrSeveral(discardMultiTarget, function (target) {
        switch (target.card.type) {
            case TYPE_CREATURE: {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    source: action.source,
                    variable: action.variable || false,
                    target: target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case TYPE_MAGI: {
                transform(__assign(__assign({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, source: source, amount: action.amount, attack: action.attack || false, spell: action.spell || false, relic: action.relic || false }, (action.variable ? { variable: action.variable } : {})), { target: target, generatedBy: action.generatedBy }));
                break;
            }
        }
    });
};
var applyDiscardEnergyFromMagiEffect = function (action, transform) {
    var _this = this;
    oneOrSeveral(this.getMetaValue(action.target, action.generatedBy), function (target) {
        var energyToRemove = Math.min(_this.getMetaValue(action.amount, action.generatedBy), target.data.energy);
        target.removeEnergy(energyToRemove);
        if (energyToRemove > 0) {
            transform(__assign(__assign({}, action), { effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, amount: energyToRemove }));
        }
    });
};
var applyDefeatMagiEffect = function (action, transform) {
    var magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(magiMiltiTarget, function (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
            target: target,
            source: null,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
var applyMagiIsDefeatedEffect = function (action, transform) {
    var target = action.target, generatedBy = action.generatedBy;
    var stillHasMagi = this.getZone(ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
    if (stillHasMagi) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: target,
            sourceZone: ZONE_TYPE_ACTIVE_MAGI,
            destinationZone: ZONE_TYPE_DEFEATED_MAGI,
            bottom: false,
            generatedBy: generatedBy,
        }, {
            type: ACTION_SELECT,
            selector: SELECTOR_OWN_CARDS_IN_PLAY,
            player: target.owner,
            variable: 'cardsInPlay',
            generatedBy: generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
            target: '$cardsInPlay',
            player: target.owner,
            generatedBy: generatedBy,
        });
    }
    else {
        var winner = this.getOpponent(target.owner);
        transform({
            type: ACTION_PLAYER_WINS,
            player: winner,
        });
    }
};
var applyDiscardEnergyFromCreaturesEffect = function (action, transform) {
    // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
    // No cards use this effect now, but some may later
    // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
    var multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    oneOrSeveral(multiTarget, function (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
            target: target,
            amount: amount,
            power: action.power,
            spell: action.spell,
            source: action.source,
            attack: action.attack,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
var applyDiscardEnergyFromCreatureEffect = function (action, transform) {
    var _this = this;
    var multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var totalEnergyLost = 0;
    oneOrSeveral(multiTarget, function (target) {
        if (_this.isCardAffectedByEffect(target, action)) {
            var energyToLose = parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10);
            var energyLossThreshold = _this.modifyByStaticAbilities(target, PROPERTY_ENERGY_LOSS_THRESHOLD);
            var energyLostAlready = target.data.energyLostThisTurn;
            if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                var energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
            }
            var energyLost = Math.min(energyToLose, target.data.energy);
            target.removeEnergy(energyLost);
            totalEnergyLost += energyLost;
            if (target.data.energy == 0 && !action.attack) {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    source: action.source,
                    target: target,
                    attack: action.attack,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            // The events transformed later take precedence over the events transformed earlier
            // That's why we transform the energy discarded event here before potentially transforming a discard creature event
            if (energyToLose > 0) {
                transform(__assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, amount: energyLost }));
            }
        }
    });
    if (action.variable) {
        this.setSpellMetaDataField(action.variable, totalEnergyLost, action.generatedBy);
    }
};
var applyRemoveEnergyFromCreatureEffect = function (action, transform) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === TYPE_CREATURE) {
        target.removeEnergy(energyToLose);
        if (target.data.energy === 0) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target: target,
                attack: false,
                sourceZone: ZONE_TYPE_IN_PLAY,
                destinationZone: ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            });
        }
    }
    else {
        console.error('Wrong card type');
    }
};
var applyRemoveEnergyFromMagiEffect = function (action) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === TYPE_MAGI) {
        target.removeEnergy(energyToLose);
    }
};
var applyRestoreCreatureToStartingEnergyEffect = function (action, transform) {
    var restoreTarget = this.getMetaValue(action.target, action.generatedBy);
    var restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
    if (restoreAmount > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
            source: action.source || undefined,
            power: action.power || false,
            spell: action.spell || false,
            target: restoreTarget,
            amount: restoreAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
var applyPayingEnergyForPowerEffect = function (action, transform) {
    var payingTarget = this.getMetaValue(action.target, action.generatedBy);
    var payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        switch (payingTarget.card.type) {
            case TYPE_CREATURE: {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case TYPE_MAGI: {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
        }
    }
};
var applyAddEnergyToCreatureEffect = function (action) {
    var _this = this;
    var addTargets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(addTargets, function (addTarget) {
        if (_this.isCardAffectedByEffect(addTarget, action)) {
            addTarget.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10));
        }
    });
};
var applyAddStartingEnergyToMagiEffect = function (action, transform) {
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
var applyAddEnergyToMagiEffect = function (action) {
    var _this = this;
    var magiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(magiTarget, function (target) { return target.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy)), 10); });
};
var applyDiscardCreatureOrRelic = function (action, transform) {
    var discardTargets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(discardTargets, function (target) {
        var targetType = target.card.type;
        if (targetType === TYPE_CREATURE) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                attack: false,
                target: target,
                generatedBy: action.generatedBy,
                player: action.player || 0,
            });
        }
        else if (targetType === TYPE_RELIC) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                target: target,
                generatedBy: action.generatedBy,
                player: action.player || 0,
            });
        }
    });
};
var applyDiscardRelicFromPlayEffect = function (action, transform) {
    var relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(relicDiscardTarget, function (relic) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: relic,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_DISCARD,
            bottom: false,
            generatedBy: action.generatedBy,
        });
    });
};
var applyDiscardCreatureFromPlayEffect = function (action, transform) {
    var _this = this;
    var creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(creatureDiscardTarget, function (creature) {
        if (_this.isCardAffectedByEffect(creature, action)) {
            var effect = {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target: creature,
                attack: action.attack,
                sourceZone: ZONE_TYPE_IN_PLAY,
                destinationZone: ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            };
            transform(effect);
        }
    });
};
var applyCreateContinuousEffect = function (action) {
    var _this = this;
    var id = nanoid();
    var staticAbilities = (action.staticAbilities || []).map(function (ability) {
        switch (ability.selector) {
            case SELECTOR_ID: {
                var selectorParameterMetaValue = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                var selectorParameter = (selectorParameterMetaValue instanceof CardInGame) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                return __assign(__assign({}, ability), { selectorParameter: selectorParameter });
            }
            case SELECTOR_CREATURES_OF_PLAYER: {
                var selectorParameter = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                return __assign(__assign({}, ability), { selectorParameter: selectorParameter });
            }
            default: {
                return ability;
            }
        }
    }).map(function (ability) {
        var _a;
        var operandOne = _this.getMetaValue((_a = ability.modifier) === null || _a === void 0 ? void 0 : _a.operandOne, action.generatedBy);
        return __assign(__assign({}, ability), { modifier: {
                operator: ability.modifier.operator,
                operandOne: operandOne,
            } });
    });
    var continuousEffect = {
        triggerEffects: action.triggerEffects || [],
        staticAbilities: staticAbilities,
        expiration: action.expiration,
        player: action.player || 0,
        id: id,
    };
    this.state = __assign(__assign({}, this.state), { continuousEffects: __spreadArray(__spreadArray([], this.state.continuousEffects, true), [
            continuousEffect,
        ], false) });
};
var applyRearrangeEnergyOnCreaturesEffect = function (action, transform) {
    var energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    var ownCreatures = this.useSelector(SELECTOR_OWN_CREATURES, action.player || 0);
    var totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(function (card) { return card.data.energy; }).reduce(function (a, b) { return a + b; }, 0) : 0;
    var newEnergyTotal = Object.values(energyArrangement).reduce(function (a, b) { return a + b; }, 0);
    // Energy stasis check
    var valid = this.getZone(ZONE_TYPE_IN_PLAY).cards.every(function (card) {
        if (!card.card.data.energyStasis)
            return true;
        if (card.id in energyArrangement) {
            var newEnergy = energyArrangement[card.id];
            return newEnergy === card.data.energy;
        }
        return true;
    });
    if (valid) {
        if (newEnergyTotal === totalEnergyOnCreatures) {
            this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
                if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
                    var newEnergy = energyArrangement[card.id];
                    card.setEnergy(newEnergy);
                    if (card.data.energy === 0) {
                        transform({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: card,
                            sourceZone: ZONE_TYPE_IN_PLAY,
                            destinationZone: ZONE_TYPE_DISCARD,
                            bottom: false,
                            attack: false,
                            generatedBy: action.generatedBy,
                        });
                    }
                }
            });
        }
        else if (this.debug) {
            console.error("Cannot rearrange energy because new total ".concat(newEnergyTotal, " is not equal to old total ").concat(totalEnergyOnCreatures));
        }
    }
    else if (this.debug) {
        console.error('One or more creatures with Energy Stasis is to be affected with energy rearrangement');
    }
};
var applyDistributeEnergyOnCreaturesEffect = function (action) {
    var energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
        if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
            var energyAmount = energyArrangement[card.id];
            card.addEnergy(energyAmount);
        }
    });
};
var applyDistributeDamageEffect = function (action, transform) {
    var damageArrangement = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
    this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
        if (card.card.type === TYPE_CREATURE && card.id in damageArrangement) {
            var damageAmount = damageArrangement[card.id];
            var source = action.source;
            if (damageAmount > 0 && source) {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    source: source,
                    target: card,
                    amount: damageAmount,
                    generatedBy: action.generatedBy,
                    player: action.player,
                });
            }
        }
    });
};
var applyRearrangeCardsOfZoneEffect = function (action) {
    var zone = this.getMetaValue(action.zone, action.generatedBy);
    var zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
    // const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
    var zoneContent = this.getZone(zone, zoneOwner).cards;
    var cardsOrder = this.getMetaValue(action.cards, action.generatedBy);
    var cardsToRearrange = {};
    for (var i = 0; i < cardsOrder.length; i++) {
        if (i >= zoneContent.length)
            break;
        var currentCard = zoneContent[i];
        cardsToRearrange[currentCard.id] = currentCard;
    }
    var newZoneContent = __spreadArray(__spreadArray([], cardsOrder.map(function (id) { return cardsToRearrange[id]; }), true), zoneContent.slice(cardsOrder.length), true);
    this.getZone(zone, zoneOwner).cards = newZoneContent;
};
var applyPlayAttachedToCreatureEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    var attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_HAND,
        destinationZone: ZONE_TYPE_IN_PLAY,
        target: card,
        generatedBy: action.generatedBy,
        bottom: false,
    }, {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_ATTACH_CARD_TO_CARD,
        target: '$new_card', // We need to attach the new card in play, not the one in hand 
        attachmentTarget: attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
var applyAttachCardToCardEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    var attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    this.attachCard(card.id, attachmentTarget.id);
    this.transformIntoActions({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
        target: card,
        attachmentTarget: action.attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
export var actionMap = (_a = {},
    // Beginning of turn and step
    _a[EFFECT_TYPE_START_TURN] = applyStartTurnEffect,
    _a[EFFECT_TYPE_START_OF_TURN] = applyStartOfTurnEffect,
    _a[EFFECT_TYPE_START_STEP] = applyStartStepEffect,
    _a[EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP] = applyDrawCardsInDrawStep,
    _a[EFFECT_TYPE_FIND_STARTING_CARDS] = applyFindStartingCardsEffect,
    _a[EFFECT_TYPE_DRAW_REST_OF_CARDS] = applyDrawRestOfCardsEffect,
    _a[EFFECT_TYPE_MAGI_FLIPPED] = applyMagiFlippedEffect,
    _a[EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI] = applyAddStartingEnergyToMagiEffect,
    // Discarding
    _a[EFFECT_TYPE_DISCARD_CARDS_FROM_HAND] = applyDiscardCardsEffect,
    _a[EFFECT_TYPE_DISCARD_CARD_FROM_HAND] = applyDiscardCardEffect,
    _a[EFFECT_TYPE_RESHUFFLE_DISCARD] = applyReshuffleDiscardEffect,
    // Returning to hand
    _a[EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY] = applyReturnCreatureDiscardingEnergyEffect,
    _a[EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY] = applyReturnCreatureReturningEnergyEffect,
    // Drawing cards
    _a[EFFECT_TYPE_DRAW_N_CARDS] = applyDrawNCardsEffect,
    _a[EFFECT_TYPE_DRAW] = applyDrawEffect,
    // Attacking
    _a[EFFECT_TYPE_ATTACK] = applyAttackEffect,
    _a[EFFECT_TYPE_BEFORE_DAMAGE] = applyBeforeDamageEffect,
    _a[EFFECT_TYPE_DAMAGE_STEP] = applyDamageStepEffect,
    _a[EFFECT_TYPE_ATTACKER_DEALS_DAMAGE] = applyAttackerDealsDamageEffect,
    _a[EFFECT_TYPE_DEFENDER_DEALS_DAMAGE] = applyDefenderDealsDamageEffect,
    _a[EFFECT_TYPE_DEAL_DAMAGE] = applyDealDamageEffect,
    _a[EFFECT_TYPE_AFTER_DAMAGE] = applyAfterDamageEffect,
    _a[EFFECT_TYPE_CREATURE_DEFEATS_CREATURE] = applyCreatureDefeatsCreatureEffect,
    // Randomization
    _a[EFFECT_TYPE_ROLL_DIE] = applyRollDieEffect,
    _a[EFFECT_TYPE_DIE_ROLLED] = applyDieRolledEffect,
    // Powers
    _a[EFFECT_TYPE_EXECUTE_POWER_EFFECTS] = applyExecutePowerEffects,
    _a[EFFECT_TYPE_ENERGIZE] = applyEnergizeEffect,
    _a[EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES] = applyMoveCardsBetweenZonesEffect,
    _a[EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES] = applyMoveCardBetweenZonesEffect,
    _a[EFFECT_TYPE_DEFEAT_MAGI] = applyDefeatMagiEffect,
    _a[EFFECT_TYPE_MAGI_IS_DEFEATED] = applyMagiIsDefeatedEffect,
    _a[EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC] = applyDiscardCreatureOrRelic,
    _a[EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY] = applyDiscardRelicFromPlayEffect,
    _a[EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY] = applyDiscardCreatureFromPlayEffect,
    _a[EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE] = applyRearrangeCardsOfZoneEffect,
    _a[EFFECT_TYPE_ATTACH_CARD_TO_CARD] = applyAttachCardToCardEffect,
    // Moving energy
    _a[EFFECT_TYPE_MOVE_ENERGY] = applyMoveEnergyEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI] = applyAddEnergyToCreatureOrMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI] = applyDiscardEnergyFromCreatureOrMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI] = applyDiscardEnergyFromMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES] = applyDiscardEnergyFromCreaturesEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE] = applyDiscardEnergyFromCreatureEffect,
    _a[EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE] = applyRemoveEnergyFromCreatureEffect,
    _a[EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI] = applyRemoveEnergyFromMagiEffect,
    _a[EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY] = applyRestoreCreatureToStartingEnergyEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_CREATURE] = applyAddEnergyToCreatureEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_MAGI] = applyAddEnergyToMagiEffect,
    _a[EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES] = applyRearrangeEnergyOnCreaturesEffect,
    _a[EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES] = applyDistributeEnergyOnCreaturesEffect,
    _a[EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES] = applyDistributeDamageEffect,
    // Playing stuff
    _a[EFFECT_TYPE_PLAY_RELIC] = applyPlayRelicEffect,
    _a[EFFECT_TYPE_PLAY_CREATURE] = applyPlayCreatureEffect,
    _a[EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE] = applyStartingEnergyOnCreatureEffect,
    _a[EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE] = applyPlayAttachedToCreatureEffect,
    // Paying for stuff
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC] = applyPayingEnergyForRelicEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL] = applyPayingEnergyForSpellEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE] = applyPayingEnergyForCreatureEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_POWER] = applyPayingEnergyForPowerEffect,
    // Delayed triggers, conditional and continuous effects
    _a[EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE] = applyForbidAttackToCreatureEffect,
    _a[EFFECT_TYPE_ADD_DELAYED_TRIGGER] = applyAddDelayedTriggerEffect,
    _a[EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT] = applyCreateContinuousEffect,
    _a[EFFECT_TYPE_CONDITIONAL] = applyConditionalEffect,
    _a);
//# sourceMappingURL=effects.js.map