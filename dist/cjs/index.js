"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTOR_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE = exports.SELECTOR_MAGI_NOT_OF_REGION = exports.SELECTOR_OPPONENT_ID = exports.SELECTOR_MAGI_OF_REGION = exports.SELECTOR_TOP_MAGI_OF_PILE = exports.SELECTOR_ENEMY_CREATURES = exports.SELECTOR_OWN_CREATURES = exports.SELECTOR_CREATURES_NOT_OF_REGION = exports.SELECTOR_CREATURES_OF_REGION = exports.SELECTOR_ENEMY_MAGI = exports.SELECTOR_OWN_MAGI = exports.SELECTOR_CREATURES_AND_MAGI = exports.SELECTOR_CREATURES = exports.CALCULATION_MULTIPLY = exports.CALCULATION_MAX = exports.CALCULATION_MIN = exports.CALCULATION_HALVE_ROUND_UP = exports.CALCULATION_HALVE_ROUND_DOWN = exports.CALCULATION_SUBTRACT = exports.CALCULATION_ADD = exports.CALCULATION_DOUBLE = exports.CALCULATION_SET = exports.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = exports.PROPERTY_ATTACKS_PER_TURN = exports.PROPERTY_MAGI_STARTING_ENERGY = exports.PROPERTY_ENERGIZE = exports.PROPERTY_COST = exports.PROPERTY_REGION = exports.PROPERTY_ENERGY_COUNT = exports.PROPERTY_CONTROLLER = exports.PROPERTY_TYPE = exports.PROPERTY_ID = exports.ACTION_PLAYER_WINS = exports.ACTION_ATTACK = exports.ACTION_GET_PROPERTY_VALUE = exports.ACTION_RESOLVE_PROMPT = exports.ACTION_ENTER_PROMPT = exports.ACTION_CALCULATE = exports.ACTION_SELECT = exports.ACTION_EFFECT = exports.ACTION_POWER = exports.ACTION_PLAY = exports.ACTION_PASS = exports.TYPE_SPELL = exports.TYPE_RELIC = exports.TYPE_MAGI = exports.TYPE_CREATURE = exports.State = exports.DEFAULT_PROMPT_VARIABLE = void 0;
exports.REGION_UNIVERSAL = exports.EFFECT_TYPE_DRAW_REST_OF_CARDS = exports.EFFECT_TYPE_FIND_STARTING_CARDS = exports.EFFECT_TYPE_MAGI_FLIPPED = exports.EFFECT_TYPE_END_OF_TURN = exports.EFFECT_TYPE_START_OF_TURN = exports.EFFECT_TYPE_CREATURE_IS_ATTACKED = exports.EFFECT_TYPE_CREATURE_ATTACKS = exports.EFFECT_TYPE_AFTER_DAMAGE = exports.EFFECT_TYPE_DEAL_DAMAGE = exports.EFFECT_TYPE_BEFORE_DAMAGE = exports.EFFECT_TYPE_CREATURE_IS_DEFEATED = exports.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = exports.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = exports.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = exports.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = exports.EFFECT_TYPE_ENERGIZE = exports.EFFECT_TYPE_ADD_ENERGY_TO_MAGI = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = exports.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = exports.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = exports.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = exports.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = exports.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = exports.EFFECT_TYPE_MAGI_IS_DEFEATED = exports.EFFECT_TYPE_RELIC_ENTERS_PLAY = exports.EFFECT_TYPE_CREATURE_ENTERS_PLAY = exports.EFFECT_TYPE_PLAY_SPELL = exports.EFFECT_TYPE_PLAY_RELIC = exports.EFFECT_TYPE_PLAY_CREATURE = exports.EFFECT_TYPE_ROLL_DIE = exports.EFFECT_TYPE_MOVE_ENERGY = exports.EFFECT_TYPE_RESHUFFLE_DISCARD = exports.EFFECT_TYPE_DRAW = exports.PROMPT_TYPE_CHOOSE_CARDS = exports.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = exports.PROMPT_TYPE_SINGLE_MAGI = exports.PROMPT_TYPE_SINGLE_CREATURE = exports.PROMPT_TYPE_NUMBER = exports.PRIORITY_CREATURES = exports.PRIORITY_ATTACK = exports.PRIORITY_PRS = exports.NO_PRIORITY = exports.SELECTOR_OWN_CARDS_IN_PLAY = void 0;
exports.ZONE_TYPE_DEFEATED_MAGI = exports.ZONE_TYPE_DECK = exports.ZONE_TYPE_MAGI_PILE = exports.ZONE_TYPE_ACTIVE_MAGI = exports.ZONE_TYPE_DISCARD = exports.ZONE_TYPE_IN_PLAY = exports.ZONE_TYPE_HAND = exports.COST_X_PLUS_ONE = exports.COST_X = void 0;
const nanoid_1 = require("nanoid");
const mersenneTwister_1 = require("./mersenneTwister");
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
Object.defineProperty(exports, "COST_X_PLUS_ONE", { enumerable: true, get: function () { return const_1.COST_X_PLUS_ONE; } });
Object.defineProperty(exports, "ZONE_TYPE_HAND", { enumerable: true, get: function () { return const_1.ZONE_TYPE_HAND; } });
Object.defineProperty(exports, "ZONE_TYPE_IN_PLAY", { enumerable: true, get: function () { return const_1.ZONE_TYPE_IN_PLAY; } });
Object.defineProperty(exports, "ZONE_TYPE_DISCARD", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DISCARD; } });
Object.defineProperty(exports, "ZONE_TYPE_ACTIVE_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_ACTIVE_MAGI; } });
Object.defineProperty(exports, "ZONE_TYPE_MAGI_PILE", { enumerable: true, get: function () { return const_1.ZONE_TYPE_MAGI_PILE; } });
Object.defineProperty(exports, "ZONE_TYPE_DECK", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DECK; } });
Object.defineProperty(exports, "ZONE_TYPE_DEFEATED_MAGI", { enumerable: true, get: function () { return const_1.ZONE_TYPE_DEFEATED_MAGI; } });
Object.defineProperty(exports, "CALCULATION_MULTIPLY", { enumerable: true, get: function () { return const_1.CALCULATION_MULTIPLY; } });
const effects_1 = require("./actionMaps/effects");
const logAction_1 = require("./logAction");
const clone_1 = __importDefault(require("./clone"));
const cards_1 = require("./cards");
const CardInGame_1 = __importDefault(require("./classes/CardInGame"));
const Zone_1 = __importDefault(require("./classes/Zone"));
const convertCard = (cardInGame) => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
});
exports.DEFAULT_PROMPT_VARIABLE = {
    [const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE]: 'targetCards',
    [const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]: 'cardsOrder',
    [const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE]: 'targetCards',
    [const_1.PROMPT_TYPE_NUMBER]: 'number',
    [const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE]: 'target',
    [const_1.PROMPT_TYPE_RELIC]: 'target',
    [const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE]: 'target',
    [const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED]: 'target',
    [const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES]: 'target',
    [const_1.PROMPT_TYPE_SINGLE_CREATURE]: 'target',
    [const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI]: 'target',
    [const_1.PROMPT_TYPE_SINGLE_MAGI]: 'targetMagi',
    [const_1.PROMPT_TYPE_CHOOSE_CARDS]: 'selectedCards',
    [const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: 'energyOnCreatures',
    [const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: 'energyOnCreatures',
    [const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: 'damageOnCreatures',
    [const_1.PROMPT_TYPE_PLAYER]: 'targetPlayer',
    [const_1.PROMPT_TYPE_NUMBER_OF_CREATURES]: 'targets',
    [const_1.PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED]: 'targets',
    [const_1.PROMPT_TYPE_POWER_ON_MAGI]: 'chosenPower',
    [const_1.PROMPT_TYPE_ALTERNATIVE]: 'alternative',
    [const_1.PROMPT_TYPE_PAYMENT_SOURCE]: 'paymentSource',
    [const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES]: 'cardsInZones',
    [const_1.PROMPT_TYPE_MAY_ABILITY]: '', // Special case, doesn't use variables
};
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
const defaultState = {
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
const updateContinuousEffects = (player) => (effect) => {
    switch (effect.expiration.type) {
        case const_1.EXPIRATION_ANY_TURNS: {
            const turnCount = effect.expiration.turns;
            if (turnCount > 1) {
                return {
                    ...effect,
                    expiration: {
                        type: effect.expiration.type,
                        turns: turnCount - 1,
                    }
                };
            }
            else {
                return null;
            }
        }
        case const_1.EXPIRATION_OPPONENT_TURNS: {
            const turnCount = effect.expiration.turns;
            if (player !== effect.player) {
                if (turnCount > 0) {
                    return {
                        ...effect,
                        expiration: {
                            type: effect.expiration.type,
                            turns: turnCount - 1,
                        }
                    };
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
};
class State {
    state;
    players = [0, 1];
    decks;
    winner;
    debug;
    twister = null;
    nanoid = nanoid_1.nanoid;
    twisterSeed = 0;
    turn;
    rollDebugValue;
    actionsOne;
    actionsTwo;
    onAction = null;
    turnTimer = null;
    timerEnabled;
    turnTimeout;
    turnNotifyTimeout;
    constructor(state) {
        this.state = {
            ...(0, clone_1.default)(defaultState),
            ...state,
        };
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
    closeStreams() { }
    initiatePRNG(seed) {
        this.twisterSeed = seed;
        this.twister = new mersenneTwister_1.MersenneTwister(seed);
        const seeded_nanoid = (0, nanoid_1.customRandom)(nanoid_1.urlAlphabet, 10, size => {
            return (new Uint8Array(size)).map(() => 256 * this.twister.random());
        });
        this.nanoid = seeded_nanoid;
    }
    setOnAction(callback) {
        this.onAction = callback;
    }
    addActionToStream(action) {
        const actionWithValues = this.addValuesToAction(action);
        // Do not send outside CALCULATE, SELECT and so on
        if (![const_1.ACTION_CALCULATE, const_1.ACTION_SELECT, const_1.ACTION_GET_PROPERTY_VALUE].includes(action.type) && this.onAction) {
            this.onAction(actionWithValues);
            // this.actionStreamOne.emit('action', actionWithValues);
            // this.actionStreamTwo.emit('action', actionWithValues);
        }
        // this.logStream.emit('action', actionWithValues);
    }
    addValuesToAction(action) {
        switch (action.type) {
            case const_1.ACTION_ENTER_PROMPT: {
                switch (action.promptType) {
                    case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                        if (Object.hasOwn(action, 'restrictions') && action.restrictions) {
                            const restrictionsWithValues = action.restrictions.map(({ type, value }) => ({
                                type,
                                value: this.getMetaValue(value, action.generatedBy),
                            }));
                            return {
                                ...action,
                                restrictions: restrictionsWithValues,
                            };
                        }
                        else {
                            return {
                                ...action,
                                restrictionValue: this.getMetaValue(action.restrictionValue, action.generatedBy),
                            };
                        }
                    }
                }
                return action;
            }
            case const_1.ACTION_EFFECT: {
                switch (action.effectType) {
                    case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return {
                            ...action,
                            staticAbilities: action.staticAbilities?.map(ability => {
                                let selectorParameter = ability.selectorParameter;
                                if (ability.selector === const_1.SELECTOR_ID) {
                                    selectorParameter = ability.selectorParameter ? this.getMetaValue(ability.selectorParameter, action.generatedBy)?.id : null;
                                }
                                else {
                                    selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                                }
                                return {
                                    ...ability,
                                    modifier: {
                                        operandOne: this.getMetaValue(ability.modifier.operandOne, action.generatedBy),
                                        operator: ability.modifier.operator,
                                    },
                                    selectorParameter,
                                };
                            }),
                        };
                    }
                }
            }
            default:
                return action;
        }
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
    clone() {
        const newObject = new State((0, clone_1.default)(this.state));
        newObject.winner = this.winner;
        newObject.rollDebugValue = this.rollDebugValue;
        newObject.players = this.players;
        newObject.decks = this.decks;
        if (this.twister) {
            newObject.twister = new mersenneTwister_1.MersenneTwister(this.twisterSeed);
        }
        return newObject;
    }
    setPlayers(player1, player2) {
        this.players = [player1, player2];
        return this;
    }
    setDeck(player, cardNames) {
        if (this.players.includes(player)) {
            const deck = cardNames.map(card => {
                const cardObject = (0, cards_1.byName)(card);
                if (!cardObject) {
                    throw new Error(`Unknown card in deck: ${card}`);
                }
                return new CardInGame_1.default(cardObject, player, this.nanoid);
            });
            this.decks.push({
                player,
                deck,
            });
        }
        else {
            throw new Error(`Non-existing player: ${player}`);
        }
    }
    enableTurnTimer(timer = 75) {
        this.turnTimer = timer;
        this.timerEnabled = true;
    }
    startTurnTimer() {
        if (this.turnTimer && this.turnTimer > 0) {
            this.turnTimeout = setTimeout(() => {
                this.endTurn();
            }, this.turnTimer * 1000);
            if (this.turnTimer > 20) {
                this.turnNotifyTimeout = setTimeout(() => {
                    this.update({ type: const_1.ACTION_TIME_NOTIFICATION, player: this.state.activePlayer });
                }, 20000);
            }
        }
    }
    stopTurnTimer() {
        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }
        if (this.turnNotifyTimeout) {
            clearTimeout(this.turnNotifyTimeout);
        }
    }
    endTurn() {
        const { activePlayer } = this.state;
        this.update({ type: const_1.ACTION_EXIT_PROMPTS });
        while (this.state.activePlayer === activePlayer) {
            this.update({ type: const_1.ACTION_PASS, player: activePlayer });
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
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
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
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
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_MAGI_ENERGY_LOSS,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
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
                        case const_1.EFFECT_TYPE_DIE_ROLLED: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_DIE_ROLLED,
                                result: action.result,
                                player: action.player,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_MAGI_ENERGY_GAIN,
                                        card: target[0].card.name,
                                        amount: this.getMetaValue(action.amount, action.generatedBy),
                                    };
                                }
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (!Array.isArray(target)) {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                if (target.length) {
                                    newLogEntry = {
                                        type: const_1.LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                        card: target[0].card.name,
                                        player: action.player,
                                    };
                                }
                            }
                            else {
                                newLogEntry = {
                                    type: const_1.LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                    card: target.card.name,
                                    player: action.player,
                                };
                            }
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
                                packHuntAttack: Boolean(action.packHuntAttack),
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
                            newLogEntry = {
                                type: const_1.LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player || 1,
                            };
                            break;
                        }
                        case const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
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
                case const_1.ACTION_RESOLVE_PROMPT: {
                    if ((this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
                        this.state.promptType === const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE ||
                        this.state.promptType === const_1.PROMPT_TYPE_SINGLE_MAGI) && 'target' in action) {
                        newLogEntry = {
                            type: const_1.LOG_ENTRY_TARGETING,
                            card: action.target?.card?.name || 'unknown card',
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
            console.error('Log entry creation failed');
            console.dir(action);
            // console.dir(e);
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
        const deck1 = new Zone_1.default('Player 1 deck', const_1.ZONE_TYPE_DECK, playerOne);
        const deck2 = new Zone_1.default('Player 2 deck', const_1.ZONE_TYPE_DECK, playerTwo);
        if (this.twister) {
            deck1.setPRNG(this.twister);
            deck2.setPRNG(this.twister);
        }
        return [
            new Zone_1.default('Player 1 hand', const_1.ZONE_TYPE_HAND, playerOne),
            new Zone_1.default('Player 2 hand', const_1.ZONE_TYPE_HAND, playerTwo),
            deck1,
            deck2,
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
    serializeData(playerId, hideZones = true) {
        const gameEnded = !(this.winner === false);
        const opponentId = this.players.find(player => player !== playerId) || 0;
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
            opponentId,
            log: this.state.log,
            gameEnded,
            winner: gameEnded ? this.winner : null,
            cardsAttached: this.state.cardsAttached,
        };
    }
    serializeZones(playerId, hideZones = true) {
        const opponentId = this.getOpponent(playerId);
        return {
            playerHand: this.getZone(const_1.ZONE_TYPE_HAND, playerId).serialize(),
            opponentHand: this.getZone(const_1.ZONE_TYPE_HAND, opponentId).serialize(hideZones),
            playerDeck: this.getZone(const_1.ZONE_TYPE_DECK, playerId).serialize(hideZones),
            opponentDeck: this.getZone(const_1.ZONE_TYPE_DECK, opponentId).serialize(hideZones),
            playerActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
            opponentActiveMagi: this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
            playerMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, playerId).serialize(),
            opponentMagiPile: this.getZone(const_1.ZONE_TYPE_MAGI_PILE, opponentId).serialize(hideZones),
            inPlay: this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.map(c => c.serialize()),
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
        // @ts-ignore
        const randomValue = this.twister ? this.twister.random() : Math.random();
        const goesFirst = this.players[(randomValue > 0.5 ? 0 : 1)];
        this.state = {
            ...this.state,
            zones,
            step: null,
            turn: 1,
            goesFirst,
            activePlayer: goesFirst,
        };
    }
    getOpponent(player) {
        const opponent = this.players.find(pl => pl != player);
        return opponent || 0;
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
        return this.state.step === null ? 0 : steps[this.state.step].priority;
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
        this.state = {
            ...this.state,
            spellMetaData: {
                ...this.state.spellMetaData,
                [spellId]: metadata,
            }
        };
    }
    getSpellMetadata(spellId) {
        return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
    }
    setSpellMetaDataField(field, value, spellId) {
        if (!spellId) {
            throw new Error('Saving spell metadata field without spellId');
        }
        const metaData = this.getSpellMetadata(spellId);
        this.setSpellMetadata({
            ...metaData,
            [field]: value,
        }, spellId);
    }
    getMetaValue(value, spellId) {
        if (typeof value == 'string' &&
            value[0] == '$' &&
            spellId) {
            const variableName = value.slice(1);
            const spellMetaData = this.getSpellMetadata(spellId);
            return (variableName in spellMetaData) ? spellMetaData[variableName] : null;
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
            if (Object.hasOwn(action, variableName))
                return action[variableName];
            // if not, we use spellMetaData
            const spellMetaData = this.getSpellMetadata(spellId);
            return Object.hasOwn(spellMetaData, variableName) ? spellMetaData[variableName] : null;
        }
        else {
            return value;
        }
    }
    selectNthCardOfZone(player, zoneType, cardNumber, restrictions) {
        const zoneCards = this.getZone(zoneType, player).cards;
        const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        const index = cardNumber - 1; // 1-based indexing, for better card data readability
        if (filteredCards.length < index + 1) {
            return [];
        }
        else {
            return [filteredCards[index]];
        }
    }
    selectRandomCardOfZone(player, zoneType) {
        const zoneCards = this.getZone(zoneType, player).cards;
        // const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        // @ts-ignore
        const randomValue = this.twister ? this.twister.random() : Math.random();
        const index = Math.floor(randomValue * zoneCards.length);
        if (zoneCards.length == 0) {
            return [];
        }
        else {
            return [zoneCards[index]];
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
                return this.players.find(id => id != argument) || 999;
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
            // case SELECTOR_OWN_MAGI_SINGLE:
            // 	return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND:
                return this.getZone(const_1.ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == const_1.TYPE_SPELL);
            case const_1.SELECTOR_ENEMY_MAGI:
                return this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player || 0)).cards;
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
            default:
                return [];
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
            case const_1.PROPERTY_CREATURE_NAME:
                return target.card.name;
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
                const powers = target.modifiedCard ? target.modifiedCard.data?.powers : target.card.data.powers;
                return (powers && powers.length) ? powers.find(({ name }) => name === subProperty)?.cost : 0;
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
                const defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : defaultValue;
        }
    }
    isCardAffectedByEffect(card, effect) {
        const protection = this.modifyByStaticAbilities(card, const_1.PROPERTY_PROTECTION);
        if (protection) {
            // Is the `from` right?
            if ((effect.spell && protection.from && protection.from.includes(const_1.PROTECTION_FROM_SPELLS)) ||
                (effect.power && protection.from && protection.from.includes(const_1.PROTECTION_FROM_POWERS)) ||
                (effect.attack && protection.from && protection.from.includes(const_1.PROTECTION_FROM_ATTACKS))) {
                if (effect.effectType === const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE &&
                    protection.type === const_1.PROTECTION_TYPE_ENERGY_LOSS) {
                    const source = effect.source;
                    if (protection.restrictions) {
                        const cardFilter = this.makeCardFilter(protection.restrictions);
                        return !cardFilter(source);
                    }
                    else {
                        return false;
                    }
                }
                if ((effect.effectType === const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && protection.type === const_1.PROTECTION_TYPE_DISCARDING_FROM_PLAY) ||
                    protection.type === const_1.PROTECTION_TYPE_GENERAL) {
                    const source = effect.source;
                    if (!source)
                        return false;
                    if (protection.restrictions) {
                        const cardFilter = this.makeCardFilter(protection.restrictions);
                        return !cardFilter(source);
                    }
                    else {
                        return false;
                    }
                }
                if (protection.type === const_1.PROTECTION_TYPE_GENERAL) {
                    if (protection.restrictions) {
                        const source = effect.source;
                        if (!source)
                            return false;
                        const cardFilter = this.makeCardFilter(protection.restrictions);
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
            if (effect.effectType === const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE ||
                effect.effectType === const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE ||
                effect.effectType === const_1.EFFECT_TYPE_MOVE_ENERGY) {
                if (effect.source && effect.source.data.controller === card.data.controller &&
                    (effect.spell ||
                        effect.power)) {
                    return false;
                }
            }
        }
        return true;
    }
    isCardAffectedByStaticAbility(card, staticAbility) {
        switch (staticAbility.selector) {
            case const_1.SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_SELF_AND_STATUS: {
                return 'card' in staticAbility &&
                    staticAbility.card &&
                    card.id === staticAbility.card.id &&
                    this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case const_1.SELECTOR_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id);
            }
            case const_1.SELECTOR_OWN_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(staticAbility?.selectorParameter?.toString() || 'no matches');
            }
            case const_1.SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_OWN_MAGI: {
                return card.card.type === const_1.TYPE_MAGI &&
                    this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)?.card?.id === card.id;
            }
            case const_1.SELECTOR_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case const_1.SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND: {
                return this.getZone(const_1.ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id && card.card.type == const_1.TYPE_SPELL);
            }
            default: {
                console.error(`Unknown static ability selector: ${staticAbility.selector}`);
                return false;
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
        const continuousStaticAbilities = this.state.continuousEffects.map(effect => effect.staticAbilities?.map(a => ({ ...a, player: effect.player })) || []).flat();
        const propertyLayers = {
            [const_1.PROPERTY_CONTROLLER]: 0,
            [const_1.PROPERTY_POWER_COST]: 1,
            [const_1.PROPERTY_COST]: 1,
            [const_1.PROPERTY_ENERGIZE]: 2,
            [const_1.PROPERTY_STATUS]: 3,
            [const_1.PROPERTY_ATTACKS_PER_TURN]: 4,
            [const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY]: 5,
            [const_1.PROPERTY_ENERGY_LOSS_THRESHOLD]: 6,
            [const_1.PROPERTY_ABLE_TO_ATTACK]: 7,
            [const_1.PROPERTY_PROTECTION]: 8,
        };
        const zoneAbilities = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
            ...acc,
            ...(cardInPlay.card.data.staticAbilities.map(a => ({ ...a, player: cardInPlay.data.controller, card: cardInPlay })))
        ] : acc, []);
        const staticAbilities = [...gameStaticAbilities, ...zoneAbilities, ...continuousStaticAbilities].sort((a, b) => propertyLayers[a.property] - propertyLayers[b.property]);
        let initialCardData = {
            card: target.card,
            modifiedCard: {
                ...target.card,
                data: {
                    protection: undefined,
                    ...target.card.data,
                    energyLossThreshold: 0,
                    ableToAttack: 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true,
                },
            },
            data: {
                ...target.data,
            },
            id: target.id,
            owner: target.owner,
        };
        // Okay, sooner or later this should be rewritten
        // Here we should construct new CardInGame object containing new Card object (both with new values)
        const modifiedCardData = staticAbilities.reduce(this.layeredDataReducer.bind(this), initialCardData);
        // @ts-ignore
        return this.getByProperty(modifiedCardData, property, subProperty);
    }
    layeredDataReducer(currentCard, staticAbility) {
        if (this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
            switch (staticAbility.property) {
                case const_1.PROPERTY_COST: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_COST);
                    const { operator, operandOne } = staticAbility.modifier;
                    if (typeof initialValue !== 'number') {
                        return {
                            ...currentCard,
                            modifiedCard: {
                                ...currentCard.modifiedCard,
                                cost: initialValue,
                            },
                        };
                    }
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            cost: resultValue,
                        },
                    };
                }
                case const_1.PROPERTY_ENERGIZE: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                energize: resultValue,
                            },
                        },
                    };
                }
                case const_1.PROPERTY_ATTACKS_PER_TURN: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ATTACKS_PER_TURN);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                attacksPerTurn: resultValue,
                            },
                        },
                    };
                }
                case const_1.PROPERTY_ENERGY_LOSS_THRESHOLD: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                        this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                        this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                    return {
                        ...currentCard,
                        modifiedCard: {
                            ...currentCard.modifiedCard,
                            data: {
                                ...currentCard.modifiedCard.data,
                                energyLossThreshold: resultValue,
                            },
                        },
                    };
                }
                case const_1.PROPERTY_ABLE_TO_ATTACK: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_ABLE_TO_ATTACK);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return {
                            ...currentCard,
                            modifiedCard: {
                                ...currentCard.modifiedCard,
                                data: {
                                    ...currentCard.modifiedCard.data,
                                    ableToAttack: resultValue,
                                },
                            },
                        };
                    }
                    else {
                        return { ...currentCard };
                    }
                }
                case const_1.PROPERTY_CAN_BE_ATTACKED: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CAN_BE_ATTACKED);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        return {
                            ...currentCard,
                            modifiedCard: {
                                ...currentCard.modifiedCard,
                                data: {
                                    ...currentCard.modifiedCard.data,
                                    canBeAttacked: resultValue,
                                },
                            },
                        };
                    }
                    else {
                        return {
                            ...currentCard,
                        };
                    }
                }
                case const_1.PROPERTY_CONTROLLER: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_CONTROLLER);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'number') {
                        return {
                            ...currentCard,
                            data: {
                                ...currentCard.data,
                                controller: resultValue,
                            },
                        };
                    }
                    else {
                        return { ...currentCard };
                    }
                }
                case const_1.PROPERTY_STATUS: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_STATUS, staticAbility.subProperty);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'boolean') {
                        switch (staticAbility.subProperty) {
                            case const_1.STATUS_BURROWED: {
                                return {
                                    ...currentCard,
                                    data: {
                                        ...currentCard.data,
                                        burrowed: resultValue,
                                    },
                                };
                            }
                            default: {
                                return currentCard;
                            }
                        }
                    }
                    else {
                        return { ...currentCard };
                    }
                }
                case const_1.PROPERTY_PROTECTION: {
                    const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_PROTECTION);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === const_1.CALCULATION_SET) ? operandOne : initialValue;
                    if (typeof resultValue == 'object' && 'from' in resultValue) {
                        return {
                            ...currentCard,
                            modifiedCard: {
                                ...currentCard.modifiedCard,
                                data: {
                                    ...currentCard.modifiedCard.data,
                                    protection: resultValue,
                                },
                            }
                        };
                    }
                    else {
                        return {
                            ...currentCard,
                        };
                    }
                }
                case const_1.PROPERTY_POWER_COST: {
                    if (currentCard.modifiedCard.data.powers) {
                        const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
                            const initialValue = this.getByProperty(currentCard, const_1.PROPERTY_POWER_COST, power.name);
                            const { operator, operandOne } = staticAbility.modifier;
                            const resultValue = (operator === const_1.CALCULATION_SUBTRACT || operator === const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
                                this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
                                this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);
                            return {
                                ...power,
                                cost: resultValue,
                            };
                        });
                        return {
                            ...currentCard,
                            modifiedCard: {
                                ...currentCard.modifiedCard,
                                data: {
                                    ...currentCard.modifiedCard.data,
                                    powers: updatedPowers,
                                },
                            },
                        };
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
            case const_1.RESTRICTION_CREATURE_NAME:
                return (card) => card.card.name === restrictionValue;
            case const_1.RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return (card) => card.card.name.split(' ').some(type => restrictionValue.includes(type));
                }
                return (card) => card.card.name.split(' ').includes(restrictionValue);
            case const_1.RESTRICTION_TYPE:
                return (card) => card.card.type === restrictionValue;
            case const_1.RESTRICTION_PLAYABLE:
                return (card) => {
                    const magi = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner)[0];
                    const cardCost = this.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case const_1.RESTRICTION_MAGI_WITHOUT_CREATURES:
                return (card) => {
                    if (card.card.type !== const_1.TYPE_MAGI)
                        return false;
                    const creatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, card.owner);
                    return (creatures && creatures instanceof Array && creatures.length === 0);
                };
            case const_1.RESTRICTION_REGION:
                return (card) => card.card.region === restrictionValue;
            case const_1.RESTRICTION_REGION_IS_NOT:
                return (card) => card.card.region !== restrictionValue;
            case const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return (card) => Boolean(card.card.type === const_1.TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost);
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
            case const_1.RESTRICTION_ENERGY_EQUALS:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.energy === restrictionValue;
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
        if (typeof object === 'boolean' || typeof object === 'number') {
            return object;
        }
        if (object === 'self') {
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
            ...cardInPlay.card.data.replacementEffects
                .filter(effect => !effect.oncePerTurn || (effect.oncePerTurn && !cardInPlay.wasActionUsed(effect.name || 'unknown effect')))
                .map(effect => ({ ...effect, self: cardInPlay })),
        ] : acc, []);
        let replacementFound = false;
        let appliedReplacerId = null;
        let appliedReplacerSelf = null;
        let replaceWith = null;
        let foundReplacer = null;
        for (let replacer of zoneReplacements) {
            const replacerId = replacer.self.id; // Not really, but will work for now
            if ('replacedBy' in action && action.replacedBy?.includes(replacerId)) {
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
        const previouslyReplacedBy = ('replacedBy' in action && action.replacedBy) ? action.replacedBy : [];
        if (!action) {
            throw new Error('Empty action found in the queue');
        }
        if (replacementFound && replaceWith) {
            const resultEffects = appliedReplacerSelf ? replaceWith.map(((appliedReplacerSelf) => (replacementEffect) => {
                if ('type' in replacementEffect && replacementEffect.type == const_1.ACTION_EXIT_PROMPTS) {
                    throw new Error('Cannot replace anything with ACTION_EXIT_PROMPTS');
                }
                if (!('type' in replacementEffect)) {
                    const resultEffect = {
                        type: const_1.ACTION_EFFECT,
                        ...replacementEffect,
                        replacedBy: appliedReplacerId ? [
                            ...previouslyReplacedBy,
                            appliedReplacerId,
                        ] : previouslyReplacedBy,
                        generatedBy: action.generatedBy || this.nanoid(),
                        player: appliedReplacerSelf.data.controller,
                    };
                    Object.keys(replacementEffect)
                        .filter(key => !['type', 'effectType'].includes(key))
                        .forEach(key => {
                        const value = this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy || 'thegame');
                        resultEffect[key] = value;
                    });
                    return resultEffect;
                }
                let resultEffect /*: WithReplacementValues<EffectType, EffectType>*/ = {
                    ...replacementEffect,
                    replacedBy: appliedReplacerId ? [
                        ...previouslyReplacedBy,
                        appliedReplacerId,
                    ] : previouslyReplacedBy,
                    generatedBy: action.generatedBy || this.nanoid(),
                    player: appliedReplacerSelf.data.controller,
                };
                // prepare %-values on created action
                Object.keys(replacementEffect)
                    .filter(key => !['type', 'effectType'].includes(key))
                    .forEach(key => {
                    const value = this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy || 'thegame');
                    resultEffect[key] = value;
                });
                return resultEffect;
            })(appliedReplacerSelf)) : [];
            // If the replacer is one-time, set the action usage
            if (appliedReplacerSelf && foundReplacer && foundReplacer.oncePerTurn && foundReplacer.name) {
                appliedReplacerSelf.setActionUsed(foundReplacer.name);
            }
            if (foundReplacer && foundReplacer.mayEffect) {
                const replacedBy = ('replacedBy' in action && action.replacedBy) ? [...action.replacedBy] : [];
                if (appliedReplacerId) {
                    replacedBy.push(appliedReplacerId);
                }
                this.state.mayEffectActions = resultEffects;
                this.state.fallbackActions = [{
                        ...action,
                        replacedBy, // :	('replacedBy' in action && action.replacedBy) ? [...action.replacedBy, appliedReplacerId] : [appliedReplacerId],
                    }];
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
                        player: appliedReplacerSelf ? appliedReplacerSelf.data.controller : 0, // This is strange @todo check if appliedReplacerSelf can be null
                    }];
            }
            else {
                return resultEffects;
            }
        }
        return [action];
    }
    checkCondition(action, self, condition) {
        if (!('objectOne' in condition) ||
            !('objectTwo' in condition)) {
            throw new Error('Missing object field in condition');
        }
        // Sometimes, spellData stores arrays of cards. If we got array to check condition on, use only first item.
        const multiObjectOne = this.getObjectOrSelf(action, self, condition.objectOne, 'propertyOne' in condition && Boolean(condition.propertyOne));
        const objectOne = (multiObjectOne instanceof Array) ? multiObjectOne[0] : multiObjectOne;
        const multiObjectTwo = this.getObjectOrSelf(action, self, condition.objectTwo, 'propertyTwo' in condition && Boolean(condition.propertyTwo));
        const objectTwo = (multiObjectTwo instanceof Array) ? multiObjectTwo[0] : multiObjectTwo;
        // So here either objectOne or objectTwo might be an array. 
        if (objectOne instanceof Array || objectTwo instanceof Array) {
            throw new Error('Whoops, array in checkCondition');
        }
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
    }
    matchAction(action, find, self) {
        if (action.type !== const_1.ACTION_EFFECT) {
            return false;
        }
        if (action.effectType !== find.effectType) {
            return false;
        }
        const conditions = find.conditions.map(condition => {
            let result = false;
            try {
                result = this.checkCondition(action, self, condition);
            }
            catch (e) {
                console.error('Failure checking condition');
                console.dir(condition);
            }
            return result;
        });
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
            ...cardInPlay.card.data.triggerEffects.map(effect => ({ ...effect, self: cardInPlay })),
        ] : acc, []);
        // const continuousEffectTriggers = this.state.continuousEffects.map(effect => effect.triggerEffects.map(triggerEffect => ({...triggerEffect, id: effect.id})) || []).flat();
        const triggerEffects = [...cardTriggerEffects, ...this.state.delayedTriggers, /* ...continuousEffectTriggers*/];
        triggerEffects.forEach(replacer => {
            // @ts-ignore
            const triggeredId = replacer.self.id; // Not really, but will work for now
            if (this.matchAction(action, replacer.find, replacer.self)) {
                // Save source to *trigger source* metadata (it's probably empty)
                // For creatures set creatureSource field (just for convenience)
                this.setSpellMetaDataField('source', replacer.self, /*action.generatedBy ||*/ triggeredId);
                if (replacer.self.card.type === const_1.TYPE_CREATURE) {
                    this.setSpellMetaDataField('sourceCreature', replacer.self, /*action.generatedBy ||*/ triggeredId);
                }
                // Turn all metadata entries into their corresponding values 
                const actionWithValues = Object.fromEntries(Object.entries(action).map(([key, value]) => {
                    if (typeof value == 'string' && value.startsWith('$')) {
                        return [key, this.getMetaValue(value, action.generatedBy)];
                    }
                    return [key, value];
                }));
                // Turn effect-templates into actual effect actions by preparing meta-values				
                const preparedEffects = replacer.effects.map(effect => {
                    // @ts-ignore
                    let resultEffect = {
                        type: effect.type || const_1.ACTION_EFFECT,
                        generatedBy: /*action.generatedBy ||*/ triggeredId, // Some actions do not have generatedBy (game actions). We still need one though.
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
                        .filter(key => !['type', 'effectType'].includes(key))
                        .forEach(key => {
                        const propertyValue = effect[key];
                        const value = this.prepareMetaValue(propertyValue, actionWithValues, replacer.self, action.generatedBy || this.nanoid());
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
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_TRIGGERED_ABILITY_FINISHED,
                    generatedBy: triggeredId,
                });
                const allPromptsAreDoable = this.checkPrompts(replacer.self, preparedEffects, false, 0);
                if (allPromptsAreDoable) {
                    if (replacer.mayEffect) {
                        this.state.mayEffectActions = preparedEffects;
                        this.transformIntoActions({
                            type: const_1.ACTION_ENTER_PROMPT,
                            promptType: const_1.PROMPT_TYPE_MAY_ABILITY,
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
                        this.transformIntoActions(...preparedEffects);
                    }
                }
                // @ts-ignore
                if (replacer.id) {
                    // @ts-ignore
                    this.removeDelayedTrigger(replacer.id);
                }
            }
        });
    }
    attachCard(cardId, attachmentTargetId) {
        this.state.attachedTo[cardId] = attachmentTargetId;
        if (!(attachmentTargetId in this.state.cardsAttached)) {
            this.state.cardsAttached[attachmentTargetId] = [];
        }
        this.state.cardsAttached[attachmentTargetId].push(cardId);
    }
    removeAttachments(cardId) {
        if (cardId in this.state.cardsAttached) {
            for (let attachedCardId of this.state.cardsAttached[cardId]) {
                if (attachedCardId in this.state.attachedTo) {
                    delete this.state.attachedTo[attachedCardId];
                }
            }
            delete this.state.cardsAttached[cardId];
        }
    }
    convertPromptActionToEffect(action) {
        const player = this.getMetaValue(action.player, action.generatedBy);
        switch (action.promptType) {
            case const_1.PROMPT_TYPE_NUMBER: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
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
                    source: this.getMetaValue(action.source, action.generatedBy),
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
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                    promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                    zone: this.getMetaValue(action.zone, action.generatedBy),
                    zoneOwner: this.getMetaValue(action.zoneOwner, action.generatedBy),
                    numberOfCards: this.getMetaValue(action.numberOfCards, action.generatedBy),
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
            case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
            case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
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
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
            case const_1.PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
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
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
            case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
            case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
                const effect = {
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_PROMPT_ENTERED,
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
                    generatedBy: action.generatedBy || 'the-game',
                    player,
                };
                return effect;
            }
        }
    }
    detachCard(cardId) {
        if (cardId in this.state.attachedTo) {
            const attachedTargetId = this.state.attachedTo[cardId];
            delete this.state.attachedTo[cardId];
            this.state.cardsAttached[attachedTargetId] =
                this.state.cardsAttached[attachedTargetId].filter(attachedCard => attachedCard !== cardId);
        }
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
    }
    calculateTotalCost(card) {
        const activeMagiSelected = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            const activeMagi = activeMagiSelected[0];
            const baseCost = this.modifyByStaticAbilities(card, const_1.PROPERTY_COST);
            const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return 0;
    }
    getAvailableCards(player, topMagi) {
        const deckCards = this.getZone(const_1.ZONE_TYPE_DECK, player).cards.map(({ card }) => card.name);
        const discardCards = this.getZone(const_1.ZONE_TYPE_DISCARD, player).cards.map(({ card }) => card.name);
        const searchableCards = [...deckCards, ...discardCards];
        const availableCards = topMagi.card.data?.startingCards?.filter(card => searchableCards.includes(card)) || [];
        return availableCards;
    }
    checkPrompts(source, preparedActions, isPower = false, powerCost = 0) {
        const testedActions = [...preparedActions];
        // Calculate if prompts are resolvable
        // If source is Magi, it will not be filtered out, being in another zone
        const creatureWillSurvive = !isPower || source.data.energy > powerCost;
        const ourCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => (creatureWillSurvive ? true : card.id !== source.id) && this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === source.data.controller);
        const allCardsInPlay = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => creatureWillSurvive ? true : card.id !== source.id);
        const metaValues = {
            '$source': source,
            '$sourceCreature': source,
        };
        while (testedActions.length && testedActions[0].type === const_1.ACTION_GET_PROPERTY_VALUE) {
            const valueGetter = testedActions[0];
            testedActions.shift();
            const multiTarget = valueGetter.source;
            const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
            const property = this.getMetaValue(valueGetter.property, valueGetter.generatedBy);
            const modifiedResult = this.modifyByStaticAbilities(target, property);
            const variable = valueGetter.variable || 'result';
            metaValues[`$${variable}`] = modifiedResult;
        }
        // powerPromptsDoable
        const testablePrompts = [
            const_1.PROMPT_TYPE_SINGLE_CREATURE,
            const_1.PROMPT_TYPE_RELIC,
            const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
            const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
            const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
            const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
            const_1.PROMPT_TYPE_POWER_ON_MAGI,
        ];
        const testablePromptFilter = (action) => action.type === const_1.ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
        const allPrompts = testedActions.filter(testablePromptFilter);
        const allPromptsAreDoable = allPrompts.every(promptAction => {
            switch (promptAction.promptType) {
                case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                    return allCardsInPlay.some(card => card.card.type === const_1.TYPE_CREATURE);
                case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    const opponent = this.getOpponent(source.data.controller);
                    const magi = [...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, ...this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, opponent).cards];
                    return magi.some(magi => !allCardsInPlay.some(card => card.card.type === const_1.TYPE_CREATURE && this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === magi.data.controller));
                case const_1.PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(card => card.card.type === const_1.TYPE_RELIC);
                case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(card => card.card.type === const_1.TYPE_CREATURE);
                case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => card.id !== source.id);
                }
                case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
                    const magi = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards;
                    return magi.some(magi => magi.card.data.powers && magi.card.data.powers.some(power => power.cost === const_1.COST_X || (power.cost <= magi.data.energy + 2)));
                }
                case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if (promptAction.restrictions) {
                        const restrictionsWithValues = promptAction.restrictions.map(({ type, value }) => {
                            const restrictionValue = (typeof value === 'string' &&
                                value in metaValues) ? metaValues[value] : value;
                            return {
                                type,
                                value: restrictionValue,
                            };
                        });
                        return this.checkAnyCardForRestrictions(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), restrictionsWithValues);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                const restrictionValue = (typeof promptAction.restrictionValue === 'string' &&
                                    promptAction.restrictionValue in metaValues) ? metaValues[promptAction.restrictionValue] : promptAction.restrictionValue;
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
                    const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
                    const numberOfCards = this.getMetaValue(promptAction.numberOfCards, source.id);
                    // if (cardsInZone.length < numberOfCards) {
                    //	 return false;
                    // }
                    if (promptAction.restrictions) {
                        return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
                    const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
                    if (promptAction.restrictions) {
                        return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case const_1.RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case const_1.RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === const_1.TYPE_CREATURE), promptAction.restriction, source.data.controller);
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
        return allPromptsAreDoable;
    }
    update(initialAction) {
        if (this.hasWinner()) {
            return false;
        }
        this.addActions(initialAction);
        while (this.hasActions()) {
            const rawAction = this.getNextAction();
            const replacedActions = this.replaceByReplacementEffect(rawAction);
            const action = replacedActions[0];
            if (replacedActions.length > 1) {
                // Stuff the rest of them into beginning of the action queue
                this.transformIntoActions(...replacedActions.slice(1));
            }
            if (this.state.prompt && !(action.type === const_1.ACTION_RESOLVE_PROMPT || action.type === const_1.ACTION_CONCEDE || action.type === const_1.ACTION_EXIT_PROMPTS || (action.type == const_1.ACTION_EFFECT && action.effectType == const_1.EFFECT_TYPE_PROMPT_ENTERED))) {
                (0, logAction_1.showAction)(action);
                throw new Error('Non-prompt action in the prompt state');
            }
            if (this.debug) {
                (0, logAction_1.showAction)(action);
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
                    const attackSource = action.generatedBy ? this.getMetaValue(action.source, action.generatedBy) : action.source;
                    const attackTarget = action.generatedBy ? this.getMetaValue(action.target, action.generatedBy) : action.target;
                    const additionalAttackers = (action.generatedBy ? this.getMetaValue(action.additionalAttackers, action.generatedBy) : action.additionalAttackers) || [];
                    const sourceAttacksPerTurn = this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ATTACKS_PER_TURN);
                    const attackerCanAttack = this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_ABLE_TO_ATTACK);
                    if (!attackerCanAttack) {
                        console.error(`Somehow ${attackSource.card.name} cannot attack`);
                    }
                    else {
                        const targetCanBeAttacked = this.modifyByStaticAbilities(attackTarget, const_1.PROPERTY_CAN_BE_ATTACKED);
                        if (!targetCanBeAttacked) {
                            console.error(`Somehow ${attackSource.card.name} cannot be attacked`);
                        }
                        else {
                            const sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
                            const additionalAttackersCanAttack = additionalAttackers.every((card) => card.card.data.canPackHunt && this.modifyByStaticAbilities(card, const_1.PROPERTY_ABLE_TO_ATTACK));
                            const additionalAttackersHasAttacksLeft = additionalAttackers.every((card) => card.data.attacked < this.modifyByStaticAbilities(card, const_1.PROPERTY_ATTACKS_PER_TURN));
                            const targetIsMagi = attackTarget.card.type == const_1.TYPE_MAGI;
                            const opponentCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, attackTarget.owner);
                            const magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;
                            const attackApproved = !targetIsMagi || ( // Either we attack a creature
                            targetIsMagi && ( // Or we are attacking a magi, but then...
                            !magiHasCreatures || // ...he either shouldn't have creatures
                                this.modifyByStaticAbilities(attackSource, const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
                            ));
                            const enoughAttacksLeft = (sourceHasAttacksLeft && ((additionalAttackersCanAttack && additionalAttackersHasAttacksLeft) || additionalAttackers.length === 0));
                            if (enoughAttacksLeft && attackApproved && this.getCurrentPriority() == const_1.PRIORITY_ATTACK) {
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_ATTACK,
                                    source: attackSource,
                                    target: attackTarget,
                                    additionalAttackers,
                                    generatedBy: attackSource.id,
                                    player: attackSource.data.controller,
                                });
                            }
                        }
                    }
                    break;
                }
                case const_1.ACTION_GET_PROPERTY_VALUE: {
                    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                    const property = this.getMetaValue(action.property, action.generatedBy);
                    if (property === const_1.CARD_COUNT) {
                        const result = (multiTarget instanceof Array) ? multiTarget.length : 0;
                        const variable = action.variable || 'result';
                        if (action.generatedBy) {
                            this.setSpellMetaDataField(variable, result, action.generatedBy);
                        }
                    }
                    else {
                        // Sometimes we can only pass here results of a selector.
                        // If so, work on first element of result.
                        const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
                        let modifiedResult;
                        if (target && 'name' in target && 'effects' in target && property === const_1.PROPERTY_POWER_COST) {
                            modifiedResult = target.cost;
                        }
                        else {
                            modifiedResult = this.modifyByStaticAbilities(target, property);
                        }
                        const variable = action.variable || 'result';
                        if (action.generatedBy) {
                            this.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
                        }
                    }
                    break;
                }
                case const_1.ACTION_CALCULATE: {
                    const operandOne = this.getMetaValue(action.operandOne, action.generatedBy);
                    const operandTwo = this.getMetaValue(action.operandTwo, action.generatedBy);
                    const result = this.performCalculation(action.operator, operandOne, operandTwo);
                    const variable = action.variable || 'result';
                    if (action.generatedBy) {
                        this.setSpellMetaDataField(variable, result, action.generatedBy);
                    }
                    break;
                }
                case const_1.ACTION_POWER: {
                    const powerCost = this.modifyByStaticAbilities(action.source, const_1.PROPERTY_POWER_COST, action.power.name || '');
                    const payingCard = (action.source.card.type === const_1.TYPE_RELIC) ?
                        this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
                        action.source;
                    if (payingCard &&
                        !action.source.wasActionUsed(action.power.name) &&
                        (payingCard.data.energy >= powerCost ||
                            (payingCard.data.energy > 0 && powerCost === const_1.COST_X))) {
                        const source = action.source;
                        const sourcePower = action.power;
                        const effects = action.power.effects;
                        const sourceController = this.modifyByStaticAbilities(source, const_1.PROPERTY_CONTROLLER);
                        const enrichAction = (effect) => ({
                            source,
                            player: sourceController,
                            ...effect,
                            power: true,
                            generatedBy: source.id,
                        });
                        const preparedActions = effects.map(enrichAction);
                        const allPromptsAreDoable = this.checkPrompts(source, preparedActions, true, powerCost);
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
                                    player: sourceController,
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
                            if (sourcePower) {
                                const powerEffects = {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
                                    power: sourcePower,
                                    source,
                                    player: action.player,
                                    generatedBy: source.id,
                                };
                                this.addActions(powerEffects);
                            }
                            this.addActions({
                                type: const_1.ACTION_EFFECT,
                                effectType: const_1.EFFECT_TYPE_POWER_FINISHED,
                                generatedBy: source.id,
                            });
                            this.setSpellMetadata(currentPowerMetaData, source.id);
                        }
                    }
                    break;
                }
                case const_1.ACTION_ENTER_PROMPT: {
                    if (!('player' in action)) {
                        throw new Error('Prompt without player!');
                    }
                    const savedActions = this.state.actions;
                    let promptParams = {};
                    let skipPrompt = false;
                    const promptPlayer = this.getMetaValue(action.player, action.generatedBy);
                    switch (action.promptType) {
                        case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                            promptParams = {
                                source: this.getMetaValue(action.source, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_MAY_ABILITY: {
                            promptParams = action.promptParams;
                            break;
                        }
                        case const_1.PROMPT_TYPE_ALTERNATIVE: {
                            promptParams = {
                                alternatives: action.alternatives,
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_PAYMENT_SOURCE: {
                            promptParams = {
                                paymentAmount: action.amount,
                                paymentType: action.paymentType,
                                cards: action.cards.map(convertCard),
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
                            const zoneContent = (zone === const_1.ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
                            const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;
                            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
                            if (maxNumberOfCards > 0) {
                                promptParams = {
                                    zone,
                                    zoneOwner,
                                    restrictions,
                                    numberOfCards: maxNumberOfCards,
                                    cards: cards.map(convertCard),
                                };
                            }
                            else {
                                skipPrompt = true;
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                            if (action.restriction && action.restrictions) {
                                throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
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
                            const zoneContent = (zone === const_1.ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
                            const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;
                            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
                            if (maxNumberOfCards > 0) {
                                promptParams = {
                                    zone,
                                    zoneOwner,
                                    restrictions,
                                    numberOfCards: maxNumberOfCards,
                                    cards: cards.map(convertCard),
                                };
                            }
                            else {
                                skipPrompt = true;
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                            const zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
                            const zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
                            const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
                            const zoneContent = this.getZone(zone, zoneOwner).cards;
                            const cards = zoneContent.slice(0, numberOfCards);
                            promptParams = {
                                zone,
                                zoneOwner,
                                numberOfCards,
                                cards: cards.map(convertCard),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                            if (action.restrictions) {
                                const restrictionsWithValues = action.restrictions.map(({ type, value }) => ({
                                    type,
                                    value: this.getMetaValue(value, action.generatedBy),
                                }));
                                promptParams = {
                                    restrictions: restrictionsWithValues,
                                };
                            }
                            else if (action.restriction) {
                                promptParams = {
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this.getMetaValue(action.restrictionValue, action.generatedBy),
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
                                min: this.getMetaValue(action.min, action.generatedBy),
                                max: this.getMetaValue(action.max, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
                            promptParams = {
                                magi: this.getMetaValue(action.magi, action.generatedBy),
                            };
                            break;
                        }
                        case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            if (action.restriction) {
                                promptParams = {
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this.getMetaValue(action.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            if (action.restriction) {
                                promptParams = {
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                    restrictions: [
                                        {
                                            type: action.restriction,
                                            value: this.getMetaValue(action.amount, action.generatedBy),
                                        },
                                    ],
                                };
                            }
                            else {
                                promptParams = {
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
                            }
                            break;
                        }
                        case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                            // console.dir(this.getSpellMetadata(action.generatedBy))
                            const sourceZone = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const sourceZoneOwner = this.getMetaValue(action.sourceZoneOwner, action.generatedBy);
                            const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
                            const zoneContent = this.getZone(sourceZone, sourceZoneOwner).cards;
                            const cards = zoneContent.slice(0, numberOfCards);
                            promptParams = {
                                sourceZone,
                                sourceZoneOwner,
                                numberOfCards,
                                cards: cards.map(convertCard),
                                targetZones: action.targetZones,
                            };
                        }
                    }
                    if (!skipPrompt) {
                        this.state = {
                            ...this.state,
                            savedActions,
                            // This will be the only action to fire after entering the prompt
                            actions: [this.convertPromptActionToEffect(action)],
                            prompt: true,
                            promptMessage: ('message' in action) ? action.message : '',
                            promptPlayer,
                            promptType: action.promptType,
                            promptVariable: action.variable,
                            promptGeneratedBy: action.generatedBy,
                            promptParams,
                        };
                    }
                    break;
                }
                case const_1.ACTION_EXIT_PROMPTS: {
                    this.state = {
                        ...this.state,
                        actions: [],
                        savedActions: [],
                        mayEffectActions: [],
                        fallbackActions: [],
                        prompt: false,
                        promptType: null,
                        promptMessage: undefined,
                        promptGeneratedBy: undefined,
                        promptVariable: undefined,
                        promptParams: {},
                        spellMetaData: {
                            ...this.state.spellMetaData,
                        },
                    };
                    break;
                }
                case const_1.ACTION_RESOLVE_PROMPT: {
                    if (this.state.promptType === const_1.PROMPT_TYPE_MAY_ABILITY) {
                        const mayEffectActions = this.state.mayEffectActions || [];
                        const fallbackActions = this.state.fallbackActions || [];
                        const savedActions = this.state.savedActions || [];
                        const actions = action.useEffect ? [...mayEffectActions, ...savedActions] : [...fallbackActions, ...savedActions];
                        this.state = {
                            ...this.state,
                            actions,
                            savedActions: [],
                            mayEffectActions: [],
                            fallbackActions: [],
                            prompt: false,
                            promptType: null,
                            promptMessage: undefined,
                            promptGeneratedBy: undefined,
                            promptVariable: undefined,
                            promptParams: {},
                            spellMetaData: {
                                ...this.state.spellMetaData,
                            },
                        };
                    }
                    else {
                        const generatedBy = action.generatedBy || this.state.promptGeneratedBy || this.nanoid();
                        const variable = action.variable || this.state.promptVariable;
                        let currentActionMetaData = this.state.spellMetaData[generatedBy] || {};
                        switch (this.state.promptType) {
                            case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                                if ('cards' in action && action.cards) {
                                    if (this.state.promptParams.numberOfCards !== action.cards.length) {
                                        return false;
                                    }
                                    if (this.state.promptParams.restrictions) {
                                        const checkResult = this.state.promptParams.restrictions.every(({ type, value }) => this.checkCardsForRestriction(action.cards, type, value));
                                        if (!checkResult) {
                                            return false;
                                        }
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                                if ('cards' in action && action.cards) {
                                    if (this.state.promptParams && this.state.promptParams.cards && this.state.promptParams.cards.length !== action.cards.length) {
                                        console.error('Number of cards is wrong');
                                        return false;
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
                                if ('cards' in action && action.cards) {
                                    const totalCards = Object.values(action.cards).flat();
                                    if (this.state.promptParams && this.state.promptParams.cards && this.state.promptParams.cards.length !== totalCards.length) {
                                        console.error('Number of cards is wrong');
                                        return false;
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
                                }
                            }
                            case const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                                if ('cards' in action && action.cards) {
                                    const expectedNumber = this.state?.promptParams?.numberOfCards || 0;
                                    if (action.cards.length > expectedNumber) {
                                        return false;
                                    }
                                    if (this.state.promptParams.restrictions) {
                                        const checkResult = this.state.promptParams.restrictions.every(({ type, value }) => this.checkCardsForRestriction(action.cards, type, value));
                                        if (!checkResult) {
                                            return false;
                                        }
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE]] = action.cards;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_NUMBER:
                                if ('number' in action) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_NUMBER]] = (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10);
                                }
                                break;
                            case const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
                                if ('target' in action && action.target && this.state?.promptParams?.source) {
                                    if (this.state.promptParams.source.id === action.target?.id) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE]] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_RELIC: {
                                if ('target' in action) {
                                    if (action.target?.card.type !== const_1.TYPE_RELIC) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_RELIC]] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                                if ('target' in action && action.target) {
                                    const targetController = this.modifyByStaticAbilities(action.target, const_1.PROPERTY_CONTROLLER);
                                    if (this.state.promptPlayer !== targetController) {
                                        throw new Error('Not-controlled creature supplied to Own Creatures prompt');
                                    }
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE]] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED]] = action.target;
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                                if ('target' in action && action.target?.card.type === const_1.TYPE_MAGI && this.useSelector(const_1.SELECTOR_CREATURES_OF_PLAYER, action.target.data.controller).length == 0) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES]] = action.target;
                                    break;
                                }
                            }
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_SINGLE_CREATURE]] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI]] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_SINGLE_MAGI:
                                if ('target' in action && action.target) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_SINGLE_MAGI]] = action.target;
                                }
                                break;
                            case const_1.PROMPT_TYPE_CHOOSE_CARDS:
                                if ('cards' in action) {
                                    // Should be a check against promptParams.availableCards
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_CHOOSE_CARDS]] = action.cards || [];
                                }
                                break;
                            case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
                                }
                                break;
                            case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                                if ('energyOnCreatures' in action && action.energyOnCreatures) {
                                    const totalEnergy = Object.values(action.energyOnCreatures).reduce((a, b) => a + b, 0);
                                    if (totalEnergy === this.state.promptParams.amount) {
                                        currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                                if ('damageOnCreatures' in action) {
                                    const totalDamage = Object.values(action.damageOnCreatures).reduce((a, b) => a + b, 0);
                                    if (totalDamage === this.state.promptParams.amount) {
                                        currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]] = action.damageOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_PLAYER: {
                                if ('targetPlayer' in action) {
                                    if (this.players.includes(action.targetPlayer)) {
                                        currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_PLAYER]] = action.targetPlayer;
                                    }
                                    else {
                                        console.error(`Unknown player: ${action.targetPlayer} in PROMPT_TYPE_PLAYER prompt resolution`);
                                    }
                                }
                                else {
                                    console.error('No player in PROMPT_TYPE_PLAYER prompt resolution');
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
                                if ('power' in action && 'source' in action) {
                                    const source = this.getMetaValue(action.source, action.generatedBy);
                                    const power = this.getMetaValue(action.power, action.generatedBy);
                                    if (source && power && source.card.data.powers && source.card.data.powers.some(p => p.name === power.name)) {
                                        currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_POWER_ON_MAGI]] = action.power;
                                    }
                                    else {
                                        console.error(`Unknown power: ${power.name || power} in PROMPT_TYPE_POWER_ON_MAGI prompt resolution`);
                                    }
                                }
                                else {
                                    console.error('No power or source in PROMPT_TYPE_POWER_ON_MAGI prompt resolution');
                                }
                                break;
                            }
                            case const_1.PROMPT_TYPE_ALTERNATIVE: {
                                if ('alternative' in action) {
                                    currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_ALTERNATIVE]] = action.alternative;
                                }
                            }
                            case const_1.PROMPT_TYPE_PAYMENT_SOURCE: {
                                if ('target' in action && action.target && this.state.promptParams.paymentType && this.state.promptParams.paymentAmount) {
                                    const paymentSource = action.target;
                                    if (paymentSource.card.type === const_1.TYPE_MAGI ||
                                        (paymentSource.card.type === const_1.TYPE_CREATURE && paymentSource.card.data.paymentSource?.includes(this.state.promptParams.paymentType))) {
                                        if (paymentSource.data.energy >= this.state.promptParams.paymentAmount) {
                                            currentActionMetaData[variable || exports.DEFAULT_PROMPT_VARIABLE[const_1.PROMPT_TYPE_ALTERNATIVE]] = action.target;
                                        }
                                        else {
                                            console.error(`This payment target doesn't have enough energy to pay for that`);
                                        }
                                    }
                                    else {
                                        console.error(`You cannot pay for ${this.state.promptParams.paymentType} from this`);
                                    }
                                }
                            }
                        }
                        const actions = this.state.savedActions || [];
                        this.state = {
                            ...this.state,
                            actions,
                            savedActions: [],
                            prompt: false,
                            promptType: null,
                            promptMessage: undefined,
                            promptGeneratedBy: undefined,
                            promptVariable: undefined,
                            promptParams: {},
                            spellMetaData: {
                                ...this.state.spellMetaData,
                                [generatedBy]: currentActionMetaData,
                            },
                        };
                    }
                    break;
                }
                case const_1.ACTION_SELECT: {
                    let result;
                    switch (action.selector) {
                        case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CARDS_IN_PLAY, action.player || 0);
                            break;
                        }
                        case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CREATURES_OF_TYPE, action.player || 0, this.getMetaValue(action.creatureType, action.generatedBy));
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
                            result = this.useSelector(const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE, null);
                            break;
                        }
                        case const_1.SELECTOR_OPPONENT_ID: {
                            result = this.useSelector(const_1.SELECTOR_OPPONENT_ID, action.player || 0, this.getMetaValue(action.opponentOf || action.player, action.generatedBy));
                            break;
                        }
                        case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                            result = this.useSelector(const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player || 0);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_AND_MAGI: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            const creatures = this.useSelector(const_1.SELECTOR_CREATURES, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                                ...(creatures instanceof Array ? creatures : []),
                            ];
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_OF_REGION: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_NOT_OF_REGION: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_NOT_OF_REGION, action.player || 0, action.region);
                            break;
                        }
                        case const_1.SELECTOR_OTHER_CREATURES_OF_TYPE: {
                            const creatures = this.useSelector(const_1.SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            result = (creatures instanceof Array) ? creatures.filter((card) => card.id !== action.generatedBy) : [];
                            break;
                        }
                        case const_1.SELECTOR_MAGI_OF_REGION: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) === action.region);
                            break;
                        }
                        case const_1.SELECTOR_MAGI_NOT_OF_REGION: {
                            const ownMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, action.player || 0);
                            const enemyMagi = this.useSelector(const_1.SELECTOR_ENEMY_MAGI, action.player || 0);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, const_1.PROPERTY_REGION) != action.region);
                            break;
                        }
                        case const_1.SELECTOR_STATUS: {
                            result = this.useSelector(const_1.SELECTOR_STATUS, null, action.status);
                            break;
                        }
                        case const_1.SELECTOR_CREATURES_WITHOUT_STATUS: {
                            result = this.useSelector(const_1.SELECTOR_CREATURES_WITHOUT_STATUS, null, action.status);
                            break;
                        }
                        case const_1.SELECTOR_NTH_CARD_OF_ZONE: {
                            const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
                            const zoneType = this.getMetaValue(action.zone, action.generatedBy);
                            const cardNumber = this.getMetaValue(action.cardNumber, action.generatedBy);
                            result = this.selectNthCardOfZone(zoneOwner, zoneType, cardNumber, action.restrictions);
                            break;
                        }
                        case const_1.SELECTOR_RANDOM_CARD_IN_HAND: {
                            const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
                            result = this.selectRandomCardOfZone(zoneOwner, const_1.ZONE_TYPE_HAND);
                            break;
                        }
                        case const_1.SELECTOR_MAGI_OF_PLAYER: {
                            const owner = this.getMetaValue(action.owner, action.generatedBy);
                            result = this.useSelector(const_1.SELECTOR_OWN_MAGI, owner);
                            break;
                        }
                        case const_1.SELECTOR_OWN_CARDS_IN_HAND: {
                            if ('player' in action && typeof action.player == 'number') {
                                const zoneOwner = this.getMetaValue(action.player, action.generatedBy);
                                result = this.getZone(const_1.ZONE_TYPE_HAND, zoneOwner).cards;
                            }
                            else {
                                result = [];
                            }
                            break;
                        }
                        case const_1.SELECTOR_CARDS_IN_HAND: {
                            if ('zoneOwner' in action) {
                                const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
                                result = this.getZone(const_1.ZONE_TYPE_HAND, zoneOwner).cards;
                            }
                            else {
                                result = [];
                            }
                            break;
                        }
                        // This selector is special
                        // If there are more than one creature with the same (least) energy, it transforms into the corresponding prompt
                        case const_1.SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY: {
                            const creatures = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == action.player &&
                                card.card.type == const_1.TYPE_CREATURE);
                            if (creatures.length) {
                                const energies = {};
                                let minEnergy = Infinity;
                                for (let creature of creatures) {
                                    const energy = creature.data.energy;
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
                                    this.transformIntoActions({
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
                            else {
                                result = [];
                            }
                            break;
                        }
                        default: {
                            // @ts-ignore
                            result = this.useSelector(action.selector, action.player);
                        }
                    }
                    const variable = action.variable || 'selected';
                    this.setSpellMetaDataField(variable, result, action.generatedBy || this.nanoid());
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
                            generatedBy: this.nanoid(),
                        });
                    }
                    else {
                        if (action.player === this.state.activePlayer) {
                            newStep = (this.state.step + 1) % steps.length;
                            if (newStep === 0) {
                                this.stopTurnTimer();
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                                    player: this.state.activePlayer,
                                    generatedBy: this.nanoid(),
                                }, {
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_START_TURN,
                                    player: this.getOpponent(this.state.activePlayer),
                                    generatedBy: this.nanoid(),
                                });
                            }
                            else {
                                this.transformIntoActions({
                                    type: const_1.ACTION_EFFECT,
                                    effectType: const_1.EFFECT_TYPE_START_STEP,
                                    player: this.state.activePlayer,
                                    step: newStep,
                                    generatedBy: this.nanoid(),
                                });
                            }
                        }
                    }
                    break;
                }
                case const_1.ACTION_PLAY: {
                    const castCards = ('card' in action) ? this.getMetaValue(action.card, action.generatedBy) : null;
                    const castCard = castCards ? (castCards.length ? castCards[0] : castCards) : null;
                    const player = ('payload' in action) ? action.payload.player : action.player || 0;
                    const cardItself = ('payload' in action) ? action.payload.card : castCard;
                    if (!cardItself) {
                        throw new Error('No card itself found');
                    }
                    const playerHand = this.getZone(const_1.ZONE_TYPE_HAND, player);
                    const cardInHand = playerHand.containsId(cardItself?.id || '');
                    // baseCard is "abstract" card, CardInPlay is concrete instance
                    const baseCard = ('payload' in action) ? action.payload.card.card : castCard?.card;
                    if (cardInHand && baseCard) {
                        const currentPriority = this.getCurrentPriority();
                        const cardType = baseCard.type;
                        if ((cardType == const_1.TYPE_CREATURE && currentPriority == const_1.PRIORITY_CREATURES) ||
                            (cardType == const_1.TYPE_RELIC && currentPriority == const_1.PRIORITY_PRS) ||
                            (cardType == const_1.TYPE_SPELL && currentPriority == const_1.PRIORITY_PRS) ||
                            action.forcePriority) {
                            const activeMagi = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).card;
                            if (!activeMagi) {
                                throw new Error('Trying to play a card without Magi');
                            }
                            const totalCost = this.calculateTotalCost(cardItself);
                            switch (cardType) {
                                case const_1.TYPE_CREATURE: {
                                    const alternativePaymentSources = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.data.paymentSource && card.card.data.paymentSource.includes(const_1.TYPE_CREATURE) && this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player);
                                    const alternativePaymentSourcesAbleToPay = alternativePaymentSources.filter(card => card.data.energy >= totalCost);
                                    if (activeMagi.data.energy >= totalCost || alternativePaymentSourcesAbleToPay.length > 0) {
                                        const availablePaymentSources = [
                                            ...alternativePaymentSourcesAbleToPay,
                                            activeMagi.data.energy >= totalCost ? activeMagi : undefined
                                        ].filter((card) => card instanceof CardInGame_1.default);
                                        const paymentActions = availablePaymentSources.length == 1 ? [{
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                                from: availablePaymentSources[0],
                                                amount: totalCost,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }] : [{
                                                type: const_1.ACTION_ENTER_PROMPT,
                                                promptType: const_1.PROMPT_TYPE_PAYMENT_SOURCE,
                                                amount: totalCost,
                                                paymentType: const_1.TYPE_CREATURE,
                                                variable: 'paymentSource',
                                                cards: availablePaymentSources,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                                from: '$paymentSource',
                                                amount: totalCost,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }];
                                        this.transformIntoActions(...paymentActions, {
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
                                            amount: (baseCard.cost === const_1.COST_X || baseCard.cost === const_1.COST_X_PLUS_ONE || baseCard.cost === null) ? 0 : baseCard.cost,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_FINISHED,
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
                                    if (!alreadyHasOne && regionAllows && typeof baseCard.cost == 'number' && activeMagi.data.energy >= baseCard.cost) {
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
                                        }, {
                                            type: const_1.ACTION_EFFECT,
                                            effectType: const_1.EFFECT_TYPE_PLAY_FINISHED,
                                            generatedBy: cardItself.id,
                                        });
                                    }
                                    break;
                                }
                                case const_1.TYPE_SPELL: {
                                    if (activeMagi.data.energy >= totalCost || baseCard.cost === const_1.COST_X || baseCard.cost === const_1.COST_X_PLUS_ONE) {
                                        const enrichAction = (effect) => ({
                                            source: cardItself,
                                            player, // Spell can rewrite this to make opponent do something - draw a card, for example
                                            ...effect,
                                            spell: true,
                                            generatedBy: cardItself.id,
                                        });
                                        const preparedEffects = baseCard.data?.effects?.map(enrichAction) || [];
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
                                                    return this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) === promptAction.player);
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
                                            const regionPenalty = (activeMagi.card.region == baseCard.region || baseCard.region == const_1.REGION_UNIVERSAL) ? 0 : 1;
                                            const maxCost = baseCard.data.maxCostX || Infinity;
                                            const payEffects = (baseCard.cost === const_1.COST_X || baseCard.cost === const_1.COST_X_PLUS_ONE) ? [
                                                {
                                                    type: const_1.ACTION_ENTER_PROMPT,
                                                    promptType: const_1.PROMPT_TYPE_NUMBER,
                                                    player,
                                                    min: 1,
                                                    max: Math.min(activeMagi.data.energy, maxCost) - regionPenalty - (baseCard.cost === const_1.COST_X_PLUS_ONE ? 1 : 0),
                                                    variable: 'chosen_cost',
                                                    generatedBy: cardItself.id,
                                                },
                                                {
                                                    type: const_1.ACTION_CALCULATE,
                                                    operandOne: 'chosen_cost',
                                                    operandTwo: regionPenalty + (baseCard.cost === const_1.COST_X_PLUS_ONE ? 1 : 0),
                                                    operator: const_1.CALCULATION_ADD,
                                                    variable: 'totalCost',
                                                    generatedBy: cardItself.id,
                                                },
                                                {
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: '$totalCost',
                                                    player: player,
                                                    generatedBy: cardItself.id,
                                                }
                                            ] : [{
                                                    type: const_1.ACTION_EFFECT,
                                                    effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: totalCost,
                                                    player: player,
                                                    generatedBy: cardItself.id,
                                                }
                                            ];
                                            this.transformIntoActions({
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PLAY_SPELL,
                                                card: cardItself,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: const_1.ACTION_CALCULATE,
                                                operator: const_1.CALCULATION_SET,
                                                operandOne: player,
                                                variable: 'player',
                                                generatedBy: cardItself.id,
                                            }, ...payEffects, {
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                target: cardItself,
                                                bottom: false,
                                                sourceZone: const_1.ZONE_TYPE_HAND,
                                                destinationZone: const_1.ZONE_TYPE_DISCARD,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, ...preparedEffects, {
                                                type: const_1.ACTION_EFFECT,
                                                effectType: const_1.EFFECT_TYPE_PLAY_FINISHED,
                                                generatedBy: cardItself.id,
                                            });
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
                            console.error(`Wrong Priority: current is ${currentPriority} (step ${this.getCurrentStep()}, type is ${cardType})`);
                        }
                    }
                    else {
                        console.error('No card to play');
                    }
                    break;
                }
                case const_1.ACTION_EFFECT: {
                    if (action.effectType in effects_1.actionMap) {
                        const transform = this.transformIntoActions.bind(this);
                        const actionTransformer = effects_1.actionMap[action.effectType];
                        actionTransformer.call(this, action, transform, this.state, this.nanoid);
                    }
                    break;
                }
            } // switch (action.type)
        } // while(this.hasActions())
        // SBA for Magi losing
        if (!this.state.prompt) {
            const sbActions = [];
            this.players.forEach(player => {
                if (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).length === 1) {
                    const magi = this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).card;
                    if (!magi) {
                        throw new Error('Trying to defeat missing Magi');
                    }
                    const creatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, player);
                    if (magi.data.energy === 0 && creatures instanceof Array && creatures.length === 0) {
                        sbActions.push({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                            source: null,
                            target: magi,
                            generatedBy: 'thegame', //nanoid(),
                            player,
                        });
                    }
                }
            });
            if (sbActions.length > 0) {
                this.addActions(...sbActions);
                this.update({
                    type: const_1.ACTION_NONE,
                });
            }
        }
        return true;
    }
}
exports.State = State;
//# sourceMappingURL=index.js.map