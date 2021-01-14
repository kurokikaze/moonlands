"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_PRIORITY = exports.SELECTOR_OWN_CARDS_IN_PLAY = exports.SELECTOR_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_MAGI_NOT_OF_REGION = exports.SELECTOR_OPPONENT_ID = exports.SELECTOR_MAGI_OF_REGION = exports.SELECTOR_TOP_MAGI_OF_PILE = exports.SELECTOR_ENEMY_CREATURES = exports.SELECTOR_OWN_CREATURES = exports.SELECTOR_CREATURES_NOT_OF_REGION = exports.SELECTOR_CREATURES_OF_REGION = exports.SELECTOR_ENEMY_MAGI = exports.SELECTOR_OWN_MAGI = exports.SELECTOR_CREATURES_AND_MAGI = exports.SELECTOR_CREATURES = exports.CALCULATION_MAX = exports.CALCULATION_MIN = exports.CALCULATION_HALVE_ROUND_UP = exports.CALCULATION_HALVE_ROUND_DOWN = exports.CALCULATION_SUBTRACT = exports.CALCULATION_ADD = exports.CALCULATION_DOUBLE = exports.CALCULATION_SET = exports.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = exports.PROPERTY_ATTACKS_PER_TURN = exports.PROPERTY_MAGI_STARTING_ENERGY = exports.PROPERTY_ENERGIZE = exports.PROPERTY_COST = exports.PROPERTY_REGION = exports.PROPERTY_ENERGY_COUNT = exports.PROPERTY_CONTROLLER = exports.PROPERTY_TYPE = exports.PROPERTY_ID = exports.ACTION_PLAYER_WINS = exports.ACTION_ATTACK = exports.ACTION_GET_PROPERTY_VALUE = exports.ACTION_RESOLVE_PROMPT = exports.ACTION_ENTER_PROMPT = exports.ACTION_CALCULATE = exports.ACTION_SELECT = exports.ACTION_EFFECT = exports.ACTION_POWER = exports.ACTION_PLAY = exports.ACTION_PASS = exports.TYPE_SPELL = exports.TYPE_RELIC = exports.TYPE_MAGI = exports.TYPE_CREATURE = exports.State = void 0;
exports.ZONE_TYPE_HAND = exports.COST_X = exports.REGION_UNIVERSAL = exports.EFFECT_TYPE_DRAW_REST_OF_CARDS = exports.EFFECT_TYPE_FIND_STARTING_CARDS = exports.EFFECT_TYPE_MAGI_FLIPPED = exports.EFFECT_TYPE_END_OF_TURN = exports.EFFECT_TYPE_START_OF_TURN = exports.EFFECT_TYPE_CREATURE_IS_ATTACKED = exports.EFFECT_TYPE_CREATURE_ATTACKS = exports.EFFECT_TYPE_AFTER_DAMAGE = exports.EFFECT_TYPE_DEAL_DAMAGE = exports.EFFECT_TYPE_BEFORE_DAMAGE = exports.EFFECT_TYPE_CREATURE_IS_DEFEATED = exports.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = exports.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = exports.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = exports.EFFECT_TYPE_ENERGIZE = exports.EFFECT_TYPE_ADD_ENERGY_TO_MAGI = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = exports.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = exports.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = exports.EFFECT_TYPE_MAGI_IS_DEFEATED = exports.EFFECT_TYPE_RELIC_ENTERS_PLAY = exports.EFFECT_TYPE_CREATURE_ENTERS_PLAY = exports.EFFECT_TYPE_PLAY_SPELL = exports.EFFECT_TYPE_PLAY_RELIC = exports.EFFECT_TYPE_PLAY_CREATURE = exports.EFFECT_TYPE_ROLL_DIE = exports.EFFECT_TYPE_MOVE_ENERGY = exports.EFFECT_TYPE_RESHUFFLE_DISCARD = exports.EFFECT_TYPE_DRAW = exports.PROMPT_TYPE_CHOOSE_CARDS = exports.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = exports.PROMPT_TYPE_SINGLE_MAGI = exports.PROMPT_TYPE_SINGLE_CREATURE = exports.PROMPT_TYPE_NUMBER = exports.PRIORITY_CREATURES = exports.PRIORITY_ATTACK = exports.PRIORITY_PRS = void 0;
exports.ZONE_TYPE_DEFEATED_MAGI = exports.ZONE_TYPE_DECK = exports.ZONE_TYPE_MAGI_PILE = exports.ZONE_TYPE_ACTIVE_MAGI = exports.ZONE_TYPE_DISCARD = exports.ZONE_TYPE_IN_PLAY = void 0;
const stream_1 = require("stream");
const events_1 = __importDefault(require("events"));
const nanoid_1 = __importDefault(require("nanoid"));
const const_1 = require("./const");
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
Object.defineProperty(exports, "ZONE_TYPE_HAND", { enumerable: true, get: function () { return const_1.ZONE_TYPE_HAND; } });
Object.defineProperty(exports, "ZONE_TYPE_IN_PLAY", { enumerable: true, get: function () { return const_1.ZONE_TYPE_IN_PLAY; } });
Object.defineProperty(exports, "ZONE_TYPE_DISCARD", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DISCARD; } });
Object.defineProperty(exports, "ZONE_TYPE_ACTIVE_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_ACTIVE_MAGI; } });
Object.defineProperty(exports, "ZONE_TYPE_MAGI_PILE", { enumerable: true, get: function () { return const_1.ZONE_TYPE_MAGI_PILE; } });
Object.defineProperty(exports, "ZONE_TYPE_DECK", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DECK; } });
Object.defineProperty(exports, "ZONE_TYPE_DEFEATED_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DEFEATED_MAGI; } });
const logAction_js_1 = require("./logAction.js");
const clone_1 = __importDefault(require("./clone"));
const cards_1 = require("./cards");
const CardInGame_1 = __importDefault(require("./classes/CardInGame"));
const Zone_1 = __importDefault(require("./classes/Zone"));
const convertCard = (cardInGame) => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame._card.name,
    data: cardInGame.data,
});
const steps = [
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
                effectType: const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
            },
        ],
    },
];
const defaultState = {
    actions: [],
    savedActions: [],
    delayedTriggers: [],
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
const oneOrSeveral = (targets, callback) => {
    if (targets instanceof Array) {
        if (targets.length > 0) {
            targets.forEach(target => callback(target));
        }
    }
    else {
        callback(targets);
    }
};
class State {
    constructor(state) {
        this.state = Object.assign(Object.assign(Object.assign({}, clone_1.default(defaultState)), { spellMetaData: {} }), state);
        this.players = [0, 1]; // For simple testing
        this.decks = [];
        this.winner = false;
        this.debug = false;
        this.turn = null;
        this.rollDebugValue = null,
            this.actionsOne = [];
        this.actionsTwo = [];
        this.actionStreamOne = new events_1.default();
        this.actionStreamTwo = new events_1.default();
        this.logStream = new events_1.default();
        this.commandStream = new stream_1.Writable({
            objectMode: true,
            write: (command) => {
                if (Object.prototype.hasOwnProperty.call(command, 'type')) {
                    this.update(command);
                }
            },
        });
    }
    closeStreams() {
        // typescript does not understand destroying streams
        // @ts-ignore
        this.actionStreamOne.destroy();
        // @ts-ignore
        this.actionStreamTwo.destroy();
        this.logStream.destroy();
        this.commandStream.destroy();
    }
    addActionToStream(action) {
        // Do not send outside CALCULATE, SELECT and so on
        if (![const_1.ACTION_CALCULATE, const_1.ACTION_SELECT, const_1.ACTION_GET_PROPERTY_VALUE].includes(action.type)) {
            this.actionStreamOne.emit('action', action);
            this.actionStreamTwo.emit('action', action);
        }
        this.logStream.emit('action', action);
    }
    enableDebug() {
        this.debug = true;
    }
    setRollDebugValue(value) {
        this.rollDebugValue = value;
    }
    resetRollDebugValue() {
        this.rollDebugValue = null;
    }
    setWinner(player) {
        this.winner = player;
    }
    hasWinner() {
        return this.winner !== false;
    }
    setPlayers(player1, player2) {
        this.players = [player1, player2];
        return this;
    }
    setDeck(player, cardNames) {
        if (this.players.includes(player)) {
            const deck = cardNames.map(card => new CardInGame_1.default(cards_1.byName(card), player));
            this.decks.push({
                player,
                deck,
            });
        }
        else {
            throw new Error(`Non-existing player: ${player}`);
        }
    }
    addActionToLog(action) {
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
                        const metaValue = this.getMetaValue(action.card, action.generatedBy);
                        const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_PLAY,
                            card: metaCard.card.name,
                            player: action.player,
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
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
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
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
                    if (this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
                        this.state.promptType === const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_MAGI) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_TARGETING,
                            card: action.target.card.name,
                            player: action.player,
                        };
                    }
                    if (this.state.promptType === const_1.PROMPT_TYPE_NUMBER) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_NUMBER_CHOICE,
                            number: action.number,
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
            this.state.log = [
                ...this.state.log,
                newLogEntry,
            ];
        }
    }
    createZones() {
        const [playerOne, playerTwo] = this.players;
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
    }
    serializeData(playerId) {
        const gameEnded = !(this.winner === false);
        return {
            zones: this.serializeZones(playerId),
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
            gameEnded,
            winner: gameEnded ? this.winner : null,
        };
    }
    serializeZones(playerId) {
        const opponentId = this.getOpponent(playerId);
        return {
            playerHand: this.getZone(const_1.ZONE_TYPE_HAND, playerId).serialize(),
            opponentHand: this.getZone(const_1.ZONE_TYPE_HAND, opponentId).serialize(true),
            playerDeck: this.getZone(const_1.ZONE_TYPE_DECK, playerId).serialize(true),
            opponentDeck: this.getZone(const_1.ZONE_TYPE_DECK, opponentId).serialize(true),
            playerActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
            opponentActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
            playerMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, playerId).serialize(true),
            opponentMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, opponentId).serialize(),
            playerInPlay: this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(c => c.data.controller == playerId).map(c => c.serialize()),
            opponentInPlay: this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(c => c.data.controller == opponentId).map(c => c.serialize()),
            playerDefeatedMagi: this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, playerId).serialize(),
            opponentDefeatedMagi: this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, opponentId).serialize(),
            playerDiscard: this.getZone(const_1.ZONE_TYPE_DISCARD, playerId).serialize(),
            opponentDiscard: this.getZone(const_1.ZONE_TYPE_DISCARD, opponentId).serialize(),
        };
    }
    setup() {
        if (this.players.length < 2) {
            throw new Error('Not enough players');
        }
        if (this.decks.length < 2) {
            throw new Error('Not enough decks for players');
        }
        const zones = this.state.zones.length == 0 ? this.createZones() : this.state.zones;
        this.state.zones = zones;
        this.decks.forEach(({ player, deck }) => {
            const magi = deck.filter(card => card.card.type === const_1.TYPE_MAGI);
            const rest = deck.filter(card => card.card.type != const_1.TYPE_MAGI);
            this.getZone(const_1.ZONE_TYPE_MAGI_PILE, player).add(magi);
            this.getZone(const_1.ZONE_TYPE_DECK, player).add(rest).shuffle();
        });
        const goesFirst = this.players[(Math.random() > 0.5 ? 0 : 1)];
        this.state = Object.assign(Object.assign({}, this.state), { zones, step: null, turn: 1, goesFirst, activePlayer: goesFirst });
    }
    getOpponent(player) {
        return this.players.find(pl => pl != player);
    }
    getZone(type, player = null) {
        return this.state.zones.find(zone => zone.type === type && (zone.player == player || player == null)) || new Zone_1.default('Empty zone', const_1.ZONE_TYPE_DECK);
    }
    getCurrentStep() {
        return this.state.step;
    }
    getActivePlayer() {
        return this.state.activePlayer;
    }
    getCurrentPriority() {
        return steps[this.state.step].priority;
    }
    addActions(...args) {
        this.state.actions.push(...args);
    }
    transformIntoActions(...args) {
        this.state.actions.unshift(...args);
    }
    removeDelayedTrigger(triggerId) {
        this.state.delayedTriggers = this.state.delayedTriggers.filter(({ id }) => id != triggerId);
    }
    getNextAction() {
        return this.state.actions.shift();
    }
    hasActions() {
        return this.state.actions.length > 0;
    }
    setSpellMetadata(metadata, spellId) {
        this.state = Object.assign(Object.assign({}, this.state), { spellMetaData: Object.assign(Object.assign({}, this.state.spellMetaData), { [spellId]: metadata }) });
    }
    getSpellMetadata(spellId) {
        return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
    }
    setSpellMetaDataField(field, value, spellId) {
        if (!spellId) {
            throw new Error('Saving spell metadata field without spellId');
        }
        const metaData = this.getSpellMetadata(spellId);
        this.setSpellMetadata(Object.assign(Object.assign({}, metaData), { [field]: value }), spellId);
    }
    getMetaValue(value, spellId) {
        if (typeof value == 'string' &&
            value[0] == '$') {
            const variableName = value.slice(1);
            const spellMetaData = this.getSpellMetadata(spellId);
            return Object.prototype.hasOwnProperty.call(spellMetaData, variableName) ? spellMetaData[variableName] : null;
        }
        else {
            return value;
        }
    }
    /**
     * Same as getMetaValue, but instead of $-variables it uses %-variables
     * $-variables are kept intact, we probably need them
     * %-variables include usual "self": link to trigger source
     */
    prepareMetaValue(value, action, self, spellId) {
        if (value === '%self')
            return self;
        if (typeof value == 'string' &&
            value[0] == '%') {
            const variableName = value.slice(1);
            // %-variables first refer to action's properties
            if (action[variableName])
                return action[variableName];
            // if not, we use spellMetaData
            const spellMetaData = this.getSpellMetadata(spellId);
            return Object.prototype.hasOwnProperty.call(spellMetaData, variableName) ? spellMetaData[variableName] : null;
        }
        else {
            return value;
        }
    }
    useSelector(selector, player, argument) {
        switch (selector) {
            case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player);
            }
            case const_1.SELECTOR_RELICS: {
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == const_1.TYPE_RELIC);
            }
            case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                        .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards
                        .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                ];
            }
            case const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                ];
            }
            case const_1.SELECTOR_OPPONENT_ID:
                return this.players.find(id => id != argument);
            case const_1.SELECTOR_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_MAGI:
                return [
                    ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards,
                    ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards,
                ].filter(Boolean);
            case const_1.SELECTOR_TOP_MAGI_OF_PILE: {
                const topMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case const_1.SELECTOR_OWN_MAGI:
                return this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards;
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND:
                return this.getZone(const_1.ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == const_1.TYPE_SPELL);
            case const_1.SELECTOR_ENEMY_MAGI:
                return this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player)).cards;
            case const_1.SELECTOR_OWN_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_ENEMY_CREATURES:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) != player && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_OF_REGION:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) == argument && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_NOT_OF_REGION:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) != argument && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_NOT_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => !card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player &&
                    card.card.type == const_1.TYPE_CREATURE &&
                    card.card.name.split(' ').includes(argument));
            case const_1.SELECTOR_STATUS:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument));
            case const_1.SELECTOR_CREATURES_WITHOUT_STATUS:
                return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(card => card.card.type == const_1.TYPE_CREATURE)
                    .filter(card => !this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument));
        }
    }
    getByProperty(target, property, subProperty = null) {
        switch (property) {
            case const_1.PROPERTY_ID:
                return target.id;
            case const_1.PROPERTY_TYPE:
                return target.card.type;
            case const_1.PROPERTY_CREATURE_TYPES:
                return target.card.name.split(' ');
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
                return target.modifiedCard ?
                    target.modifiedCard.data.powers.find(({ name }) => name === subProperty).cost :
                    target.card.data.powers.find(({ name }) => name === subProperty).cost;
            case const_1.PROPERTY_STATUS_WAS_ATTACKED:
                return target.data.wasAttacked || false;
            case const_1.PROPERTY_STATUS_DEFEATED_CREATURE:
                return target.data.defeatedCreature || false;
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
    }
    isCardAffectedByStaticAbility(card, staticAbility) {
        switch (staticAbility.selector) {
            case const_1.SELECTOR_OWN_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_MAGI: {
                return card.card.type === const_1.TYPE_MAGI &&
                    this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).card.id === card.id;
            }
            case const_1.SELECTOR_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case const_1.SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND: {
                return this.getZone(const_1.ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id);
            }
        }
    }
    modifyByStaticAbilities(target, property, subProperty = null) {
        if (!target) {
            return null;
        }
        const PLAYER_ONE = this.players[0];
        const PLAYER_TWO = this.players[1];
        const gameStaticAbilities = [
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
        const allZonesCards = [
            ...this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards,
            ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards,
            ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards,
        ];
        const propertyLayers = {
            [const_1.PROPERTY_COST]: 1,
            [const_1.PROPERTY_ENERGIZE]: 2,
            [const_1.PROPERTY_STATUS]: 3,
            [const_1.PROPERTY_ATTACKS_PER_TURN]: 4,
            [const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY]: 5,
            [const_1.PROPERTY_ENERGY_LOSS_THRESHOLD]: 6,
            [const_1.PROPERTY_ABLE_TO_ATTACK]: 7,
        };
        const zoneAbilities = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
            ...acc,
            ...(cardInPlay.card.data.staticAbilities.map(a => (Object.assign(Object.assign({}, a), { player: cardInPlay.data.controller }))))
        ] : acc, []);
        const staticAbilities = [...gameStaticAbilities, ...zoneAbilities].sort((a, b) => propertyLayers[a.property] - propertyLayers[b.property]);
        let initialCardData = {
            card: target.card,
            modifiedCard: Object.assign(Object.assign({}, target.card), { data: Object.assign(Object.assign({}, target.card.data), { energyLossThreshold: 0, ableToAttack: true }) }),
            data: Object.assign({}, target.data),
            id: target.id,
            owner: target.owner,
        };
        const modifiedCardData = staticAbilities.reduce(this.layeredDataReducer.bind(this), initialCardData);
        return this.getByProperty(modifiedCardData, property, subProperty);
    }
    layeredDataReducer(currentCard, staticAbility) {
        if (this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
            switch (staticAbility.property) {
                case const_1.PROPERTY_COST: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_COST);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { cost: resultValue }) });
                }
                case const_1.PROPERTY_ENERGIZE: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { energize: resultValue }) }) });
                }
                case const_1.PROPERTY_ATTACKS_PER_TURN: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ATTACKS_PER_TURN);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { attacksPerTurn: resultValue }) }) });
                }
                case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { energyLossThreshold: resultValue }) }) });
                }
                case const_1.PROPERTY_ABLE_TO_ATTACK: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ABLE_TO_ATTACK);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { ableToAttack: resultValue }) }) });
                }
                case const_1.PROPERTY_STATUS: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_STATUS, staticAbility.subProperty);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, operandOne) :
                        this.performCalculation(operator, operandOne, initialValue);
                    switch (staticAbility.subProperty) {
                        case [const_1.STATUS_BURROWED]: {
                            return Object.assign(Object.assign({}, currentCard), { data: Object.assign(Object.assign({}, currentCard.data), { burrowed: resultValue }) });
                        }
                        default: {
                            return currentCard;
                        }
                    }
                }
                case const_1.PROPERTY_POWER_COST: {
                    if (currentCard.modifiedCard.data.powers) {
                        const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
                            const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_POWER_COST, power.name);
                            const { operator, operandOne } = staticAbility.modifier;
                            const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                                this.performCalculation(operator, initialValue, operandOne) :
                                this.performCalculation(operator, operandOne, initialValue);
                            return Object.assign(Object.assign({}, power), { cost: resultValue });
                        });
                        return Object.assign(Object.assign({}, currentCard), { modifiedCard: Object.assign(Object.assign({}, currentCard.modifiedCard), { data: Object.assign(Object.assign({}, currentCard.modifiedCard.data), { powers: updatedPowers }) }) });
                    }
                    return currentCard;
                }
                default: {
                    return currentCard;
                }
            }
        }
        return currentCard;
    }
    makeChecker(restriction, restrictionValue) {
        switch (restriction) {
            case const_1.RESTRICTION_CREATURE_TYPE:
                return (card) => card.card.name.split(' ').includes(restrictionValue);
            case const_1.RESTRICTION_TYPE:
                return (card) => card.card.type === restrictionValue;
            case const_1.RESTRICTION_PLAYABLE:
                return (card) => {
                    const magi = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner, null)[0];
                    const cardCost = this.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case const_1.RESTRICTION_MAGI_WITHOUT_CREATURES:
                return (card) => {
                    if (card.card.type !== const_1.TYPE_MAGI)
                        return false;
                    const creatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, card.owner, null);
                    return (creatures instanceof Array && creatures.length === 0);
                };
            case const_1.RESTRICTION_REGION:
                return (card) => card.card.region === restrictionValue;
            case const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.energy < card.card.cost;
            case const_1.RESTRICTION_ENERGY_LESS_THAN:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.energy < restrictionValue;
            case const_1.RESTRICTION_CREATURE_WAS_ATTACKED:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.wasAttacked === true;
            // For own and opponents creatures we pass effect controller as restrictionValue
            case const_1.RESTRICTION_OWN_CREATURE:
                return (card) => card.data.controller === restrictionValue;
            case const_1.RESTRICTION_OPPONENT_CREATURE:
                return (card) => card.data.controller !== restrictionValue;
            case const_1.RESTRICTION_STATUS:
                return (card) => this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, restrictionValue);
            default:
                return () => true;
        }
    }
    checkAnyCardForRestriction(cards, restriction, restrictionValue) {
        return cards.some(this.makeChecker(restriction, restrictionValue));
    }
    checkAnyCardForRestrictions(cards, restrictions) {
        return cards.some(this.makeCardFilter(restrictions));
    }
    checkCardsForRestriction(cards, restriction, restrictionValue) {
        return cards.every(this.makeChecker(restriction, restrictionValue));
    }
    makeCardFilter(restrictions = []) {
        const checkers = restrictions.map(({ type, value }) => this.makeChecker(type, value));
        return card => checkers.every(checker => checker(card)); // combine checkers
    }
    getObjectOrSelf(action, self, object, property) {
        if (object == 'self') {
            return self;
        }
        return property ? this.getMetaValue(action[object], action.generatedBy) : object;
    }
    replaceByReplacementEffect(action) {
        const PLAYER_ONE = this.players[0];
        const PLAYER_TWO = this.players[1];
        const allZonesCards = [
            ...(this.getZone(const_1.ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
            ...(this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE)).cards,
            ...(this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO)).cards,
        ];
        const zoneReplacements = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.replacementEffects ? [
            ...acc,
            ...cardInPlay.card.data.replacementEffects.map(effect => (Object.assign(Object.assign({}, effect), { self: cardInPlay }))),
        ] : acc, []);
        let replacementFound = false;
        let appliedReplacerId = null;
        let appliedReplacerSelf = null;
        let replaceWith = null;
        zoneReplacements.forEach(replacer => {
            const replacerId = replacer.self.id; // Not really, but will work for now
            if (action.replacedBy && action.replacedBy.includes(replacerId)) {
                return false;
            }
            if (this.matchAction(action, replacer.find, replacer.self)) {
                replacementFound = true;
                appliedReplacerSelf = replacer.self;
                appliedReplacerId = replacerId;
                replaceWith = replacer.replaceWith;
            }
        });
        const previouslyReplacedBy = action.replacedBy || [];
        if (replacementFound) {
            let resultEffect = Object.assign(Object.assign({ type: const_1.ACTION_EFFECT }, replaceWith), { replacedBy: [
                    ...previouslyReplacedBy,
                    appliedReplacerId,
                ], generatedBy: action.generatedBy });
            // prepare %-values on created action
            Object.keys(replaceWith)
                .filter(key => !['type', 'effectType'].includes(key))
                .forEach(key => {
                const value = this.prepareMetaValue(replaceWith[key], action, appliedReplacerSelf, action.generatedBy);
                resultEffect[key] = value;
            });
            return resultEffect;
        }
        return action;
    }
    checkCondition(action, self, condition) {
        if (!Object.prototype.hasOwnProperty.call(condition, 'objectOne') ||
            !Object.prototype.hasOwnProperty.call(condition, 'objectTwo')) {
            throw new Error('Missing object field in condition');
        }
        const objectOne = this.getObjectOrSelf(action, self, condition.objectOne, condition.propertyOne);
        const objectTwo = this.getObjectOrSelf(action, self, condition.objectTwo, condition.propertyTwo);
        const operandOne = (condition.propertyOne && condition.propertyOne !== const_1.ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectOne, condition.propertyOne) : objectOne;
        const operandTwo = (condition.propertyTwo && condition.propertyTwo !== const_1.ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectTwo, condition.propertyTwo) : objectTwo;
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
        return false;
    }
    matchAction(action, find, self) {
        if (action.type !== const_1.ACTION_EFFECT) {
            return false;
        }
        if (action.effectType !== find.effectType) {
            return false;
        }
        const conditions = find.conditions.map(condition => this.checkCondition(action, self, condition));
        return conditions.every(result => result === true);
    }
    triggerAbilities(action) {
        const PLAYER_ONE = this.players[0];
        const PLAYER_TWO = this.players[1];
        const allZonesCards = [
            ...(this.getZone(const_1.ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
            ...(this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE) || { cards: [] }).cards,
            ...(this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO) || { cards: [] }).cards,
        ];
        const cardTriggerEffects = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.triggerEffects ? [
            ...acc,
            ...cardInPlay.card.data.triggerEffects.map(effect => (Object.assign(Object.assign({}, effect), { self: cardInPlay }))),
        ] : acc, []);
        const triggerEffects = [...cardTriggerEffects, ...this.state.delayedTriggers];
        triggerEffects.forEach(replacer => {
            const triggeredId = replacer.id || replacer.self.id; // Not really, but will work for now
            if (this.matchAction(action, replacer.find, replacer.self)) {
                // Save source to *trigger source* metadata (it's probably empty)
                // For creatures set creatureSource field (just for convenience)
                this.setSpellMetaDataField('source', replacer.self, action.generatedBy || triggeredId);
                if (replacer.self.card.type === const_1.TYPE_CREATURE) {
                    this.setSpellMetaDataField('sourceCreature', replacer.self, action.generatedBy || triggeredId);
                }
                // Turn effect-templates into actual effect actions by preparing meta-values				
                const preparedEffects = replacer.effects.map(effect => {
                    let resultEffect = {
                        type: effect.type || const_1.ACTION_EFFECT,
                        effectType: effect.effectType,
                        generatedBy: action.generatedBy || triggeredId,
                        triggeredId: [triggeredId],
                        triggerSource: replacer.self,
                        player: replacer.self.data.controller,
                    };
                    // prepare %-values on created action
                    Object.keys(effect)
                        .filter(key => !['type', 'effectType'].includes(key))
                        .forEach(key => {
                        const value = this.prepareMetaValue(effect[key], action, replacer.self, action.generatedBy);
                        resultEffect[key] = value;
                    });
                    return resultEffect;
                });
                this.transformIntoActions(...preparedEffects);
                if (replacer.id) {
                    this.removeDelayedTrigger(replacer.id);
                }
            }
        });
    }
    performCalculation(operator, operandOne, operandTwo) {
        let result;
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
    }
    calculateTotalCost(card) {
        const activeMagiSelected = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner, null);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            const activeMagi = activeMagiSelected[0];
            const baseCost = this.modifyByStaticAbilities(card, const_1.PROPERTY_COST);
            const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return null;
    }
    update(initialAction) {
        if (this.hasWinner()) {
            return false;
        }
        this.addActions(initialAction);
        while (this.hasActions()) {
            const rawAction = this.getNextAction();
            const action = this.replaceByReplacementEffect(rawAction);
            if (this.debug) {
                logAction_js_1.showAction(action);
            }
            this.addActionToLog(action);
            this.addActionToStream(action);
            this.triggerAbilities(action);
            switch (action.type) {
                case const_1.ACTION_CONCEDE: {
                    const opponentId = this.getOpponent(action.player);
                    this.transformIntoActions({
                        type: const_1.ACTION_PLAYER_WINS,
                        player: opponentId,
                    });
                    break;
                }
                case const_1.ACTION_PLAYER_WINS: {
                    this.setWinner(action.player);
                    this.state.actions = [];
                    break;
                }
                case const_1.ACTION_ATTACK: {
                    const attackSource = this.getMetaValue(action.source, action.generatedBy);
                    const attackTarget = this.getMetaValue(action.target, action.generatedBy);
                    const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy) || [];
                    const sourceAttacksPerTurn = this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ATTACKS_PER_TURN);
                    const attackerCanAttack = this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ABLE_TO_ATTACK);
                    if (!attackerCanAttack) {
                        console.log(`Somehow ${attackSource.card.name} cannot attack`);
                    }
                    const sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
                    const additionalAttackersHasAttacksLeft = additionalAttackers.every(card => card.card.data.canPackHunt && card.data.attacked < this.modifyByStaticAbilities(card, const_1.PROPERTY_ATTACKS_PER_TURN));
                    const targetIsMagi = attackTarget.card.type == const_1.TYPE_MAGI;
                    const opponentCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, attackTarget.owner, null);
                    const magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;
                    const attackApproved = attackerCanAttack &&
                        !targetIsMagi || ( // Either we attack a creature
                    targetIsMagi && ( // Or we are attacking a magi, but then...
                    !magiHasCreatures || // ...he either shouldn't have creatures
                        this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
                    ));
                    const enoughAttacksLeft = (sourceHasAttacksLeft && (additionalAttackersHasAttacksLeft || additionalAttackers.length === 0));
                    if (enoughAttacksLeft && attackApproved && this.getCurrentPriority() == const_1.PRIORITY_ATTACK) {
                        let attackSequence = [
                            {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                                source: attackSource,
                                sourceAtStart: attackSource.copy(),
                                target: attackTarget,
                                targetAtStart: attackTarget.copy(),
                                generatedBy: attackSource.id,
                            },
                            {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                                source: attackSource,
                                sourceAtStart: attackSource.copy(),
                                target: attackTarget,
                                targetAtStart: attackTarget.copy(),
                                generatedBy: attackSource.id,
                            },
                            {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                                source: attackSource,
                                sourceAtStart: attackSource.copy(),
                                target: attackTarget,
                                packHuntAttack: false,
                                targetAtStart: attackTarget.copy(),
                                generatedBy: attackSource.id,
                            },
                            {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
                                source: attackSource,
                                target: attackTarget,
                                generatedBy: attackSource.id,
                            },
                        ];
                        if (additionalAttackers) {
                            const preparedEffects = additionalAttackers.map((card) => [
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                                    source: card,
                                    sourceAtStart: card.copy(),
                                    packHuntAttack: true,
                                    target: attackTarget,
                                    targetAtStart: attackTarget.copy(),
                                    generatedBy: attackSource.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                                    source: card,
                                    sourceAtStart: card.copy(),
                                    packHuntAttack: true,
                                    target: attackTarget,
                                    targetAtStart: attackTarget.copy(),
                                    generatedBy: attackSource.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                                    source: card,
                                    sourceAtStart: card.copy(),
                                    packHuntAttack: true,
                                    target: attackTarget,
                                    targetAtStart: attackTarget.copy(),
                                    generatedBy: attackSource.id,
                                },
                                {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
                                    source: card,
                                    packHuntAttack: true,
                                    target: attackTarget,
                                    generatedBy: attackSource.id,
                                },
                            ]).flat();
                            attackSequence = [...attackSequence, ...preparedEffects];
                        }
                        this.transformIntoActions(...attackSequence);
                    }
                    break;
                }
                case const_1.ACTION_GET_PROPERTY_VALUE: {
                    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                    // Sometimes we can only pass here results of a selector. 
                    // If so, work on first element of result.
                    const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
                    const property = this.getMetaValue(action.property, action.generatedBy);
                    const modifiedResult = this.modifyByStaticAbilities(target, property);
                    const variable = action.variable || 'result';
                    this.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
                    break;
                }
                case const_1.ACTION_CALCULATE: {
                    const operandOne = this.getMetaValue(action.operandOne, action.generatedBy);
                    const operandTwo = this.getMetaValue(action.operandTwo, action.generatedBy);
                    const result = this.performCalculation(action.operator, operandOne, operandTwo);
                    const variable = action.variable || 'result';
                    this.setSpellMetaDataField(variable, result, action.generatedBy);
                    break;
                }
                case const_1.ACTION_POWER: {
                    const powerCost = this.modifyByStaticAbilities(action.source, const_1.PROPERTY_POWER_COST, action.power.name);
                    const payingCard = (action.source.card.type === const_1.TYPE_RELIC) ?
                        this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
                        action.source;
                    if (!action.source.wasActionUsed(action.power.name) &&
                        (payingCard.data.energy >= powerCost ||
                            (payingCard.data.energy > 0 && powerCost === const_1.COST_X))) {
                        const source = action.source;
                        const sourcePower = action.power;
                        const effects = action.power.effects;
                        const enrichAction = (effect) => (Object.assign(Object.assign({}, effect), { power: true, generatedBy: source.id, player: action.player }));
                        const preparedActions = effects.map(enrichAction);
                        // Calculate if prompts are resolvable
                        // If source is Magi, it will not be filtered out, being in another zone
                        const creatureWillSurvive = source.data.energy > powerCost;
                        const ourCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => (creatureWillSurvive ? card.id !== action.source.id : true) && card.data.controller === action.source.data.controller);
                        const allCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => creatureWillSurvive ? card.id !== action.source.id : true);
                        // powerPromptsDoable
                        const testablePrompts = [
                            const_1.PROMPT_TYPE_SINGLE_CREATURE,
                            const_1.PROMPT_TYPE_RELIC,
                            const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                            const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                            const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                            const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        ];
                        const testablePromptFilter = (action) => action.type === const_1.ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
                        const allPrompts = preparedActions.filter(testablePromptFilter);
                        const allPromptsAreDoable = allPrompts.every(promptAction => {
                            switch (promptAction.promptType) {
                                case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                                    return allCardsInPlay.some(card => card.card.type === const_1.TYPE_CREATURE);
                                case const_1.PROMPT_TYPE_RELIC:
                                    return allCardsInPlay.some(card => card.card.type === const_1.TYPE_RELIC);
                                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
                                    return ourCardsInPlay.some(card => card.card.type === const_1.TYPE_CREATURE);
                                case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => card.id !== action.source.id);
                                }
                                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                    if (promptAction.restrictions) {
                                        return this.checkAnyCardForRestrictions(allCardsInPlay, promptAction.restrictions);
                                    }
                                    else if (promptAction.restriction) {
                                        switch (promptAction.restriction) {
                                            case const_1.RESTRICTION_OWN_CREATURE: {
                                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, action.source.data.controller);
                                            }
                                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, action.source.data.controller);
                                            }
                                            default: {
                                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                                            }
                                        }
                                    }
                                    return true;
                                }
                                case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                                    const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
                                    const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
                                    if (promptAction.restrictions) {
                                        return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                                    }
                                    else if (promptAction.restriction) {
                                        switch (promptAction.restriction) {
                                            case const_1.RESTRICTION_OWN_CREATURE: {
                                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, action.source.data.controller);
                                            }
                                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, action.source.data.controller);
                                            }
                                            default: {
                                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                                            }
                                        }
                                    }
                                    return true;
                                }
                                default:
                                    return true;
                            }
                        });
                        if (allPromptsAreDoable) {
                            let currentPowerMetaData = {
                                source,
                                sourcePower,
                                player: action.player,
                                sourceCreature: source,
                            }; // No retrieving old metadata from old activations
                            source.setActionUsed(action.power.name);
                            if (powerCost == const_1.COST_X) {
                                this.addActions({
                                    type: const_1.ACTION_ENTER_PROMPT,
                                    promptType: const_1.PROMPT_TYPE_NUMBER,
                                    player: action.player,
                                    generatedBy: source.id,
                                    min: 1,
                                    max: action.source.data.energy,
                                }, {
                                    type: const_1.ACTION_CALCULATE,
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: '$number',
                                    variable: 'chosen_cost',
                                    generatedBy: source.id,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: '$number',
                                    generatedBy: source.id,
                                });
                            }
                            else if (powerCost > 0) {
                                this.addActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: powerCost,
                                    generatedBy: source.id,
                                });
                            }
                            this.addActions(...preparedActions);
                            this.setSpellMetadata(currentPowerMetaData, source.id);
                        }
                    }
                    break;
                }
                case const_1.ACTION_ENTER_PROMPT: {
                    if (!Object.prototype.hasOwnProperty.call(action, 'player')) {
                        throw new Error('Prompt without player!');
                    }
                    const savedActions = this.state.actions;
                    let promptParams = {};
                    const promptPlayer = this.getMetaValue(action.player, action.generatedBy);
                    switch (action.promptType) {
                        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                            promptParams = {
                                source: this.getMetaValue(action.source, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                            if (action.restriction && action.restrictions) {
                                throw new Error('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
                            }
                            const restrictions = action.restrictions || (action.restriction ? [
                                {
                                    type: this.getMetaValue(action.restriction, action.generatedBy),
                                    value: this.getMetaValue(action.restrictionValue, action.generatedBy),
                                },
                            ] : null);
                            const zone = this.getMetaValue(action.zone, action.generatedBy);
                            const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
                            const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
                            const cardFilter = this.makeCardFilter(restrictions || []);
                            const zoneContent = this.getZone(zone, zoneOwner).cards;
                            const cards = restrictions ? zoneContent.filter(cardFilter) : zoneContent;
                            promptParams = {
                                zone,
                                zoneOwner,
                                restrictions,
                                numberOfCards,
                                cards: cards.map(convertCard),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                            promptParams = {
                                restriction: action.restriction,
                                restrictionValue: action.restrictionValue,
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_CARDS: {
                            promptParams = action.promptParams;
                            break;
                        }
                        case const_1.PROMPT_TYPE_NUMBER: {
                            promptParams = {
                                min: this.getMetaValue(action.min, action.generatedBy),
                                max: this.getMetaValue(action.max, action.generatedBy),
                            };
                            break;
                        }
                    }
                    this.state = Object.assign(Object.assign({}, this.state), { actions: [], savedActions, prompt: true, promptMessage: action.message, promptPlayer, promptType: action.promptType, promptVariable: action.variable, promptGeneratedBy: action.generatedBy, promptParams });
                    break;
                }
                case const_1.ACTION_RESOLVE_PROMPT: {
                    const generatedBy = action.generatedBy || this.state.promptGeneratedBy;
                    const variable = action.variable || this.state.promptVariable;
                    let currentActionMetaData = this.state.spellMetaData[generatedBy] || {};
                    switch (this.state.promptType) {
                        case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                            if (this.state.promptParams.numberOfCards !== action.cards.length) {
                                return false;
                            }
                            if (this.state.promptParams.restrictions) {
                                const checkResult = this.state.promptParams.restrictions.every(({ type, value }) => this.checkCardsForRestriction(action.cards, type, value));
                                if (!checkResult) {
                                    return false;
                                }
                            }
                            currentActionMetaData[variable || 'targetCards'] = action.cards;
                            break;
                        }
                        case const_1.PROMPT_TYPE_NUMBER:
                            currentActionMetaData[variable || 'number'] = action.number;
                            break;
                        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
                            if (this.state.promptParams.source.id === action.target.id) {
                                throw new Error('Got forbidden target on prompt');
                            }
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        case const_1.PROMPT_TYPE_RELIC: {
                            if (action.target.card.type !== const_1.TYPE_RELIC) {
                                throw new Error('Got forbidden target on prompt');
                            }
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        }
                        case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                            if (this.state.promptPlayer !== action.target.data.controller) {
                                throw new Error('Not-controlled creature supplied to Own Creatures prompt');
                            }
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        }
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        }
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                            currentActionMetaData[variable || 'target'] = action.target;
                            break;
                        case const_1.PROMPT_TYPE_SINGLE_MAGI:
                            currentActionMetaData[variable || 'targetMagi'] = action.target;
                            break;
                        case const_1.PROMPT_TYPE_CHOOSE_CARDS:
                            currentActionMetaData[variable || 'selectedCards'] = action.cards || [];
                            break;
                    }
                    const actions = this.state.savedActions || [];
                    this.state = Object.assign(Object.assign({}, this.state), { actions, savedActions: [], prompt: false, promptType: null, promptMessage: null, promptGeneratedBy: null, promptVariable: null, promptParams: {}, spellMetaData: Object.assign(Object.assign({}, this.state.spellMetaData), { [generatedBy]: currentActionMetaData }) });
                    break;
                }
                case const_1.ACTION_SELECT: {
                    let result;
                    switch (action.selector) {
                        case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CARDS_IN_PLAY, action.player, null);
                            break;
                        }
                        case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CREATURES_OF_TYPE, action.player, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_OF_TYPE: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_NOT_OF_TYPE: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_NOT_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                            result = this.useSelector(const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE, action.player, null);
                            break;
                        }
                        case const_1.SELECTOR_OPPONENT_ID: {
                            result = this.useSelector(const_1.SELECTOR_OPPONENT_ID, action.player, this.getMetaValue(action.opponentOf || action.player, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player, null);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_AND_MAGI: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player, null);
                            const creatures = this.useSelector(const_1.SELECTOR_CREATURES, null, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                                ...(creatures instanceof Array ? creatures : []),
                            ];
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_OF_REGION: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_OF_REGION, action.player, action.region);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_NOT_OF_REGION: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_NOT_OF_REGION, action.player, action.region);
                            break;
                        }
                        case const_1.SELECTOR_OTHER_CREATURES_OF_TYPE: {
                            const creatures = this.useSelector(const_1.SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            result = (creatures instanceof Array) ? creatures.filter((card) => card.id !== action.generatedBy) : [];
                            break;
                        }
                        case const_1.SELECTOR_MAGI_OF_REGION: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) === action.region);
                            break;
                        }
                        case const_1.SELECTOR_MAGI_NOT_OF_REGION: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) != action.region);
                            break;
                        }
                        case const_1.SELECTOR_STATUS: {
                            result = this.useSelector(action.selector, action.player, action.status);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_WITHOUT_STATUS: {
                            result = this.useSelector(action.selector, action.player, action.status);
                            break;
                        }
                        default: {
                            result = this.useSelector(action.selector, action.player, null);
                        }
                    }
                    const variable = action.variable || 'selected';
                    this.setSpellMetaDataField(variable, result, action.generatedBy);
                    break;
                }
                case const_1.ACTION_PASS: {
                    var newStep;
                    if (this.state.step === null) {
                        // Null-start
                        this.transformIntoActions({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_START_TURN,
                            player: this.state.activePlayer,
                            generatedBy: nanoid_1.default(),
                        });
                    }
                    else {
                        newStep = (this.state.step + 1) % steps.length;
                        if (newStep === 0) {
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                                player: this.state.activePlayer,
                                generatedBy: nanoid_1.default(),
                            }, {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_START_TURN,
                                player: this.getOpponent(this.state.activePlayer),
                                generatedBy: nanoid_1.default(),
                            });
                        }
                        else {
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_START_STEP,
                                player: this.state.activePlayer,
                                step: newStep,
                                generatedBy: nanoid_1.default(),
                            });
                        }
                    }
                    break;
                }
                case const_1.ACTION_PLAY: {
                    const castCards = ('card' in action) ? this.getMetaValue(action.card, action.generatedBy) : null;
                    const castCard = castCards ? (castCards.length ? castCards[0] : castCards) : null;
                    const player = ('payload' in action) ? action.payload.player : action.player;
                    const cardItself = ('payload' in action) ? action.payload.card : castCard;
                    const playerHand = this.getZone(const_1.ZONE_TYPE_HAND, player);
                    const cardInHand = playerHand.containsId(cardItself.id);
                    if (cardInHand) {
                        // baseCard is "abstract" card, CardInPlay is concrete instance
                        const baseCard = ('payload' in action) ? action.payload.card.card : castCard.card;
                        const currentPriority = this.getCurrentPriority();
                        const cardType = baseCard.type;
                        if ((cardType == const_1.TYPE_CREATURE && currentPriority == const_1.PRIORITY_CREATURES) ||
                            (cardType == const_1.TYPE_RELIC && currentPriority == const_1.PRIORITY_PRS) ||
                            (cardType == const_1.TYPE_SPELL && currentPriority == const_1.PRIORITY_PRS) ||
                            action.forcePriority) {
                            const activeMagi = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).card;
                            const totalCost = this.calculateTotalCost(cardItself);
                            switch (cardType) {
                                case const_1.TYPE_CREATURE: {
                                    if (activeMagi.data.energy >= totalCost) {
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_CREATURE,
                                            card: cardItself,
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                                            target: '$creature_created',
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                                            target: '$creature_created',
                                            player: player,
                                            amount: baseCard.cost,
                                            generatedBy: cardItself.id,
                                        });
                                    }
                                    break;
                                }
                                case const_1.TYPE_RELIC: {
                                    const alreadyHasOne = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                                        .some(card => card.data.controller === player && card.card.name === baseCard.name);
                                    const relicRegion = baseCard.region;
                                    const magiRegion = activeMagi.card.region;
                                    const regionAllows = relicRegion === magiRegion || relicRegion === const_1.REGION_UNIVERSAL;
                                    if (!alreadyHasOne && regionAllows && activeMagi.data.energy >= baseCard.cost) {
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_RELIC,
                                            card: cardItself,
                                            player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_RELIC_ENTERS_PLAY,
                                            card: '$relic_created',
                                            player,
                                            generatedBy: cardItself.id,
                                        });
                                    }
                                    break;
                                }
                                case const_1.TYPE_SPELL: {
                                    if (activeMagi.data.energy >= totalCost) {
                                        const enrichAction = (effect) => (Object.assign(Object.assign({ source: cardItself, player: player }, effect), { spell: true, generatedBy: cardItself.id }));
                                        const preparedEffects = baseCard.data.effects
                                            .map(enrichAction);
                                        const testablePrompts = [
                                            const_1.PROMPT_TYPE_SINGLE_CREATURE,
                                            const_1.PROMPT_TYPE_RELIC,
                                            const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                                            const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        ];
                                        const testablePromptFilter = (action) => action.type === const_1.ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
                                        const allPrompts = preparedEffects.filter(testablePromptFilter);
                                        const allPromptsAreDoable = allPrompts.every(promptAction => {
                                            switch (promptAction.promptType) {
                                                case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                                                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === const_1.TYPE_CREATURE);
                                                case const_1.PROMPT_TYPE_RELIC:
                                                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === const_1.TYPE_RELIC);
                                                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
                                                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => card.data.controller === promptAction.player);
                                                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                                    if (promptAction.restrictions) {
                                                        return promptAction.restrictions.every(({ type, value }) => this.checkAnyCardForRestriction(this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards, type, value));
                                                    }
                                                    else if (promptAction.restriction) {
                                                        return this.checkAnyCardForRestriction(this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                                                    }
                                                    return true;
                                                }
                                                default:
                                                    return true;
                                            }
                                        });
                                        if (allPromptsAreDoable) {
                                            this.transformIntoActions({
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PLAY_SPELL,
                                                card: cardItself,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                from: activeMagi,
                                                amount: totalCost,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: const_1.ACTION_CALCULATE,
                                                operator: const_1.CALCULATION_SET,
                                                operandOne: player,
                                                variable: 'player',
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                target: cardItself,
                                                bottom: false,
                                                sourceZone: const_1.ZONE_TYPE_HAND,
                                                destinationZone: const_1.ZONE_TYPE_DISCARD,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, ...preparedEffects);
                                            let currentMetaData = {
                                                source: cardItself,
                                            };
                                            this.setSpellMetadata(currentMetaData, cardItself.id);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            console.log(`Wrong Priority: current is ${currentPriority} (step ${this.getCurrentStep()}, type is ${cardType})`);
                        }
                    }
                    else {
                        console.log('No card to play');
                    }
                    break;
                }
                case const_1.ACTION_EFFECT: {
                    switch (action.effectType) {
                        case const_1.EFFECT_TYPE_START_TURN: {
                            if (this.turn === null) {
                                this.turn = 0;
                            }
                            else {
                                this.turn += 1;
                            }
                            this.transformIntoActions({
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
                            this.state = Object.assign(Object.assign({}, this.state), { activePlayer: action.player, step: 0 });
                            break;
                        }
                        case const_1.EFFECT_TYPE_START_STEP: {
                            // Player who goes first do not energize on first turn
                            const isFirstEnergize = this.turn === 0 &&
                                action.player === this.state.goesFirst &&
                                action.step === 0;
                            if (steps[action.step].effects && !isFirstEnergize) {
                                const transformedActions = steps[action.step].effects.map(effect => (Object.assign(Object.assign({}, effect), { player: action.player, generatedBy: action.generatedBy })));
                                this.addActions(...transformedActions);
                            }
                            if (steps[action.step].automatic) {
                                this.addActions({
                                    type: const_1.ACTION_PASS,
                                    player: action.player,
                                });
                            }
                            this.state = Object.assign(Object.assign({}, this.state), { step: action.step });
                            break;
                        }
                        case const_1.EFFECT_TYPE_CONDITIONAL: {
                            const metaData = this.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            const self = metaData.source || metaData.new_card || action.triggerSource;
                            // checkCondition(action, self, condition)
                            const results = action.conditions.map(condition => this.checkCondition(action, self, condition));
                            const enrichAction = (effect) => (Object.assign(Object.assign({ source: self, player: self.data.controller }, effect), { generatedBy: action.generatedBy }));
                            if (results.every(result => result === true)) {
                                if (action.thenEffects) {
                                    const preparedEffects = action.thenEffects
                                        .map(enrichAction);
                                    this.transformIntoActions(...preparedEffects);
                                }
                            }
                            else {
                                if (action.elseEffects) {
                                    const preparedEffects = action.elseEffects
                                        .map(enrichAction);
                                    this.transformIntoActions(...preparedEffects);
                                }
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP: {
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DRAW,
                                stepEffect: true,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            }, {
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DRAW,
                                stepEffect: true,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                            const metaData = this.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            if ('source' in metaData || 'new_card' in metaData) {
                                const self = metaData.source || metaData.new_card;
                                this.state = Object.assign(Object.assign({}, this.state), { delayedTriggers: [
                                        ...this.state.delayedTriggers,
                                        Object.assign({ id: nanoid_1.default(), self }, action.delayedTrigger)
                                    ] });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_START_OF_TURN: {
                            if (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
                                this.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).length > 0) {
                                const topMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).cards[0];
                                const firstMagi = this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;
                                const deckCards = this.getZone(const_1.ZONE_TYPE_DECK, action.player).cards.map(({ card }) => card.name);
                                const discardCards = this.getZone(const_1.ZONE_TYPE_DISCARD, action.player).cards.map(({ card }) => card.name);
                                const searchableCards = [...deckCards, ...discardCards];
                                const availableCards = topMagi.card.data.startingCards.filter(card => searchableCards.includes(card));
                                const actionsToTake = [
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
                                            cards: topMagi.card.data.startingCards,
                                            availableCards,
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
                                const actions = actionsToTake.map(preAction => (Object.assign(Object.assign({}, preAction), { player: action.player, generatedBy: action.generatedBy })));
                                this.transformIntoActions(...actions);
                            }
                            const creatures = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                                .filter(card => card.card.type === const_1.TYPE_CREATURE && card.data.controller === action.player);
                            if (creatures.length > 0) {
                                creatures.forEach(creature => {
                                    creature.clearAttackMarkers();
                                    creature.clearActionsUsed();
                                });
                            }
                            // if magi is active, reset its actions used too
                            if (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
                                this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).card.clearActionsUsed();
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_FIND_STARTING_CARDS: {
                            const cardsToFind = this.getMetaValue(action.cards, action.generatedBy);
                            let foundCards = [];
                            if (cardsToFind.length) {
                                const deck = this.getZone(const_1.ZONE_TYPE_DECK, action.player);
                                const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, action.player);
                                const hand = this.getZone(const_1.ZONE_TYPE_HAND, action.player);
                                cardsToFind.forEach(cardName => {
                                    if (discard.cards.some(({ card }) => card.name == cardName)) {
                                        const card = discard.cards.find(({ card }) => card.name == cardName);
                                        const newCard = new CardInGame_1.default(card.card, action.player);
                                        hand.add([newCard]);
                                        discard.removeById(card.id);
                                        foundCards.push(cardName);
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                            sourceCard: card,
                                            sourceZone: const_1.ZONE_TYPE_DISCARD,
                                            destinationCard: newCard,
                                            destinationZone: const_1.ZONE_TYPE_HAND,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                    else if (deck.cards.some(({ card }) => card.name == cardName)) {
                                        const card = deck.cards.find(({ card }) => card.name == cardName);
                                        const newCard = new CardInGame_1.default(card.card, action.player);
                                        hand.add([newCard]);
                                        deck.removeById(card.id);
                                        foundCards.push(cardName);
                                        this.transformIntoActions({
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
                            this.setSpellMetaDataField('foundCards', foundCards, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS: {
                            const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
                            const number = 5 - foundCards.length;
                            if (number > 0) { // who knows
                                for (let i = 0; i < number; i++) {
                                    this.transformIntoActions({
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
                            this.transformIntoActions({
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
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, target => target && this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_HAND,
                                destinationZone: const_1.ZONE_TYPE_DISCARD,
                                bottom: false,
                                target,
                                generatedBy: action.generatedBy,
                            }));
                            break;
                        }
                        case const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY: {
                            const card = this.getMetaValue(action.target, action.generatedBy);
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                destinationZone: const_1.ZONE_TYPE_HAND,
                                bottom: false,
                                target: card,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY: {
                            const card = this.getMetaValue(action.target, action.generatedBy);
                            const ownersMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner, null)[0];
                            this.transformIntoActions({
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
                            break;
                        }
                        case const_1.EFFECT_TYPE_DRAW: {
                            const player = this.getMetaValue(action.player, action.generatedBy);
                            const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
                            const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
                            if (deck.length > 0) {
                                const card = deck.cards[0];
                                this.transformIntoActions({
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
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_RESHUFFLE_DISCARD,
                                    player: player,
                                }, action);
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_RESHUFFLE_DISCARD: {
                            const player = this.getMetaValue(action.player, action.generatedBy);
                            const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
                            const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
                            const newCards = discard.cards.map(card => new CardInGame_1.default(card.card, card.owner));
                            deck.add(newCards);
                            deck.shuffle();
                            discard.empty();
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
                            const attackSource = action.source;
                            const attackTarget = action.target;
                            const damageByAttacker = attackSource.data.energy;
                            const damageByDefender = (attackTarget.card.type === const_1.TYPE_CREATURE) ?
                                attackTarget.data.energy :
                                0;
                            const attackerDamageAction = {
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
                            const damageActions = (attackTarget.card.type === const_1.TYPE_CREATURE && !action.packHuntAttack) ? [
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
                            this.transformIntoActions(...damageActions);
                            break;
                        }
                        case const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE: {
                            this.transformIntoActions({
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
                            this.transformIntoActions({
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
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                                target: action.target,
                                amount: action.amount,
                                attack: true,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_AFTER_DAMAGE: {
                            if (action.source.data.energy === 0) {
                                this.transformIntoActions({
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
                                this.transformIntoActions({
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
                                this.transformIntoActions({
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
                            const result = action.result ||
                                (this.rollDebugValue === null ? (Math.floor(Math.random() * 6) + 1) : this.rollDebugValue);
                            this.setSpellMetaDataField('roll_result', result, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_ENERGIZE: {
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, (target) => {
                                const amount = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGIZE);
                                const type = target.card.type;
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: (type == const_1.TYPE_CREATURE) ? const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target,
                                    source: null,
                                    amount,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case const_1.EFFECT_TYPE_PLAY_RELIC: {
                            this.transformIntoActions({
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
                            this.transformIntoActions({
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
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, target => target.forbidAttacks());
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            const zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy);
                            // We assume all cards changing zones are in one zone intially
                            const zoneOwner = zoneChangingTargets[0].owner;
                            const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const sourceZone = this.getZone(sourceZoneType, sourceZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
                            const destinationZone = this.getZone(destinationZoneType, destinationZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            const newCards = [];
                            oneOrSeveral(zoneChangingTargets, zoneChangingCard => {
                                const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
                                if (action.bottom) {
                                    destinationZone.add([newObject]);
                                }
                                else {
                                    destinationZone.addToTop([newObject]);
                                }
                                sourceZone.removeById(zoneChangingCard.id);
                                newCards.push(newObject);
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                    sourceCard: zoneChangingCard,
                                    sourceZone: sourceZoneType,
                                    destinationCard: newObject,
                                    destinationZone: destinationZoneType,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            this.setSpellMetaDataField('new_cards', newCards, action.generatedBy);
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            const zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                            const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
                            const destinationZone = this.getZone(destinationZoneType, destinationZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const sourceZone = this.getZone(sourceZoneType, sourceZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
                            if (action.bottom) {
                                destinationZone.add([newObject]);
                            }
                            else {
                                destinationZone.addToTop([newObject]);
                            }
                            sourceZone.removeById(zoneChangingCard.id);
                            this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
                            this.transformIntoActions({
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
                            // we should check if it was the last creature in play and Magi loses
                            if (action.sourceZone === const_1.ZONE_TYPE_IN_PLAY) {
                                const newCard = this.getMetaValue(action.destinationCard, action.generatedBy);
                                const magi = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, newCard.owner).card;
                                const creatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, newCard.owner, null);
                                const numberOfCreatures = (creatures instanceof Array) ? creatures.length : 0;
                                if (magi && magi.data.energy === 0 && numberOfCreatures === 0) {
                                    this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                                        source: null,
                                        target: magi,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY:
                            break;
                        case const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE: {
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            this.transformIntoActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target,
                                source: null,
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_MOVE_ENERGY: {
                            const moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
                            const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                            const moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
                            const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                            const amountToMove = this.getMetaValue(action.amount, action.generatedBy);
                            moveSource.removeEnergy(amountToMove);
                            moveTarget.addEnergy(amountToMove);
                            if (moveSource.data.energy === 0) {
                                switch (moveSource.card.type) {
                                    case const_1.TYPE_CREATURE: {
                                        // Creature goes to discard
                                        this.transformIntoActions({
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
                                    case const_1.TYPE_MAGI: {
                                        const hisCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, moveSource.data.controller, null);
                                        if (hisCreatures instanceof Array && hisCreatures.length === 0) {
                                            this.transformIntoActions({
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                                                source: moveSource,
                                                target: moveSource,
                                                generatedBy: action.generatedBy,
                                            });
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI: {
                            const addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addMiltiTarget, (target) => {
                                switch (target.card.type) {
                                    case const_1.TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                            amount: action.amount,
                                            target,
                                            source: null,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case const_1.TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI: {
                            const discardMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(discardMiltiTarget, target => {
                                switch (target.card.type) {
                                    case const_1.TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            amount: action.amount,
                                            attack: action.attack || false,
                                            source: action.source,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case const_1.TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                            source: action.source,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            oneOrSeveral(this.getMetaValue(action.target, action.generatedBy), target => {
                                target.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                                const hisCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, target.data.controller, null);
                                if (target.data.energy === 0 && hisCreatures instanceof Array && hisCreatures.length === 0) {
                                    this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                                        source: action.source || null,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DEFEAT_MAGI: {
                            const magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiMiltiTarget, target => {
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                                    target,
                                    source: null,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            const { target, generatedBy } = action;
                            const stillHasMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
                            if (stillHasMagi) {
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: target,
                                    sourceZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
                                    destinationZone: const_1.ZONE_TYPE_DEFEATED_MAGI,
                                    bottom: false,
                                    generatedBy,
                                }, {
                                    type: const_1.ACTION_SELECT,
                                    selector: const_1.SELECTOR_OWN_CARDS_IN_PLAY,
                                    player: target.owner,
                                    variable: 'cardsInPlay',
                                    generatedBy,
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
                                    target: '$cardsInPlay',
                                    player: target.owner,
                                    generatedBy,
                                });
                            }
                            else {
                                const winner = this.getOpponent(target.owner);
                                this.transformIntoActions({
                                    type: const_1.ACTION_PLAYER_WINS,
                                    player: winner,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(multiTarget, target => {
                                var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
                                const energyLossThreshold = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGY_LOSS_THRESHOLD);
                                const energyLostAlready = target.data.energyLostThisTurn;
                                if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                                    const energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                                    energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
                                }
                                target.removeEnergy(energyToLose);
                                if (target.data.energy == 0 && !action.attack) {
                                    this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                        target,
                                        attack: false,
                                        sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                                        bottom: false,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY: {
                            const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
                            const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
                            if (restoreAmount > 0) {
                                this.transformIntoActions({
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
                            const payingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const payingAmount = this.getMetaValue(action.amount, action.generatedBy);
                            if (payingAmount > 0) {
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                    target: payingTarget,
                                    source: null,
                                    amount: payingAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            const addTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addTargets, addTarget => addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10)));
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI: {
                            const magiTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTargets, magiTarget => {
                                const startingEnergy = this.modifyByStaticAbilities(magiTarget, const_1.PROPERTY_MAGI_STARTING_ENERGY);
                                this.transformIntoActions({
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
                            const magiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC: {
                            const discardTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(discardTargets, target => {
                                const targetType = target.card.type;
                                if (targetType === const_1.TYPE_CREATURE) {
                                    this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                                else if (targetType === const_1.TYPE_RELIC) {
                                    this.transformIntoActions({
                                        type: const_1.ACTION_EFFECT,
                                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            });
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            const relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(relicDiscardTarget, relic => {
                                this.transformIntoActions({
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
                            const creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(creatureDiscardTarget, creature => {
                                const effect = {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: creature,
                                    sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                                    destinationZone: const_1.ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    generatedBy: action.generatedBy,
                                };
                                this.transformIntoActions(effect);
                            });
                            break;
                        }
                    }
                    break;
                }
            } // switch (action.type)
        } // while(this.hasActions())
        return true;
    }
}
exports.State = State;
//# sourceMappingURL=index.js.map