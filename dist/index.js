"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTOR_OWN_CARDS_IN_PLAY = exports.SELECTOR_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_MAGI_NOT_OF_REGION = exports.SELECTOR_OPPONENT_ID = exports.SELECTOR_MAGI_OF_REGION = exports.SELECTOR_TOP_MAGI_OF_PILE = exports.SELECTOR_ENEMY_CREATURES = exports.SELECTOR_OWN_CREATURES = exports.SELECTOR_CREATURES_NOT_OF_REGION = exports.SELECTOR_CREATURES_OF_REGION = exports.SELECTOR_ENEMY_MAGI = exports.SELECTOR_OWN_MAGI = exports.SELECTOR_CREATURES_AND_MAGI = exports.SELECTOR_CREATURES = exports.CALCULATION_MULTIPLY = exports.CALCULATION_MAX = exports.CALCULATION_MIN = exports.CALCULATION_HALVE_ROUND_UP = exports.CALCULATION_HALVE_ROUND_DOWN = exports.CALCULATION_SUBTRACT = exports.CALCULATION_ADD = exports.CALCULATION_DOUBLE = exports.CALCULATION_SET = exports.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = exports.PROPERTY_ATTACKS_PER_TURN = exports.PROPERTY_MAGI_STARTING_ENERGY = exports.PROPERTY_ENERGIZE = exports.PROPERTY_COST = exports.PROPERTY_REGION = exports.PROPERTY_ENERGY_COUNT = exports.PROPERTY_CONTROLLER = exports.PROPERTY_TYPE = exports.PROPERTY_ID = exports.ACTION_PLAYER_WINS = exports.ACTION_ATTACK = exports.ACTION_GET_PROPERTY_VALUE = exports.ACTION_RESOLVE_PROMPT = exports.ACTION_ENTER_PROMPT = exports.ACTION_CALCULATE = exports.ACTION_SELECT = exports.ACTION_EFFECT = exports.ACTION_POWER = exports.ACTION_PLAY = exports.ACTION_PASS = exports.TYPE_SPELL = exports.TYPE_RELIC = exports.TYPE_MAGI = exports.TYPE_CREATURE = exports.State = void 0;
exports.COST_X = exports.REGION_UNIVERSAL = exports.EFFECT_TYPE_DRAW_REST_OF_CARDS = exports.EFFECT_TYPE_FIND_STARTING_CARDS = exports.EFFECT_TYPE_MAGI_FLIPPED = exports.EFFECT_TYPE_END_OF_TURN = exports.EFFECT_TYPE_START_OF_TURN = exports.EFFECT_TYPE_CREATURE_IS_ATTACKED = exports.EFFECT_TYPE_CREATURE_ATTACKS = exports.EFFECT_TYPE_AFTER_DAMAGE = exports.EFFECT_TYPE_DEAL_DAMAGE = exports.EFFECT_TYPE_BEFORE_DAMAGE = exports.EFFECT_TYPE_CREATURE_IS_DEFEATED = exports.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = exports.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = exports.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = exports.EFFECT_TYPE_ENERGIZE = exports.EFFECT_TYPE_ADD_ENERGY_TO_MAGI = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = exports.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = exports.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = exports.EFFECT_TYPE_MAGI_IS_DEFEATED = exports.EFFECT_TYPE_RELIC_ENTERS_PLAY = exports.EFFECT_TYPE_CREATURE_ENTERS_PLAY = exports.EFFECT_TYPE_PLAY_SPELL = exports.EFFECT_TYPE_PLAY_RELIC = exports.EFFECT_TYPE_PLAY_CREATURE = exports.EFFECT_TYPE_ROLL_DIE = exports.EFFECT_TYPE_MOVE_ENERGY = exports.EFFECT_TYPE_RESHUFFLE_DISCARD = exports.EFFECT_TYPE_DRAW = exports.PROMPT_TYPE_CHOOSE_CARDS = exports.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = exports.PROMPT_TYPE_SINGLE_MAGI = exports.PROMPT_TYPE_SINGLE_CREATURE = exports.PROMPT_TYPE_NUMBER = exports.PRIORITY_CREATURES = exports.PRIORITY_ATTACK = exports.PRIORITY_PRS = exports.NO_PRIORITY = void 0;
exports.ZONE_TYPE_DEFEATED_MAGI = exports.ZONE_TYPE_DECK = exports.ZONE_TYPE_MAGI_PILE = exports.ZONE_TYPE_ACTIVE_MAGI = exports.ZONE_TYPE_DISCARD = exports.ZONE_TYPE_IN_PLAY = exports.ZONE_TYPE_HAND = exports.COST_X_PLUS_ONE = void 0;
var stream_1 = require("stream");
var events_1 = __importDefault(require("events"));
var nanoid_1 = __importDefault(require("nanoid"));
var const_1 = require("./const");
Object.defineProperty(exports, "TYPE_CREATURE", { enumerable: true, get: function () { return const_1.TYPE_CREATURE; } });
Object.defineProperty(exports, "TYPE_MAGI", { enumerable: true, get: function () { return const_1.TYPE_MAGI; } });
Object.defineProperty(exports, "TYPE_RELIC", { enumerable: true, get: function () { return const_1.TYPE_RELIC; } });
Object.defineProperty(exports, "TYPE_SPELL", { enumerable: true, get: function () { return const_1.TYPE_SPELL; } });
Object.defineProperty(exports, "ACTION_PASS", { enumerable: true, get: function () { return const_1.ACTION_PASS; } });
Object.defineProperty(exports, "ACTION_PLAY", { enumerable: true, get: function () { return const_1.ACTION_PLAY; } });
Object.defineProperty(exports, "ACTION_POWER", { enumerable: true, get: function () { return const_1.ACTION_POWER; } });
Object.defineProperty(exports, "ACTION_EFFECT", { enumerable: true, get: function () { return const_1.ACTION_EFFECT; } });
Object.defineProperty(exports, "ACTION_SELECT", { enumerable: true, get: function () { return const_1.ACTION_SELECT; } });
Object.defineProperty(exports, "ACTION_CALCULATE", { enumerable: true, get: function () { return const_1.ACTION_CALCULATE; } });
Object.defineProperty(exports, "ACTION_ENTER_PROMPT", { enumerable: true, get: function () { return const_1.ACTION_ENTER_PROMPT; } });
Object.defineProperty(exports, "ACTION_RESOLVE_PROMPT", { enumerable: true, get: function () { return const_1.ACTION_RESOLVE_PROMPT; } });
Object.defineProperty(exports, "ACTION_GET_PROPERTY_VALUE", { enumerable: true, get: function () { return const_1.ACTION_GET_PROPERTY_VALUE; } });
Object.defineProperty(exports, "ACTION_ATTACK", { enumerable: true, get: function () { return const_1.ACTION_ATTACK; } });
Object.defineProperty(exports, "ACTION_PLAYER_WINS", { enumerable: true, get: function () { return const_1.ACTION_PLAYER_WINS; } });
Object.defineProperty(exports, "PROPERTY_ID", { enumerable: true, get: function () { return const_1.PROPERTY_ID; } });
Object.defineProperty(exports, "PROPERTY_TYPE", { enumerable: true, get: function () { return const_1.PROPERTY_TYPE; } });
Object.defineProperty(exports, "PROPERTY_CONTROLLER", { enumerable: true, get: function () { return const_1.PROPERTY_CONTROLLER; } });
Object.defineProperty(exports, "PROPERTY_ENERGY_COUNT", { enumerable: true, get: function () { return const_1.PROPERTY_ENERGY_COUNT; } });
Object.defineProperty(exports, "PROPERTY_REGION", { enumerable: true, get: function () { return const_1.PROPERTY_REGION; } });
Object.defineProperty(exports, "PROPERTY_COST", { enumerable: true, get: function () { return const_1.PROPERTY_COST; } });
Object.defineProperty(exports, "PROPERTY_ENERGIZE", { enumerable: true, get: function () { return const_1.PROPERTY_ENERGIZE; } });
Object.defineProperty(exports, "PROPERTY_MAGI_STARTING_ENERGY", { enumerable: true, get: function () { return const_1.PROPERTY_MAGI_STARTING_ENERGY; } });
Object.defineProperty(exports, "PROPERTY_ATTACKS_PER_TURN", { enumerable: true, get: function () { return const_1.PROPERTY_ATTACKS_PER_TURN; } });
Object.defineProperty(exports, "PROPERTY_CAN_ATTACK_MAGI_DIRECTLY", { enumerable: true, get: function () { return const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY; } });
Object.defineProperty(exports, "CALCULATION_SET", { enumerable: true, get: function () { return const_1.CALCULATION_SET; } });
Object.defineProperty(exports, "CALCULATION_DOUBLE", { enumerable: true, get: function () { return const_1.CALCULATION_DOUBLE; } });
Object.defineProperty(exports, "CALCULATION_ADD", { enumerable: true, get: function () { return const_1.CALCULATION_ADD; } });
Object.defineProperty(exports, "CALCULATION_SUBTRACT", { enumerable: true, get: function () { return const_1.CALCULATION_SUBTRACT; } });
Object.defineProperty(exports, "CALCULATION_HALVE_ROUND_DOWN", { enumerable: true, get: function () { return const_1.CALCULATION_HALVE_ROUND_DOWN; } });
Object.defineProperty(exports, "CALCULATION_HALVE_ROUND_UP", { enumerable: true, get: function () { return const_1.CALCULATION_HALVE_ROUND_UP; } });
Object.defineProperty(exports, "CALCULATION_MIN", { enumerable: true, get: function () { return const_1.CALCULATION_MIN; } });
Object.defineProperty(exports, "CALCULATION_MAX", { enumerable: true, get: function () { return const_1.CALCULATION_MAX; } });
Object.defineProperty(exports, "SELECTOR_CREATURES", { enumerable: true, get: function () { return const_1.SELECTOR_CREATURES; } });
Object.defineProperty(exports, "SELECTOR_CREATURES_AND_MAGI", { enumerable: true, get: function () { return const_1.SELECTOR_CREATURES_AND_MAGI; } });
Object.defineProperty(exports, "SELECTOR_OWN_MAGI", { enumerable: true, get: function () { return const_1.SELECTOR_OWN_MAGI; } });
Object.defineProperty(exports, "SELECTOR_ENEMY_MAGI", { enumerable: true, get: function () { return const_1.SELECTOR_ENEMY_MAGI; } });
Object.defineProperty(exports, "SELECTOR_CREATURES_OF_REGION", { enumerable: true, get: function () { return const_1.SELECTOR_CREATURES_OF_REGION; } });
Object.defineProperty(exports, "SELECTOR_CREATURES_NOT_OF_REGION", { enumerable: true, get: function () { return const_1.SELECTOR_CREATURES_NOT_OF_REGION; } });
Object.defineProperty(exports, "SELECTOR_OWN_CREATURES", { enumerable: true, get: function () { return const_1.SELECTOR_OWN_CREATURES; } });
Object.defineProperty(exports, "SELECTOR_ENEMY_CREATURES", { enumerable: true, get: function () { return const_1.SELECTOR_ENEMY_CREATURES; } });
Object.defineProperty(exports, "SELECTOR_TOP_MAGI_OF_PILE", { enumerable: true, get: function () { return const_1.SELECTOR_TOP_MAGI_OF_PILE; } });
Object.defineProperty(exports, "SELECTOR_MAGI_OF_REGION", { enumerable: true, get: function () { return const_1.SELECTOR_MAGI_OF_REGION; } });
Object.defineProperty(exports, "SELECTOR_OPPONENT_ID", { enumerable: true, get: function () { return const_1.SELECTOR_OPPONENT_ID; } });
Object.defineProperty(exports, "SELECTOR_MAGI_NOT_OF_REGION", { enumerable: true, get: function () { return const_1.SELECTOR_MAGI_NOT_OF_REGION; } });
Object.defineProperty(exports, "SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE", { enumerable: true, get: function () { return const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE; } });
Object.defineProperty(exports, "SELECTOR_CARDS_WITH_ENERGIZE_RATE", { enumerable: true, get: function () { return const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE; } });
Object.defineProperty(exports, "SELECTOR_OWN_CARDS_IN_PLAY", { enumerable: true, get: function () { return const_1.SELECTOR_OWN_CARDS_IN_PLAY; } });
Object.defineProperty(exports, "PROMPT_TYPE_NUMBER", { enumerable: true, get: function () { return const_1.PROMPT_TYPE_NUMBER; } });
Object.defineProperty(exports, "PROMPT_TYPE_SINGLE_CREATURE", { enumerable: true, get: function () { return const_1.PROMPT_TYPE_SINGLE_CREATURE; } });
Object.defineProperty(exports, "PROMPT_TYPE_SINGLE_MAGI", { enumerable: true, get: function () { return const_1.PROMPT_TYPE_SINGLE_MAGI; } });
Object.defineProperty(exports, "PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE", { enumerable: true, get: function () { return const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE; } });
Object.defineProperty(exports, "PROMPT_TYPE_CHOOSE_CARDS", { enumerable: true, get: function () { return const_1.PROMPT_TYPE_CHOOSE_CARDS; } });
Object.defineProperty(exports, "NO_PRIORITY", { enumerable: true, get: function () { return const_1.NO_PRIORITY; } });
Object.defineProperty(exports, "PRIORITY_PRS", { enumerable: true, get: function () { return const_1.PRIORITY_PRS; } });
Object.defineProperty(exports, "PRIORITY_ATTACK", { enumerable: true, get: function () { return const_1.PRIORITY_ATTACK; } });
Object.defineProperty(exports, "PRIORITY_CREATURES", { enumerable: true, get: function () { return const_1.PRIORITY_CREATURES; } });
Object.defineProperty(exports, "EFFECT_TYPE_DRAW", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DRAW; } });
Object.defineProperty(exports, "EFFECT_TYPE_RESHUFFLE_DISCARD", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_RESHUFFLE_DISCARD; } });
Object.defineProperty(exports, "EFFECT_TYPE_MOVE_ENERGY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_MOVE_ENERGY; } });
Object.defineProperty(exports, "EFFECT_TYPE_ROLL_DIE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_ROLL_DIE; } });
Object.defineProperty(exports, "EFFECT_TYPE_PLAY_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PLAY_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_PLAY_RELIC", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PLAY_RELIC; } });
Object.defineProperty(exports, "EFFECT_TYPE_PLAY_SPELL", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PLAY_SPELL; } });
Object.defineProperty(exports, "EFFECT_TYPE_CREATURE_ENTERS_PLAY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY; } });
Object.defineProperty(exports, "EFFECT_TYPE_RELIC_ENTERS_PLAY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_RELIC_ENTERS_PLAY; } });
Object.defineProperty(exports, "EFFECT_TYPE_MAGI_IS_DEFEATED", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_MAGI_IS_DEFEATED; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI; } });
Object.defineProperty(exports, "EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC; } });
Object.defineProperty(exports, "EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL; } });
Object.defineProperty(exports, "EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES; } });
Object.defineProperty(exports, "EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI; } });
Object.defineProperty(exports, "EFFECT_TYPE_ADD_ENERGY_TO_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_ADD_ENERGY_TO_MAGI", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI; } });
Object.defineProperty(exports, "EFFECT_TYPE_ENERGIZE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_ENERGIZE; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY; } });
Object.defineProperty(exports, "EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY; } });
Object.defineProperty(exports, "EFFECT_TYPE_PAYING_ENERGY_FOR_POWER", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER; } });
Object.defineProperty(exports, "EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI; } });
Object.defineProperty(exports, "EFFECT_TYPE_CREATURE_DEFEATS_CREATURE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE; } });
Object.defineProperty(exports, "EFFECT_TYPE_CREATURE_IS_DEFEATED", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED; } });
Object.defineProperty(exports, "EFFECT_TYPE_BEFORE_DAMAGE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_BEFORE_DAMAGE; } });
Object.defineProperty(exports, "EFFECT_TYPE_DEAL_DAMAGE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DEAL_DAMAGE; } });
Object.defineProperty(exports, "EFFECT_TYPE_AFTER_DAMAGE", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_AFTER_DAMAGE; } });
Object.defineProperty(exports, "EFFECT_TYPE_CREATURE_ATTACKS", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_CREATURE_ATTACKS; } });
Object.defineProperty(exports, "EFFECT_TYPE_CREATURE_IS_ATTACKED", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_CREATURE_IS_ATTACKED; } });
Object.defineProperty(exports, "EFFECT_TYPE_START_OF_TURN", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_START_OF_TURN; } });
Object.defineProperty(exports, "EFFECT_TYPE_END_OF_TURN", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_END_OF_TURN; } });
Object.defineProperty(exports, "EFFECT_TYPE_MAGI_FLIPPED", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_MAGI_FLIPPED; } });
Object.defineProperty(exports, "EFFECT_TYPE_FIND_STARTING_CARDS", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_FIND_STARTING_CARDS; } });
Object.defineProperty(exports, "EFFECT_TYPE_DRAW_REST_OF_CARDS", { enumerable: true, get: function () { return const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS; } });
Object.defineProperty(exports, "REGION_UNIVERSAL", { enumerable: true, get: function () { return const_1.REGION_UNIVERSAL; } });
Object.defineProperty(exports, "COST_X", { enumerable: true, get: function () { return const_1.COST_X; } });
Object.defineProperty(exports, "COST_X_PLUS_ONE", { enumerable: true, get: function () { return const_1.COST_X_PLUS_ONE; } });
Object.defineProperty(exports, "ZONE_TYPE_HAND", { enumerable: true, get: function () { return const_1.ZONE_TYPE_HAND; } });
Object.defineProperty(exports, "ZONE_TYPE_IN_PLAY", { enumerable: true, get: function () { return const_1.ZONE_TYPE_IN_PLAY; } });
Object.defineProperty(exports, "ZONE_TYPE_DISCARD", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DISCARD; } });
Object.defineProperty(exports, "ZONE_TYPE_ACTIVE_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_ACTIVE_MAGI; } });
Object.defineProperty(exports, "ZONE_TYPE_MAGI_PILE", { enumerable: true, get: function () { return const_1.ZONE_TYPE_MAGI_PILE; } });
Object.defineProperty(exports, "ZONE_TYPE_DECK", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DECK; } });
Object.defineProperty(exports, "ZONE_TYPE_DEFEATED_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DEFEATED_MAGI; } });
Object.defineProperty(exports, "CALCULATION_MULTIPLY", { enumerable: true, get: function () { return const_1.CALCULATION_MULTIPLY; } });
var logAction_1 = require("./logAction");
var clone_1 = __importDefault(require("./clone"));
var cards_1 = require("./cards");
var CardInGame_1 = __importDefault(require("./classes/CardInGame"));
var Zone_1 = __importDefault(require("./classes/Zone"));
var convertCard = function (cardInGame) { return ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
}); };
var steps = [
    {
        name: 'Energize',
        priority: const_1.NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: const_1.ACTION_SELECT,
                selector: const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
                variable: 'energize',
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_ENERGIZE,
                target: '$energize',
            },
        ],
    },
    {
        name: 'Powers/Relics/Spells',
        priority: const_1.PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Attack',
        priority: const_1.PRIORITY_ATTACK,
        automatic: false,
    },
    {
        name: 'Play Dream Creatures',
        priority: const_1.PRIORITY_CREATURES,
        automatic: false,
    },
    {
        name: 'Powers/Relics/Spells',
        priority: const_1.PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Draw',
        priority: const_1.NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
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
        case const_1.EXPIRATION_ANY_TURNS: {
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
        case const_1.EXPIRATION_OPPONENT_TURNS: {
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
        case const_1.EXPIRATION_NEVER: {
            return effect;
        }
    }
}; };
var State = /** @class */ (function () {
    function State(state) {
        var _this = this;
        this.players = [0, 1];
        this.turnTimer = null;
        this.state = __assign(__assign({}, (0, clone_1.default)(defaultState)), state);
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
        this.actionStreamOne = new events_1.default();
        this.actionStreamTwo = new events_1.default();
        this.logStream = new events_1.default();
        this.commandStream = new stream_1.Writable({
            objectMode: true,
            write: function (command) {
                if (Object.prototype.hasOwnProperty.call(command, 'type')) {
                    _this.update(command);
                }
            },
        });
    }
    State.prototype.closeStreams = function () {
        this.actionStreamOne.removeAllListeners();
        this.actionStreamTwo.removeAllListeners();
        this.logStream.removeAllListeners();
        this.commandStream.destroy();
    };
    State.prototype.addActionToStream = function (action) {
        var actionWithValues = this.addValuesToAction(action);
        // Do not send outside CALCULATE, SELECT and so on
        if (![const_1.ACTION_CALCULATE, const_1.ACTION_SELECT, const_1.ACTION_GET_PROPERTY_VALUE].includes(action.type)) {
            this.actionStreamOne.emit('action', actionWithValues);
            this.actionStreamTwo.emit('action', actionWithValues);
        }
        this.logStream.emit('action', actionWithValues);
    };
    State.prototype.addValuesToAction = function (action) {
        var _this = this;
        var _a;
        switch (action.type) {
            case const_1.ACTION_ENTER_PROMPT: {
                switch (action.promptType) {
                    case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                        if (Object.hasOwn(action, 'restrictions') && action.restrictions) {
                            var restrictionsWithValues = action.restrictions.map(function (_a) {
                                var type = _a.type, value = _a.value;
                                return ({
                                    type: type,
                                    value: _this.getMetaValue(value, action.generatedBy),
                                });
                            });
                            return __assign(__assign({}, action), { restrictions: restrictionsWithValues });
                        }
                        else {
                            return __assign(__assign({}, action), { restrictionValue: this.getMetaValue(action.restrictionValue, action.generatedBy) });
                        }
                    }
                }
                return action;
            }
            case const_1.ACTION_EFFECT: {
                switch (action.effectType) {
                    case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return __assign(__assign({}, action), { staticAbilities: (_a = action.staticAbilities) === null || _a === void 0 ? void 0 : _a.map(function (ability) {
                                var _a;
                                return (__assign(__assign({}, ability), { modifier: {
                                        operandOne: _this.getMetaValue(ability.modifier.operandOne, action.generatedBy),
                                        operator: ability.modifier.operator,
                                    }, selectorParameter: ability.selectorParameter ? (_a = _this.getMetaValue(ability.selectorParameter, action.generatedBy)) === null || _a === void 0 ? void 0 : _a.id : null }));
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
        var newObject = new State((0, clone_1.default)(this.state));
        newObject.winner = this.winner;
        newObject.rollDebugValue = this.rollDebugValue;
        newObject.players = this.players;
        newObject.decks = this.decks;
        return newObject;
    };
    State.prototype.setPlayers = function (player1, player2) {
        this.players = [player1, player2];
        return this;
    };
    State.prototype.setDeck = function (player, cardNames) {
        if (this.players.includes(player)) {
            var deck = cardNames.map(function (card) {
                var cardObject = (0, cards_1.byName)(card);
                if (!cardObject) {
                    throw new Error("Unknown card in deck: ".concat(card));
                }
                return new CardInGame_1.default(cardObject, player);
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
                    _this.update({ type: const_1.ACTION_TIME_NOTIFICATION, player: _this.state.activePlayer });
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
        this.update({ type: const_1.ACTION_EXIT_PROMPTS });
        while (this.state.activePlayer === activePlayer) {
            this.update({ type: const_1.ACTION_PASS, player: activePlayer });
        }
    };
    State.prototype.addActionToLog = function (action) {
        var _a, _b, _c;
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
                        var metaValue = this.getMetaValue(action.card, action.generatedBy);
                        var metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;
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
                                player: this.getMetaValue(action.player, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_LOSS,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_LOSS,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            var target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_GAIN,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_MAGI_ENERGY_GAIN,
                                    card: target.card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
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
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                card: ((_a = this.getMetaValue(action.target, action.generatedBy)) === null || _a === void 0 ? void 0 : _a.card.name) || 'Unknown creature',
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_MAGI_DEFEATED,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATURE_ATTACKS: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_ATTACK,
                                source: this.getMetaValue(action.source, action.generatedBy).card.name,
                                target: this.getMetaValue(action.target, action.generatedBy).card.name,
                            };
                        }
                    }
                    break;
                }
                case const_1.ACTION_RESOLVE_PROMPT: {
                    if ((this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
                        this.state.promptType === const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_MAGI) && 'target' in action) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_TARGETING,
                            card: ((_c = (_b = action.target) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.name) || 'unknown card',
                            player: action.player,
                        };
                    }
                    if (this.state.promptType === const_1.PROMPT_TYPE_NUMBER && 'number' in action) {
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
            console.log('Log entry creation failed');
            console.dir(e);
        }
        if (newLogEntry) {
            this.state.log = __spreadArray(__spreadArray([], this.state.log, true), [
                newLogEntry,
            ], false);
        }
    };
    State.prototype.createZones = function () {
        var _a = this.players, playerOne = _a[0], playerTwo = _a[1];
        return [
            new Zone_1.default('Player 1 hand', const_1.ZONE_TYPE_HAND, playerOne),
            new Zone_1.default('Player 2 hand', const_1.ZONE_TYPE_HAND, playerTwo),
            new Zone_1.default('Player 1 deck', const_1.ZONE_TYPE_DECK, playerOne),
            new Zone_1.default('Player 2 deck', const_1.ZONE_TYPE_DECK, playerTwo),
            new Zone_1.default('Player 1 discard', const_1.ZONE_TYPE_DISCARD, playerOne),
            new Zone_1.default('Player 2 discard', const_1.ZONE_TYPE_DISCARD, playerTwo),
            new Zone_1.default('Player 1 active magi', const_1.ZONE_TYPE_ACTIVE_MAGI, playerOne),
            new Zone_1.default('Player 2 active magi', const_1.ZONE_TYPE_ACTIVE_MAGI, playerTwo),
            new Zone_1.default('Player 1 magi pile', const_1.ZONE_TYPE_MAGI_PILE, playerOne),
            new Zone_1.default('Player 2 magi pile', const_1.ZONE_TYPE_MAGI_PILE, playerTwo),
            new Zone_1.default('Player 1 magi pile', const_1.ZONE_TYPE_DEFEATED_MAGI, playerOne),
            new Zone_1.default('Player 2 magi pile', const_1.ZONE_TYPE_DEFEATED_MAGI, playerTwo),
            new Zone_1.default('In play', const_1.ZONE_TYPE_IN_PLAY, null),
        ];
    };
    State.prototype.serializeData = function (playerId) {
        var gameEnded = !(this.winner === false);
        return {
            zones: this.serializeZones(playerId),
            continuousEffects: this.state.continuousEffects,
            step: this.state.step,
            turn: this.state.turn,
            goesFirst: this.state.goesFirst,
            activePlayer: this.state.activePlayer,
            prompt: this.state.prompt,
            promptType: this.state.promptType,
            promptMessage: this.state.promptMessage,
            promptPlayer: this.state.promptPlayer,
            promptGeneratedBy: this.state.promptGeneratedBy,
            promptParams: this.state.promptParams,
            log: this.state.log,
            gameEnded: gameEnded,
            winner: gameEnded ? this.winner : null,
        };
    };
    State.prototype.serializeZones = function (playerId) {
        var opponentId = this.getOpponent(playerId);
        return {
            playerHand: this.getZone(const_1.ZONE_TYPE_HAND, playerId).serialize(),
            opponentHand: this.getZone(const_1.ZONE_TYPE_HAND, opponentId).serialize(true),
            playerDeck: this.getZone(const_1.ZONE_TYPE_DECK, playerId).serialize(true),
            opponentDeck: this.getZone(const_1.ZONE_TYPE_DECK, opponentId).serialize(true),
            playerActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
            opponentActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
            playerMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, playerId).serialize(),
            opponentMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, opponentId).serialize(true),
            inPlay: this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.map(function (c) { return c.serialize(); }),
            playerDefeatedMagi: this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, playerId).serialize(),
            opponentDefeatedMagi: this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, opponentId).serialize(),
            playerDiscard: this.getZone(const_1.ZONE_TYPE_DISCARD, playerId).serialize(),
            opponentDiscard: this.getZone(const_1.ZONE_TYPE_DISCARD, opponentId).serialize(),
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
            var magi = deck.filter(function (card) { return card.card.type === const_1.TYPE_MAGI; });
            var rest = deck.filter(function (card) { return card.card.type != const_1.TYPE_MAGI; });
            _this.getZone(const_1.ZONE_TYPE_MAGI_PILE, player).add(magi);
            _this.getZone(const_1.ZONE_TYPE_DECK, player).add(rest).shuffle();
        });
        var goesFirst = this.players[(Math.random() > 0.5 ? 0 : 1)];
        this.state = __assign(__assign({}, this.state), { zones: zones, step: null, turn: 1, goesFirst: goesFirst, activePlayer: goesFirst });
    };
    State.prototype.getOpponent = function (player) {
        var opponent = this.players.find(function (pl) { return pl != player; });
        return opponent || 0;
    };
    State.prototype.getZone = function (type, player) {
        if (player === void 0) { player = null; }
        return this.state.zones.find(function (zone) { return zone.type === type && (zone.player == player || player == null); }) || new Zone_1.default('Empty zone', const_1.ZONE_TYPE_DECK);
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
    State.prototype.useSelector = function (selector, player, argument) {
        var _this = this;
        switch (selector) {
            case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player; });
            }
            case const_1.SELECTOR_RELICS: {
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == const_1.TYPE_RELIC; });
            }
            case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray([], this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && _this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0; }), true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0; }), true);
            }
            case const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray(__spreadArray([], this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0; }), true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0; }), true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0; }), true);
            }
            case const_1.SELECTOR_OPPONENT_ID:
                return this.players.find(function (id) { return id != argument; }) || 999;
            case const_1.SELECTOR_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_MAGI:
                return __spreadArray(__spreadArray([], this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards, true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards, true).filter(Boolean);
            case const_1.SELECTOR_TOP_MAGI_OF_PILE: {
                var topMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case const_1.SELECTOR_OWN_MAGI:
                return this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards;
            // case SELECTOR_OWN_MAGI_SINGLE:
            // 	return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND:
                return this.getZone(const_1.ZONE_TYPE_HAND, player).cards.filter(function (card) { return card.card.type == const_1.TYPE_SPELL; });
            case const_1.SELECTOR_ENEMY_MAGI:
                return this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player || 0)).cards;
            case const_1.SELECTOR_OWN_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_ENEMY_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) != player && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_CREATURES_OF_REGION:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) == argument && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_CREATURES_NOT_OF_REGION:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) != argument && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_CREATURES_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_CREATURES_NOT_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return !card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE; });
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player &&
                        card.card.type == const_1.TYPE_CREATURE &&
                        card.card.name.split(' ').includes(argument);
                });
            case const_1.SELECTOR_STATUS:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument);
                });
            case const_1.SELECTOR_CREATURES_WITHOUT_STATUS:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type == const_1.TYPE_CREATURE; })
                    .filter(function (card) { return !_this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument); });
            default:
                return [];
        }
    };
    State.prototype.getByProperty = function (target, property, subProperty) {
        var _a, _b;
        if (subProperty === void 0) { subProperty = null; }
        switch (property) {
            case const_1.PROPERTY_ID:
                return target.id;
            case const_1.PROPERTY_TYPE:
                return target.card.type;
            case const_1.PROPERTY_CREATURE_TYPES:
                return target.card.name.split(' ');
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
            case const_1.PROPERTY_POWER_COST:
                var powers = target.modifiedCard ? (_a = target.modifiedCard.data) === null || _a === void 0 ? void 0 : _a.powers : target.card.data.powers;
                return (powers && powers.length) ? (_b = powers.find(function (_a) {
                    var name = _a.name;
                    return name === subProperty;
                })) === null || _b === void 0 ? void 0 : _b.cost : 0;
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
            case const_1.PROPERTY_ABLE_TO_ATTACK:
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : true;
        }
    };
    State.prototype.isCardAffectedByEffect = function (card, effect) {
        var protection = this.modifyByStaticAbilities(card, const_1.PROPERTY_PROTECTION);
        if (!protection)
            return true;
        // Is the `from` right?
        if ((effect.spell && protection.from === const_1.PROTECTION_FROM_SPELLS) ||
            (effect.power && protection.from === const_1.PROTECTION_FROM_POWERS) ||
            (effect.attack && protection.from === const_1.PROTECTION_FROM_ATTACKS)) {
            if (effect.effectType === const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE &&
                protection.type === const_1.PROTECTION_TYPE_ENERGY_LOSS) {
                var source = effect.source;
                if (protection.restrictions) {
                    var cardFilter = this.makeCardFilter(protection.restrictions);
                    return !cardFilter(source);
                }
                else {
                    return false;
                }
            }
            if ((effect.effectType === const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && protection.type === const_1.PROTECTION_TYPE_DISCARDING_FROM_PLAY) ||
                protection.type === const_1.PROTECTION_TYPE_GENERAL) {
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
            if (protection.type === const_1.PROTECTION_TYPE_GENERAL) {
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
        return true;
    };
    State.prototype.isCardAffectedByStaticAbility = function (card, staticAbility) {
        var _a, _b, _c;
        switch (staticAbility.selector) {
            case const_1.SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    });
            }
            case const_1.SELECTOR_OWN_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(((_a = staticAbility === null || staticAbility === void 0 ? void 0 : staticAbility.selectorParameter) === null || _a === void 0 ? void 0 : _a.toString()) || 'no matches');
            }
            case const_1.SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_OWN_MAGI: {
                return card.card.type === const_1.TYPE_MAGI &&
                    this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    ((_c = (_b = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.id) === card.id;
            }
            case const_1.SELECTOR_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case const_1.SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND: {
                return this.getZone(const_1.ZONE_TYPE_HAND, staticAbility.player).cards.some(function (_a) {
                    var id = _a.id;
                    return id === card.id;
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
                selector: const_1.SELECTOR_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ENERGY_LOSS_THRESHOLD,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: 2,
                },
            },
            {
                name: 'Burrowed - Ability to attack',
                text: 'Your burrowed creatures cannot attack',
                selector: const_1.SELECTOR_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: false,
                },
            },
        ];
        // gathering static abilities from the field, adding players Magi to them
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards, true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards, true), this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards, true);
        var continuousStaticAbilities = this.state.continuousEffects.map(function (effect) { var _a; return ((_a = effect.staticAbilities) === null || _a === void 0 ? void 0 : _a.map(function (a) { return (__assign(__assign({}, a), { player: effect.player })); })) || []; }).flat();
        var propertyLayers = (_a = {},
            _a[const_1.PROPERTY_CONTROLLER] = 0,
            _a[const_1.PROPERTY_COST] = 1,
            _a[const_1.PROPERTY_ENERGIZE] = 2,
            _a[const_1.PROPERTY_STATUS] = 3,
            _a[const_1.PROPERTY_ATTACKS_PER_TURN] = 4,
            _a[const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY] = 5,
            _a[const_1.PROPERTY_ENERGY_LOSS_THRESHOLD] = 6,
            _a[const_1.PROPERTY_ABLE_TO_ATTACK] = 7,
            _a[const_1.PROPERTY_PROTECTION] = 8,
            _a);
        var zoneAbilities = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.staticAbilities ? __spreadArray(__spreadArray([], acc, true), (cardInPlay.card.data.staticAbilities.map(function (a) { return (__assign(__assign({}, a), { player: cardInPlay.data.controller })); })), true) : acc; }, []);
        var staticAbilities = __spreadArray(__spreadArray(__spreadArray([], gameStaticAbilities, true), zoneAbilities, true), continuousStaticAbilities, true).sort(function (a, b) { return propertyLayers[a.property] - propertyLayers[b.property]; });
        var initialCardData = {
            card: target.card,
            modifiedCard: __assign(__assign({}, target.card), { data: __assign(__assign({ protection: undefined }, target.card.data), { energyLossThreshold: 0, ableToAttack: true }) }),
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
                case const_1.PROPERTY_COST: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_COST);
                    var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                    if (typeof initialValue !== 'number') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: initialValue }) });
                    }
                    var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { cost: resultValue }) });
                }
                case const_1.PROPERTY_ENERGIZE: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    var _b = staticAbility.modifier, operator = _b.operator, operandOne = _b.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energize: resultValue }) }) });
                }
                case const_1.PROPERTY_ATTACKS_PER_TURN: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ATTACKS_PER_TURN);
                    var _c = staticAbility.modifier, operator = _c.operator, operandOne = _c.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { attacksPerTurn: resultValue }) }) });
                }
                case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    var _d = staticAbility.modifier, operator = _d.operator, operandOne = _d.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { energyLossThreshold: resultValue }) }) });
                }
                case const_1.PROPERTY_ABLE_TO_ATTACK: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ABLE_TO_ATTACK);
                    var _e = staticAbility.modifier, operator = _e.operator, operandOne = _e.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { ableToAttack: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case const_1.PROPERTY_CAN_BE_ATTACKED: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CAN_BE_ATTACKED);
                    var _f = staticAbility.modifier, operator = _f.operator, operandOne = _f.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { canBeAttacked: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case const_1.PROPERTY_CONTROLLER: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CONTROLLER);
                    var _g = staticAbility.modifier, operator = _g.operator, operandOne = _g.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'number') {
                        return __assign(__assign({}, currentCard), { data: __assign(__assign({}, currentCard.data), { controller: resultValue }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case const_1.PROPERTY_STATUS: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_STATUS, staticAbility.subProperty);
                    var _h = staticAbility.modifier, operator = _h.operator, operandOne = _h.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        switch (staticAbility.subProperty) {
                            case const_1.STATUS_BURROWED: {
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
                case const_1.PROPERTY_PROTECTION: {
                    var initialValue = this.getByProperty(currentCard, const_1.PROPERTY_PROTECTION);
                    var _j = staticAbility.modifier, operator = _j.operator, operandOne = _j.operandOne;
                    var resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'object' && 'from' in resultValue) {
                        return __assign(__assign({}, currentCard), { modifiedCard: __assign(__assign({}, currentCard.modifiedCard), { data: __assign(__assign({}, currentCard.modifiedCard.data), { protection: resultValue }) }) });
                    }
                    else {
                        return __assign({}, currentCard);
                    }
                }
                case const_1.PROPERTY_POWER_COST: {
                    if (currentCard.modifiedCard.data.powers) {
                        var updatedPowers = currentCard.modifiedCard.data.powers.map(function (power) {
                            var initialValue = _this.getByProperty(currentCard, const_1.PROPERTY_POWER_COST, power.name);
                            var _a = staticAbility.modifier, operator = _a.operator, operandOne = _a.operandOne;
                            var resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
            case const_1.RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return function (card) { return card.card.name.split(' ').some(function (type) { return restrictionValue.includes(type); }); };
                }
                return function (card) { return card.card.name.split(' ').includes(restrictionValue); };
            case const_1.RESTRICTION_TYPE:
                return function (card) { return card.card.type === restrictionValue; };
            case const_1.RESTRICTION_PLAYABLE:
                return function (card) {
                    var magi = _this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner)[0];
                    var cardCost = _this.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case const_1.RESTRICTION_MAGI_WITHOUT_CREATURES:
                return function (card) {
                    if (card.card.type !== const_1.TYPE_MAGI)
                        return false;
                    var creatures = _this.useSelector(const_1.SELECTOR_OWN_CREATURES, card.owner);
                    return (creatures && creatures instanceof Array && creatures.length === 0);
                };
            case const_1.RESTRICTION_REGION:
                return function (card) { return card.card.region === restrictionValue; };
            case const_1.RESTRICTION_REGION_IS_NOT:
                return function (card) { return card.card.region !== restrictionValue; };
            case const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return function (card) { return Boolean(card.card.type === const_1.TYPE_CREATURE && card.card.cost && card.data.energy < card.card.cost); };
            case const_1.RESTRICTION_ENERGY_LESS_THAN:
                return function (card) { return card.card.type === const_1.TYPE_CREATURE && card.data.energy < restrictionValue; };
            case const_1.RESTRICTION_CREATURE_WAS_ATTACKED:
                return function (card) { return card.card.type === const_1.TYPE_CREATURE && card.data.wasAttacked === true; };
            // For own and opponents creatures we pass effect controller as restrictionValue
            case const_1.RESTRICTION_OWN_CREATURE:
                return function (card) { return card.data.controller === restrictionValue; };
            case const_1.RESTRICTION_OPPONENT_CREATURE:
                return function (card) { return card.data.controller !== restrictionValue; };
            case const_1.RESTRICTION_STATUS:
                return function (card) { return _this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, restrictionValue); };
            case const_1.RESTRICTION_ENERGY_EQUALS:
                return function (card) { return card.card.type === const_1.TYPE_CREATURE && card.data.energy === restrictionValue; };
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
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], (this.getZone(const_1.ZONE_TYPE_IN_PLAY) || { cards: [] }).cards, true), (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE)).cards, true), (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO)).cards, true);
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
        if (replacementFound && replaceWith) {
            var resultEffects = appliedReplacerSelf ? replaceWith.map((function (appliedReplacerSelf) { return function (replacementEffect) {
                if (!('type' in replacementEffect)) {
                    // @ts-ignore
                    var resultEffect_1 = __assign(__assign({ type: const_1.ACTION_EFFECT }, replacementEffect), { replacedBy: __spreadArray(__spreadArray([], previouslyReplacedBy, true), [
                            appliedReplacerId,
                        ], false), generatedBy: action.generatedBy || (0, nanoid_1.default)(), player: appliedReplacerSelf.data.controller });
                    Object.keys(replacementEffect)
                        .filter(function (key) { return !['type', 'effectType'].includes(key); })
                        .forEach(function (key) {
                        var value = _this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy);
                        resultEffect_1[key] = value;
                    });
                    return resultEffect_1;
                }
                var resultEffect = __assign(__assign({ type: const_1.ACTION_EFFECT }, replacementEffect), { replacedBy: __spreadArray(__spreadArray([], previouslyReplacedBy, true), [
                        appliedReplacerId,
                    ], false), generatedBy: action.generatedBy || (0, nanoid_1.default)(), player: appliedReplacerSelf.data.controller });
                // prepare %-values on created action
                Object.keys(replacementEffect)
                    .filter(function (key) { return !['type', 'effectType'].includes(key); })
                    .forEach(function (key) {
                    var value = _this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy);
                    resultEffect[key] = value;
                });
                return resultEffect;
            }; })(appliedReplacerSelf)) : [];
            // If the replacer is one-time, set the action usage
            if (foundReplacer && foundReplacer.oncePerTurn && foundReplacer.name) {
                appliedReplacerSelf.setActionUsed(foundReplacer.name);
            }
            if (foundReplacer && foundReplacer.mayEffect) {
                this.state.mayEffectActions = resultEffects;
                this.state.fallbackActions = [__assign(__assign({}, action), { replacedBy: ('replacedBy' in action && action.replacedBy) ? __spreadArray(__spreadArray([], action.replacedBy, true), [appliedReplacerId], false) : [appliedReplacerId] })];
                return [{
                        type: const_1.ACTION_ENTER_PROMPT,
                        promptType: const_1.PROMPT_TYPE_MAY_ABILITY,
                        promptParams: {
                            effect: {
                                name: foundReplacer.name,
                                text: foundReplacer.text,
                            },
                        },
                        generatedBy: appliedReplacerId,
                        player: appliedReplacerSelf.data.controller,
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
        var operandOne = (condition.propertyOne && condition.propertyOne !== const_1.ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectOne, condition.propertyOne) : objectOne;
        var operandTwo = (condition.propertyTwo && condition.propertyTwo !== const_1.ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectTwo, condition.propertyTwo) : objectTwo;
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
        if (action.type !== const_1.ACTION_EFFECT) {
            return false;
        }
        if (action.effectType !== find.effectType) {
            return false;
        }
        var conditions = find.conditions.map(function (condition) {
            return _this.checkCondition(action, self, condition);
        });
        return conditions.every(function (result) { return result === true; });
    };
    State.prototype.triggerAbilities = function (action) {
        var _this = this;
        var PLAYER_ONE = this.players[0];
        var PLAYER_TWO = this.players[1];
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], (this.getZone(const_1.ZONE_TYPE_IN_PLAY) || { cards: [] }).cards, true), (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE) || { cards: [] }).cards, true), (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO) || { cards: [] }).cards, true);
        var cardTriggerEffects = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.triggerEffects ? __spreadArray(__spreadArray([], acc, true), cardInPlay.card.data.triggerEffects.map(function (effect) { return (__assign(__assign({}, effect), { self: cardInPlay })); }), true) : acc; }, []);
        // const continuousEffectTriggers = this.state.continuousEffects.map(effect => effect.triggerEffects.map(triggerEffect => ({...triggerEffect, id: effect.id})) || []).flat();
        var triggerEffects = __spreadArray(__spreadArray([], cardTriggerEffects, true), this.state.delayedTriggers, true);
        triggerEffects.forEach(function (replacer) {
            // @ts-ignore
            var triggeredId = replacer.self.id; // Not really, but will work for now
            if (_this.matchAction(action, replacer.find, replacer.self)) {
                // Save source to *trigger source* metadata (it's probably empty)
                // For creatures set creatureSource field (just for convenience)
                _this.setSpellMetaDataField('source', replacer.self, action.generatedBy || triggeredId);
                if (replacer.self.card.type === const_1.TYPE_CREATURE) {
                    _this.setSpellMetaDataField('sourceCreature', replacer.self, action.generatedBy || triggeredId);
                }
                // Turn effect-templates into actual effect actions by preparing meta-values				
                var preparedEffects = replacer.effects.map(function (effect) {
                    // @ts-ignore
                    var resultEffect = {
                        type: effect.type || const_1.ACTION_EFFECT,
                        generatedBy: action.generatedBy || triggeredId,
                        triggeredId: [triggeredId],
                        triggerSource: replacer.self,
                        player: replacer.self.data.controller,
                    };
                    // Do we need to replace this? Maybe later
                    if (effect.type === const_1.ACTION_EFFECT) {
                        // @ts-ignore
                        resultEffect.effectType = effect.effectType;
                    }
                    // prepare %-values on created action
                    Object.keys(effect)
                        .filter(function (key) { return !['type', 'effectType'].includes(key); })
                        .forEach(function (key) {
                        var value = _this.prepareMetaValue(effect[key], action, replacer.self, action.generatedBy || (0, nanoid_1.default)());
                        resultEffect[key] = value;
                    });
                    return resultEffect;
                });
                var allPromptsAreDoable = _this.checkPrompts(replacer.self, preparedEffects, false, 0);
                if (allPromptsAreDoable) {
                    if (replacer.mayEffect) {
                        _this.state.mayEffectActions = preparedEffects;
                        _this.transformIntoActions({
                            type: const_1.ACTION_ENTER_PROMPT,
                            promptType: const_1.PROMPT_TYPE_MAY_ABILITY,
                            promptParams: {
                                effect: {
                                    name: replacer.name,
                                    text: replacer.text,
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
    State.prototype.performCalculation = function (operator, operandOne, operandTwo) {
        var result;
        switch (operator) {
            case const_1.CALCULATION_SET: {
                result = operandOne;
                break;
            }
            case const_1.CALCULATION_DOUBLE: {
                result = operandOne * 2;
                break;
            }
            case const_1.CALCULATION_ADD: {
                result = operandOne + operandTwo;
                break;
            }
            case const_1.CALCULATION_SUBTRACT: {
                result = operandOne - operandTwo;
                break;
            }
            case const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
                result = Math.max(operandOne - operandTwo, 1);
                break;
            }
            case const_1.CALCULATION_HALVE_ROUND_DOWN: {
                result = Math.floor(operandOne / 2);
                break;
            }
            case const_1.CALCULATION_HALVE_ROUND_UP: {
                result = Math.ceil(operandOne / 2);
                break;
            }
            case const_1.CALCULATION_MULTIPLY: {
                result = operandOne * operandTwo;
                break;
            }
            case const_1.CALCULATION_MIN: {
                result = Math.min(operandOne, operandTwo);
                break;
            }
            case const_1.CALCULATION_MAX: {
                result = Math.max(operandOne, operandTwo);
                break;
            }
        }
        return result;
    };
    State.prototype.calculateTotalCost = function (card) {
        var activeMagiSelected = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            var activeMagi = activeMagiSelected[0];
            var baseCost = this.modifyByStaticAbilities(card, const_1.PROPERTY_COST);
            var regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return 0;
    };
    State.prototype.getAvailableCards = function (player, topMagi) {
        var _a, _b;
        var deckCards = this.getZone(const_1.ZONE_TYPE_DECK, player).cards.map(function (_a) {
            var card = _a.card;
            return card.name;
        });
        var discardCards = this.getZone(const_1.ZONE_TYPE_DISCARD, player).cards.map(function (_a) {
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
        var ourCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return (creatureWillSurvive ? true : card.id !== source.id) && card.data.controller === source.data.controller; });
        var allCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return creatureWillSurvive ? true : card.id !== source.id; });
        var metaValues = {
            '$source': source,
            '$sourceCreature': source,
        };
        while (testedActions.length && testedActions[0].type === const_1.ACTION_GET_PROPERTY_VALUE) {
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
            const_1.PROMPT_TYPE_SINGLE_CREATURE,
            const_1.PROMPT_TYPE_RELIC,
            const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
            const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
            const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
            const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
        ];
        var testablePromptFilter = function (action) {
            return action.type === const_1.ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
        };
        var allPrompts = testedActions.filter(testablePromptFilter);
        var allPromptsAreDoable = allPrompts.every(function (promptAction) {
            switch (promptAction.promptType) {
                case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                    return allCardsInPlay.some(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    var opponent = _this.getOpponent(source.data.controller);
                    var magi = __spreadArray(__spreadArray([], _this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, true), _this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponent).cards, true);
                    return magi.some(function (magi) { return !allCardsInPlay.some(function (card) { return card.data.controller === magi.data.controller && card.card.type === const_1.TYPE_CREATURE; }); });
                case const_1.PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(function (card) { return card.card.type === const_1.TYPE_RELIC; });
                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return _this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.id !== source.id; });
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if (promptAction.restrictions) {
                        var restrictionsWithValues = promptAction.restrictions.map(function (_a) {
                            var type = _a.type, value = _a.value;
                            var restrictionValue = (typeof value === 'string' &&
                                value in metaValues) ? metaValues[value] : value;
                            return {
                                type: type,
                                value: restrictionValue,
                            };
                        });
                        return _this.checkAnyCardForRestrictions(allCardsInPlay.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), restrictionsWithValues);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                var restrictionValue = (typeof promptAction.restrictionValue === 'string' &&
                                    promptAction.restrictionValue in metaValues) ? metaValues[promptAction.restrictionValue] : promptAction.restrictionValue;
                                return _this.checkAnyCardForRestriction(allCardsInPlay.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    var zoneOwner = _this.getMetaValue(promptAction.zoneOwner, source.id);
                    var cardsInZone = _this.getZone(promptAction.zone, zoneOwner).cards;
                    if (promptAction.restrictions) {
                        return _this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, promptAction.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    var zoneOwner = _this.getMetaValue(promptAction.zoneOwner, source.id);
                    var cardsInZone = _this.getZone(promptAction.zone, zoneOwner).cards;
                    if (promptAction.restrictions) {
                        return _this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                return _this.checkAnyCardForRestriction(cardsInZone.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, promptAction.restrictionValue);
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (this.hasWinner()) {
            return false;
        }
        this.addActions(initialAction);
        var _loop_1 = function () {
            var _q;
            var rawAction = this_1.getNextAction();
            var replacedActions = this_1.replaceByReplacementEffect(rawAction);
            var action = replacedActions[0];
            if (replacedActions.length > 1) {
                // Stuff the rest of them into beginning of the action queue
                this_1.transformIntoActions.apply(this_1, replacedActions.slice(1));
            }
            if (this_1.debug) {
                (0, logAction_1.showAction)(action);
            }
            this_1.addActionToLog(action);
            this_1.addActionToStream(action);
            this_1.triggerAbilities(action);
            switch (action.type) {
                case const_1.ACTION_CONCEDE: {
                    var opponentId = this_1.getOpponent(action.player);
                    this_1.transformIntoActions({
                        type: const_1.ACTION_PLAYER_WINS,
                        player: opponentId,
                    });
                    break;
                }
                case const_1.ACTION_PLAYER_WINS: {
                    this_1.setWinner(action.player);
                    this_1.state.actions = [];
                    break;
                }
                case const_1.ACTION_ATTACK: {
                    var attackSource = action.generatedBy ? this_1.getMetaValue(action.source, action.generatedBy) : action.source;
                    var attackTarget = action.generatedBy ? this_1.getMetaValue(action.target, action.generatedBy) : action.target;
                    var additionalAttackers = (action.generatedBy ? this_1.getMetaValue(action.additionalAttackers, action.generatedBy) : action.additionalAttackers) || [];
                    var sourceAttacksPerTurn = this_1.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ATTACKS_PER_TURN);
                    var attackerCanAttack = this_1.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ABLE_TO_ATTACK);
                    if (!attackerCanAttack) {
                        console.log("Somehow ".concat(attackSource.card.name, " cannot attack"));
                    }
                    var targetCanBeAttacked = this_1.modifyByStaticAbilities(attackTarget, const_1.PROPERTY_CAN_BE_ATTACKED);
                    if (!targetCanBeAttacked) {
                        console.log("Somehow ".concat(attackSource.card.name, " cannot be attacked"));
                    }
                    var sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
                    var additionalAttackersCanAttack = additionalAttackers.every(function (card) { return card.card.data.canPackHunt && _this.modifyByStaticAbilities(card, const_1.PROPERTY_ABLE_TO_ATTACK); });
                    var additionalAttackersHasAttacksLeft = additionalAttackers.every(function (card) { return card.data.attacked < _this.modifyByStaticAbilities(card, const_1.PROPERTY_ATTACKS_PER_TURN); });
                    var targetIsMagi = attackTarget.card.type == const_1.TYPE_MAGI;
                    var opponentCreatures = this_1.useSelector(const_1.SELECTOR_OWN_CREATURES, attackTarget.owner);
                    var magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;
                    var attackApproved = attackerCanAttack &&
                        !targetIsMagi || ( // Either we attack a creature
                    targetIsMagi && ( // Or we are attacking a magi, but then...
                    !magiHasCreatures || // ...he either shouldn't have creatures
                        this_1.modifyByStaticAbilities(attackSource, const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
                    ));
                    var enoughAttacksLeft = (sourceHasAttacksLeft && ((additionalAttackersCanAttack && additionalAttackersHasAttacksLeft) || additionalAttackers.length === 0));
                    if (enoughAttacksLeft && attackApproved && this_1.getCurrentPriority() == const_1.PRIORITY_ATTACK) {
                        this_1.transformIntoActions({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_ATTACK,
                            source: attackSource,
                            target: attackTarget,
                            additionalAttackers: additionalAttackers,
                            generatedBy: attackSource.id,
                            player: attackSource.data.controller,
                        });
                    }
                    break;
                }
                case const_1.ACTION_GET_PROPERTY_VALUE: {
                    var multiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                    var property = this_1.getMetaValue(action.property, action.generatedBy);
                    if (property === const_1.CARD_COUNT) {
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
                        var modifiedResult = this_1.modifyByStaticAbilities(target, property);
                        var variable = action.variable || 'result';
                        if (action.generatedBy) {
                            this_1.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
                        }
                    }
                    break;
                }
                case const_1.ACTION_CALCULATE: {
                    var operandOne = this_1.getMetaValue(action.operandOne, action.generatedBy);
                    var operandTwo = this_1.getMetaValue(action.operandTwo, action.generatedBy);
                    var result = this_1.performCalculation(action.operator, operandOne, operandTwo);
                    var variable = action.variable || 'result';
                    if (action.generatedBy) {
                        this_1.setSpellMetaDataField(variable, result, action.generatedBy);
                    }
                    break;
                }
                case const_1.ACTION_POWER: {
                    var powerCost = this_1.modifyByStaticAbilities(action.source, const_1.PROPERTY_POWER_COST, action.power.name || '');
                    var payingCard = (action.source.card.type === const_1.TYPE_RELIC) ?
                        this_1.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
                        action.source;
                    if (payingCard &&
                        !action.source.wasActionUsed(action.power.name) &&
                        (payingCard.data.energy >= powerCost ||
                            (payingCard.data.energy > 0 && powerCost === const_1.COST_X))) {
                        var source_1 = action.source;
                        var sourcePower = action.power;
                        var effects = action.power.effects;
                        var sourceController_1 = this_1.modifyByStaticAbilities(source_1, const_1.PROPERTY_CONTROLLER);
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
                            if (powerCost == const_1.COST_X) {
                                this_1.addActions({
                                    type: const_1.ACTION_ENTER_PROMPT,
                                    promptType: const_1.PROMPT_TYPE_NUMBER,
                                    player: sourceController_1,
                                    generatedBy: source_1.id,
                                    min: 1,
                                    max: action.source.data.energy,
                                }, {
                                    type: const_1.ACTION_CALCULATE,
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: '$number',
                                    variable: 'chosen_cost',
                                    generatedBy: source_1.id,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: '$number',
                                    generatedBy: source_1.id,
                                });
                            }
                            else if (powerCost > 0) {
                                this_1.addActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: powerCost,
                                    generatedBy: source_1.id,
                                });
                            }
                            this_1.addActions.apply(this_1, preparedActions);
                            this_1.setSpellMetadata(currentPowerMetaData, source_1.id);
                        }
                    }
                    break;
                }
                case const_1.ACTION_ENTER_PROMPT: {
                    if (!('player' in action)) {
                        throw new Error('Prompt without player!');
                    }
                    var savedActions = this_1.state.actions;
                    var promptParams = {};
                    var promptPlayer = this_1.getMetaValue(action.player, action.generatedBy);
                    switch (action.promptType) {
                        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                            promptParams = {
                                source: this_1.getMetaValue(action.source, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_MAY_ABILITY: {
                            promptParams = action.promptParams;
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                            if (action.restriction && action.restrictions) {
                                throw new Error('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
                            }
                            var restrictions = action.restrictions || (action.restriction ? [
                                {
                                    type: this_1.getMetaValue(action.restriction, action.generatedBy),
                                    value: this_1.getMetaValue(action.restrictionValue, action.generatedBy),
                                },
                            ] : null);
                            var zone = this_1.getMetaValue(action.zone, action.generatedBy);
                            var zoneOwner = this_1.getMetaValue(action.zoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.numberOfCards, action.generatedBy);
                            var cardFilter = this_1.makeCardFilter(restrictions || []);
                            var zoneContent = this_1.getZone(zone, zoneOwner).cards;
                            var cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
                            promptParams = {
                                zone: zone,
                                zoneOwner: zoneOwner,
                                restrictions: restrictions,
                                numberOfCards: numberOfCards,
                                cards: cards.map(convertCard),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                            if (action.restriction && action.restrictions) {
                                throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
                            }
                            var restrictions = action.restrictions || (action.restriction ? [
                                {
                                    type: this_1.getMetaValue(action.restriction, action.generatedBy),
                                    value: this_1.getMetaValue(action.restrictionValue, action.generatedBy),
                                },
                            ] : null);
                            var zone = this_1.getMetaValue(action.zone, action.generatedBy);
                            var zoneOwner = this_1.getMetaValue(action.zoneOwner, action.generatedBy);
                            var numberOfCards = this_1.getMetaValue(action.numberOfCards, action.generatedBy);
                            var cardFilter = this_1.makeCardFilter(restrictions || []);
                            var zoneContent = this_1.getZone(zone, zoneOwner).cards;
                            var cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
                            promptParams = {
                                zone: zone,
                                zoneOwner: zoneOwner,
                                restrictions: restrictions,
                                numberOfCards: numberOfCards,
                                cards: cards.map(convertCard),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                            if (action.restrictions) {
                                var restrictionsWithValues = action.restrictions.map(function (_a) {
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
                            else if (action.restriction) {
                                promptParams = {
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this_1.getMetaValue(action.restrictionValue, action.generatedBy),
                                        }
                                    ],
                                };
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_CARDS: {
                            promptParams = action.promptParams;
                            break;
                        }
                        case const_1.PROMPT_TYPE_NUMBER: {
                            promptParams = {
                                min: this_1.getMetaValue(action.min, action.generatedBy),
                                max: this_1.getMetaValue(action.max, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            if (action.restriction) {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this_1.getMetaValue(action.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            if (action.restriction) {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this_1.getMetaValue(action.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this_1.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                    }
                    this_1.state = __assign(__assign({}, this_1.state), { actions: [], savedActions: savedActions, prompt: true, promptMessage: ('message' in action) ? action.message : '', promptPlayer: promptPlayer, promptType: action.promptType, promptVariable: action.variable, promptGeneratedBy: action.generatedBy, promptParams: promptParams });
                    break;
                }
                case const_1.ACTION_EXIT_PROMPTS: {
                    this_1.state = __assign(__assign({}, this_1.state), { actions: [], savedActions: [], mayEffectActions: [], fallbackActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign({}, this_1.state.spellMetaData) });
                    break;
                }
                case const_1.ACTION_RESOLVE_PROMPT: {
                    if (this_1.state.promptType === const_1.PROMPT_TYPE_MAY_ABILITY) {
                        var mayEffectActions = this_1.state.mayEffectActions || [];
                        var fallbackActions = this_1.state.fallbackActions || [];
                        var savedActions = this_1.state.savedActions || [];
                        var actions = action.useEffect ? __spreadArray(__spreadArray([], mayEffectActions, true), savedActions, true) : __spreadArray(__spreadArray([], fallbackActions, true), savedActions, true);
                        this_1.state = __assign(__assign({}, this_1.state), { actions: actions, savedActions: [], mayEffectActions: [], fallbackActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign({}, this_1.state.spellMetaData) });
                    }
                    else {
                        var generatedBy = action.generatedBy || this_1.state.promptGeneratedBy || (0, nanoid_1.default)();
                        var variable = action.variable || this_1.state.promptVariable;
                        var currentActionMetaData = this_1.state.spellMetaData[generatedBy] || {};
                        switch (this_1.state.promptType) {
                            case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
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
                                    currentActionMetaData[variable || 'targetCards'] = action.cards;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
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
                                    currentActionMetaData[variable || 'targetCards'] = action.cards;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_NUMBER:
                                if ('number' in action) {
                                    currentActionMetaData[variable || 'number'] = (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10);
                                }
                                break;
                            case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
                                if ('target' in action && action.target && ((_d = (_c = this_1.state) === null || _c === void 0 ? void 0 : _c.promptParams) === null || _d === void 0 ? void 0 : _d.source)) {
                                    if (this_1.state.promptParams.source.id === ((_e = action.target) === null || _e === void 0 ? void 0 : _e.id)) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_RELIC: {
                                if ('target' in action) {
                                    if (((_f = action.target) === null || _f === void 0 ? void 0 : _f.card.type) !== const_1.TYPE_RELIC) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                                if ('target' in action && action.target) {
                                    if (this_1.state.promptPlayer !== ((_g = action.target) === null || _g === void 0 ? void 0 : _g.data.controller)) {
                                        throw new Error('Not-controlled creature supplied to Own Creatures prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                                if ('target' in action && ((_h = action.target) === null || _h === void 0 ? void 0 : _h.card.type) === const_1.TYPE_MAGI && this_1.useSelector(const_1.SELECTOR_CREATURES_OF_PLAYER, action.target.data.controller)) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                    break;
                                }
                            }
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_SINGLE_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || 'targetMagi'] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_CHOOSE_CARDS:
                                if ('cards' in action) {
                                    currentActionMetaData[variable || 'selectedCards'] = action.cards || [];
                                }
                                break;
                            case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    currentActionMetaData[variable || 'energyOnCreatures'] = action.energyOnCreatures || [];
                                }
                                break;
                            case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    var totalEnergy = Object.values(action.energyOnCreatures).reduce(function (a, b) { return a + b; }, 0);
                                    if (totalEnergy === this_1.state.promptParams.amount) {
                                        currentActionMetaData[variable || 'energyOnCreatures'] = action.energyOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                                if ('damageOnCreatures' in action) {
                                    var totalDamage = Object.values(action.damageOnCreatures).reduce(function (a, b) { return a + b; }, 0);
                                    if (totalDamage === this_1.state.promptParams.amount) {
                                        currentActionMetaData[variable || 'damageOnCreatures'] = action.damageOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_PLAYER: {
                                if ('targetPlayer' in action) {
                                    if (this_1.players.includes(action.targetPlayer)) {
                                        currentActionMetaData[variable || 'targetPlayer'] = action.targetPlayer;
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
                        }
                        var actions = this_1.state.savedActions || [];
                        this_1.state = __assign(__assign({}, this_1.state), { actions: actions, savedActions: [], prompt: false, promptType: null, promptMessage: undefined, promptGeneratedBy: undefined, promptVariable: undefined, promptParams: {}, spellMetaData: __assign(__assign({}, this_1.state.spellMetaData), (_q = {}, _q[generatedBy] = currentActionMetaData, _q)) });
                    }
                    break;
                }
                case const_1.ACTION_SELECT: {
                    var result = void 0;
                    switch (action.selector) {
                        case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                            result = this_1.useSelector(const_1.SELECTOR_OWN_CARDS_IN_PLAY, action.player || 0);
                            break;
                        }
                        case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                            result = this_1.useSelector(const_1.SELECTOR_OWN_CREATURES_OF_TYPE, action.player || 0, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_OF_TYPE: {
                            result = this_1.useSelector(const_1.SELECTOR_CREATURES_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_NOT_OF_TYPE: {
                            result = this_1.useSelector(const_1.SELECTOR_CREATURES_NOT_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                            result = this_1.useSelector(const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE, null);
                            break;
                        }
                        case const_1.SELECTOR_OPPONENT_ID: {
                            result = this_1.useSelector(const_1.SELECTOR_OPPONENT_ID, action.player || 0, this_1.getMetaValue(action.opponentOf || action.player, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                            result = this_1.useSelector(const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player || 0);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_AND_MAGI: {
                            var ownMagi = this_1.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            var creatures = this_1.useSelector(const_1.SELECTOR_CREATURES, null);
                            result = __spreadArray(__spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true), (creatures instanceof Array ? creatures : []), true);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_OF_REGION: {
                            result = this_1.useSelector(const_1.SELECTOR_CREATURES_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_NOT_OF_REGION: {
                            result = this_1.useSelector(const_1.SELECTOR_CREATURES_NOT_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case const_1.SELECTOR_OTHER_CREATURES_OF_TYPE: {
                            var creatures = this_1.useSelector(const_1.SELECTOR_CREATURES_OF_TYPE, null, this_1.getMetaValue(action.creatureType, action.generatedBy));
                            result = (creatures instanceof Array) ? creatures.filter(function (card) { return card.id !== action.generatedBy; }) : [];
                            break;
                        }
                        case const_1.SELECTOR_MAGI_OF_REGION: {
                            var ownMagi = this_1.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = __spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true).filter(function (magi) { return _this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) === action.region; });
                            break;
                        }
                        case const_1.SELECTOR_MAGI_NOT_OF_REGION: {
                            var ownMagi = this_1.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            var enemyMagi = this_1.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = __spreadArray(__spreadArray([], (ownMagi instanceof Array ? ownMagi : []), true), (enemyMagi instanceof Array ? enemyMagi : []), true).filter(function (magi) { return _this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) != action.region; });
                            break;
                        }
                        case const_1.SELECTOR_STATUS: {
                            result = this_1.useSelector(const_1.SELECTOR_STATUS, null, action.status);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_WITHOUT_STATUS: {
                            result = this_1.useSelector(const_1.SELECTOR_CREATURES_WITHOUT_STATUS, null, action.status);
                            break;
                        }
                        // This selector is special
                        // If there are more than one creature with the same (least) energy, it transforms into the corresponding prompt
                        case const_1.SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY: {
                            var creatures = this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                                return _this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == action.player &&
                                    card.card.type == const_1.TYPE_CREATURE;
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
                                        type: const_1.ACTION_ENTER_PROMPT,
                                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        restrictions: [{
                                                type: const_1.RESTRICTION_OWN_CREATURE,
                                                value: '',
                                            }, {
                                                type: const_1.RESTRICTION_ENERGY_EQUALS,
                                                value: minEnergy,
                                            }],
                                        variable: action.variable || 'selected',
                                        generatedBy: action.generatedBy,
                                        player: action.player,
                                    });
                                }
                            }
                            break;
                        }
                        default: {
                            // @ts-ignore
                            result = this_1.useSelector(action.selector, action.player);
                        }
                    }
                    var variable = action.variable || 'selected';
                    this_1.setSpellMetaDataField(variable, result, action.generatedBy || (0, nanoid_1.default)());
                    break;
                }
                case const_1.ACTION_PASS: {
                    if (this_1.state.step === null) {
                        // Null-start
                        this_1.transformIntoActions({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_START_TURN,
                            player: this_1.state.activePlayer,
                            generatedBy: (0, nanoid_1.default)(),
                        });
                    }
                    else {
                        if (action.player === this_1.state.activePlayer) {
                            newStep = (this_1.state.step + 1) % steps.length;
                            if (newStep === 0) {
                                this_1.stopTurnTimer();
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                                    player: this_1.state.activePlayer,
                                    generatedBy: (0, nanoid_1.default)(),
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_START_TURN,
                                    player: this_1.getOpponent(this_1.state.activePlayer),
                                    generatedBy: (0, nanoid_1.default)(),
                                });
                            }
                            else {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_START_STEP,
                                    player: this_1.state.activePlayer,
                                    step: newStep,
                                    generatedBy: (0, nanoid_1.default)(),
                                });
                            }
                        }
                    }
                    break;
                }
                case const_1.ACTION_PLAY: {
                    var castCards = ('card' in action) ? this_1.getMetaValue(action.card, action.generatedBy) : null;
                    var castCard = castCards ? (castCards.length ? castCards[0] : castCards) : null;
                    var player_1 = ('payload' in action) ? action.payload.player : action.player || 0;
                    var cardItself_1 = ('payload' in action) ? action.payload.card : castCard;
                    if (!cardItself_1) {
                        throw new Error('No card itself found');
                    }
                    var playerHand = this_1.getZone(const_1.ZONE_TYPE_HAND, player_1);
                    var cardInHand = playerHand.containsId((cardItself_1 === null || cardItself_1 === void 0 ? void 0 : cardItself_1.id) || '');
                    // baseCard is "abstract" card, CardInPlay is concrete instance
                    var baseCard_1 = ('payload' in action) ? action.payload.card.card : castCard === null || castCard === void 0 ? void 0 : castCard.card;
                    if (cardInHand && baseCard_1) {
                        var currentPriority = this_1.getCurrentPriority();
                        var cardType = baseCard_1.type;
                        if ((cardType == const_1.TYPE_CREATURE && currentPriority == const_1.PRIORITY_CREATURES) ||
                            (cardType == const_1.TYPE_RELIC && currentPriority == const_1.PRIORITY_PRS) ||
                            (cardType == const_1.TYPE_SPELL && currentPriority == const_1.PRIORITY_PRS) ||
                            action.forcePriority) {
                            var activeMagi = this_1.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player_1).card;
                            if (!activeMagi) {
                                throw new Error('Trying to play a card without Magi');
                            }
                            var totalCost = this_1.calculateTotalCost(cardItself_1);
                            switch (cardType) {
                                case const_1.TYPE_CREATURE: {
                                    if (activeMagi.data.energy >= totalCost) {
                                        this_1.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_CREATURE,
                                            card: cardItself_1,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                                            target: '$creature_created',
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                                            target: '$creature_created',
                                            player: player_1,
                                            amount: (baseCard_1.cost === const_1.COST_X || baseCard_1.cost === const_1.COST_X_PLUS_ONE || baseCard_1.cost === null) ? 0 : baseCard_1.cost,
                                            generatedBy: cardItself_1.id,
                                        });
                                    }
                                    break;
                                }
                                case const_1.TYPE_RELIC: {
                                    var alreadyHasOne = this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                                        .some(function (card) { return card.data.controller === player_1 && card.card.name === baseCard_1.name; });
                                    var relicRegion = baseCard_1.region;
                                    var magiRegion = activeMagi.card.region;
                                    var regionAllows = relicRegion === magiRegion || relicRegion === const_1.REGION_UNIVERSAL;
                                    if (!alreadyHasOne && regionAllows && typeof baseCard_1.cost == 'number' && activeMagi.data.energy >= baseCard_1.cost) {
                                        this_1.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_RELIC,
                                            card: cardItself_1,
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_RELIC_ENTERS_PLAY,
                                            card: '$relic_created',
                                            player: player_1,
                                            generatedBy: cardItself_1.id,
                                        });
                                    }
                                    break;
                                }
                                case const_1.TYPE_SPELL: {
                                    if (activeMagi.data.energy >= totalCost || baseCard_1.cost === const_1.COST_X || baseCard_1.cost === const_1.COST_X_PLUS_ONE) {
                                        var enrichAction = function (effect) { return (__assign(__assign({ source: cardItself_1, player: player_1 }, effect), { spell: true, generatedBy: cardItself_1.id })); };
                                        var preparedEffects = ((_k = (_j = baseCard_1.data) === null || _j === void 0 ? void 0 : _j.effects) === null || _k === void 0 ? void 0 : _k.map(enrichAction)) || [];
                                        var testablePrompts_1 = [
                                            const_1.PROMPT_TYPE_SINGLE_CREATURE,
                                            const_1.PROMPT_TYPE_RELIC,
                                            const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                                            const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        ];
                                        var testablePromptFilter = function (action) {
                                            return action.type === const_1.ACTION_ENTER_PROMPT && testablePrompts_1.includes(action.promptType);
                                        };
                                        var allPrompts = preparedEffects.filter(testablePromptFilter);
                                        var allPromptsAreDoable = allPrompts.every(function (promptAction) {
                                            switch (promptAction.promptType) {
                                                case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                                                    return _this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.card.type === const_1.TYPE_CREATURE; });
                                                case const_1.PROMPT_TYPE_RELIC:
                                                    return _this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.card.type === const_1.TYPE_RELIC; });
                                                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
                                                    return _this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(function (card) { return card.data.controller === promptAction.player; });
                                                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                                    if (promptAction.restrictions) {
                                                        return promptAction.restrictions.every(function (_a) {
                                                            var type = _a.type, value = _a.value;
                                                            return _this.checkAnyCardForRestriction(_this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards, type, value);
                                                        });
                                                    }
                                                    else if (promptAction.restriction) {
                                                        return _this.checkAnyCardForRestriction(_this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type === const_1.TYPE_CREATURE; }), promptAction.restriction, promptAction.restrictionValue);
                                                    }
                                                    return true;
                                                }
                                                default:
                                                    return true;
                                            }
                                        });
                                        if (allPromptsAreDoable) {
                                            var regionPenalty = (activeMagi.card.region == baseCard_1.region || baseCard_1.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
                                            var maxCost = baseCard_1.data.maxCostX || Infinity;
                                            var payEffects = (baseCard_1.cost === const_1.COST_X || baseCard_1.cost === const_1.COST_X_PLUS_ONE) ? [
                                                {
                                                    type: const_1.ACTION_ENTER_PROMPT,
                                                    promptType: const_1.PROMPT_TYPE_NUMBER,
                                                    player: player_1,
                                                    min: 1,
                                                    max: Math.min(activeMagi.data.energy, maxCost) - regionPenalty - (baseCard_1.cost === const_1.COST_X_PLUS_ONE ? 1 : 0),
                                                    variable: 'chosen_cost',
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: const_1.ACTION_CALCULATE,
                                                    operandOne: 'chosen_cost',
                                                    operandTwo: regionPenalty + (baseCard_1.cost === const_1.COST_X_PLUS_ONE ? 1 : 0),
                                                    operator: const_1.CALCULATION_ADD,
                                                    variable: 'totalCost',
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: '$totalCost',
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }
                                            ] : [{
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: totalCost,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }
                                            ];
                                            this_1.transformIntoActions.apply(this_1, __spreadArray(__spreadArray(__spreadArray([{
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_PLAY_SPELL,
                                                    card: cardItself_1,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                },
                                                {
                                                    type: const_1.ACTION_CALCULATE,
                                                    operator: const_1.CALCULATION_SET,
                                                    operandOne: player_1,
                                                    variable: 'player',
                                                    generatedBy: cardItself_1.id,
                                                }], payEffects, false), [{
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                    target: cardItself_1,
                                                    bottom: false,
                                                    sourceZone: const_1.ZONE_TYPE_HAND,
                                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                                    player: player_1,
                                                    generatedBy: cardItself_1.id,
                                                }], false), preparedEffects, false));
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
                case const_1.ACTION_EFFECT: {
                    switch (action.effectType) {
                        case const_1.EFFECT_TYPE_START_TURN: {
                            if (this_1.turn === null) {
                                this_1.turn = 0;
                            }
                            else {
                                this_1.turn += 1;
                            }
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_START_STEP,
                                player: action.player,
                                step: 0,
                                generatedBy: action.generatedBy,
                            }, {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_START_OF_TURN,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            });
                            this_1.state = __assign(__assign({}, this_1.state), { continuousEffects: this_1.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean), activePlayer: action.player, step: 0 });
                            break;
                        }
                        case const_1.EFFECT_TYPE_START_STEP: {
                            // Player who goes first do not energize on first turn
                            var isFirstEnergize = this_1.turn === 0 &&
                                action.player === this_1.state.goesFirst &&
                                action.step === 0;
                            if (steps[action.step].effects && !isFirstEnergize) {
                                var transformedActions = ((_m = (_l = steps[action.step]) === null || _l === void 0 ? void 0 : _l.effects) === null || _m === void 0 ? void 0 : _m.map(function (effect) {
                                    return (__assign(__assign({}, effect), { player: action.player, generatedBy: action.generatedBy }));
                                })) || [];
                                this_1.addActions.apply(this_1, transformedActions);
                            }
                            if (steps[action.step].automatic) {
                                this_1.addActions({
                                    type: const_1.ACTION_PASS,
                                    player: action.player,
                                });
                            }
                            if (action.step === 1 && this_1.timerEnabled) {
                                this_1.startTurnTimer();
                            }
                            this_1.state = __assign(__assign({}, this_1.state), { step: action.step });
                            break;
                        }
                        case const_1.EFFECT_TYPE_CONDITIONAL: {
                            var metaData = this_1.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            var self_1 = metaData.source || metaData.new_card || action.triggerSource;
                            if (!self_1) {
                                break;
                            }
                            // checkCondition(action, self, condition)
                            var results = action.conditions.map(function (condition) {
                                return _this.checkCondition(action, self_1, condition);
                            });
                            var enrichAction = function (effect) { return (__assign(__assign({ source: self_1, player: self_1.data.controller }, effect), { generatedBy: action.generatedBy })); };
                            if (results.every(function (result) { return result === true; })) {
                                if (action.thenEffects) {
                                    var preparedEffects = action.thenEffects
                                        .map(enrichAction);
                                    this_1.transformIntoActions.apply(this_1, preparedEffects);
                                }
                            }
                            else {
                                if (action.elseEffects) {
                                    var preparedEffects = action.elseEffects
                                        .map(enrichAction);
                                    this_1.transformIntoActions.apply(this_1, preparedEffects);
                                }
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP: {
                            var numberOfCards = action.numberOfCards;
                            var draws = (new Array(numberOfCards)).fill({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DRAW,
                                stepEffect: true,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            });
                            this_1.transformIntoActions.apply(this_1, draws);
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                            var metaData = this_1.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            if ('source' in metaData || 'new_card' in metaData) {
                                var self = metaData.source || metaData.new_card;
                                this_1.state = __assign(__assign({}, this_1.state), { delayedTriggers: __spreadArray(__spreadArray([], this_1.state.delayedTriggers, true), [
                                        __assign({ id: (0, nanoid_1.default)(), self: self }, action.delayedTrigger)
                                    ], false) });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_START_OF_TURN: {
                            if (this_1.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
                                this_1.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).length > 0) {
                                var topMagi = this_1.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).cards[0];
                                var availableCards = this_1.getAvailableCards(action.player, topMagi);
                                var firstMagi = this_1.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;
                                var actionsToTake = [
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_MAGI_FLIPPED,
                                        target: topMagi,
                                    },
                                    {
                                        type: const_1.ACTION_SELECT,
                                        selector: const_1.SELECTOR_OWN_MAGI,
                                        variable: 'ownMagi',
                                    },
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
                                        target: '$ownMagi',
                                    },
                                    {
                                        type: const_1.ACTION_ENTER_PROMPT,
                                        promptType: const_1.PROMPT_TYPE_CHOOSE_CARDS,
                                        promptParams: {
                                            cards: topMagi.card.data.startingCards || [],
                                            availableCards: availableCards,
                                        },
                                        variable: 'startingCards',
                                    },
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_FIND_STARTING_CARDS,
                                        cards: '$startingCards',
                                    }
                                ];
                                if (firstMagi) {
                                    actionsToTake.push({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS,
                                        drawnCards: '$foundCards',
                                    });
                                }
                                var actions = actionsToTake.map(function (preAction) { return (__assign(__assign({}, preAction), { player: action.player, generatedBy: action.generatedBy })); });
                                this_1.transformIntoActions.apply(this_1, actions);
                            }
                            // Reset creatures' actions and attacks
                            var creatures = this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                                .filter(function (card) { return card.card.type === const_1.TYPE_CREATURE && card.data.controller === action.player; });
                            if (creatures.length > 0) {
                                creatures.forEach(function (creature) {
                                    creature.clearAttackMarkers();
                                    creature.clearActionsUsed();
                                });
                            }
                            // Reset relics' actions
                            var relics = this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                                .filter(function (card) { return card.card.type === const_1.TYPE_RELIC && card.data.controller === action.player; });
                            if (relics.length > 0) {
                                relics.forEach(function (relic) { return relic.clearActionsUsed(); });
                            }
                            // if magi is active, reset its actions used too
                            if (this_1.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
                                (_p = (_o = this_1.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player)) === null || _o === void 0 ? void 0 : _o.card) === null || _p === void 0 ? void 0 : _p.clearActionsUsed();
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_FIND_STARTING_CARDS: {
                            var cardsToFind = this_1.getMetaValue(action.cards, action.generatedBy);
                            var foundCards_1 = [];
                            if (cardsToFind.length) {
                                var deck_1 = this_1.getZone(const_1.ZONE_TYPE_DECK, action.player);
                                var discard_1 = this_1.getZone(const_1.ZONE_TYPE_DISCARD, action.player);
                                var hand_1 = this_1.getZone(const_1.ZONE_TYPE_HAND, action.player);
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
                                        var newCard = new CardInGame_1.default(card.card, action.player || 0);
                                        hand_1.add([newCard]);
                                        discard_1.removeById(card.id);
                                        foundCards_1.push(cardName);
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                            sourceCard: card,
                                            sourceZone: const_1.ZONE_TYPE_DISCARD,
                                            destinationCard: newCard,
                                            destinationZone: const_1.ZONE_TYPE_HAND,
                                            generatedBy: action.generatedBy,
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
                                        var newCard = new CardInGame_1.default(card.card, action.player || 0);
                                        hand_1.add([newCard]);
                                        deck_1.removeById(card.id);
                                        foundCards_1.push(cardName);
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                            sourceCard: card,
                                            sourceZone: const_1.ZONE_TYPE_DECK,
                                            destinationCard: newCard,
                                            destinationZone: const_1.ZONE_TYPE_HAND,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                });
                            }
                            this_1.setSpellMetaDataField('foundCards', foundCards_1, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS: {
                            var foundCards = this_1.getMetaValue(action.drawnCards, action.generatedBy) || [];
                            var number = 5 - foundCards.length;
                            if (number > 0) { // who knows
                                for (var i = 0; i < number; i++) {
                                    this_1.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DRAW,
                                        player: action.player,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_MAGI_FLIPPED: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_MAGI_PILE,
                                destinationZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
                                bottom: false,
                                target: action.target,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        /* End of starting actions */
                        case const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND: {
                            var targets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, function (target) {
                                return target && _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    sourceZone: const_1.ZONE_TYPE_HAND,
                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    target: target,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY: {
                            var card = this_1.getMetaValue(action.target, action.generatedBy);
                            if (this_1.isCardAffectedByEffect(card, action)) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_HAND,
                                    bottom: false,
                                    target: card,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY: {
                            var card = this_1.getMetaValue(action.target, action.generatedBy);
                            if (this_1.isCardAffectedByEffect(card, action)) {
                                var ownersMagi = this_1.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner)[0];
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_GET_PROPERTY_VALUE,
                                    property: const_1.PROPERTY_ENERGY_COUNT,
                                    target: card,
                                    variable: 'creatureEnergyToRefund',
                                    generatedBy: action.generatedBy,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target: ownersMagi,
                                    amount: '$creatureEnergyToRefund',
                                    generatedBy: action.generatedBy,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_HAND,
                                    bottom: false,
                                    target: card,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW_N_CARDS: {
                            var numberOfCards = this_1.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
                            for (var i = 0; i < numberOfCards; i++) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DRAW,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW: {
                            var player = this_1.getMetaValue(action.player, action.generatedBy);
                            var deck = this_1.getZone(const_1.ZONE_TYPE_DECK, player);
                            var discard = this_1.getZone(const_1.ZONE_TYPE_DISCARD, player);
                            if (deck.length > 0) {
                                var card = deck.cards[0];
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: card,
                                    sourceZone: const_1.ZONE_TYPE_DECK,
                                    destinationZone: const_1.ZONE_TYPE_HAND,
                                    bottom: false,
                                    player: player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            else if (discard.length > 0) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_RESHUFFLE_DISCARD,
                                    player: player,
                                    generatedBy: action.generatedBy,
                                }, action);
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_RESHUFFLE_DISCARD: {
                            var player = this_1.getMetaValue(action.player, action.generatedBy);
                            var deck = this_1.getZone(const_1.ZONE_TYPE_DECK, player);
                            var discard = this_1.getZone(const_1.ZONE_TYPE_DISCARD, player);
                            var newCards = discard.cards.map(function (card) { return new CardInGame_1.default(card.card, card.owner); });
                            deck.add(newCards);
                            deck.shuffle();
                            discard.empty();
                            break;
                        }
                        case const_1.EFFECT_TYPE_ATTACK: {
                            var source_2 = this_1.getMetaValue(action.source, action.generatedBy);
                            var target_1 = this_1.getMetaValue(action.target, action.generatedBy);
                            var additionalAttackers = this_1.getMetaValue(action.additionalAttackers, action.generatedBy);
                            var attackSequence = [
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                                    source: source_2,
                                    sourceAtStart: source_2.copy(),
                                    target: target_1,
                                    targetAtStart: target_1.copy(),
                                    generatedBy: source_2.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                                    source: source_2,
                                    sourceAtStart: source_2.copy(),
                                    target: target_1,
                                    targetAtStart: target_1.copy(),
                                    generatedBy: source_2.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                                    source: source_2,
                                    sourceAtStart: source_2.copy(),
                                    target: target_1,
                                    packHuntAttack: false,
                                    targetAtStart: target_1.copy(),
                                    generatedBy: source_2.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
                                    source: source_2,
                                    target: target_1,
                                    generatedBy: source_2.id,
                                },
                            ];
                            if (additionalAttackers) {
                                var preparedEffects = additionalAttackers.map(function (card) { return [
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                                        source: card,
                                        sourceAtStart: card.copy(),
                                        packHuntAttack: true,
                                        target: target_1,
                                        targetAtStart: target_1.copy(),
                                        generatedBy: source_2.id,
                                    },
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                                        source: card,
                                        sourceAtStart: card.copy(),
                                        packHuntAttack: true,
                                        target: target_1,
                                        targetAtStart: target_1.copy(),
                                        generatedBy: source_2.id,
                                    },
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                                        source: card,
                                        sourceAtStart: card.copy(),
                                        packHuntAttack: true,
                                        target: target_1,
                                        targetAtStart: target_1.copy(),
                                        generatedBy: source_2.id,
                                    },
                                    {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
                                        source: card,
                                        packHuntAttack: true,
                                        target: target_1,
                                        generatedBy: source_2.id,
                                    },
                                ]; }).flat();
                                attackSequence = __spreadArray(__spreadArray([], attackSequence, true), preparedEffects, true);
                            }
                            this_1.transformIntoActions.apply(this_1, attackSequence);
                            break;
                        }
                        // Attack sequence
                        case const_1.EFFECT_TYPE_BEFORE_DAMAGE: {
                            action.source.markAttackDone();
                            action.target.markAttackReceived();
                            break;
                        }
                        case const_1.EFFECT_TYPE_DAMAGE_STEP: {
                            // Here we finalize damage amount from both creatures' energy
                            var attackSource = action.source;
                            var attackTarget = action.target;
                            var damageByAttacker = attackSource.data.energy;
                            var damageByDefender = (attackTarget.card.type === const_1.TYPE_CREATURE) ?
                                attackTarget.data.energy :
                                0;
                            var attackerDamageAction = {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
                                source: attackSource,
                                sourceAtStart: action.sourceAtStart,
                                target: attackTarget,
                                targetAtStart: action.targetAtStart,
                                sourceBeforeDamage: attackSource.copy(),
                                targetBeforeDamage: attackTarget.copy(),
                                amount: damageByAttacker,
                                generatedBy: attackSource.id,
                            };
                            var damageActions = (attackTarget.card.type === const_1.TYPE_CREATURE && !action.packHuntAttack) ? [
                                attackerDamageAction, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
                                    source: attackTarget,
                                    sourceAtStart: action.targetAtStart,
                                    target: attackSource,
                                    amount: damageByDefender,
                                    targetAtStart: action.sourceAtStart,
                                    sourceBeforeDamage: attackTarget.copy(),
                                    targetBeforeDamage: attackSource.copy(),
                                    generatedBy: attackSource.id,
                                }
                            ] : [attackerDamageAction];
                            this_1.transformIntoActions.apply(this_1, damageActions);
                            break;
                        }
                        case const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
                                source: action.source,
                                sourceAtStart: action.sourceAtStart,
                                target: action.target,
                                targetAtStart: action.targetAtStart,
                                amount: action.amount,
                                attack: true,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
                                source: action.source,
                                sourceAtStart: action.sourceAtStart,
                                target: action.target,
                                targetAtStart: action.targetAtStart,
                                amount: action.amount,
                                attack: true,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DEAL_DAMAGE: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                                target: action.target,
                                source: action.source,
                                amount: action.amount,
                                attack: true,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_AFTER_DAMAGE: {
                            if (action.source.data.energy === 0) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: action.source,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            if (action.target.data.energy === 0 && action.target.card.type === const_1.TYPE_CREATURE) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                                    source: action.source,
                                    target: action.target,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED,
                                    target: action.target,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                            if (action.target.data.energy === 0) {
                                action.source.markDefeatedCreature();
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: action.target,
                                    bottom: false,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ROLL_DIE: {
                            var result = action.result ||
                                (this_1.rollDebugValue === null ? (Math.floor(Math.random() * 6) + 1) : this_1.rollDebugValue);
                            this_1.setSpellMetaDataField('roll_result', result, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_ENERGIZE: {
                            var targets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, function (target) {
                                var amount = _this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGIZE);
                                var type = target.card.type;
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: (type == const_1.TYPE_CREATURE) ? const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target: target,
                                    source: null,
                                    amount: amount,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC: {
                            action.from.removeEnergy(this_1.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL: {
                            action.from.removeEnergy(this_1.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE: {
                            action.from.removeEnergy(this_1.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PLAY_RELIC: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_HAND,
                                destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                                bottom: false,
                                target: action.card,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            }, {
                                type: const_1.ACTION_GET_PROPERTY_VALUE,
                                property: const_1.PROPERTY_ID,
                                target: '$new_card',
                                variable: 'relic_created',
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_PLAY_CREATURE: {
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_HAND,
                                destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                                bottom: false,
                                target: action.card,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            }, {
                                type: const_1.ACTION_CALCULATE,
                                operator: const_1.CALCULATION_SET,
                                operandOne: '$new_card',
                                variable: 'creature_created',
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                            var targets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, function (target) { return target.forbidAttacks(); });
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            var zoneChangingTargets = this_1.getMetaValue(action.target, action.generatedBy);
                            // We assume all cards changing zones are in one zone intially
                            var zoneOwner = zoneChangingTargets[0].owner;
                            var sourceZoneType_1 = this_1.getMetaValue(action.sourceZone, action.generatedBy);
                            var sourceZone_1 = this_1.getZone(sourceZoneType_1, sourceZoneType_1 === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            var destinationZoneType_1 = this_1.getMetaValue(action.destinationZone, action.generatedBy);
                            var destinationZone_1 = this_1.getZone(destinationZoneType_1, destinationZoneType_1 === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            var newCards_1 = [];
                            oneOrSeveral(zoneChangingTargets, function (zoneChangingCard) {
                                var newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
                                if (action.bottom) {
                                    destinationZone_1.add([newObject]);
                                }
                                else {
                                    destinationZone_1.addToTop([newObject]);
                                }
                                sourceZone_1.removeById(zoneChangingCard.id);
                                newCards_1.push(newObject);
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                    sourceCard: zoneChangingCard,
                                    sourceZone: sourceZoneType_1,
                                    destinationCard: newObject,
                                    destinationZone: destinationZoneType_1,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            this_1.setSpellMetaDataField('new_cards', newCards_1, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            var zoneChangingTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            var zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                            var sourceZoneType = this_1.getMetaValue(action.sourceZone, action.generatedBy);
                            var destinationZoneType = this_1.getMetaValue(action.destinationZone, action.generatedBy);
                            var destinationZone = this_1.getZone(destinationZoneType, destinationZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            var sourceZone = this_1.getZone(sourceZoneType, sourceZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            var newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
                            if (action.bottom) {
                                destinationZone.add([newObject]);
                            }
                            else {
                                destinationZone.addToTop([newObject]);
                            }
                            sourceZone.removeById(zoneChangingCard.id);
                            this_1.setSpellMetaDataField('new_card', newObject, action.generatedBy);
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                sourceCard: zoneChangingCard,
                                sourceZone: sourceZoneType,
                                destinationCard: newObject,
                                destinationZone: destinationZoneType,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES: {
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY: {
                            break;
                        }
                        case const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE: {
                            var target = this_1.getMetaValue(action.target, action.generatedBy);
                            this_1.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: target,
                                source: null,
                                amount: this_1.getMetaValue(action.amount, action.generatedBy),
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_ENERGY: {
                            var moveMultiSource = this_1.getMetaValue(action.source, action.generatedBy);
                            var moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                            var moveMultiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            var moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                            var amountToMove = this_1.getMetaValue(action.amount, action.generatedBy);
                            if (moveSource.data.energy >= amountToMove) {
                                moveSource.removeEnergy(amountToMove);
                                moveTarget.addEnergy(amountToMove);
                                if (moveSource.data.energy === 0) {
                                    switch (moveSource.card.type) {
                                        case const_1.TYPE_CREATURE: {
                                            // Creature goes to discard
                                            this_1.transformIntoActions({
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                                destinationZone: const_1.ZONE_TYPE_DISCARD,
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
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI: {
                            var addMiltiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addMiltiTarget, function (target) {
                                switch (target.card.type) {
                                    case const_1.TYPE_CREATURE:
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                            amount: action.amount,
                                            target: target,
                                            source: null,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case const_1.TYPE_MAGI:
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                            amount: action.amount,
                                            target: target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI: {
                            var discardMiltiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            var source_3 = action.source;
                            if (!source_3) {
                                break;
                            }
                            oneOrSeveral(discardMiltiTarget, function (target) {
                                switch (target.card.type) {
                                    case const_1.TYPE_CREATURE:
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            amount: action.amount,
                                            attack: action.attack || false,
                                            spell: action.spell || false,
                                            relic: action.relic || false,
                                            source: action.source,
                                            target: target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case const_1.TYPE_MAGI:
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                            source: source_3,
                                            amount: action.amount,
                                            attack: action.attack || false,
                                            spell: action.spell || false,
                                            relic: action.relic || false,
                                            target: target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            oneOrSeveral(this_1.getMetaValue(action.target, action.generatedBy), function (target) {
                                target.removeEnergy(_this.getMetaValue(action.amount, action.generatedBy));
                                // const hisCreatures = this.useSelector(SELECTOR_OWN_CREATURES, target.data.controller, null);
                                /* if (target.data.energy === 0 && hisCreatures instanceof Array && hisCreatures.length === 0) {
                                    this.transformIntoActions({
                                        type: ACTION_EFFECT,
                                        effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
                                        source: action.source || null,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                } */
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DEFEAT_MAGI: {
                            var magiMiltiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiMiltiTarget, function (target) {
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                                    target: target,
                                    source: null,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            var target = action.target, generatedBy = action.generatedBy;
                            var stillHasMagi = this_1.getZone(const_1.ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
                            if (stillHasMagi) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: target,
                                    sourceZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
                                    destinationZone: const_1.ZONE_TYPE_DEFEATED_MAGI,
                                    bottom: false,
                                    generatedBy: generatedBy,
                                }, {
                                    type: const_1.ACTION_SELECT,
                                    selector: const_1.SELECTOR_OWN_CARDS_IN_PLAY,
                                    player: target.owner,
                                    variable: 'cardsInPlay',
                                    generatedBy: generatedBy,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
                                    target: '$cardsInPlay',
                                    player: target.owner,
                                    generatedBy: generatedBy,
                                });
                            }
                            else {
                                var winner = this_1.getOpponent(target.owner);
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_PLAYER_WINS,
                                    player: winner,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES: {
                            // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
                            // No cards use this effect now, but some may later
                            // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
                            var multiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            amount = parseInt(this_1.getMetaValue(action.amount, action.generatedBy), 10);
                            oneOrSeveral(multiTarget, function (target) {
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
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
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            var multiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(multiTarget, function (target) {
                                if (_this.isCardAffectedByEffect(target, action)) {
                                    var energyToLose = parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10);
                                    var energyLossThreshold = _this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGY_LOSS_THRESHOLD);
                                    var energyLostAlready = target.data.energyLostThisTurn;
                                    if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                                        var energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                                        energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
                                    }
                                    target.removeEnergy(energyToLose);
                                    if (target.data.energy == 0 && !action.attack) {
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                            target: target,
                                            attack: false,
                                            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                            destinationZone: const_1.ZONE_TYPE_DISCARD,
                                            bottom: false,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY: {
                            var restoreTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            var restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
                            if (restoreAmount > 0) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                    source: action.source || null,
                                    target: restoreTarget,
                                    amount: restoreAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER: {
                            var payingTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            var payingAmount = Number(this_1.getMetaValue(action.amount, action.generatedBy));
                            if (payingAmount > 0) {
                                this_1.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                    target: payingTarget,
                                    source: ('length' in payingTarget) ? payingTarget[0] : payingTarget,
                                    power: false,
                                    attack: false,
                                    relic: false,
                                    spell: false,
                                    amount: payingAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            var addTargets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addTargets, function (addTarget) {
                                return addTarget.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10));
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI: {
                            var magiTargets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTargets, function (magiTarget) {
                                var startingEnergy = _this.modifyByStaticAbilities(magiTarget, const_1.PROPERTY_MAGI_STARTING_ENERGY);
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target: magiTarget,
                                    amount: startingEnergy,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            var magiTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTarget, function (target) { return target.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy)), 10); });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC: {
                            var discardTargets = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(discardTargets, function (target) {
                                var targetType = target.card.type;
                                if (targetType === const_1.TYPE_CREATURE) {
                                    _this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                                        target: target,
                                        generatedBy: action.generatedBy,
                                        player: action.player || 0,
                                    });
                                }
                                else if (targetType === const_1.TYPE_RELIC) {
                                    _this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                                        target: target,
                                        generatedBy: action.generatedBy,
                                        player: action.player || 0,
                                    });
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            var relicDiscardTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(relicDiscardTarget, function (relic) {
                                _this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: relic,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            var creatureDiscardTarget = this_1.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(creatureDiscardTarget, function (creature) {
                                if (_this.isCardAffectedByEffect(creature, action)) {
                                    var effect = {
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                        target: creature,
                                        sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                                        bottom: false,
                                        generatedBy: action.generatedBy,
                                    };
                                    _this.transformIntoActions(effect);
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                            var id = (0, nanoid_1.default)();
                            var staticAbilities = (action.staticAbilities || []).map(function (ability) {
                                switch (ability.selector) {
                                    case const_1.SELECTOR_ID: {
                                        var selectorParameterMetaValue = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                                        var selectorParameter = (selectorParameterMetaValue instanceof CardInGame_1.default) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                                        return __assign(__assign({}, ability), { selectorParameter: selectorParameter });
                                    }
                                    case const_1.SELECTOR_CREATURES_OF_PLAYER: {
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
                            this_1.state = __assign(__assign({}, this_1.state), { continuousEffects: __spreadArray(__spreadArray([], this_1.state.continuousEffects, true), [
                                    continuousEffect,
                                ], false) });
                            break;
                        }
                        case const_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                            var energyArrangement_1 = this_1.getMetaValue(action.energyOnCreatures, action.generatedBy);
                            var ownCreatures = this_1.useSelector(const_1.SELECTOR_OWN_CREATURES, action.player || 0);
                            var totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(function (card) { return card.data.energy; }).reduce(function (a, b) { return a + b; }, 0) : 0;
                            var newEnergyTotal = Object.values(energyArrangement_1).reduce(function (a, b) { return a + b; }, 0);
                            if (newEnergyTotal === totalEnergyOnCreatures) {
                                this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
                                    if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement_1) {
                                        var newEnergy = energyArrangement_1[card.id];
                                        card.setEnergy(newEnergy);
                                        if (card.data.energy === 0) {
                                            _this.transformIntoActions({
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                target: card,
                                                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                                destinationZone: const_1.ZONE_TYPE_DISCARD,
                                                bottom: false,
                                                attack: false,
                                                generatedBy: action.generatedBy,
                                            });
                                        }
                                    }
                                });
                            }
                            else if (this_1.debug) {
                                console.log("Cannot rearrange energy because new total ".concat(newEnergyTotal, " is not equal to old total ").concat(totalEnergyOnCreatures));
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            var energyArrangement_2 = this_1.getMetaValue(action.energyOnCreatures, action.generatedBy);
                            this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
                                if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement_2) {
                                    var energyAmount = energyArrangement_2[card.id];
                                    card.addEnergy(energyAmount);
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            var damageArrangement_1 = this_1.getMetaValue(action.damageOnCreatures, action.generatedBy);
                            this_1.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
                                if (card.card.type === const_1.TYPE_CREATURE && card.id in damageArrangement_1) {
                                    var damageAmount = damageArrangement_1[card.id];
                                    var source = action.source;
                                    if (damageAmount > 0 && source) {
                                        _this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            source: source,
                                            target: card,
                                            amount: damageAmount,
                                            generatedBy: action.generatedBy,
                                            player: action.player,
                                        });
                                    }
                                }
                            });
                            break;
                        }
                    }
                    break;
                }
            } // switch (action.type)
        };
        var this_1 = this, newStep, amount;
        while (this.hasActions()) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        } // while(this.hasActions())
        // SBA for Magi losing
        if (!this.state.prompt) {
            var sbActions_1 = [];
            this.players.forEach(function (player) {
                if (_this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).length === 1) {
                    var magi = _this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).card;
                    if (!magi) {
                        throw new Error('Trying to defeat missing Magi');
                    }
                    var creatures = _this.useSelector(const_1.SELECTOR_OWN_CREATURES, player);
                    if (magi.data.energy === 0 && creatures instanceof Array && creatures.length === 0) {
                        sbActions_1.push({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                            source: null,
                            target: magi,
                            generatedBy: 'thegame',
                            player: player,
                        });
                    }
                }
            });
            if (sbActions_1.length > 0) {
                this.addActions.apply(this, sbActions_1);
                this.update({
                    type: const_1.ACTION_NONE,
                });
            }
        }
        return true;
    };
    return State;
}());
exports.State = State;
//# sourceMappingURL=index.js.map