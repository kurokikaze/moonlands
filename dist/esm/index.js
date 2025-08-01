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
import { nanoid, customRandom, urlAlphabet } from 'nanoid';
import { MersenneTwister } from './mersenneTwister.js';
import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, ACTION_CONCEDE, ACTION_TIME_NOTIFICATION, ACTION_EXIT_PROMPTS, ACTION_PROPERTY, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS_WAS_ATTACKED, PROPERTY_STATUS_DEFEATED_CREATURE, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, SELECTOR_CREATURES, SELECTOR_MAGI, SELECTOR_CREATURES_AND_MAGI, SELECTOR_RELICS, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_SPELLS_IN_HAND, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_CREATURES_OF_TYPE, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_OTHER_CREATURES_OF_TYPE, SELECTOR_STATUS, SELECTOR_OWN_CREATURES_WITH_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_ID, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY, STATUS_BURROWED, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_RELIC, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_PLAYER, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_ATTACK, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, REGION_UNIVERSAL, RESTRICTION_TYPE, RESTRICTION_REGION, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_CREATURE_TYPE, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_PLAYABLE, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_STATUS, RESTRICTION_REGION_IS_NOT, RESTRICTION_ENERGY_EQUALS, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, LOG_ENTRY_PLAY, LOG_ENTRY_DRAW, LOG_ENTRY_CHOOSES_STARTING_CARDS, LOG_ENTRY_POWER_ACTIVATION, LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY, LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY, LOG_ENTRY_TARGETING, LOG_ENTRY_NUMBER_CHOICE, LOG_ENTRY_ATTACK, LOG_ENTRY_CREATURE_ENERGY_LOSS, LOG_ENTRY_MAGI_ENERGY_LOSS, LOG_ENTRY_CREATURE_ENERGY_GAIN, LOG_ENTRY_MAGI_ENERGY_GAIN, LOG_ENTRY_MAGI_DEFEATED, ACTION_NONE, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER, EXPIRATION_OPPONENT_TURNS, PROTECTION_FROM_POWERS, PROTECTION_FROM_SPELLS, PROTECTION_TYPE_DISCARDING_FROM_PLAY, PROTECTION_TYPE_GENERAL, CARD_COUNT, PROPERTY_PROTECTION, PROTECTION_FROM_ATTACKS, CALCULATION_MULTIPLY, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, PROTECTION_TYPE_ENERGY_LOSS, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, SELECTOR_NTH_CARD_OF_ZONE, EFFECT_TYPE_DIE_ROLLED, LOG_ENTRY_DIE_ROLLED, PROPERTY_CREATURE_NAME, RESTRICTION_CREATURE_NAME, PROMPT_TYPE_NUMBER_OF_CREATURES, PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED, SELECTOR_SELF_AND_STATUS, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_ALTERNATIVE, SELECTOR_OWN_CARDS_IN_HAND, SELECTOR_CARDS_IN_HAND, PROMPT_TYPE_PAYMENT_SOURCE, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, LOG_ENTRY_CARD_DISCARDED_FROM_HAND, SELECTOR_MAGI_OF_PLAYER, SELECTOR_RANDOM_CARD_IN_HAND, EFFECT_TYPE_PLAY_FINISHED, EFFECT_TYPE_TRIGGERED_ABILITY_FINISHED, EFFECT_TYPE_POWER_FINISHED, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, EFFECT_TYPE_PROMPT_ENTERED, } from './const.js';
import { actionMap } from './actionMaps/effects.js';
import { showAction } from './logAction.js';
import clone from './clone.js';
import { byName } from './cards.js';
import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import convertPromptActionToEffect from './helpers/convertPromptAction.js';
import performCalculation from './helpers/performCalculation.js';
var convertCard = function (cardInGame) { return ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
}); };
export var DEFAULT_PROMPT_VARIABLE = (_a = {},
    _a[PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE] = 'targetCards',
    _a[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE] = 'cardsOrder',
    _a[PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE] = 'targetCards',
    _a[PROMPT_TYPE_NUMBER] = 'number',
    _a[PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE] = 'target',
    _a[PROMPT_TYPE_RELIC] = 'target',
    _a[PROMPT_TYPE_OWN_SINGLE_CREATURE] = 'target',
    _a[PROMPT_TYPE_SINGLE_CREATURE_FILTERED] = 'target',
    _a[PROMPT_TYPE_MAGI_WITHOUT_CREATURES] = 'target',
    _a[PROMPT_TYPE_SINGLE_CREATURE] = 'target',
    _a[PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI] = 'target',
    _a[PROMPT_TYPE_SINGLE_MAGI] = 'targetMagi',
    _a[PROMPT_TYPE_CHOOSE_CARDS] = 'selectedCards',
    _a[PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES] = 'energyOnCreatures',
    _a[PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES] = 'energyOnCreatures',
    _a[PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES] = 'damageOnCreatures',
    _a[PROMPT_TYPE_PLAYER] = 'targetPlayer',
    _a[PROMPT_TYPE_NUMBER_OF_CREATURES] = 'targets',
    _a[PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED] = 'targets',
    _a[PROMPT_TYPE_POWER_ON_MAGI] = 'chosenPower',
    _a[PROMPT_TYPE_ALTERNATIVE] = 'alternative',
    _a[PROMPT_TYPE_PAYMENT_SOURCE] = 'paymentSource',
    _a[PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES] = 'cardsInZones',
    _a[PROMPT_TYPE_MAY_ABILITY] = '',
    _a);
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
var defaultState = {
    actions: [],
    savedActions: [],
    delayedTriggers: [],
    mayEffectActions: [],
    fallbackActions: [],
    continuousEffects: [],
    activePlayer: 0,
    prompt: false,
    promptType: null,
    promptParams: {},
    log: [],
    step: 0,
    turn: 0,
    zones: [],
    players: [],
    spellMetaData: {},
    attachedTo: {},
    cardsAttached: {},
};
var oneOrSeveral = function (targets, callback) {
    if (targets instanceof Array) {
        if (targets.length > 0) {
            targets.forEach(function (target) { return callback(target); });
        }
    }
    else {
        callback(targets);
    }
};
var updateContinuousEffects = function (player) { return function (effect) {
    switch (effect.expiration.type) {
        case EXPIRATION_ANY_TURNS: {
            var turnCount = effect.expiration.turns;
            if (turnCount > 1) {
                return __assign(__assign({}, effect), { expiration: {
                        type: effect.expiration.type,
                        turns: turnCount - 1,
                    } });
            }
            else {
                return null;
            }
        }
        case EXPIRATION_OPPONENT_TURNS: {
            var turnCount = effect.expiration.turns;
            if (player !== effect.player) {
                if (turnCount > 0) {
                    return __assign(__assign({}, effect), { expiration: {
                            type: effect.expiration.type,
                            turns: turnCount - 1,
                        } });
                }
                else {
                    return null;
                }
            }
            else {
                return effect;
            }
        }
        case EXPIRATION_NEVER: {
            return effect;
        }
    }
}; };
var State = /** @class */ (function () {
    function State(state) {
        this.players = [0, 1];
        this.twister = null;
        this.nanoid = nanoid;
        this.twisterSeed = 0;
        this.onAction = null;
        this.turnTimer = null;
        this.state = __assign(__assign({}, clone(defaultState)), state);
        this.decks = [];
        this.winner = false;
        this.debug = false;
        this.turn = null;
        this.timerEnabled = false;
        this.turnTimeout = null;
        this.turnNotifyTimeout = null;
        this.rollDebugValue = null,
            this.actionsOne = [];
        this.actionsTwo = [];
    }
    // @deprecated
    State.prototype.closeStreams = function () { };
    State.prototype.initiatePRNG = function (seed) {
        var _this = this;
        this.twisterSeed = seed;
        this.twister = new MersenneTwister(seed);
        var seeded_nanoid = customRandom(urlAlphabet, 10, function (size) {
            return (new Uint8Array(size)).map(function () { return 256 * _this.twister.random(); });
        });
        this.nanoid = seeded_nanoid;
    };
    State.prototype.setOnAction = function (callback) {
        this.onAction = callback;
    };
    State.prototype.addActionToStream = function (action) {
        var actionWithValues = this.addValuesToAction(action);
        // Do not send outside CALCULATE, SELECT and so on
        if (![ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE].includes(action.type) && this.onAction) {
            this.onAction(actionWithValues);
            // this.actionStreamOne.emit('action', actionWithValues);
            // this.actionStreamTwo.emit('action', actionWithValues);
        }
        // this.logStream.emit('action', actionWithValues);
    };
    State.prototype.addValuesToAction = function (action) {
        var _this = this;
        var _a;
        switch (action.type) {
            case ACTION_ENTER_PROMPT: {
                switch (action.promptType) {
                    case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                        if ('restrictions' in action.promptParams) {
                            if (action.promptParams.restrictions) {
                                var restrictionsWithValues = action.promptParams.restrictions.map(function (_a) {
                                    var type = _a.type, value = _a.value;
                                    return ({
                                        type: type,
                                        value: _this.getMetaValue(value, action.generatedBy),
                                    });
                                });
                                return __assign(__assign({}, action), { promptParams: __assign(__assign({}, action.promptParams), { restrictions: restrictionsWithValues }) });
                            }
                        }
                        else {
                            return __assign(__assign({}, action), { promptParams: __assign(__assign({}, action.promptParams), { restrictionValue: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy) }) });
                        }
                    }
                }
                return action;
            }
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return __assign(__assign({}, action), { staticAbilities: (_a = action.staticAbilities) === null || _a === void 0 ? void 0 : _a.map(function (ability) {
                                var _a;
                                var selectorParameter = ability.selectorParameter;
                                if (ability.selector === SELECTOR_ID) {
                                    selectorParameter = ability.selectorParameter ? (_a = _this.getMetaValue(ability.selectorParameter, action.generatedBy)) === null || _a === void 0 ? void 0 : _a.id : null;
                                }
                                else {
                                    selectorParameter = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                                }
                                return __assign(__assign({}, ability), { modifier: {
                                        operandOne: _this.getMetaValue(ability.modifier.operandOne, action.generatedBy),
                                        operator: ability.modifier.operator,
                                    }, selectorParameter: selectorParameter });
                            }) });
                    }
                }
            }
            default:
                return action;
        }
    };
    State.prototype.enableDebug = function () {
        this.debug = true;
    };
    State.prototype.setRollDebugValue = function (value) {
        this.rollDebugValue = value;
    };
    State.prototype.resetRollDebugValue = function () {
        this.rollDebugValue = null;
    };
    State.prototype.setWinner = function (player) {
        this.winner = player;
    };
    State.prototype.hasWinner = function () {
        return this.winner !== false;
    };
    State.prototype.clone = function () {
        var newObject = new State(clone(this.state));
        newObject.winner = this.winner;
        newObject.rollDebugValue = this.rollDebugValue;
        newObject.players = this.players;
        newObject.decks = this.decks;
        if (this.twister) {
            newObject.twister = new MersenneTwister(this.twisterSeed);
        }
        return newObject;
    };
    State.prototype.setPlayers = function (player1, player2) {
        this.players = [player1, player2];
        return this;
    };
    State.prototype.setDeck = function (player, cardNames) {
        var _this = this;
        if (this.players.includes(player)) {
            var deck = cardNames.map(function (card) {
                var cardObject = byName(card);
                if (!cardObject) {
                    throw new Error("Unknown card in deck: ".concat(card));
                }
                return new CardInGame(cardObject, player, _this.nanoid);
            });
            this.decks.push({
                player: player,
                deck: deck,
            });
        }
        else {
            throw new Error("Non-existing player: ".concat(player));
        }
    };
    State.prototype.enableTurnTimer = function (timer) {
        if (timer === void 0) { timer = 75; }
        this.turnTimer = timer;
        this.timerEnabled = true;
    };
    State.prototype.startTurnTimer = function () {
        var _this = this;
        if (this.turnTimer && this.turnTimer > 0) {
            this.turnTimeout = setTimeout(function () {
                _this.endTurn();
            }, this.turnTimer * 1000);
            if (this.turnTimer > 20) {
                this.turnNotifyTimeout = setTimeout(function () {
                    _this.update({ type: ACTION_TIME_NOTIFICATION, player: _this.state.activePlayer });
                }, 20000);
            }
        }
    };
    State.prototype.stopTurnTimer = function () {
        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }
        if (this.turnNotifyTimeout) {
            clearTimeout(this.turnNotifyTimeout);
        }
    };
    State.prototype.endTurn = function () {
        var activePlayer = this.state.activePlayer;
        this.update({ type: ACTION_EXIT_PROMPTS });
        while (this.state.activePlayer === activePlayer) {
            this.update({ type: ACTION_PASS, player: activePlayer });
        }
    };
    State.prototype.addActionToLog = function (action) {
        var _a, _b;
        var newLogEntry = false;
        try {
            switch (action.type) {
                case ACTION_PLAY: {
                    if ('payload' in action) {
                        newLogEntry = {
                            type: LOG_ENTRY_PLAY,
                            card: action.payload.card.card.name,
                            player: action.player,
                        };
                    }
                    else {
                        var metaValue = this.getMetaValue(action.card, action.generatedBy);
                        var metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;
                        newLogEntry = {
                            type: LOG_ENTRY_PLAY,
                            card: metaCard.card.name,
                            player: Number(action.player),
                        };
                    }
                    break;
                }
                case ACTION_POWER: {
                    newLogEntry = {
                        type: LOG_ENTRY_POWER_ACTIVATION,
                        card: action.source.card.name,
                        name: action.power.name,
                        player: action.player,
                    };
                    break;
                }
                case ACTION_EFFECT: {
                    switch (action.effectType) {
                        case EFFECT_TYPE_DRAW: {
                            newLogEntry = {
                                type: LOG_ENTRY_DRAW,
                                player: this.getMetaValue(action.player, action.generatedBy),
                            };
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: LOG_ENTRY_MAGI_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: LOG_ENTRY_MAGI_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_DIE_ROLLED: {
                            newLogEntry = {
                                type: LOG_ENTRY_DIE_ROLLED,
                                result: action.result,
                                player: action.player,
                            };
                            break;
                        }
                        case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: LOG_ENTRY_MAGI_ENERGY_GAIN,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: LOG_ENTRY_MAGI_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_FIND_STARTING_CARDS: {
                            newLogEntry = {
                                type: LOG_ENTRY_CHOOSES_STARTING_CARDS,
                                player: action.player || 0,
                            };
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (!Array.isArray(target)) {
                                newLogEntry = {
                                    type: LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                        card: target[0].card.name,
                                        player: action.player,
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            newLogEntry = {
                                type: LOG_ENTRY_MAGI_DEFEATED,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player,
                            };
                            break;
                        }
                        case EFFECT_TYPE_CREATURE_ATTACKS: {
                            newLogEntry = {
                                type: LOG_ENTRY_ATTACK,
                                source: this.getMetaValue(action.source, action.generatedBy).card.name,
                                target: this.getMetaValue(action.target, action.generatedBy).card.name,
                                packHuntAttack: Boolean(action.packHuntAttack),
                            };
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
                            newLogEntry = {
                                type: LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player || 1,
                            };
                            break;
                        }
                        case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                            // This requires the useSelector method to accept SELECTOR_ID type, so I will do it a bit later
                            break;
                            /*if (action.staticAbilities) {
                                for (let staticAbility of action.staticAbilities) {
                                    // Targeting gets a little complicated here because we aren't explicitly saying "this creature is burrowed for X turns"
                                    // Rather, we create a continuous effect of "creatures satisfying this selector have this property modified in this way with such-and-such expiration conditions"
                                    // if (staticAbility.property === PROPERTY_STATUS && staticAbility.selector == SELECTOR_ID) {
                                    // 	const id = this.getMetaValue(staticAbility.selectorParameter, action.generatedBy);
                                    // 	const target = this.useSelector(SELECTOR_ID, action.player, id);
                                    // 	if (target) {
                                    // 		newLogEntry = {
                                    // 			type: LOG_ENTRY_CONTINUOUS_EFFECT_CREATED,
                                    // 			property: PROPERTY_STATUS,
                                    // 			turns: this.getMetaValue(action.expiration.turns, action.generatedBy),
                                    // 		}
                                    // 	}
                                    // }
                                }
                            }
                            break;*/
                        }
                    }
                    break;
                }
                case ACTION_RESOLVE_PROMPT: {
                    if ((this.state.promptType === PROMPT_TYPE_SINGLE_CREATURE ||
                        this.state.promptType === PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
                        this.state.promptType === PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
                        this.state.promptType === PROMPT_TYPE_OWN_SINGLE_CREATURE ||
                        this.state.promptType === PROMPT_TYPE_SINGLE_MAGI) && 'target' in action) {
                        newLogEntry = {
                            type: LOG_ENTRY_TARGETING,
                            card: ((_b = (_a = action.target) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.name) || 'unknown card',
                            player: action.player,
                        };
                    }
                    if (this.state.promptType === PROMPT_TYPE_NUMBER && 'number' in action) {
                        newLogEntry = {
                            type: LOG_ENTRY_NUMBER_CHOICE,
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
            // console.dir(e);
        }
        if (newLogEntry) {
            this.state.log = __spreadArray(__spreadArray([], this.state.log, true), [
                newLogEntry,
            ], false);
        }
    };
    State.prototype.createZones = function () {
        var _a = this.players, playerOne = _a[0], playerTwo = _a[1];
        var deck1 = new Zone('Player 1 deck', ZONE_TYPE_DECK, playerOne);
        var deck2 = new Zone('Player 2 deck', ZONE_TYPE_DECK, playerTwo);
        if (this.twister) {
            deck1.setPRNG(this.twister);
            deck2.setPRNG(this.twister);
        }
        return [
            new Zone('Player 1 hand', ZONE_TYPE_HAND, playerOne),
            new Zone('Player 2 hand', ZONE_TYPE_HAND, playerTwo),
            deck1,
            deck2,
            new Zone('Player 1 discard', ZONE_TYPE_DISCARD, playerOne),
            new Zone('Player 2 discard', ZONE_TYPE_DISCARD, playerTwo),
            new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, playerOne),
            new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, playerTwo),
            new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, playerOne),
            new Zone('Player 2 magi pile', ZONE_TYPE_MAGI_PILE, playerTwo),
            new Zone('Player 1 magi pile', ZONE_TYPE_DEFEATED_MAGI, playerOne),
            new Zone('Player 2 magi pile', ZONE_TYPE_DEFEATED_MAGI, playerTwo),
            new Zone('In play', ZONE_TYPE_IN_PLAY, null),
        ];
    };
    State.prototype.serializeData = function (playerId, hideZones) {
        if (hideZones === void 0) { hideZones = true; }
        var gameEnded = !(this.winner === false);
        var opponentId = this.players.find(function (player) { return player !== playerId; }) || 0;
        return {
            zones: this.serializeZones(playerId, hideZones),
            continuousEffects: this.state.continuousEffects,
            step: this.state.step,
            turn: this.state.turn || 0,
            goesFirst: this.state.goesFirst || 0,
            activePlayer: this.state.activePlayer,
            prompt: this.state.prompt,
            promptType: this.state.promptType,
            promptMessage: this.state.promptMessage || null,
            promptPlayer: this.state.promptPlayer || null,
            promptGeneratedBy: this.state.promptGeneratedBy || null,
            promptParams: this.state.promptParams,
            opponentId: opponentId,
            log: this.state.log,
            gameEnded: gameEnded,
            winner: gameEnded ? this.winner : null,
            cardsAttached: this.state.cardsAttached,
        };
    };
    State.prototype.serializeZones = function (playerId, hideZones) {
        if (hideZones === void 0) { hideZones = true; }
        var opponentId = this.getOpponent(playerId);
        return {
            playerHand: this.getZone(ZONE_TYPE_HAND, playerId).serialize(),
            opponentHand: this.getZone(ZONE_TYPE_HAND, opponentId).serialize(hideZones),
            playerDeck: this.getZone(ZONE_TYPE_DECK, playerId).serialize(hideZones),
            opponentDeck: this.getZone(ZONE_TYPE_DECK, opponentId).serialize(hideZones),
            playerActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
            opponentActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
            playerMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, playerId).serialize(),
            opponentMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, opponentId).serialize(hideZones),
            inPlay: this.getZone(ZONE_TYPE_IN_PLAY).cards.map(function (c) { return c.serialize(); }),
            playerDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, playerId).serialize(),
            opponentDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, opponentId).serialize(),
            playerDiscard: this.getZone(ZONE_TYPE_DISCARD, playerId).serialize(),
            opponentDiscard: this.getZone(ZONE_TYPE_DISCARD, opponentId).serialize(),
        };
    };
    State.prototype.setup = function () {
        var _this = this;
        if (this.players.length < 2) {
            throw new Error('Not enough players');
        }
        if (this.decks.length < 2) {
            throw new Error('Not enough decks for players');
        }
        var zones = this.state.zones.length == 0 ? this.createZones() : this.state.zones;
        this.state.zones = zones;
        this.decks.forEach(function (_a) {
            var player = _a.player, deck = _a.deck;
            var magi = deck.filter(function (card) { return card.card.type === TYPE_MAGI; });
            var rest = deck.filter(function (card) { return card.card.type != TYPE_MAGI; });
            _this.getZone(ZONE_TYPE_MAGI_PILE, player).add(magi);
            _this.getZone(ZONE_TYPE_DECK, player).add(rest).shuffle();
        });
        // @ts-ignore
        var randomValue = this.twister ? this.twister.random() : Math.random();
        var goesFirst = this.players[(randomValue > 0.5 ? 0 : 1)];
        this.state = __assign(__assign({}, this.state), { zones: zones, step: null, turn: 1, goesFirst: goesFirst, activePlayer: goesFirst });
    };
    State.prototype.getOpponent = function (player) {
        var opponent = this.players.find(function (pl) { return pl != player; });
        return opponent || 0;
    };
    State.prototype.getZone = function (type, player) {
        if (player === void 0) { player = null; }
        return this.state.zones.find(function (zone) { return zone.type === type && (zone.player == player || player == null); }) || new Zone('Empty zone', ZONE_TYPE_DECK);
    };
    State.prototype.getCurrentStep = function () {
        return this.state.step;
    };
    State.prototype.getActivePlayer = function () {
        return this.state.activePlayer;
    };
    State.prototype.getCurrentPriority = function () {
        return this.state.step === null ? 0 : steps[this.state.step].priority;
    };
    State.prototype.addActions = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.state.actions).push.apply(_a, args);
    };
    State.prototype.transformIntoActions = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.state.actions).unshift.apply(_a, args);
    };
    State.prototype.removeDelayedTrigger = function (triggerId) {
        this.state.delayedTriggers = this.state.delayedTriggers.filter(function (_a) {
            var id = _a.id;
            return id != triggerId;
        });
    };
    State.prototype.getNextAction = function () {
        return this.state.actions.shift();
    };
    State.prototype.hasActions = function () {
        return this.state.actions.length > 0;
    };
    State.prototype.setSpellMetadata = function (metadata, spellId) {
        var _a;
        this.state = __assign(__assign({}, this.state), { spellMetaData: __assign(__assign({}, this.state.spellMetaData), (_a = {}, _a[spellId] = metadata, _a)) });
    };
    State.prototype.getSpellMetadata = function (spellId) {
        return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
    };
    State.prototype.setSpellMetaDataField = function (field, value, spellId) {
        var _a;
        if (!spellId) {
            throw new Error('Saving spell metadata field without spellId');
        }
        var metaData = this.getSpellMetadata(spellId);
        this.setSpellMetadata(__assign(__assign({}, metaData), (_a = {}, _a[field] = value, _a)), spellId);
    };
    State.prototype.getMetaValue = function (value, spellId) {
        if (typeof value == 'string' &&
            value[0] == '$' &&
            spellId) {
            var variableName = value.slice(1);
            var spellMetaData = this.getSpellMetadata(spellId);
            return (variableName in spellMetaData) ? spellMetaData[variableName] : null;
        }
        else {
            return value;
        }
    };
    /**
         * Same as getMetaValue, but instead of $-variables it uses %-variables
         * $-variables are kept intact, we probably need them
         * %-variables include usual "self": link to trigger source
         */
    State.prototype.prepareMetaValue = function (value, action, self, spellId) {
        if (value === '%self')
            return self;
        if (typeof value == 'string' &&
            value[0] == '%') {
            var variableName = value.slice(1);
            // %-variables first refer to action's properties
            if (Object.hasOwn(action, variableName))
                return action[variableName];
            // if not, we use spellMetaData
            var spellMetaData = this.getSpellMetadata(spellId);
            return Object.hasOwn(spellMetaData, variableName) ? spellMetaData[variableName] : null;
        }
        else {
            return value;
        }
    };
    State.prototype.selectNthCardOfZone = function (player, zoneType, cardNumber, restrictions) {
        var zoneCards = this.getZone(zoneType, player).cards;
        var filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        var index = cardNumber - 1; // 1-based indexing, for better card data readability
        if (filteredCards.length < index + 1) {
            return [];
        }
        else {
            return [filteredCards[index]];
        }
    };
    State.prototype.selectRandomCardOfZone = function (player, zoneType) {
        var zoneCards = this.getZone(zoneType, player).cards;
        // const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        // @ts-ignore
        var randomValue = this.twister ? this.twister.random() : Math.random();
        var index = Math.floor(randomValue * zoneCards.length);
        if (zoneCards.length == 0) {
            return [];
        }
        else {
            return [zoneCards[index]];
        }
    };
    State.prototype.useSelector = function (selector, player, argument) {
        var _this = this;
        switch (selector) {
            case SELECTOR_OWN_CARDS_IN_PLAY: {
                return this.getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player; });
            }
            case SELECTOR_RELICS: {
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == TYPE_RELIC; });
            }
            case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray([], this.getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true);
            }
            case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray(__spreadArray([], this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true);
            }
            case SELECTOR_OPPONENT_ID:
                return this.players.find(function (id) { return id != argument; }) || 999;
            case SELECTOR_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == TYPE_CREATURE; });
            case SELECTOR_MAGI:
                return __spreadArray(__spreadArray([], this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards, true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards, true).filter(Boolean);
            case SELECTOR_TOP_MAGI_OF_PILE: {
                var topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case SELECTOR_OWN_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
            // case SELECTOR_OWN_MAGI_SINGLE:
            // 	return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            case SELECTOR_OWN_SPELLS_IN_HAND:
                return this.getZone(ZONE_TYPE_HAND, player).cards.filter(function (card) { return card.card.type == TYPE_SPELL; });
            case SELECTOR_ENEMY_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player || 0)).cards;
            case SELECTOR_OWN_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && card.card.type == TYPE_CREATURE; });
            case SELECTOR_ENEMY_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) != player && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_REGION) == argument && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_NOT_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_REGION) != argument && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_NOT_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return !card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE; });
            case SELECTOR_OWN_CREATURES_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player &&
                        card.card.type == TYPE_CREATURE &&
                        card.card.name.split(' ').includes(argument);
                });
            case SELECTOR_STATUS:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument);
                });
            case SELECTOR_CREATURES_WITHOUT_STATUS:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type == TYPE_CREATURE; })
                    .filter(function (card) { return !_this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument); });
            default:
                return [];
        }
    };
    State.prototype.getByProperty = function (target, property, subProperty) {
        var _a, _b;
        if (subProperty === void 0) { subProperty = null; }
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
            case PROPERTY_POWER_COST:
                var powers = target.modifiedCard ? (_a = target.modifiedCard.data) === null || _a === void 0 ? void 0 : _a.powers : target.card.data.powers;
                return (powers && powers.length) ? (_b = powers.find(function (_a) {
                    var name = _a.name;
                    return name === subProperty;
                })) === null || _b === void 0 ? void 0 : _b.cost : 0;
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
            case PROPERTY_ABLE_TO_ATTACK:
                var defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : defaultValue;
        }
    };
    State.prototype.isCardAffectedByEffect = function (card, effect) {
        var protection = this.modifyByStaticAbilities(card, PROPERTY_PROTECTION);
        if (protection) {
            // Is the `from` right?
            if ((effect.spell && protection.from && protection.from.includes(PROTECTION_FROM_SPELLS)) ||
                (effect.power && protection.from && protection.from.includes(PROTECTION_FROM_POWERS)) ||
                (effect.attack && protection.from && protection.from.includes(PROTECTION_FROM_ATTACKS))) {
                if (effect.effectType === EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE &&
                    protection.type === PROTECTION_TYPE_ENERGY_LOSS) {
                    var source = effect.source;
                    if (protection.restrictions) {
                        var cardFilter = this.makeCardFilter(protection.restrictions);
                        return !cardFilter(source);
                    }
                    else {
                        return false;
                    }
                }
                if ((effect.effectType === EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && protection.type === PROTECTION_TYPE_DISCARDING_FROM_PLAY) ||
                    protection.type === PROTECTION_TYPE_GENERAL) {
                    var source = effect.source;
                    if (!source)
                        return false;
                    if (protection.restrictions) {
                        var cardFilter = this.makeCardFilter(protection.restrictions);
                        return !cardFilter(source);
                    }
                    else {
                        return false;
                    }
                }
                if (protection.type === PROTECTION_TYPE_GENERAL) {
                    if (protection.restrictions) {
                        var source = effect.source;
                        if (!source)
                            return false;
                        var cardFilter = this.makeCardFilter(protection.restrictions);
                        return !cardFilter(source);
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        // Energy stasis check
        if (card.modifiedCard.data.energyStasis) {
            if (effect.effectType === EFFECT_TYPE_ADD_ENERGY_TO_CREATURE ||
                effect.effectType === EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE ||
                effect.effectType === EFFECT_TYPE_MOVE_ENERGY) {
                if (effect.source && effect.source.data.controller === card.data.controller &&
                    (effect.spell ||
                        effect.power)) {
                    return false;
                }
            }
        }
        return true;
    };
    State.prototype.isCardAffectedByStaticAbility = function (card, staticAbility) {
        var _a, _b, _c;
        switch (staticAbility.selector) {
            case SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case SELECTOR_SELF_AND_STATUS: {
                return 'card' in staticAbility &&
                    staticAbility.card &&
                    card.id === staticAbility.card.id &&
                    this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case SELECTOR_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    });
            }
            case SELECTOR_OWN_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(((_a = staticAbility === null || staticAbility === void 0 ? void 0 : staticAbility.selectorParameter) === null || _a === void 0 ? void 0 : _a.toString()) || 'no matches');
            }
            case SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case SELECTOR_OWN_MAGI: {
                return card.card.type === TYPE_MAGI &&
                    this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    ((_c = (_b = this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.id) === card.id;
            }
            case SELECTOR_STATUS: {
                return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_SPELLS_IN_HAND: {
                return this.getZone(ZONE_TYPE_HAND, staticAbility.player).cards.some(function (_a) {
                    var id = _a.id;
                    return id === card.id && card.card.type == TYPE_SPELL;
                });
            }
            default: {
                console.error("Unknown static ability selector: ".concat(staticAbility.selector));
                return false;
            }
        }
    };
    State.prototype.modifyByStaticAbilities = function (target, property, subProperty) {
        var _a;
        if (subProperty === void 0) { subProperty = null; }
        if (!target) {
            return null;
        }
        var PLAYER_ONE = this.players[0];
        var PLAYER_TWO = this.players[1];
        var gameStaticAbilities = [
            {
                name: 'Burrowed - Energy loss',
                text: 'Your burrowed creatures may not lose more than 2 energy each turn',
                selector: SELECTOR_STATUS,
                selectorParameter: STATUS_BURROWED,
                property: PROPERTY_ENERGY_LOSS_THRESHOLD,
                modifier: {
                    operator: CALCULATION_SET,
                    operandOne: 2,
                },
            },
            {
                name: 'Burrowed - Ability to attack',
                text: 'Your burrowed creatures cannot attack',
                selector: SELECTOR_STATUS,
                selectorParameter: STATUS_BURROWED,
                property: PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operator: CALCULATION_SET,
                    operandOne: false,
                },
            },
        ];
        // gathering static abilities from the field, adding players Magi to them
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], this.getZone(ZONE_TYPE_IN_PLAY).cards, true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards, true), this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards, true);
        var continuousStaticAbilities = this.state.continuousEffects.map(function (effect) { var _a; return ((_a = effect.staticAbilities) === null || _a === void 0 ? void 0 : _a.map(function (a) { return (__assign(__assign({}, a), { player: effect.player })); })) || []; }).flat();
        var propertyLayers = (_a = {},
            _a[PROPERTY_CONTROLLER] = 0,
            _a[PROPERTY_POWER_COST] = 1,
            _a[PROPERTY_COST] = 1,
            _a[PROPERTY_ENERGIZE] = 2,
            _a[PROPERTY_STATUS] = 3,
            _a[PROPERTY_ATTACKS_PER_TURN] = 4,
            _a[PROPERTY_CAN_ATTACK_MAGI_DIRECTLY] = 5,
            _a[PROPERTY_ENERGY_LOSS_THRESHOLD] = 6,
            _a[PROPERTY_ABLE_TO_ATTACK] = 7,
            _a[PROPERTY_PROTECTION] = 8,
            _a);
        var zoneAbilities = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.staticAbilities ? __spreadArray(__spreadArray([], acc, true), (cardInPlay.card.data.staticAbilities.map(function (a) { return (__assign(__assign({}, a), { player: cardInPlay.data.controller, card: cardInPlay })); })), true) : acc; }, []);
        var staticAbilities = __spreadArray(__spreadArray(__spreadArray([], gameStaticAbilities, true), zoneAbilities, true), continuousStaticAbilities, true).sort(function (a, b) { return propertyLayers[a.property] - propertyLayers[b.property]; });
        var initialCardData = {
            card: target.card,
            modifiedCard: __assign(__assign({}, target.card), { data: __assign(__assign({ protection: undefined }, target.card.data), { energyLossThreshold: 0, ableToAttack: 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true }) }),
            data: __assign({}, target.data),
            id: target.id,
            owner: target.owner,
        };
        // Okay, sooner or later this should be rewritten
        // Here we should construct new CardInGame object containing new Card object (both with new values)
        var modifiedCardData = staticAbilities.reduce(this.layeredDataReducer.bind(this), initialCardData);
        // @ts-ignore
        return this.getByProperty(modifiedCardData, property, subProperty);
    };
    State.prototype.layeredDataReducer = function (currentCard, staticAbility) {
        var _this = this;
        if (this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
            switch (staticAbility.property) {
                case PROPERTY_COST: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_COST);
                    var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                    if (typeof initialValue !== 'number') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: initialValue }) });
                    }
                    var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: resultValue }) });
                }
                case PROPERTY_ENERGIZE: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                    var _b = staticAbility.modifier, operator = _b.operator, operandOne = _b.operandOne;
                    var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energize: resultValue }) }) });
                }
                case PROPERTY_ATTACKS_PER_TURN: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
                    var _c = staticAbility.modifier, operator = _c.operator, operandOne = _c.operandOne;
                    var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { attacksPerTurn: resultValue }) }) });
                }
                case PROPERTY_ENERGY_LOSS_THRESHOLD: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                    var _d = staticAbility.modifier, operator = _d.operator, operandOne = _d.operandOne;
                    var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energyLossThreshold: resultValue }) }) });
                }
                case PROPERTY_ABLE_TO_ATTACK: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
                    var _e = staticAbility.modifier, operator = _e.operator, operandOne = _e.operandOne;
                    var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { ableToAttack: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case PROPERTY_CAN_BE_ATTACKED: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
                    var _f = staticAbility.modifier, operator = _f.operator, operandOne = _f.operandOne;
                    var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { canBeAttacked: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case PROPERTY_CONTROLLER: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
                    var _g = staticAbility.modifier, operator = _g.operator, operandOne = _g.operandOne;
                    var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'number') {
                        return __assign(__assign({}, currentCard), { data: __assign(__assign({}, currentCard.data), { controller: resultValue }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case PROPERTY_STATUS: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty);
                    var _h = staticAbility.modifier, operator = _h.operator, operandOne = _h.operandOne;
                    var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        switch (staticAbility.subProperty) {
                            case STATUS_BURROWED: {
                                return __assign(__assign({}, currentCard), { data: __assign(__assign({}, currentCard.data), { burrowed: resultValue }) });
                            }
                            default: {
                                return currentCard;
                            }
                        }
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case PROPERTY_PROTECTION: {
                    var initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
                    var _j = staticAbility.modifier, operator = _j.operator, operandOne = _j.operandOne;
                    var resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'object' && 'from' in resultValue) {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { protection: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case PROPERTY_POWER_COST: {
                    if (currentCard.modifiedCard.data.powers) {
                        var updatedPowers = currentCard.modifiedCard.data.powers.map(function (power) {
                            var initialValue = _this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
                            var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                            var resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                                _this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                                _this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                            return __assign(__assign({}, power), { cost: resultValue });
                        });
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { powers: updatedPowers }) }) });
                    }
                    return currentCard;
                }
                default: {
                    return currentCard;
                }
            }
        }
        return currentCard;
    };
    State.prototype.makeChecker = function (restriction, restrictionValue) {
        var _this = this;
        switch (restriction) {
            case RESTRICTION_CREATURE_NAME:
                return function (card) { return card.card.name === restrictionValue; };
            case RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return function (card) { return card.card.name.split(' ').some(function (type) { return restrictionValue.includes(type); }); };
                }
                return function (card) { return card.card.name.split(' ').includes(restrictionValue); };
            case RESTRICTION_TYPE:
                return function (card) { return card.card.type === restrictionValue; };
            case RESTRICTION_PLAYABLE:
                return function (card) {
                    var magi = _this.useSelector(SELECTOR_OWN_MAGI, card.owner)[0];
                    var cardCost = _this.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case RESTRICTION_MAGI_WITHOUT_CREATURES:
                return function (card) {
                    if (card.card.type !== TYPE_MAGI)
                        return false;
                    var creatures = _this.useSelector(SELECTOR_OWN_CREATURES, card.owner);
                    return (creatures && creatures instanceof Array && creatures.length === 0);
                };
            case RESTRICTION_REGION:
                return function (card) { return card.card.region === restrictionValue; };
            case RESTRICTION_REGION_IS_NOT:
                return function (card) { return card.card.region !== restrictionValue; };
            case RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return function (card) { return Boolean(card.card.type === TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost); };
            case RESTRICTION_ENERGY_LESS_THAN:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.energy < restrictionValue; };
            case RESTRICTION_CREATURE_WAS_ATTACKED:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.wasAttacked === true; };
            // For own and opponents creatures we pass effect controller as restrictionValue
            case RESTRICTION_OWN_CREATURE:
                return function (card) { return card.data.controller === restrictionValue; };
            case RESTRICTION_OPPONENT_CREATURE:
                return function (card) { return card.data.controller !== restrictionValue; };
            case RESTRICTION_STATUS:
                return function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue); };
            case RESTRICTION_ENERGY_EQUALS:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.energy === restrictionValue; };
            default:
                return function () { return true; };
        }
    };
    State.prototype.checkAnyCardForRestriction = function (cards, restriction, restrictionValue) {
        return cards.some(this.makeChecker(restriction, restrictionValue));
    };
    State.prototype.checkAnyCardForRestrictions = function (cards, restrictions) {
        return cards.some(this.makeCardFilter(restrictions));
    };
    State.prototype.checkCardsForRestriction = function (cards, restriction, restrictionValue) {
        return cards.every(this.makeChecker(restriction, restrictionValue));
    };
    State.prototype.makeCardFilter = function (restrictions) {
        var _this = this;
        if (restrictions === void 0) { restrictions = []; }
        var checkers = restrictions.map(function (_a) {
            var type = _a.type, value = _a.value;
            return _this.makeChecker(type, value);
        });
        return function (card) {
            return checkers.every(function (checker) { return checker(card); });
        }; // combine checkers
    };
    State.prototype.getObjectOrSelf = function (action, self, object, property) {
        if (typeof object === 'boolean' || typeof object === 'number') {
            return object;
        }
        if (object === 'self') {
            return self;
        }
        return property ? this.getMetaValue(action[object], action.generatedBy) : object;
    };
    State.prototype.replaceByReplacementEffect = function (action) {
        var _this = this;
        var _a;
        var PLAYER_ONE = this.players[0];
        var PLAYER_TWO = this.players[1];
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], (this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards, true), (this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE)).cards, true), (this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO)).cards, true);
        var zoneReplacements = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.replacementEffects ? __spreadArray(__spreadArray([], acc, true), cardInPlay.card.data.replacementEffects
            .filter(function (effect) { return !effect.oncePerTurn || (effect.oncePerTurn && !cardInPlay.wasActionUsed(effect.name || 'unknown effect')); })
            .map(function (effect) { return (__assign(__assign({}, effect), { self: cardInPlay })); }), true) : acc; }, []);
        var replacementFound = false;
        var appliedReplacerId = null;
        var appliedReplacerSelf = null;
        var replaceWith = null;
        var foundReplacer = null;
        for (var _i = 0, zoneReplacements_1 = zoneReplacements; _i < zoneReplacements_1.length; _i++) {
            var replacer = zoneReplacements_1[_i];
            var replacerId = replacer.self.id; // Not really, but will work for now
            if ('replacedBy' in action && ((_a = action.replacedBy) === null || _a === void 0 ? void 0 : _a.includes(replacerId))) {
                break;
            }
            if (this.matchAction(action, replacer.find, replacer.self)) {
                foundReplacer = replacer;
                replacementFound = true;
                appliedReplacerSelf = replacer.self;
                appliedReplacerId = replacerId;
                replaceWith = (replacer.replaceWith instanceof Array) ? replacer.replaceWith : [replacer.replaceWith];
            }
        }
        var previouslyReplacedBy = ('replacedBy' in action && action.replacedBy) ? action.replacedBy : [];
        if (!action) {
            throw new Error('Empty action found in the queue');
        }
        if (replacementFound && replaceWith) {
            var resultEffects = appliedReplacerSelf ? replaceWith.map((function (appliedReplacerSelf) { return function (replacementEffect) {
                if ('type' in replacementEffect && replacementEffect.type == ACTION_EXIT_PROMPTS) {
                    throw new Error('Cannot replace anything with ACTION_EXIT_PROMPTS');
                }
                if (!('type' in replacementEffect)) {
                    var resultEffect_1 = __assign(__assign({ type: ACTION_EFFECT }, replacementEffect), { replacedBy: appliedReplacerId ? __spreadArray(__spreadArray([], previouslyReplacedBy, true), [
                            appliedReplacerId,
                        ], false) : previouslyReplacedBy, generatedBy: action.generatedBy || _this.nanoid(), player: appliedReplacerSelf.data.controller });
                    Object.keys(replacementEffect)
                        .filter(function (key) { return !['type', 'effectType'].includes(key); })
                        .forEach(function (key) {
                        var value = _this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy || 'thegame');
                        resultEffect_1[key] = value;
                    });
                    return resultEffect_1;
                }
                var resultEffect /*: WithReplacementValues<EffectType, EffectType>*/ = __assign(__assign({}, replacementEffect), { replacedBy: appliedReplacerId ? __spreadArray(__spreadArray([], previouslyReplacedBy, true), [
                        appliedReplacerId,
                    ], false) : previouslyReplacedBy, generatedBy: action.generatedBy || _this.nanoid(), player: appliedReplacerSelf.data.controller });
                // prepare %-values on created action
                Object.keys(replacementEffect)
                    .filter(function (key) { return !['type', 'effectType'].includes(key); })
                    .forEach(function (key) {
                    var value = _this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy || 'thegame');
                    resultEffect[key] = value;
                });
                return resultEffect;
            }; })(appliedReplacerSelf)) : [];
            // If the replacer is one-time, set the action usage
            if (appliedReplacerSelf && foundReplacer && foundReplacer.oncePerTurn && foundReplacer.name) {
                appliedReplacerSelf.setActionUsed(foundReplacer.name);
            }
            if (foundReplacer && foundReplacer.mayEffect) {
                var replacedBy = ('replacedBy' in action && action.replacedBy) ? __spreadArray([], action.replacedBy, true) : [];
                if (appliedReplacerId) {
                    replacedBy.push(appliedReplacerId);
                }
                this.state.mayEffectActions = resultEffects;
                this.state.fallbackActions = [__assign(__assign({}, action), { replacedBy: replacedBy })];
                return [{
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_MAY_ABILITY,
                        promptParams: {
                            effect: {
                                name: foundReplacer.name,
                                text: foundReplacer.text,
                            },
                        },
                        generatedBy: appliedReplacerId,
                        player: appliedReplacerSelf ? appliedReplacerSelf.data.controller : 0, // This is strange @todo check if appliedReplacerSelf can be null
                    }];
            }
            else {
                return resultEffects;
            }
        }
        return [action];
    };
    State.prototype.checkCondition = function (action, self, condition) {
        if (!('objectOne' in condition) ||
            !('objectTwo' in condition)) {
            throw new Error('Missing object field in condition');
        }
        // Sometimes, spellData stores arrays of cards. If we got array to check condition on, use only first item.
        var multiObjectOne = this.getObjectOrSelf(action, self, condition.objectOne, 'propertyOne' in condition && Boolean(condition.propertyOne));
        var objectOne = (multiObjectOne instanceof Array) ? multiObjectOne[0] : multiObjectOne;
        var multiObjectTwo = this.getObjectOrSelf(action, self, condition.objectTwo, 'propertyTwo' in condition && Boolean(condition.propertyTwo));
        var objectTwo = (multiObjectTwo instanceof Array) ? multiObjectTwo[0] : multiObjectTwo;
        // So here either objectOne or objectTwo might be an array. 
        if (objectOne instanceof Array || objectTwo instanceof Array) {
            throw new Error('Whoops, array in checkCondition');
        }
        var operandOne = (condition.propertyOne && condition.propertyOne !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectOne, condition.propertyOne) : objectOne;
        var operandTwo = (condition.propertyTwo && condition.propertyTwo !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectTwo, condition.propertyTwo) : objectTwo;
        switch (condition.comparator) {
            case '!=':
                return operandOne !== operandTwo;
            case '=':
                return operandOne == operandTwo;
            case '>':
                return operandOne > operandTwo;
            case '<':
                return operandOne < operandTwo;
            case '>=':
                return operandOne >= operandTwo;
            case '<=':
                return operandOne <= operandTwo;
            case 'includes':
                return operandOne.length && operandOne.includes(operandTwo);
        }
    };
    State.prototype.matchAction = function (action, find, self) {
        var _this = this;
        if (action.type !== ACTION_EFFECT) {
            return false;
        }
        if (action.effectType !== find.effectType) {
            return false;
        }
        var conditions = find.conditions.map(function (condition) {
            var result = false;
            try {
                result = _this.checkCondition(action, self, condition);
            }
            catch (e) {
                console.error('Failure checking condition');
                console.dir(condition);
            }
            return result;
        });
        return conditions.every(function (result) { return result === true; });
    };
    State.prototype.triggerAbilities = function (action) {
        var _this = this;
        var PLAYER_ONE = this.players[0];
        var PLAYER_TWO = this.players[1];
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], (this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards, true), (this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE) || { cards: [] }).cards, true), (this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO) || { cards: [] }).cards, true);
        var cardTriggerEffects = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.triggerEffects ? __spreadArray(__spreadArray([], acc, true), cardInPlay.card.data.triggerEffects.map(function (effect) { return (__assign(__assign({}, effect), { self: cardInPlay })); }), true) : acc; }, []);
        // const continuousEffectTriggers = this.state.continuousEffects.map(effect => effect.triggerEffects.map(triggerEffect => ({...triggerEffect, id: effect.id})) || []).flat();
        var triggerEffects = __spreadArray(__spreadArray([], cardTriggerEffects, true), this.state.delayedTriggers, true);
        triggerEffects.forEach(function (replacer) {
            // @ts-ignore
            var triggeredId = replacer.self.id; // Not really, but will work for now
            if (_this.matchAction(action, replacer.find, replacer.self)) {
                // Save source to *trigger source* metadata (it's probably empty)
                // For creatures set creatureSource field (just for convenience)
                _this.setSpellMetaDataField('source', replacer.self, /*action.generatedBy ||*/ triggeredId);
                if (replacer.self.card.type === TYPE_CREATURE) {
                    _this.setSpellMetaDataField('sourceCreature', replacer.self, /*action.generatedBy ||*/ triggeredId);
                }
                // Turn all metadata entries into their corresponding values 
                var actionWithValues_1 = Object.fromEntries(Object.entries(action).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (typeof value == 'string' && value.startsWith('$')) {
                        return [key, _this.getMetaValue(value, action.generatedBy)];
                    }
                    return [key, value];
                }));
                // Turn effect-templates into actual effect actions by preparing meta-values				
                var preparedEffects = replacer.effects.map(function (effect) {
                    // @ts-ignore
                    var resultEffect = {
                        type: effect.type || ACTION_EFFECT,
                        generatedBy: /*action.generatedBy ||*/ triggeredId, // Some actions do not have generatedBy (game actions). We still need one though.
                        triggeredId: [triggeredId],
                        triggerSource: replacer.self,
                        player: replacer.self.data.controller,
                    };
                    // Do we need to replace this? Maybe later
                    if (effect.type === ACTION_EFFECT) {
                        // @ts-ignore
                        resultEffect.effectType = effect.effectType;
                    }
                    // prepare %-values on created action
                    Object.keys(effect)
                        .filter(function (key) { return !['type', 'effectType'].includes(key); })
                        .forEach(function (key) {
                        var propertyValue = effect[key];
                        var value = _this.prepareMetaValue(propertyValue, actionWithValues_1, replacer.self, action.generatedBy || _this.nanoid());
                        // if (typeof value == 'string' && value.startsWith('$')) {
                        // 	console.log(`Interpolating ${key} with generatedBy ${action.generatedBy}`)
                        // 	console.dir(this.getMetaValue(value, action.generatedBy))
                        // 	resultEffect[key as keyof typeof effect] = this.getMetaValue(value, action.generatedBy)
                        // } else {
                        resultEffect[key] = value;
                        // }
                    });
                    return resultEffect;
                });
                preparedEffects.push({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_TRIGGERED_ABILITY_FINISHED,
                    generatedBy: triggeredId,
                });
                var allPromptsAreDoable = _this.checkPrompts(replacer.self, preparedEffects, false, 0);
                if (allPromptsAreDoable) {
                    if (replacer.mayEffect) {
                        _this.state.mayEffectActions = preparedEffects;
                        _this.transformIntoActions({
                            type: ACTION_ENTER_PROMPT,
                            promptType: PROMPT_TYPE_MAY_ABILITY,
                            promptParams: {
                                effect: {
                                    name: replacer.name || 'Generic replacer',
                                    text: replacer.text || 'There was an error determining the replacer for the effect',
                                },
                            },
                            generatedBy: replacer.self.id,
                            player: replacer.self.data.controller,
                        });
                    }
                    else {
                        _this.transformIntoActions.apply(_this, preparedEffects);
                    }
                }
                // @ts-ignore
                if (replacer.id) {
                    // @ts-ignore
                    _this.removeDelayedTrigger(replacer.id);
                }
            }
        });
    };
    State.prototype.attachCard = function (cardId, attachmentTargetId) {
        this.state.attachedTo[cardId] = attachmentTargetId;
        if (!(attachmentTargetId in this.state.cardsAttached)) {
            this.state.cardsAttached[attachmentTargetId] = [];
        }
        this.state.cardsAttached[attachmentTargetId].push(cardId);
    };
    State.prototype.removeAttachments = function (cardId) {
        if (cardId in this.state.cardsAttached) {
            for (var _i = 0, _a = this.state.cardsAttached[cardId]; _i < _a.length; _i++) {
                var attachedCardId = _a[_i];
                if (attachedCardId in this.state.attachedTo) {
                    delete this.state.attachedTo[attachedCardId];
                }
            }
            delete this.state.cardsAttached[cardId];
        }
    };
    State.prototype.convertPromptActionToEffect = function (action) {
        return convertPromptActionToEffect(action, this);
    };
    State.prototype.detachCard = function (cardId) {
        if (cardId in this.state.attachedTo) {
            var attachedTargetId = this.state.attachedTo[cardId];
            delete this.state.attachedTo[cardId];
            this.state.cardsAttached[attachedTargetId] =
                this.state.cardsAttached[attachedTargetId].filter(function (attachedCard) { return attachedCard !== cardId; });
        }
    };
    State.prototype.performCalculation = function (operator, operandOne, operandTwo) {
        return performCalculation(operator, operandOne, operandTwo);
    };
    State.prototype.calculateTotalCost = function (card) {
        var activeMagiSelected = this.useSelector(SELECTOR_OWN_MAGI, card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            var activeMagi = activeMagiSelected[0];
            var baseCost = this.modifyByStaticAbilities(card, PROPERTY_COST);
            var regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return 0;
    };
    State.prototype.getAvailableCards = function (player, topMagi) {
        var _a, _b;
        var deckCards = this.getZone(ZONE_TYPE_DECK, player).cards.map(function (_a) {
            var card = _a.card;
            return card.name;
        });
        var discardCards = this.getZone(ZONE_TYPE_DISCARD, player).cards.map(function (_a) {
            var card = _a.card;
            return card.name;
        });
        var searchableCards = __spreadArray(__spreadArray([], deckCards, true), discardCards, true);
        var availableCards = ((_b = (_a = topMagi.card.data) === null || _a === void 0 ? void 0 : _a.startingCards) === null || _b === void 0 ? void 0 : _b.filter(function (card) { return searchableCards.includes(card); })) || [];
        return availableCards;
    };
    State.prototype.checkPrompts = function (source, preparedActions, isPower, powerCost) {
        var _this = this;
        if (isPower === void 0) { isPower = false; }
        if (powerCost === void 0) { powerCost = 0; }
        var testedActions = __spreadArray([], preparedActions, true);
        // Calculate if prompts are resolvable
        // If source is Magi, it will not be filtered out, being in another zone
        var creatureWillSurvive = !isPower || source.data.energy > powerCost;
        var ourCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return (creatureWillSurvive ? true : card.id !== source.id) && _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === source.data.controller; });
        var allCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return creatureWillSurvive ? true : card.id !== source.id; });
        var metaValues = {
            '$source': source,
            '$sourceCreature': source,
        };
        while (testedActions.length && testedActions[0].type === ACTION_GET_PROPERTY_VALUE) {
            var valueGetter = testedActions[0];
            testedActions.shift();
            var multiTarget = valueGetter.source;
            var target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
            var property = this.getMetaValue(valueGetter.property, valueGetter.generatedBy);
            var modifiedResult = this.modifyByStaticAbilities(target, property);
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
                    var opponent = _this.getOpponent(source.data.controller);
                    var magi = __spreadArray(__spreadArray([], _this.getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, true), _this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards, true);
                    return magi.some(function (magi) { return !allCardsInPlay.some(function (card) { return card.card.type === TYPE_CREATURE && _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === magi.data.controller; }); });
                case PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(function (card) { return card.card.type === TYPE_RELIC; });
                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(function (card) { return card.card.type === TYPE_CREATURE; });
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return _this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.id !== source.id; });
                }
                case PROMPT_TYPE_POWER_ON_MAGI: {
                    var magi_1 = _this.getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards;
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
                        return _this.checkAnyCardForRestrictions(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), restrictionsWithValues);
                    }
                    else if ('restriction' in promptAction.promptParams) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                var restrictionValue = (typeof promptAction.promptParams.restrictionValue === 'string' &&
                                    promptAction.promptParams.restrictionValue in metaValues) ? metaValues[promptAction.promptParams.restrictionValue] : promptAction.promptParams.restrictionValue;
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    var zoneOwner = _this.getMetaValue(promptAction.promptParams.zoneOwner, source.id);
                    var cardsInZone = _this.getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    var numberOfCards = _this.getMetaValue(promptAction.promptParams.numberOfCards, source.id);
                    // if (cardsInZone.length < numberOfCards) {
                    //	 return false;
                    // }
                    if (promptAction.promptParams.restrictions) {
                        return _this.checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    var zoneOwner = _this.getMetaValue(promptAction.promptParams.zoneOwner, source.id);
                    var cardsInZone = _this.getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    if (promptAction.promptParams.restrictions) {
                        return _this.checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, source.data.controller);
                            }
                            default: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
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
    State.prototype.update = function (initialAction) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (this.hasWinner()) {
            return false;
        }
        this.addActions(initialAction);
        var _loop_1 = function () {
            var _l;
            var rawAction = this_1.getNextAction();
            var replacedActions = this_1.replaceByReplacementEffect(rawAction);
            var action = replacedActions[0];
            if (replacedActions.length > 1) {
                // Stuff the rest of them into beginning of the action queue
                this_1.transformIntoActions.apply(this_1, replacedActions.slice(1));
            }
            if (this_1.state.prompt && !(action.type === ACTION_RESOLVE_PROMPT || action.type === ACTION_CONCEDE || action.type === ACTION_EXIT_PROMPTS || (action.type == ACTION_EFFECT && action.effectType == EFFECT_TYPE_PROMPT_ENTERED))) {
                showAction(action);
                throw new Error('Non-prompt action in the prompt state');
            }
            if (this_1.debug) {
                showAction(action);
            }
            this_1.addActionToLog(action);
            this_1.addActionToStream(action);
            this_1.triggerAbilities(action);
            switch (action.type) {
                case ACTION_CONCEDE: {
                    var opponentId = this_1.getOpponent(action.player);
                    this_1.transformIntoActions({
                        type: ACTION_PLAYER_WINS,
                        player: opponentId,
                    });
                    break;
                }
                case ACTION_PLAYER_WINS: {
                    this_1.setWinner(action.player);
                    this_1.state.actions = [];
                    break;
                }
                case ACTION_ATTACK: {
                    var attackSource = action.generatedBy ? this_1.getMetaValue(action.source, action.generatedBy) : action.source;
                    var attackTarget = action.generatedBy ? this_1.getMetaValue(action.target, action.generatedBy) : action.target;
                    var additionalAttackers = (action.generatedBy ? this_1.getMetaValue(action.additionalAttackers, action.generatedBy) : action.additionalAttackers) || [];
                    var sourceAttacksPerTurn = this_1.modifyByStaticAbilities(attackSource, PROPERTY_ATTACKS_PER_TURN);
                    var attackerCanAttack = this_1.modifyByStaticAbilities(attackSource, PROPERTY_ABLE_TO_ATTACK);
                    if (!attackerCanAttack) {
                        console.error("Somehow ".concat(attackSource.card.name, " cannot attack"));
                    }
                    else {
                        var targetCanBeAttacked = this_1.modifyByStaticAbilities(attackTarget, PROPERTY_CAN_BE_ATTACKED);
                        if (!targetCanBeAttacked) {
                            console.error("Somehow ".concat(attackSource.card.name, " cannot be attacked"));
                        }
                        else {
                            var sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
                            var additionalAttackersCanAttack = additionalAttackers.every(function (card) { return card.card.data.canPackHunt && _this.modifyByStaticAbilities(card, PROPERTY_ABLE_TO_ATTACK); });
                            var additionalAttackersHasAttacksLeft = additionalAttackers.every(function (card) { return card.data.attacked < _this.modifyByStaticAbilities(card, PROPERTY_ATTACKS_PER_TURN); });
                            var targetIsMagi = attackTarget.card.type == TYPE_MAGI;
                            var opponentCreatures = this_1.useSelector(SELECTOR_OWN_CREATURES, attackTarget.owner);
                            var magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;
                            var attackApproved = !targetIsMagi || ( // Either we attack a creature
                            targetIsMagi && ( // Or we are attacking a magi, but then...
                            !magiHasCreatures || // ...he either shouldn't have creatures
                                this_1.modifyByStaticAbilities(attackSource, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
                            ));
                            var enoughAttacksLeft = (sourceHasAttacksLeft && ((additionalAttackersCanAttack && additionalAttackersHasAttacksLeft) || additionalAttackers.length === 0));
                            if (enoughAttacksLeft && attackApproved && this_1.getCurrentPriority() == PRIORITY_ATTACK) {
                                this_1.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_ATTACK,
                                    source: attackSource,
                                    target: attackTarget,
                                    additionalAttackers: additionalAttackers,
                                    generatedBy: attackSource.id,
                                    player: attackSource.data.controller,
                                });
                            }
                        }
                    }
                    break;
                }
                case ACTION_GET_PROPERTY_VALUE: {
                    var multiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                    var property = this_1.getMetaValue(action.property, action.generatedBy);
                    if (property === CARD_COUNT) {
                        var result = (multiTarget instanceof Array) ? multiTarget.length : 0;
                        var variable = action.variable || 'result';
                        if (action.generatedBy) {
                            this_1.setSpellMetaDataField(variable, result, action.generatedBy);
                        }
                    }
                    else {
                        // Sometimes we can only pass here results of a selector.
                        // If so, work on first element of result.
                        var target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
                        var modifiedResult = void 0;
                        if (target && 'name' in target && 'effects' in target && property === PROPERTY_POWER_COST) {
                            modifiedResult = target.cost;
                        }
                        else {
                            modifiedResult = this_1.modifyByStaticAbilities(target, property);
                        }
                        var variable = action.variable || 'result';
                        if (action.generatedBy) {
                            this_1.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
                        }
                    }
                    break;
                }
                case ACTION_CALCULATE: {
                    var operandOne = this_1.getMetaValue(action.operandOne, action.generatedBy);
                    var operandTwo = this_1.getMetaValue(action.operandTwo, action.generatedBy);
                    var result = this_1.performCalculation(action.operator, operandOne, operandTwo);
                    var variable = action.variable || 'result';
                    if (action.generatedBy) {
                        this_1.setSpellMetaDataField(variable, result, action.generatedBy);
                    }
                    break;
                }
                case ACTION_POWER: {
                    var powerCost = this_1.modifyByStaticAbilities(action.source, PROPERTY_POWER_COST, action.power.name || '');
                    var payingCard = (action.source.card.type === TYPE_RELIC) ?
                        this_1.getZone(ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
                        action.source;
                    if (payingCard &&
                        !action.source.wasActionUsed(action.power.name) &&
                        (payingCard.data.energy >= powerCost ||
                            (payingCard.data.energy > 0 && powerCost === COST_X))) {
                        var source_1 = action.source;
                        var sourcePower = action.power;
                        var effects = action.power.effects;
                        var sourceController_1 = this_1.modifyByStaticAbilities(source_1, PROPERTY_CONTROLLER);
                        var enrichAction = function (effect) { return (__assign(__assign({ source: source_1, player: sourceController_1 }, effect), { power: true, generatedBy: source_1.id })); };
                        var preparedActions = effects.map(enrichAction);
                        var allPromptsAreDoable = this_1.checkPrompts(source_1, preparedActions, true, powerCost);
                        if (allPromptsAreDoable) {
                            var currentPowerMetaData = {
                                source: source_1,
                                sourcePower: sourcePower,
                                player: action.player,
                                sourceCreature: source_1,
                            }; // No retrieving old metadata from old activations
                            source_1.setActionUsed(action.power.name);
                            if (powerCost == COST_X) {
                                this_1.addActions({
                                    type: ACTION_ENTER_PROMPT,
                                    promptType: PROMPT_TYPE_NUMBER,
                                    player: sourceController_1,
                                    generatedBy: source_1.id,
                                    promptParams: {
                                        min: 1,
                                        max: action.source.data.energy,
                                    },
                                }, {
                                    type: ACTION_CALCULATE,
                                    operator: CALCULATION_SET,
                                    operandOne: '$number',
                                    variable: 'chosen_cost',
                                    generatedBy: source_1.id,
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: '$number',
                                    generatedBy: source_1.id,
                                });
                            }
                            else if (powerCost > 0) {
                                this_1.addActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: powerCost,
                                    generatedBy: source_1.id,
                                });
                            }
                            if (sourcePower) {
                                var powerEffects = {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
                                    power: sourcePower,
                                    source: source_1,
                                    player: action.player,
                                    generatedBy: source_1.id,
                                };
                                this_1.addActions(powerEffects);
                            }
                            this_1.addActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_POWER_FINISHED,
                                generatedBy: source_1.id,
                            });
                            this_1.setSpellMetadata(currentPowerMetaData, source_1.id);
                        }
                    }
                    break;
                }
                case ACTION_ENTER_PROMPT: {
                    if (!('player' in action)) {
                        throw new Error('Prompt without player!');
                    }
                    var savedActions = this_1.state.actions;
                    var promptParams = {};
                    var skipPrompt = false;
                    var promptPlayer = this_1.getMetaValue(action.player, action.generatedBy);
                    switch (action.promptType) {
                        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                            promptParams = {
                                // @Todo fix enriched cards moving through the engine
                                // @ts-ignore
                                source: this_1.getMetaValue(action.source, action.generatedBy),
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
                                    type: this_1.getMetaValue(action.promptParams.restriction, action.generatedBy),
                                    value: this_1.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                                },
                            ] : null);
                            var zone = this_1.getMetaValue(action.promptParams.zone, action.generatedBy);
                            var zoneOwner = this_1.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this_1.getZone(zone, null).cards : this_1.getZone(zone, zoneOwner).cards;
                            var cards = restrictions ? zoneContent.filter(this_1.makeCardFilter(restrictions)) : zoneContent;
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
                            else {
                                skipPrompt = true;
                            }
                            break;
                        }
                        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                            if (action.promptParams.restriction && action.promptParams.restrictions) {
                                throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
                            }
                            var restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                                {
                                    type: this_1.getMetaValue(action.promptParams.restriction, action.generatedBy),
                                    value: this_1.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                                },
                            ] : null);
                            var zone = this_1.getMetaValue(action.promptParams.zone, action.generatedBy);
                            var zoneOwner = this_1.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                            var zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this_1.getZone(zone, null).cards : this_1.getZone(zone, zoneOwner).cards;
                            var cards = restrictions ? zoneContent.filter(this_1.makeCardFilter(restrictions)) : zoneContent;
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
                            else {
                                skipPrompt = true;
                            }
                            break;
                        }
                        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                            var zone = this_1.getMetaValue(action.promptParams.zone, action.generatedBy);
                            var zoneOwner = this_1.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                            var zoneContent = this_1.getZone(zone, zoneOwner).cards;
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
                            var restrictions = [];
                            if ('restrictions' in action.promptParams) {
                                restrictions = action.promptParams.restrictions.map(function (_a) {
                                    var type = _a.type, value = _a.value;
                                    return ({
                                        type: type,
                                        value: _this.getMetaValue(value, action.generatedBy),
                                    });
                                });
                            }
                            else if ('restriction' in action.promptParams) {
                                restrictions = [
                                    {
                                        type: action.promptParams.restriction,
                                        value: this_1.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                                    }
                                ];
                            }
                            if (restrictions.length) {
                                /*const zoneContent = this.getZone(ZONE_TYPE_IN_PLAY, null).getCardsByRestriction(restrictions, this);

                                if (zoneContent.length == 0) {
                                    skipPrompt = true
                                } else { */
                                promptParams = {
                                    restrictions: restrictions,
                                };
                                // }
                            }
                            break;
                        }
                        case PROMPT_TYPE_CHOOSE_CARDS: {
                            promptParams = action.promptParams;
                            break;
                        }
                        case PROMPT_TYPE_NUMBER: {
                            promptParams = {
                                min: this_1.getMetaValue(action.promptParams.min, action.generatedBy),
                                max: this_1.getMetaValue(action.promptParams.max, action.generatedBy),
                            };
                            break;
                        }
                        case PROMPT_TYPE_POWER_ON_MAGI: {
                            promptParams = {
                                magi: this_1.getMetaValue(action.promptParams.magi, action.generatedBy),
                            };
                            break;
                        }
                        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            if (action.promptParams.restriction) {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.promptParams.restriction,
                                            value: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            if (action.promptParams.restriction) {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.promptParams.restriction,
                                            value: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.promptParams.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                            var sourceZone = this_1.getMetaValue(action.promptParams.sourceZone, action.generatedBy);
                            var sourceZoneOwner = this_1.getMetaValue(action.promptParams.sourceZoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                            var zoneContent = this_1.getZone(sourceZone, sourceZoneOwner).cards;
                            var cards = zoneContent.slice(0, numberOfCards);
                            promptParams = {
                                sourceZone: sourceZone,
                                sourceZoneOwner: sourceZoneOwner,
                                numberOfCards: numberOfCards,
                                cards: cards.map(convertCard),
                                targetZones: action.promptParams.targetZones,
                            };
                        }
                    }
                    if (!skipPrompt) {
                        this_1.state = __assign(__assign({}, this_1.state), { savedActions: savedActions, 
                            // This will be the only action to fire after entering the prompt
                            actions: [this_1.convertPromptActionToEffect(action)] });
                    }
                    break;
                }
                case ACTION_EXIT_PROMPTS: {
                    this_1.state = __assign(__assign({}, this_1.state), { actions: [], savedActions: [], mayEffectActions: [], fallbackActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign({}, this_1.state.spellMetaData) });
                    break;
                }
                case ACTION_RESOLVE_PROMPT: {
                    if (this_1.state.promptType === PROMPT_TYPE_MAY_ABILITY) {
                        var mayEffectActions = this_1.state.mayEffectActions || [];
                        var fallbackActions = this_1.state.fallbackActions || [];
                        var savedActions = this_1.state.savedActions || [];
                        var actions = action.useEffect ? __spreadArray(__spreadArray([], mayEffectActions, true), savedActions, true) : __spreadArray(__spreadArray([], fallbackActions, true), savedActions, true);
                        this_1.state = __assign(__assign({}, this_1.state), { actions: actions, savedActions: [], mayEffectActions: [], fallbackActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign({}, this_1.state.spellMetaData) });
                    }
                    else {
                        var generatedBy = action.generatedBy || this_1.state.promptGeneratedBy || this_1.nanoid();
                        var variable = action.variable || this_1.state.promptVariable;
                        var currentActionMetaData = this_1.state.spellMetaData[generatedBy] || {};
                        switch (this_1.state.promptType) {
                            case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                                if ('cards' in action && action.cards) {
                                    if (this_1.state.promptParams.numberOfCards !== action.cards.length) {
                                        return { value: false };
                                    }
                                    if (this_1.state.promptParams.restrictions) {
                                        var checkResult = this_1.state.promptParams.restrictions.every(function (_a) {
                                            var type = _a.type, value = _a.value;
                                            return _this.checkCardsForRestriction(action.cards, type, value);
                                        });
                                        if (!checkResult) {
                                            return { value: false };
                                        }
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                                if ('cards' in action && action.cards) {
                                    if (this_1.state.promptParams && this_1.state.promptParams.cards && this_1.state.promptParams.cards.length !== action.cards.length) {
                                        console.error('Number of cards is wrong');
                                        return { value: false };
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                                if ('cards' in action && action.cards) {
                                    var totalCards = Object.values(action.cards).flat();
                                    if (this_1.state.promptParams && this_1.state.promptParams.cards && this_1.state.promptParams.cards.length !== totalCards.length) {
                                        console.error('Number of cards is wrong');
                                        return { value: false };
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
                                }
                            }
                            case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                                if ('cards' in action && action.cards) {
                                    var expectedNumber = ((_b = (_a = this_1.state) === null || _a === void 0 ? void 0 : _a.promptParams) === null || _b === void 0 ? void 0 : _b.numberOfCards) || 0;
                                    if (action.cards.length > expectedNumber) {
                                        return { value: false };
                                    }
                                    if (this_1.state.promptParams.restrictions) {
                                        var checkResult = this_1.state.promptParams.restrictions.every(function (_a) {
                                            var type = _a.type, value = _a.value;
                                            return _this.checkCardsForRestriction(action.cards, type, value);
                                        });
                                        if (!checkResult) {
                                            return { value: false };
                                        }
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case PROMPT_TYPE_NUMBER:
                                if ('number' in action) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_NUMBER]] = (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10);
                                }
                                break;
                            case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
                                if ('target' in action && action.target && ((_d = (_c = this_1.state) === null || _c === void 0 ? void 0 : _c.promptParams) === null || _d === void 0 ? void 0 : _d.source)) {
                                    if (this_1.state.promptParams.source.id === ((_e = action.target) === null || _e === void 0 ? void 0 : _e.id)) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE]] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_RELIC: {
                                if ('target' in action) {
                                    if (((_f = action.target) === null || _f === void 0 ? void 0 : _f.card.type) !== TYPE_RELIC) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_RELIC]] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                                if ('target' in action && action.target) {
                                    var targetController = this_1.modifyByStaticAbilities(action.target, PROPERTY_CONTROLLER);
                                    if (this_1.state.promptPlayer !== targetController) {
                                        throw new Error('Not-controlled creature supplied to Own Creatures prompt');
                                    }
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_OWN_SINGLE_CREATURE]] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE_FILTERED]] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                                if ('target' in action && ((_g = action.target) === null || _g === void 0 ? void 0 : _g.card.type) === TYPE_MAGI && this_1.useSelector(SELECTOR_CREATURES_OF_PLAYER, action.target.data.controller).length == 0) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_MAGI_WITHOUT_CREATURES]] = action.target;
                                    break;
                                }
                            }
                            case PROMPT_TYPE_SINGLE_CREATURE:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE]] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI]] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_SINGLE_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_MAGI]] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_CHOOSE_CARDS:
                                if ('cards' in action) {
                                    // Should be a check against promptParams.availableCards
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_CARDS]] = action.cards || [];
                                }
                                break;
                            case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
                                }
                                break;
                            case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    var totalEnergy = Object.values(action.energyOnCreatures).reduce(function (a, b) { return a + b; }, 0);
                                    if (totalEnergy === this_1.state.promptParams.amount) {
                                        currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                                if ('damageOnCreatures' in action) {
                                    var totalDamage = Object.values(action.damageOnCreatures).reduce(function (a, b) { return a + b; }, 0);
                                    if (totalDamage === this_1.state.promptParams.amount) {
                                        currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]] = action.damageOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case PROMPT_TYPE_PLAYER: {
                                if ('targetPlayer' in action) {
                                    if (this_1.players.includes(action.targetPlayer)) {
                                        currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_PLAYER]] = action.targetPlayer;
                                    }
                                    else {
                                        console.error("Unknown player: ".concat(action.targetPlayer, " in PROMPT_TYPE_PLAYER prompt resolution"));
                                    }
                                }
                                else {
                                    console.error('No player in PROMPT_TYPE_PLAYER prompt resolution');
                                }
                                break;
                            }
                            case PROMPT_TYPE_POWER_ON_MAGI: {
                                if ('power' in action && 'source' in action) {
                                    var source = this_1.getMetaValue(action.source, action.generatedBy);
                                    var power_1 = this_1.getMetaValue(action.power, action.generatedBy);
                                    if (source && power_1 && source.card.data.powers && source.card.data.powers.some(function (p) { return p.name === power_1.name; })) {
                                        currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_POWER_ON_MAGI]] = action.power;
                                    }
                                    else {
                                        console.error("Unknown power: ".concat(power_1.name || power_1, " in PROMPT_TYPE_POWER_ON_MAGI prompt resolution"));
                                    }
                                }
                                else {
                                    console.error('No power or source in PROMPT_TYPE_POWER_ON_MAGI prompt resolution');
                                }
                                break;
                            }
                            case PROMPT_TYPE_ALTERNATIVE: {
                                if ('alternative' in action) {
                                    currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ALTERNATIVE]] = action.alternative;
                                }
                            }
                            case PROMPT_TYPE_PAYMENT_SOURCE: {
                                if ('target' in action && action.target && this_1.state.promptParams.paymentType && this_1.state.promptParams.paymentAmount) {
                                    var paymentSource = action.target;
                                    if (paymentSource.card.type === TYPE_MAGI ||
                                        (paymentSource.card.type === TYPE_CREATURE && ((_h = paymentSource.card.data.paymentSource) === null || _h === void 0 ? void 0 : _h.includes(this_1.state.promptParams.paymentType)))) {
                                        if (paymentSource.data.energy >= this_1.state.promptParams.paymentAmount) {
                                            currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ALTERNATIVE]] = action.target;
                                        }
                                        else {
                                            console.error("This payment target doesn't have enough energy to pay for that");
                                        }
                                    }
                                    else {
                                        console.error("You cannot pay for ".concat(this_1.state.promptParams.paymentType, " from this"));
                                    }
                                }
                            }
                        }
                        var actions = this_1.state.savedActions || [];
                        this_1.state = __assign(__assign({}, this_1.state), { actions: actions, savedActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign(__assign({}, this_1.state.spellMetaData), (_l = {}, _l[generatedBy] = currentActionMetaData, _l)) });
                    }
                    break;
                }
                case ACTION_SELECT: {
                    var result = void 0;
                    switch (action.selector) {
                        case SELECTOR_OWN_CARDS_IN_PLAY: {
                            result = this_1.useSelector(SELECTOR_OWN_CARDS_IN_PLAY, action.player || 0);
                            break;
                        }
                        case SELECTOR_OWN_CREATURES_OF_TYPE: {
                            result = this_1.useSelector(SELECTOR_OWN_CREATURES_OF_TYPE, action.player || 0, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CREATURES_OF_TYPE: {
                            result = this_1.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CREATURES_NOT_OF_TYPE: {
                            result = this_1.useSelector(SELECTOR_CREATURES_NOT_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                            result = this_1.useSelector(SELECTOR_CARDS_WITH_ENERGIZE_RATE, null);
                            break;
                        }
                        case SELECTOR_OPPONENT_ID: {
                            result = this_1.useSelector(SELECTOR_OPPONENT_ID, action.player || 0, this_1.getMetaValue(action.opponentOf || action.player, action.generatedBy));
                            break;
                        }
                        case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                            result = this_1.useSelector(SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player || 0);
                            break;
                        }
                        case SELECTOR_CREATURES_AND_MAGI: {
                            var ownMagi = this_1.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
                            var creatures = this_1.useSelector(SELECTOR_CREATURES, null);
                            result = __spreadArray(__spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true), (creatures instanceof Array ? creatures : []), true);
                            break;
                        }
                        case SELECTOR_CREATURES_OF_REGION: {
                            result = this_1.useSelector(SELECTOR_CREATURES_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case SELECTOR_CREATURES_NOT_OF_REGION: {
                            result = this_1.useSelector(SELECTOR_CREATURES_NOT_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case SELECTOR_OTHER_CREATURES_OF_TYPE: {
                            var creatures = this_1.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            result = (creatures instanceof Array) ? creatures.filter(function (card) { return card.id !== action.generatedBy; }) : [];
                            break;
                        }
                        case SELECTOR_MAGI_OF_REGION: {
                            var ownMagi = this_1.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = __spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true).filter(function (magi) { return _this.modifyByStaticAbilities(magi, PROPERTY_REGION) === action.region; });
                            break;
                        }
                        case SELECTOR_MAGI_NOT_OF_REGION: {
                            var ownMagi = this_1.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = __spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true).filter(function (magi) { return _this.modifyByStaticAbilities(magi, PROPERTY_REGION) != action.region; });
                            break;
                        }
                        case SELECTOR_STATUS: {
                            result = this_1.useSelector(SELECTOR_STATUS, null, action.status);
                            break;
                        }
                        case SELECTOR_CREATURES_WITHOUT_STATUS: {
                            result = this_1.useSelector(SELECTOR_CREATURES_WITHOUT_STATUS, null, action.status);
                            break;
                        }
                        case SELECTOR_NTH_CARD_OF_ZONE: {
                            var zoneOwner = this_1.getMetaValue(action.zoneOwner, action.generatedBy);
                            var zoneType = this_1.getMetaValue(action.zone, action.generatedBy);
                            var cardNumber = this_1.getMetaValue(action.cardNumber, action.generatedBy);
                            result = this_1.selectNthCardOfZone(zoneOwner, zoneType, cardNumber, action.restrictions);
                            break;
                        }
                        case SELECTOR_RANDOM_CARD_IN_HAND: {
                            var zoneOwner = this_1.getMetaValue(action.zoneOwner, action.generatedBy);
                            result = this_1.selectRandomCardOfZone(zoneOwner, ZONE_TYPE_HAND);
                            break;
                        }
                        case SELECTOR_MAGI_OF_PLAYER: {
                            var owner = this_1.getMetaValue(action.owner, action.generatedBy);
                            result = this_1.useSelector(SELECTOR_OWN_MAGI, owner);
                            break;
                        }
                        case SELECTOR_OWN_CARDS_IN_HAND: {
                            if ('player' in action && typeof action.player == 'number') {
                                var zoneOwner = this_1.getMetaValue(action.player, action.generatedBy);
                                result = this_1.getZone(ZONE_TYPE_HAND, zoneOwner).cards;
                            }
                            else {
                                result = [];
                            }
                            break;
                        }
                        case SELECTOR_CARDS_IN_HAND: {
                            if ('zoneOwner' in action) {
                                var zoneOwner = this_1.getMetaValue(action.zoneOwner, action.generatedBy);
                                result = this_1.getZone(ZONE_TYPE_HAND, zoneOwner).cards;
                            }
                            else {
                                result = [];
                            }
                            break;
                        }
                        // This selector is special
                        // If there are more than one creature with the same (least) energy, it transforms into the corresponding prompt
                        case SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY: {
                            var creatures = this_1.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                                return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == action.player &&
                                    card.card.type == TYPE_CREATURE;
                            });
                            if (creatures.length) {
                                var energies = {};
                                var minEnergy = Infinity;
                                for (var _i = 0, creatures_1 = creatures; _i < creatures_1.length; _i++) {
                                    var creature = creatures_1[_i];
                                    var energy = creature.data.energy;
                                    if (!(energy in energies)) {
                                        energies[energy] = [];
                                    }
                                    energies[energy].push(creature);
                                    if (creature.data.energy < minEnergy) {
                                        minEnergy = creature.data.energy;
                                    }
                                }
                                if (energies[minEnergy].length == 1) {
                                    result = energies[minEnergy];
                                }
                                else {
                                    result = [];
                                    this_1.transformIntoActions({
                                        type: ACTION_ENTER_PROMPT,
                                        promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        promptParams: {
                                            restrictions: [{
                                                    type: RESTRICTION_OWN_CREATURE,
                                                    value: '',
                                                }, {
                                                    type: RESTRICTION_ENERGY_EQUALS,
                                                    value: minEnergy,
                                                }],
                                        },
                                        variable: action.variable || 'selected',
                                        generatedBy: action.generatedBy,
                                        player: action.player,
                                    });
                                }
                            }
                            else {
                                result = [];
                            }
                            break;
                        }
                        default: {
                            // @ts-ignore
                            result = this_1.useSelector(action.selector, action.player);
                        }
                    }
                    var variable = action.variable || 'selected';
                    this_1.setSpellMetaDataField(variable, result, action.generatedBy || this_1.nanoid());
                    break;
                }
                case ACTION_PASS: {
                    if (this_1.state.step === null) {
                        // Null-start
                        this_1.transformIntoActions({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_START_TURN,
                            player: this_1.state.activePlayer,
                            generatedBy: this_1.nanoid(),
                        });
                    }
                    else {
                        if (action.player === this_1.state.activePlayer) {
                            newStep = (this_1.state.step + 1) % steps.length;
                            if (newStep === 0) {
                                this_1.stopTurnTimer();
                                this_1.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_END_OF_TURN,
                                    player: this_1.state.activePlayer,
                                    generatedBy: this_1.nanoid(),
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_START_TURN,
                                    player: this_1.getOpponent(this_1.state.activePlayer),
                                    generatedBy: this_1.nanoid(),
                                });
                            }
                            else {
                                this_1.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_START_STEP,
                                    player: this_1.state.activePlayer,
                                    step: newStep,
                                    generatedBy: this_1.nanoid(),
                                });
                            }
                        }
                    }
                    break;
                }
                case ACTION_PLAY: {
                    var castCards = ('card' in action) ? this_1.getMetaValue(action.card, action.generatedBy) : null;
                    var castCard = castCards ? (castCards.length ? castCards[0] : castCards) : null;
                    var player_1 = ('payload' in action) ? action.payload.player : action.player || 0;
                    var cardItself_1 = ('payload' in action) ? action.payload.card : castCard;
                    if (!cardItself_1) {
                        throw new Error('No card itself found');
                    }
                    var playerHand = this_1.getZone(ZONE_TYPE_HAND, player_1);
                    var cardInHand = playerHand.containsId((cardItself_1 === null || cardItself_1 === void 0 ? void 0 : cardItself_1.id) || '');
                    // baseCard is "abstract" card, CardInPlay is concrete instance
                    var baseCard_1 = ('payload' in action) ? action.payload.card.card : castCard === null || castCard === void 0 ? void 0 : castCard.card;
                    if (cardInHand && baseCard_1) {
                        var currentPriority = this_1.getCurrentPriority();
                        var cardType = baseCard_1.type;
                        if ((cardType == TYPE_CREATURE && currentPriority == PRIORITY_CREATURES) ||
                            (cardType == TYPE_RELIC && currentPriority == PRIORITY_PRS) ||
                            (cardType == TYPE_SPELL && currentPriority == PRIORITY_PRS) ||
                            action.forcePriority) {
                            var activeMagi = this_1.getZone(ZONE_TYPE_ACTIVE_MAGI, player_1).card;
                            if (!activeMagi) {
                                throw new Error('Trying to play a card without Magi');
                            }
                            var totalCost_1 = this_1.calculateTotalCost(cardItself_1);
                            switch (cardType) {
                                case TYPE_CREATURE: {
                                    var alternativePaymentSources = this_1.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.data.paymentSource && card.card.data.paymentSource.includes(TYPE_CREATURE) && _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player_1; });
                                    var alternativePaymentSourcesAbleToPay = alternativePaymentSources.filter(function (card) { return card.data.energy >= totalCost_1; });
                                    if (activeMagi.data.energy >= totalCost_1 || alternativePaymentSourcesAbleToPay.length > 0) {
                                        var availablePaymentSources = __spreadArray(__spreadArray([], alternativePaymentSourcesAbleToPay, true), [
                                            activeMagi.data.energy >= totalCost_1 ? activeMagi : undefined
                                        ], false).filter(function (card) { return card instanceof CardInGame; });
                                        var paymentActions = availablePaymentSources.length == 1 ? [{
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                                from: availablePaymentSources[0],
                                                amount: totalCost_1,
                                                player: player_1,
                                                generatedBy: cardItself_1.id,
                                            }] : [{
                                                type: ACTION_ENTER_PROMPT,
                                                promptType: PROMPT_TYPE_PAYMENT_SOURCE,
                                                promptParams: {
                                                    amount: totalCost_1,
                                                    paymentType: TYPE_CREATURE,
                                                    cards: availablePaymentSources,
                                                },
                                                variable: 'paymentSource',
                                                player: player_1,
                                                generatedBy: cardItself_1.id,
                                            }, {
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                                from: '$paymentSource',
                                                amount: totalCost_1,
                                                player: player_1,
                                                generatedBy: cardItself_1.id,
                                            }];
                                        this_1.transformIntoActions.apply(this_1, __spreadArray(__spreadArray([], paymentActions, false), [{
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_PLAY_CREATURE,
                                                card: cardItself_1,
                                                player: player_1,
                                                generatedBy: cardItself_1.id,
                                            },
                                            {
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                                                target: '$creature_created',
                                                player: player_1,
                                                generatedBy: cardItself_1.id,
                                            },
                                            {
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                                                target: '$creature_created',
                                                player: player_1,
                                                amount: (baseCard_1.cost === COST_X || baseCard_1.cost === COST_X_PLUS_ONE || baseCard_1.cost === null) ? 0 : baseCard_1.cost,
                                                generatedBy: cardItself_1.id,
                                            },
                                            {
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_PLAY_FINISHED,
                                                generatedBy: cardItself_1.id,
                                            }], false));
                                    }
                                    break;
                                }
                                case TYPE_RELIC: {
                                    var alreadyHasOne = this_1.getZone(ZONE_TYPE_IN_PLAY).cards
                                        .some(function (card) { return card.data.controller === player_1 && card.card.name === baseCard_1.name; });
                                    var relicRegion = baseCard_1.region;
                                    var magiRegion = activeMagi.card.region;
                                    var regionAllows = relicRegion === magiRegion || relicRegion === REGION_UNIVERSAL;
                                    if (!alreadyHasOne && regionAllows && typeof baseCard_1.cost == 'number' && activeMagi.data.energy >= baseCard_1.cost) {
                                        this_1.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
                                            from: activeMagi,
                                            amount: totalCost_1,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PLAY_RELIC,
                                            card: cardItself_1,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_RELIC_ENTERS_PLAY,
                                            card: '$relic_created',
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PLAY_FINISHED,
                                            generatedBy: cardItself_1.id,
                                        });
                                    }
                                    break;
                                }
                                case TYPE_SPELL: {
                                    if (activeMagi.data.energy >= totalCost_1 || baseCard_1.cost === COST_X || baseCard_1.cost === COST_X_PLUS_ONE) {
                                        var enrichAction = function (effect) { return (__assign(__assign({ source: cardItself_1, player: player_1 }, effect), { spell: true, generatedBy: cardItself_1.id })); };
                                        var preparedEffects = ((_k = (_j = baseCard_1.data) === null || _j === void 0 ? void 0 : _j.effects) === null || _k === void 0 ? void 0 : _k.map(enrichAction)) || [];
                                        var testablePrompts_1 = [
                                            PROMPT_TYPE_SINGLE_CREATURE,
                                            PROMPT_TYPE_RELIC,
                                            PROMPT_TYPE_OWN_SINGLE_CREATURE,
                                            PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        ];
                                        var testablePromptFilter = function (action) {
                                            return action.type === ACTION_ENTER_PROMPT && testablePrompts_1.includes(action.promptType);
                                        };
                                        var allPrompts = preparedEffects.filter(testablePromptFilter);
                                        var allPromptsAreDoable = allPrompts.every(function (promptAction) {
                                            switch (promptAction.promptType) {
                                                case PROMPT_TYPE_SINGLE_CREATURE:
                                                    return _this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.card.type === TYPE_CREATURE; });
                                                case PROMPT_TYPE_RELIC:
                                                    return _this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.card.type === TYPE_RELIC; });
                                                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                                                    return _this.getZone(ZONE_TYPE_IN_PLAY).cards.some(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === promptAction.player; });
                                                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                                    if ('restrictions' in promptAction.promptParams) {
                                                        return promptAction.promptParams.restrictions.every(function (_a) {
                                                            var type = _a.type, value = _a.value;
                                                            return _this.checkAnyCardForRestriction(_this.getZone(ZONE_TYPE_IN_PLAY).cards, type, value);
                                                        });
                                                    }
                                                    else if ('restriction' in promptAction.promptParams) {
                                                        return _this.checkAnyCardForRestriction(_this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === TYPE_CREATURE; }), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                                                    }
                                                    return true;
                                                }
                                                default:
                                                    return true;
                                            }
                                        });
                                        if (allPromptsAreDoable) {
                                            var regionPenalty = (activeMagi.card.region == baseCard_1.region || baseCard_1.region == REGION_UNIVERSAL) ? 0 : 1;
                                            var maxCost = baseCard_1.data.maxCostX || Infinity;
                                            var payEffects = (baseCard_1.cost === COST_X || baseCard_1.cost === COST_X_PLUS_ONE) ? [
                                                {
                                                    type: ACTION_ENTER_PROMPT,
                                                    promptType: PROMPT_TYPE_NUMBER,
                                                    player: player_1,
                                                    promptParams: {
                                                        min: 1,
                                                        max: Math.min(activeMagi.data.energy, maxCost) - regionPenalty - (baseCard_1.cost === COST_X_PLUS_ONE ? 1 : 0),
                                                    },
                                                    variable: 'chosen_cost',
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: ACTION_CALCULATE,
                                                    operandOne: 'chosen_cost',
                                                    operandTwo: regionPenalty + (baseCard_1.cost === COST_X_PLUS_ONE ? 1 : 0),
                                                    operator: CALCULATION_ADD,
                                                    variable: 'totalCost',
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: '$totalCost',
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }
                                            ] : [{
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: totalCost_1,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }
                                            ];
                                            this_1.transformIntoActions.apply(this_1, __spreadArray(__spreadArray(__spreadArray(__spreadArray([{
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PLAY_SPELL,
                                                    card: cardItself_1,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: ACTION_CALCULATE,
                                                    operator: CALCULATION_SET,
                                                    operandOne: player_1,
                                                    variable: 'player',
                                                    generatedBy: cardItself_1.id,
                                                }], payEffects, false), [{
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                    target: cardItself_1,
                                                    bottom: false,
                                                    sourceZone: ZONE_TYPE_HAND,
                                                    destinationZone: ZONE_TYPE_DISCARD,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }], false), preparedEffects, false), [{
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PLAY_FINISHED,
                                                    generatedBy: cardItself_1.id,
                                                }], false));
                                            var currentMetaData = {
                                                source: cardItself_1,
                                            };
                                            this_1.setSpellMetadata(currentMetaData, cardItself_1.id);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            console.error("Wrong Priority: current is ".concat(currentPriority, " (step ").concat(this_1.getCurrentStep(), ", type is ").concat(cardType, ")"));
                        }
                    }
                    else {
                        console.error('No card to play');
                    }
                    break;
                }
                case ACTION_EFFECT: {
                    if (action.effectType in actionMap) {
                        var transform = this_1.transformIntoActions.bind(this_1);
                        var actionTransformer = actionMap[action.effectType];
                        actionTransformer.call(this_1, action, transform, this_1.state, this_1.nanoid);
                    }
                    break;
                }
            } // switch (action.type)
        };
        var this_1 = this, newStep;
        while (this.hasActions()) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        } // while(this.hasActions())
        // SBA for Magi losing
        if (!this.state.prompt) {
            var sbActions_1 = [];
            this.players.forEach(function (player) {
                if (_this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).length === 1) {
                    var magi = _this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
                    if (!magi) {
                        throw new Error('Trying to defeat missing Magi');
                    }
                    var creatures = _this.useSelector(SELECTOR_OWN_CREATURES, player);
                    if (magi.data.energy === 0 && creatures instanceof Array && creatures.length === 0) {
                        sbActions_1.push({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
                            source: null,
                            target: magi,
                            generatedBy: 'thegame', //nanoid(),
                            player: player,
                        });
                    }
                }
            });
            if (sbActions_1.length > 0) {
                this.addActions.apply(this, sbActions_1);
                this.update({
                    type: ACTION_NONE,
                });
            }
        }
        return true;
    };
    return State;
}());
export { State };
export { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, CALCULATION_MULTIPLY, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, };
//# sourceMappingURL=index.js.map