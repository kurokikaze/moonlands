import { Writable } from 'stream';
import EventEmitter from 'events';
import nanoid from 'nanoid';
import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, ACTION_CONCEDE, ACTION_TIME_NOTIFICATION, ACTION_EXIT_PROMPTS, ACTION_PROPERTY, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS_WAS_ATTACKED, PROPERTY_STATUS_DEFEATED_CREATURE, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, SELECTOR_CREATURES, SELECTOR_MAGI, SELECTOR_CREATURES_AND_MAGI, SELECTOR_RELICS, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_SPELLS_IN_HAND, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_CREATURES_OF_TYPE, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_OTHER_CREATURES_OF_TYPE, SELECTOR_STATUS, SELECTOR_OWN_CREATURES_WITH_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_ID, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY, STATUS_BURROWED, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_RELIC, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_PLAYER, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_DRAW, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DEFEAT_MAGI, EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_ATTACK, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, REGION_UNIVERSAL, RESTRICTION_TYPE, RESTRICTION_REGION, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_CREATURE_TYPE, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_PLAYABLE, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_STATUS, RESTRICTION_REGION_IS_NOT, RESTRICTION_ENERGY_EQUALS, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, LOG_ENTRY_PLAY, LOG_ENTRY_DRAW, LOG_ENTRY_CHOOSES_STARTING_CARDS, LOG_ENTRY_POWER_ACTIVATION, LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY, LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY, LOG_ENTRY_TARGETING, LOG_ENTRY_NUMBER_CHOICE, LOG_ENTRY_ATTACK, LOG_ENTRY_CREATURE_ENERGY_LOSS, LOG_ENTRY_MAGI_ENERGY_LOSS, LOG_ENTRY_CREATURE_ENERGY_GAIN, LOG_ENTRY_MAGI_ENERGY_GAIN, LOG_ENTRY_MAGI_DEFEATED, ACTION_NONE, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER, EXPIRATION_OPPONENT_TURNS, PROTECTION_FROM_POWERS, PROTECTION_FROM_SPELLS, PROTECTION_TYPE_DISCARDING_FROM_PLAY, PROTECTION_TYPE_GENERAL, CARD_COUNT, EFFECT_TYPE_DRAW_N_CARDS, EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROPERTY_PROTECTION, PROTECTION_FROM_ATTACKS, CALCULATION_MULTIPLY, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, } from './const';
import { showAction } from './logAction';
import clone from './clone';
import { byName } from './cards';
import CardInGame from './classes/CardInGame';
import Zone from './classes/Zone';
const convertCard = (cardInGame) => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
});
const steps = [
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
        case EXPIRATION_ANY_TURNS: {
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
        case EXPIRATION_OPPONENT_TURNS: {
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
        case EXPIRATION_NEVER: {
            return effect;
        }
    }
};
export class State {
    constructor(state) {
        this.state = {
            ...clone(defaultState),
            spellMetaData: {},
            ...state,
        };
        this.players = [0, 1]; // For simple testing
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
        this.actionStreamOne = new EventEmitter();
        this.actionStreamTwo = new EventEmitter();
        this.logStream = new EventEmitter();
        this.commandStream = new Writable({
            objectMode: true,
            write: (command) => {
                if (Object.prototype.hasOwnProperty.call(command, 'type')) {
                    this.update(command);
                }
            },
        });
    }
    closeStreams() {
        this.actionStreamOne.removeAllListeners();
        this.actionStreamTwo.removeAllListeners();
        this.logStream.removeAllListeners();
        this.commandStream.destroy();
    }
    addActionToStream(action) {
        const actionWithValues = this.addValuesToAction(action);
        // Do not send outside CALCULATE, SELECT and so on
        if (![ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE].includes(action.type)) {
            this.actionStreamOne.emit('action', actionWithValues);
            this.actionStreamTwo.emit('action', actionWithValues);
        }
        this.logStream.emit('action', actionWithValues);
    }
    addValuesToAction(action) {
        switch (action.type) {
            case ACTION_ENTER_PROMPT: {
                switch (action.promptType) {
                    case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                        if ('restrictions' in action) {
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
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return {
                            ...action,
                            staticAbilities: action.staticAbilities.map(ability => ({
                                ...ability,
                                modifier: {
                                    operandOne: this.getMetaValue(ability.modifier.operandOne, action.generatedBy),
                                    operator: ability.modifier.operator,
                                },
                                selectorParameter: ability.selectorParameter ? this.getMetaValue(ability.selectorParameter, action.generatedBy)?.id : null,
                            })),
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
    setPlayers(player1, player2) {
        this.players = [player1, player2];
        return this;
    }
    setDeck(player, cardNames) {
        if (this.players.includes(player)) {
            const deck = cardNames.map(card => new CardInGame(byName(card), player));
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
        if (this.turnTimer > 0) {
            this.turnTimeout = setTimeout(() => {
                this.endTurn();
            }, this.turnTimer * 1000);
            if (this.turnTimer > 20) {
                this.turnNotifyTimeout = setTimeout(() => {
                    this.update({ type: ACTION_TIME_NOTIFICATION, player: this.state.activePlayer });
                }, 20000);
            }
        }
    }
    stopTurnTimer() {
        clearTimeout(this.turnTimeout);
        clearTimeout(this.turnNotifyTimeout);
    }
    endTurn() {
        const { activePlayer } = this.state;
        this.update({ type: ACTION_EXIT_PROMPTS });
        while (this.state.activePlayer === activePlayer) {
            this.update({ type: ACTION_PASS, player: activePlayer });
        }
    }
    addActionToLog(action) {
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
                        const metaValue = this.getMetaValue(action.card, action.generatedBy);
                        const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;
                        newLogEntry = {
                            type: LOG_ENTRY_PLAY,
                            card: metaCard.card.name,
                            player: action.player,
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
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
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: LOG_ENTRY_MAGI_ENERGY_LOSS,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
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
                        case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            if (Array.isArray(target)) {
                                newLogEntry = {
                                    type: LOG_ENTRY_MAGI_ENERGY_GAIN,
                                    card: target[0].card.name,
                                    amount: this.getMetaValue(action.amount, action.generatedBy),
                                };
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
                                player: action.player,
                            };
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            newLogEntry = {
                                type: LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
                                card: this.getMetaValue(action.target, action.generatedBy)?.card.name || 'Unknown creature',
                                player: action.player,
                            };
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            newLogEntry = {
                                type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
                                card: this.getMetaValue(action.target, action.generatedBy).card.name,
                                player: action.player,
                            };
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
                            };
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
                            card: action.target.card.name,
                            player: action.player,
                        };
                    }
                    if (this.state.promptType === PROMPT_TYPE_NUMBER && 'number' in action) {
                        newLogEntry = {
                            type: LOG_ENTRY_NUMBER_CHOICE,
                            number: (typeof action.number === 'number') ? action.number : parseInt(action.number, 10),
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
            new Zone('Player 1 hand', ZONE_TYPE_HAND, playerOne),
            new Zone('Player 2 hand', ZONE_TYPE_HAND, playerTwo),
            new Zone('Player 1 deck', ZONE_TYPE_DECK, playerOne),
            new Zone('Player 2 deck', ZONE_TYPE_DECK, playerTwo),
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
    }
    serializeData(playerId) {
        const gameEnded = !(this.winner === false);
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
            gameEnded,
            winner: gameEnded ? this.winner : null,
        };
    }
    serializeZones(playerId) {
        const opponentId = this.getOpponent(playerId);
        return {
            playerHand: this.getZone(ZONE_TYPE_HAND, playerId).serialize(),
            opponentHand: this.getZone(ZONE_TYPE_HAND, opponentId).serialize(true),
            playerDeck: this.getZone(ZONE_TYPE_DECK, playerId).serialize(true),
            opponentDeck: this.getZone(ZONE_TYPE_DECK, opponentId).serialize(true),
            playerActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
            opponentActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
            playerMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, playerId).serialize(true),
            opponentMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, opponentId).serialize(),
            inPlay: this.getZone(ZONE_TYPE_IN_PLAY).cards.map(c => c.serialize()),
            playerDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, playerId).serialize(),
            opponentDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, opponentId).serialize(),
            playerDiscard: this.getZone(ZONE_TYPE_DISCARD, playerId).serialize(),
            opponentDiscard: this.getZone(ZONE_TYPE_DISCARD, opponentId).serialize(),
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
            const magi = deck.filter(card => card.card.type === TYPE_MAGI);
            const rest = deck.filter(card => card.card.type != TYPE_MAGI);
            this.getZone(ZONE_TYPE_MAGI_PILE, player).add(magi);
            this.getZone(ZONE_TYPE_DECK, player).add(rest).shuffle();
        });
        const goesFirst = this.players[(Math.random() > 0.5 ? 0 : 1)];
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
        return this.players.find(pl => pl != player);
    }
    getZone(type, player = null) {
        return this.state.zones.find(zone => zone.type === type && (zone.player == player || player == null)) || new Zone('Empty zone', ZONE_TYPE_DECK);
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
            case SELECTOR_OWN_CARDS_IN_PLAY: {
                return this.getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player);
            }
            case SELECTOR_RELICS: {
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_RELIC);
            }
            case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...this.getZone(ZONE_TYPE_IN_PLAY).cards
                        .filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
                        .filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
                ];
            }
            case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
                    ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
                ];
            }
            case SELECTOR_OPPONENT_ID:
                return this.players.find(id => id != argument);
            case SELECTOR_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_CREATURE);
            case SELECTOR_MAGI:
                return [
                    ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards,
                    ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards,
                ].filter(Boolean);
            case SELECTOR_TOP_MAGI_OF_PILE: {
                const topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case SELECTOR_OWN_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
            // case SELECTOR_OWN_MAGI_SINGLE:
            // 	return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            case SELECTOR_OWN_SPELLS_IN_HAND:
                return this.getZone(ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == TYPE_SPELL);
            case SELECTOR_ENEMY_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player)).cards;
            case SELECTOR_OWN_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && card.card.type == TYPE_CREATURE);
            case SELECTOR_ENEMY_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) != player && card.card.type == TYPE_CREATURE);
            case SELECTOR_CREATURES_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) == argument && card.card.type == TYPE_CREATURE);
            case SELECTOR_CREATURES_NOT_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) != argument && card.card.type == TYPE_CREATURE);
            case SELECTOR_CREATURES_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
            case SELECTOR_CREATURES_NOT_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => !card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
            case SELECTOR_OWN_CREATURES_OF_TYPE:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player &&
                    card.card.type == TYPE_CREATURE &&
                    card.card.name.split(' ').includes(argument));
            case SELECTOR_STATUS:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument));
            case SELECTOR_CREATURES_WITHOUT_STATUS:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(card => card.card.type == TYPE_CREATURE)
                    .filter(card => !this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument));
        }
    }
    getByProperty(target, property, subProperty = null) {
        switch (property) {
            case PROPERTY_ID:
                return target.id;
            case PROPERTY_TYPE:
                return target.card.type;
            case PROPERTY_CREATURE_TYPES:
                return target.card.name.split(' ');
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
                return target.modifiedCard ?
                    target.modifiedCard.data.powers.find(({ name }) => name === subProperty).cost :
                    target.card.data.powers.find(({ name }) => name === subProperty).cost;
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
                return target.modifiedCard ?
                    target.modifiedCard.data.ableToAttack : true;
        }
    }
    isCardAffectedByEffect(card, effect) {
        const protection = this.modifyByStaticAbilities(card, PROPERTY_PROTECTION);
        if (!protection)
            return true;
        // Is the `from` right?
        if ((effect.spell && protection.from === PROTECTION_FROM_SPELLS) ||
            (effect.power && protection.from === PROTECTION_FROM_POWERS) ||
            (effect.attack && protection.from === PROTECTION_FROM_ATTACKS)) {
            const source = effect.source;
            if ((effect.effectType === EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && protection.type === PROTECTION_TYPE_DISCARDING_FROM_PLAY) ||
                protection.type === PROTECTION_TYPE_GENERAL) {
                if (protection.restrictions) {
                    const cardFilter = this.makeCardFilter(protection.restrictions);
                    return !cardFilter(source);
                }
                else {
                    return false;
                }
            }
            if ((effect.effectType === EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE) ||
                protection.type === PROTECTION_TYPE_GENERAL) {
                if (protection.restrictions) {
                    const cardFilter = this.makeCardFilter(protection.restrictions);
                    return !cardFilter(source);
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }
    isCardAffectedByStaticAbility(card, staticAbility) {
        switch (staticAbility.selector) {
            case SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case SELECTOR_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id);
            }
            case SELECTOR_OWN_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(staticAbility.selectorParameter.toString());
            }
            case SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === TYPE_CREATURE &&
                    this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case SELECTOR_OWN_MAGI: {
                return card.card.type === TYPE_MAGI &&
                    this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).card.id === card.id;
            }
            case SELECTOR_STATUS: {
                return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_SPELLS_IN_HAND: {
                return this.getZone(ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id);
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
        const allZonesCards = [
            ...this.getZone(ZONE_TYPE_IN_PLAY).cards,
            ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards,
            ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards,
        ];
        const continuousStaticAbilities = this.state.continuousEffects.map(effect => effect.staticAbilities.map(a => ({ ...a, player: effect.player })) || []).flat();
        const propertyLayers = {
            [PROPERTY_CONTROLLER]: 0,
            [PROPERTY_COST]: 1,
            [PROPERTY_ENERGIZE]: 2,
            [PROPERTY_STATUS]: 3,
            [PROPERTY_ATTACKS_PER_TURN]: 4,
            [PROPERTY_CAN_ATTACK_MAGI_DIRECTLY]: 5,
            [PROPERTY_ENERGY_LOSS_THRESHOLD]: 6,
            [PROPERTY_ABLE_TO_ATTACK]: 7,
            [PROPERTY_PROTECTION]: 8,
        };
        const zoneAbilities = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
            ...acc,
            ...(cardInPlay.card.data.staticAbilities.map(a => ({ ...a, player: cardInPlay.data.controller })))
        ] : acc, []);
        const staticAbilities = [...gameStaticAbilities, ...zoneAbilities, ...continuousStaticAbilities].sort((a, b) => propertyLayers[a.property] - propertyLayers[b.property]);
        let initialCardData = {
            card: target.card,
            modifiedCard: {
                ...target.card,
                data: {
                    protection: null,
                    ...target.card.data,
                    energyLossThreshold: 0,
                    ableToAttack: true,
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
                case PROPERTY_COST: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_COST);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
                case PROPERTY_ENERGIZE: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
                case PROPERTY_ATTACKS_PER_TURN: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
                case PROPERTY_ENERGY_LOSS_THRESHOLD: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
                case PROPERTY_ABLE_TO_ATTACK: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
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
                case PROPERTY_CAN_BE_ATTACKED: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
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
                case PROPERTY_CONTROLLER: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    return {
                        ...currentCard,
                        data: {
                            ...currentCard.modifiedCard.data,
                            controller: resultValue,
                        },
                    };
                }
                case PROPERTY_STATUS: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
                    switch (staticAbility.subProperty) {
                        case STATUS_BURROWED: {
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
                case PROPERTY_PROTECTION: {
                    const initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
                    const { operator, operandOne } = staticAbility.modifier;
                    const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;
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
                case PROPERTY_POWER_COST: {
                    if (currentCard.modifiedCard.data.powers) {
                        const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
                            const initialValue = this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
                            const { operator, operandOne } = staticAbility.modifier;
                            const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
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
            case RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return (card) => card.card.name.split(' ').some(type => restrictionValue.includes(type));
                }
                return (card) => card.card.name.split(' ').includes(restrictionValue);
            case RESTRICTION_TYPE:
                return (card) => card.card.type === restrictionValue;
            case RESTRICTION_PLAYABLE:
                return (card) => {
                    const magi = this.useSelector(SELECTOR_OWN_MAGI, card.owner, null)[0];
                    const cardCost = this.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case RESTRICTION_MAGI_WITHOUT_CREATURES:
                return (card) => {
                    if (card.card.type !== TYPE_MAGI)
                        return false;
                    const creatures = this.useSelector(SELECTOR_OWN_CREATURES, card.owner, null);
                    return (creatures instanceof Array && creatures.length === 0);
                };
            case RESTRICTION_REGION:
                return (card) => card.card.region === restrictionValue;
            case RESTRICTION_REGION_IS_NOT:
                return (card) => card.card.region !== restrictionValue;
            case RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return (card) => card.card.type === TYPE_CREATURE && card.data.energy < card.card.cost;
            case RESTRICTION_ENERGY_LESS_THAN:
                return (card) => card.card.type === TYPE_CREATURE && card.data.energy < restrictionValue;
            case RESTRICTION_CREATURE_WAS_ATTACKED:
                return (card) => card.card.type === TYPE_CREATURE && card.data.wasAttacked === true;
            // For own and opponents creatures we pass effect controller as restrictionValue
            case RESTRICTION_OWN_CREATURE:
                return (card) => card.data.controller === restrictionValue;
            case RESTRICTION_OPPONENT_CREATURE:
                return (card) => card.data.controller !== restrictionValue;
            case RESTRICTION_STATUS:
                return (card) => this.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue);
            case RESTRICTION_ENERGY_EQUALS:
                return (card) => card.card.type === TYPE_CREATURE && card.data.energy === restrictionValue;
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
            ...(this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
            ...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE)).cards,
            ...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO)).cards,
        ];
        const zoneReplacements = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.replacementEffects ? [
            ...acc,
            ...cardInPlay.card.data.replacementEffects
                .filter(effect => !effect.oncePerTurn || (effect.oncePerTurn && !cardInPlay.wasActionUsed(effect.name)))
                .map(effect => ({ ...effect, self: cardInPlay })),
        ] : acc, []);
        let replacementFound = false;
        let appliedReplacerId = null;
        let appliedReplacerSelf = null;
        let replaceWith = null;
        let foundReplacer;
        zoneReplacements.forEach(replacer => {
            const replacerId = replacer.self.id; // Not really, but will work for now
            if ('replacedBy' in action && action.replacedBy.includes(replacerId)) {
                return false;
            }
            if (this.matchAction(action, replacer.find, replacer.self)) {
                foundReplacer = replacer;
                replacementFound = true;
                appliedReplacerSelf = replacer.self;
                appliedReplacerId = replacerId;
                replaceWith = (replacer.replaceWith instanceof Array) ? replacer.replaceWith : [replacer.replaceWith];
            }
        });
        const previouslyReplacedBy = 'replacedBy' in action ? action.replacedBy : [];
        if (replacementFound) {
            const resultEffects = replaceWith.map((replacementEffect) => {
                let resultEffect = {
                    type: ACTION_EFFECT,
                    ...replacementEffect,
                    replacedBy: [
                        ...previouslyReplacedBy,
                        appliedReplacerId,
                    ],
                    generatedBy: action.generatedBy,
                    player: appliedReplacerSelf.data.controller,
                };
                // prepare %-values on created action
                Object.keys(replacementEffect)
                    .filter(key => !['type', 'effectType'].includes(key))
                    .forEach(key => {
                    const value = this.prepareMetaValue(replacementEffect[key], action, appliedReplacerSelf, action.generatedBy);
                    resultEffect[key] = value;
                });
                return resultEffect;
            });
            // If the replacer is one-time, set the action usage
            if (foundReplacer.oncePerTurn && 'name' in foundReplacer) {
                appliedReplacerSelf.setActionUsed(foundReplacer.name);
            }
            if (foundReplacer.mayEffect) {
                this.state.mayEffectActions = resultEffects;
                this.state.fallbackActions = [{
                        ...action,
                        replacedBy: ('replacedBy' in action) ? [...action.replacedBy, appliedReplacerId] : [appliedReplacerId],
                    }];
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
                        player: appliedReplacerSelf.data.controller,
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
        const operandOne = (condition.propertyOne && condition.propertyOne !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectOne, condition.propertyOne) : objectOne;
        const operandTwo = (condition.propertyTwo && condition.propertyTwo !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectTwo, condition.propertyTwo) : objectTwo;
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
        if (action.type !== ACTION_EFFECT) {
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
            ...(this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
            ...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE) || { cards: [] }).cards,
            ...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO) || { cards: [] }).cards,
        ];
        const cardTriggerEffects = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.triggerEffects ? [
            ...acc,
            ...cardInPlay.card.data.triggerEffects.map(effect => ({ ...effect, self: cardInPlay })),
        ] : acc, []);
        const continuousEffectTriggers = this.state.continuousEffects.map(effect => effect.triggerEffects.map(triggerEffect => ({ ...triggerEffect, id: effect.id })) || []).flat();
        const triggerEffects = [...cardTriggerEffects, ...this.state.delayedTriggers, ...continuousEffectTriggers];
        triggerEffects.forEach(replacer => {
            // @ts-ignore
            const triggeredId = replacer.self.id; // Not really, but will work for now
            if (this.matchAction(action, replacer.find, replacer.self)) {
                // Save source to *trigger source* metadata (it's probably empty)
                // For creatures set creatureSource field (just for convenience)
                this.setSpellMetaDataField('source', replacer.self, action.generatedBy || triggeredId);
                if (replacer.self.card.type === TYPE_CREATURE) {
                    this.setSpellMetaDataField('sourceCreature', replacer.self, action.generatedBy || triggeredId);
                }
                // Turn effect-templates into actual effect actions by preparing meta-values				
                const preparedEffects = replacer.effects.map(effect => {
                    // @ts-ignore
                    let resultEffect = {
                        type: effect.type || ACTION_EFFECT,
                        generatedBy: action.generatedBy || triggeredId,
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
                        .filter(key => !['type', 'effectType'].includes(key))
                        .forEach(key => {
                        const value = this.prepareMetaValue(effect[key], action, replacer.self, action.generatedBy);
                        resultEffect[key] = value;
                    });
                    return resultEffect;
                });
                const allPromptsAreDoable = this.checkPrompts(replacer.self, preparedEffects, false, 0);
                if (allPromptsAreDoable) {
                    if (replacer.mayEffect) {
                        this.state.mayEffectActions = preparedEffects;
                        this.transformIntoActions({
                            type: ACTION_ENTER_PROMPT,
                            promptType: PROMPT_TYPE_MAY_ABILITY,
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
    performCalculation(operator, operandOne, operandTwo) {
        let result;
        switch (operator) {
            case CALCULATION_SET: {
                result = operandOne;
                break;
            }
            case CALCULATION_DOUBLE: {
                result = operandOne * 2;
                break;
            }
            case CALCULATION_ADD: {
                result = operandOne + operandTwo;
                break;
            }
            case CALCULATION_SUBTRACT: {
                result = operandOne - operandTwo;
                break;
            }
            case CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
                result = Math.max(operandOne - operandTwo, 1);
                break;
            }
            case CALCULATION_HALVE_ROUND_DOWN: {
                result = Math.floor(operandOne / 2);
                break;
            }
            case CALCULATION_HALVE_ROUND_UP: {
                result = Math.ceil(operandOne / 2);
                break;
            }
            case CALCULATION_MULTIPLY: {
                result = operandOne * operandTwo;
                break;
            }
            case CALCULATION_MIN: {
                result = Math.min(operandOne, operandTwo);
                break;
            }
            case CALCULATION_MAX: {
                result = Math.max(operandOne, operandTwo);
                break;
            }
        }
        return result;
    }
    calculateTotalCost(card) {
        const activeMagiSelected = this.useSelector(SELECTOR_OWN_MAGI, card.owner, null);
        if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
            const activeMagi = activeMagiSelected[0];
            const baseCost = this.modifyByStaticAbilities(card, PROPERTY_COST);
            const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;
            return baseCost + regionPenalty;
        }
        return null;
    }
    getAvailableCards(player, topMagi) {
        const deckCards = this.getZone(ZONE_TYPE_DECK, player).cards.map(({ card }) => card.name);
        const discardCards = this.getZone(ZONE_TYPE_DISCARD, player).cards.map(({ card }) => card.name);
        const searchableCards = [...deckCards, ...discardCards];
        const availableCards = topMagi.card.data.startingCards.filter(card => searchableCards.includes(card));
        return availableCards;
    }
    checkPrompts(source, preparedActions, isPower = false, powerCost = 0) {
        const testedActions = [...preparedActions];
        // Calculate if prompts are resolvable
        // If source is Magi, it will not be filtered out, being in another zone
        const creatureWillSurvive = !isPower || source.data.energy > powerCost;
        const ourCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => (creatureWillSurvive ? true : card.id !== source.id) && card.data.controller === source.data.controller);
        const allCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => creatureWillSurvive ? true : card.id !== source.id);
        const metaValues = {
            '$source': source,
            '$sourceCreature': source,
        };
        while (testedActions.length && testedActions[0].type === ACTION_GET_PROPERTY_VALUE) {
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
            PROMPT_TYPE_SINGLE_CREATURE,
            PROMPT_TYPE_RELIC,
            PROMPT_TYPE_OWN_SINGLE_CREATURE,
            PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
            PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
            PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
        ];
        const testablePromptFilter = (action) => action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
        const allPrompts = testedActions.filter(testablePromptFilter);
        const allPromptsAreDoable = allPrompts.every(promptAction => {
            switch (promptAction.promptType) {
                case PROMPT_TYPE_SINGLE_CREATURE:
                    return allCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
                case PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    const opponent = this.getOpponent(source.data.controller);
                    const magi = [...this.getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards];
                    return magi.some(magi => !allCardsInPlay.some(card => card.data.controller === magi.data.controller && card.card.type === TYPE_CREATURE));
                case PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(card => card.card.type === TYPE_RELIC);
                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.id !== source.id);
                }
                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if (promptAction.restrictions) {
                        const restrictionsWithValues = promptAction.restrictions.map(({ type, value }) => {
                            const restrictionValue = (typeof value === 'string' &&
                                value in metaValues) ? metaValues[value] : value;
                            return {
                                type,
                                value: restrictionValue,
                            };
                        });
                        return this.checkAnyCardForRestrictions(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), restrictionsWithValues);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                const restrictionValue = (typeof promptAction.restrictionValue === 'string' &&
                                    promptAction.restrictionValue in metaValues) ? metaValues[promptAction.restrictionValue] : promptAction.restrictionValue;
                                return this.checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
                    const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
                    if (promptAction.restrictions) {
                        return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
                    const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
                    if (promptAction.restrictions) {
                        return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
                    }
                    else if (promptAction.restriction) {
                        switch (promptAction.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, source.data.controller);
                            }
                            default: {
                                return this.checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
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
            if (this.debug) {
                showAction(action);
            }
            this.addActionToLog(action);
            this.addActionToStream(action);
            this.triggerAbilities(action);
            switch (action.type) {
                case ACTION_CONCEDE: {
                    const opponentId = this.getOpponent(action.player);
                    this.transformIntoActions({
                        type: ACTION_PLAYER_WINS,
                        player: opponentId,
                    });
                    break;
                }
                case ACTION_PLAYER_WINS: {
                    this.setWinner(action.player);
                    this.state.actions = [];
                    break;
                }
                case ACTION_ATTACK: {
                    const attackSource = this.getMetaValue(action.source, action.generatedBy);
                    const attackTarget = this.getMetaValue(action.target, action.generatedBy);
                    const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy) || [];
                    const sourceAttacksPerTurn = this.modifyByStaticAbilities(attackSource, PROPERTY_ATTACKS_PER_TURN);
                    const attackerCanAttack = this.modifyByStaticAbilities(attackSource, PROPERTY_ABLE_TO_ATTACK);
                    if (!attackerCanAttack) {
                        console.log(`Somehow ${attackSource.card.name} cannot attack`);
                    }
                    const targetCanBeAttacked = this.modifyByStaticAbilities(attackTarget, PROPERTY_CAN_BE_ATTACKED);
                    if (!targetCanBeAttacked) {
                        console.log(`Somehow ${attackSource.card.name} cannot be attacked`);
                    }
                    const sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
                    const additionalAttackersCanAttack = additionalAttackers.every((card) => card.card.data.canPackHunt && this.modifyByStaticAbilities(card, PROPERTY_ABLE_TO_ATTACK));
                    const additionalAttackersHasAttacksLeft = additionalAttackers.every((card) => card.data.attacked < this.modifyByStaticAbilities(card, PROPERTY_ATTACKS_PER_TURN));
                    const targetIsMagi = attackTarget.card.type == TYPE_MAGI;
                    const opponentCreatures = this.useSelector(SELECTOR_OWN_CREATURES, attackTarget.owner, null);
                    const magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;
                    const attackApproved = attackerCanAttack &&
                        !targetIsMagi || ( // Either we attack a creature
                    targetIsMagi && ( // Or we are attacking a magi, but then...
                    !magiHasCreatures || // ...he either shouldn't have creatures
                        this.modifyByStaticAbilities(attackSource, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
                    ));
                    const enoughAttacksLeft = (sourceHasAttacksLeft && ((additionalAttackersCanAttack && additionalAttackersHasAttacksLeft) || additionalAttackers.length === 0));
                    if (enoughAttacksLeft && attackApproved && this.getCurrentPriority() == PRIORITY_ATTACK) {
                        this.transformIntoActions({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_ATTACK,
                            source: attackSource,
                            target: attackTarget,
                            additionalAttackers,
                            generatedBy: attackSource.id,
                            player: attackSource.data.controller,
                        });
                    }
                    break;
                }
                case ACTION_GET_PROPERTY_VALUE: {
                    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                    const property = this.getMetaValue(action.property, action.generatedBy);
                    if (property === CARD_COUNT) {
                        const result = (multiTarget instanceof Array) ? multiTarget.length : 0;
                        const variable = action.variable || 'result';
                        this.setSpellMetaDataField(variable, result, action.generatedBy);
                    }
                    else {
                        // Sometimes we can only pass here results of a selector.
                        // If so, work on first element of result.
                        const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
                        const modifiedResult = this.modifyByStaticAbilities(target, property);
                        const variable = action.variable || 'result';
                        this.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
                    }
                    break;
                }
                case ACTION_CALCULATE: {
                    const operandOne = this.getMetaValue(action.operandOne, action.generatedBy);
                    const operandTwo = this.getMetaValue(action.operandTwo, action.generatedBy);
                    const result = this.performCalculation(action.operator, operandOne, operandTwo);
                    const variable = action.variable || 'result';
                    this.setSpellMetaDataField(variable, result, action.generatedBy);
                    break;
                }
                case ACTION_POWER: {
                    const powerCost = this.modifyByStaticAbilities(action.source, PROPERTY_POWER_COST, action.power.name);
                    const payingCard = (action.source.card.type === TYPE_RELIC) ?
                        this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
                        action.source;
                    if (!action.source.wasActionUsed(action.power.name) &&
                        (payingCard.data.energy >= powerCost ||
                            (payingCard.data.energy > 0 && powerCost === COST_X))) {
                        const source = action.source;
                        const sourcePower = action.power;
                        const effects = action.power.effects;
                        const sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);
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
                            if (powerCost == COST_X) {
                                this.addActions({
                                    type: ACTION_ENTER_PROMPT,
                                    promptType: PROMPT_TYPE_NUMBER,
                                    player: sourceController,
                                    generatedBy: source.id,
                                    min: 1,
                                    max: action.source.data.energy,
                                }, {
                                    type: ACTION_CALCULATE,
                                    operator: CALCULATION_SET,
                                    operandOne: '$number',
                                    variable: 'chosen_cost',
                                    generatedBy: source.id,
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: payingCard,
                                    amount: '$number',
                                    generatedBy: source.id,
                                });
                            }
                            else if (powerCost > 0) {
                                this.addActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
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
                case ACTION_ENTER_PROMPT: {
                    if (!('player' in action)) {
                        throw new Error('Prompt without player!');
                    }
                    const savedActions = this.state.actions;
                    let promptParams = {};
                    const promptPlayer = this.getMetaValue(action.player, action.generatedBy);
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
                        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
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
                        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
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
                        case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                            if (action.restrictions) {
                                const restrictionsWithValues = action.restrictions.map(({ type, value }) => ({
                                    type,
                                    value: this.getMetaValue(value, action.generatedBy),
                                }));
                                promptParams = {
                                    restrictions: restrictionsWithValues,
                                };
                            }
                            else {
                                promptParams = {
                                    restriction: action.restriction,
                                    restrictionValue: this.getMetaValue(action.restrictionValue, action.generatedBy),
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
                                min: this.getMetaValue(action.min, action.generatedBy),
                                max: this.getMetaValue(action.max, action.generatedBy),
                            };
                            break;
                        }
                        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            promptParams = {
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                restriction: action.restriction,
                                restrictionValue: this.getMetaValue(action.amount, action.generatedBy),
                            };
                            break;
                        }
                        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            promptParams = {
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                restriction: action.restriction,
                                restrictionValue: this.getMetaValue(action.amount, action.generatedBy),
                            };
                            break;
                        }
                    }
                    this.state = {
                        ...this.state,
                        actions: [],
                        savedActions,
                        prompt: true,
                        promptMessage: ('message' in action) ? action.message : '',
                        promptPlayer,
                        promptType: action.promptType,
                        promptVariable: action.variable,
                        promptGeneratedBy: action.generatedBy,
                        promptParams,
                    };
                    break;
                }
                case ACTION_EXIT_PROMPTS: {
                    this.state = {
                        ...this.state,
                        actions: [],
                        savedActions: [],
                        mayEffectActions: [],
                        fallbackActions: [],
                        prompt: false,
                        promptType: null,
                        promptMessage: null,
                        promptGeneratedBy: null,
                        promptVariable: null,
                        promptParams: {},
                        spellMetaData: {
                            ...this.state.spellMetaData,
                        },
                    };
                    break;
                }
                case ACTION_RESOLVE_PROMPT: {
                    if (this.state.promptType === PROMPT_TYPE_MAY_ABILITY) {
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
                            promptMessage: null,
                            promptGeneratedBy: null,
                            promptVariable: null,
                            promptParams: {},
                            spellMetaData: {
                                ...this.state.spellMetaData,
                            },
                        };
                    }
                    else {
                        const generatedBy = action.generatedBy || this.state.promptGeneratedBy;
                        const variable = action.variable || this.state.promptVariable;
                        let currentActionMetaData = this.state.spellMetaData[generatedBy] || {};
                        switch (this.state.promptType) {
                            case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                                if ('cards' in action) {
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
                                }
                                break;
                            }
                            case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                                if ('cards' in action) {
                                    if (this.state.promptParams.numberOfCards < action.cards.length) {
                                        return false;
                                    }
                                    if (this.state.promptParams.restrictions) {
                                        const checkResult = this.state.promptParams.restrictions.every(({ type, value }) => this.checkCardsForRestriction(action.cards, type, value));
                                        if (!checkResult) {
                                            return false;
                                        }
                                    }
                                    currentActionMetaData[variable || 'targetCards'] = action.cards;
                                }
                                break;
                            }
                            case PROMPT_TYPE_NUMBER:
                                if ('number' in action) {
                                    currentActionMetaData[variable || 'number'] = (typeof action.number === 'number') ? action.number : parseInt(action.number, 10);
                                }
                                break;
                            case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
                                if ('target' in action) {
                                    if (this.state.promptParams.source.id === action.target.id) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_RELIC: {
                                if ('target' in action) {
                                    if (action.target.card.type !== TYPE_RELIC) {
                                        throw new Error('Got forbidden target on prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
                                if ('target' in action) {
                                    if (this.state.promptPlayer !== action.target.data.controller) {
                                        throw new Error('Not-controlled creature supplied to Own Creatures prompt');
                                    }
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                if ('target' in action) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            }
                            case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
                                if ('target' in action && action.target.card.type === TYPE_MAGI && this.useSelector(SELECTOR_CREATURES_OF_PLAYER, action.target.data.controller)) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                    break;
                                }
                            }
                            case PROMPT_TYPE_SINGLE_CREATURE:
                                if ('target' in action) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                                if ('target' in action) {
                                    currentActionMetaData[variable || 'target'] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_SINGLE_MAGI:
                                if ('target' in action) {
                                    currentActionMetaData[variable || 'targetMagi'] = action.target;
                                }
                                break;
                            case PROMPT_TYPE_CHOOSE_CARDS:
                                if ('cards' in action) {
                                    currentActionMetaData[variable || 'selectedCards'] = action.cards || [];
                                }
                                break;
                            case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
                                if ('energyOnCreatures' in action) {
                                    currentActionMetaData[variable || 'energyOnCreatures'] = action.energyOnCreatures || [];
                                }
                                break;
                            case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                                if ('energyOnCreatures' in action) {
                                    const totalEnergy = Object.values(action.energyOnCreatures).reduce((a, b) => a + b, 0);
                                    if (totalEnergy === this.state.promptParams.amount) {
                                        currentActionMetaData[variable || 'energyOnCreatures'] = action.energyOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                                if ('damageOnCreatures' in action) {
                                    const totalDamage = Object.values(action.damageOnCreatures).reduce((a, b) => a + b, 0);
                                    if (totalDamage === this.state.promptParams.amount) {
                                        currentActionMetaData[variable || 'damageOnCreatures'] = action.damageOnCreatures || [];
                                    }
                                }
                                break;
                            }
                            case PROMPT_TYPE_PLAYER: {
                                if ('targetPlayer' in action) {
                                    if (this.players.includes(action.targetPlayer)) {
                                        currentActionMetaData[variable || 'targetPlayer'] = action.targetPlayer;
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
                        }
                        const actions = this.state.savedActions || [];
                        this.state = {
                            ...this.state,
                            actions,
                            savedActions: [],
                            prompt: false,
                            promptType: null,
                            promptMessage: null,
                            promptGeneratedBy: null,
                            promptVariable: null,
                            promptParams: {},
                            spellMetaData: {
                                ...this.state.spellMetaData,
                                [generatedBy]: currentActionMetaData,
                            },
                        };
                    }
                    break;
                }
                case ACTION_SELECT: {
                    let result;
                    switch (action.selector) {
                        case SELECTOR_OWN_CARDS_IN_PLAY: {
                            result = this.useSelector(SELECTOR_OWN_CARDS_IN_PLAY, action.player, null);
                            break;
                        }
                        case SELECTOR_OWN_CREATURES_OF_TYPE: {
                            result = this.useSelector(SELECTOR_OWN_CREATURES_OF_TYPE, action.player, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CREATURES_OF_TYPE: {
                            result = this.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CREATURES_NOT_OF_TYPE: {
                            result = this.useSelector(SELECTOR_CREATURES_NOT_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            break;
                        }
                        case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                            result = this.useSelector(SELECTOR_CARDS_WITH_ENERGIZE_RATE, action.player, null);
                            break;
                        }
                        case SELECTOR_OPPONENT_ID: {
                            result = this.useSelector(SELECTOR_OPPONENT_ID, action.player, this.getMetaValue(action.opponentOf || action.player, action.generatedBy));
                            break;
                        }
                        case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                            result = this.useSelector(SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player, null);
                            break;
                        }
                        case SELECTOR_CREATURES_AND_MAGI: {
                            const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player, null);
                            const creatures = this.useSelector(SELECTOR_CREATURES, null, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                                ...(creatures instanceof Array ? creatures : []),
                            ];
                            break;
                        }
                        case SELECTOR_CREATURES_OF_REGION: {
                            result = this.useSelector(SELECTOR_CREATURES_OF_REGION, action.player, action.region);
                            break;
                        }
                        case SELECTOR_CREATURES_NOT_OF_REGION: {
                            result = this.useSelector(SELECTOR_CREATURES_NOT_OF_REGION, action.player, action.region);
                            break;
                        }
                        case SELECTOR_OTHER_CREATURES_OF_TYPE: {
                            const creatures = this.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
                            result = (creatures instanceof Array) ? creatures.filter((card) => card.id !== action.generatedBy) : [];
                            break;
                        }
                        case SELECTOR_MAGI_OF_REGION: {
                            const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, PROPERTY_REGION) === action.region);
                            break;
                        }
                        case SELECTOR_MAGI_NOT_OF_REGION: {
                            const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player, null);
                            const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player, null);
                            result = [
                                ...(ownMagi instanceof Array ? ownMagi : []),
                                ...(enemyMagi instanceof Array ? enemyMagi : []),
                            ].filter(magi => this.modifyByStaticAbilities(magi, PROPERTY_REGION) != action.region);
                            break;
                        }
                        case SELECTOR_STATUS: {
                            result = this.useSelector(action.selector, action.player, action.status);
                            break;
                        }
                        case SELECTOR_CREATURES_WITHOUT_STATUS: {
                            result = this.useSelector(action.selector, action.player, action.status);
                            break;
                        }
                        // This selector is special
                        // If there are more than one creature with the same (least) energy, it transforms into the corresponding prompt
                        case SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY: {
                            const creatures = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == action.player &&
                                card.card.type == TYPE_CREATURE);
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
                                        type: ACTION_ENTER_PROMPT,
                                        promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        restrictions: [{
                                                type: RESTRICTION_OWN_CREATURE,
                                                value: '',
                                            }, {
                                                type: RESTRICTION_ENERGY_EQUALS,
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
                            result = this.useSelector(action.selector, action.player, null);
                        }
                    }
                    const variable = action.variable || 'selected';
                    this.setSpellMetaDataField(variable, result, action.generatedBy);
                    break;
                }
                case ACTION_PASS: {
                    var newStep;
                    if (this.state.step === null) {
                        // Null-start
                        this.transformIntoActions({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_START_TURN,
                            player: this.state.activePlayer,
                            generatedBy: nanoid(),
                        });
                    }
                    else {
                        if (action.player === this.state.activePlayer) {
                            newStep = (this.state.step + 1) % steps.length;
                            if (newStep === 0) {
                                this.stopTurnTimer();
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_END_OF_TURN,
                                    player: this.state.activePlayer,
                                    generatedBy: nanoid(),
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_START_TURN,
                                    player: this.getOpponent(this.state.activePlayer),
                                    generatedBy: nanoid(),
                                });
                            }
                            else {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_START_STEP,
                                    player: this.state.activePlayer,
                                    step: newStep,
                                    generatedBy: nanoid(),
                                });
                            }
                        }
                    }
                    break;
                }
                case ACTION_PLAY: {
                    const castCards = ('card' in action) ? this.getMetaValue(action.card, action.generatedBy) : null;
                    const castCard = castCards ? (castCards.length ? castCards[0] : castCards) : null;
                    const player = ('payload' in action) ? action.payload.player : action.player;
                    const cardItself = ('payload' in action) ? action.payload.card : castCard;
                    const playerHand = this.getZone(ZONE_TYPE_HAND, player);
                    const cardInHand = playerHand.containsId(cardItself.id);
                    if (cardInHand) {
                        // baseCard is "abstract" card, CardInPlay is concrete instance
                        const baseCard = ('payload' in action) ? action.payload.card.card : castCard.card;
                        const currentPriority = this.getCurrentPriority();
                        const cardType = baseCard.type;
                        if ((cardType == TYPE_CREATURE && currentPriority == PRIORITY_CREATURES) ||
                            (cardType == TYPE_RELIC && currentPriority == PRIORITY_PRS) ||
                            (cardType == TYPE_SPELL && currentPriority == PRIORITY_PRS) ||
                            action.forcePriority) {
                            const activeMagi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
                            const totalCost = this.calculateTotalCost(cardItself);
                            switch (cardType) {
                                case TYPE_CREATURE: {
                                    if (activeMagi.data.energy >= totalCost) {
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PLAY_CREATURE,
                                            card: cardItself,
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                                            target: '$creature_created',
                                            player: player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                                            target: '$creature_created',
                                            player: player,
                                            amount: (baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE) ? 0 : baseCard.cost,
                                            generatedBy: cardItself.id,
                                        });
                                    }
                                    break;
                                }
                                case TYPE_RELIC: {
                                    const alreadyHasOne = this.getZone(ZONE_TYPE_IN_PLAY).cards
                                        .some(card => card.data.controller === player && card.card.name === baseCard.name);
                                    const relicRegion = baseCard.region;
                                    const magiRegion = activeMagi.card.region;
                                    const regionAllows = relicRegion === magiRegion || relicRegion === REGION_UNIVERSAL;
                                    if (!alreadyHasOne && regionAllows && activeMagi.data.energy >= baseCard.cost) {
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
                                            from: activeMagi,
                                            amount: totalCost,
                                            player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_PLAY_RELIC,
                                            card: cardItself,
                                            player,
                                            generatedBy: cardItself.id,
                                        }, {
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_RELIC_ENTERS_PLAY,
                                            card: '$relic_created',
                                            player,
                                            generatedBy: cardItself.id,
                                        });
                                    }
                                    break;
                                }
                                case TYPE_SPELL: {
                                    if (activeMagi.data.energy >= totalCost || baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE) {
                                        const enrichAction = (effect) => ({
                                            source: cardItself,
                                            player,
                                            ...effect,
                                            spell: true,
                                            generatedBy: cardItself.id,
                                        });
                                        const preparedEffects = baseCard.data.effects
                                            .map(enrichAction);
                                        const testablePrompts = [
                                            PROMPT_TYPE_SINGLE_CREATURE,
                                            PROMPT_TYPE_RELIC,
                                            PROMPT_TYPE_OWN_SINGLE_CREATURE,
                                            PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                                        ];
                                        const testablePromptFilter = (action) => action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
                                        const allPrompts = preparedEffects.filter(testablePromptFilter);
                                        const allPromptsAreDoable = allPrompts.every(promptAction => {
                                            switch (promptAction.promptType) {
                                                case PROMPT_TYPE_SINGLE_CREATURE:
                                                    return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === TYPE_CREATURE);
                                                case PROMPT_TYPE_RELIC:
                                                    return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === TYPE_RELIC);
                                                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                                                    return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.data.controller === promptAction.player);
                                                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                                                    if (promptAction.restrictions) {
                                                        return promptAction.restrictions.every(({ type, value }) => this.checkAnyCardForRestriction(this.getZone(ZONE_TYPE_IN_PLAY).cards, type, value));
                                                    }
                                                    else if (promptAction.restriction) {
                                                        return this.checkAnyCardForRestriction(this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type === TYPE_CREATURE), promptAction.restriction, promptAction.restrictionValue);
                                                    }
                                                    return true;
                                                }
                                                default:
                                                    return true;
                                            }
                                        });
                                        if (allPromptsAreDoable) {
                                            const regionPenalty = (activeMagi.card.region == baseCard.region || baseCard.region == REGION_UNIVERSAL) ? 0 : 1;
                                            const maxCost = baseCard.data.maxCostX || Infinity;
                                            const payEffects = (baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE) ? [
                                                {
                                                    type: ACTION_ENTER_PROMPT,
                                                    promptType: PROMPT_TYPE_NUMBER,
                                                    player,
                                                    min: 1,
                                                    max: Math.min(activeMagi.data.energy, maxCost) - regionPenalty - (baseCard.cost === COST_X_PLUS_ONE ? 1 : 0),
                                                    variable: 'chosen_cost',
                                                    generatedBy: cardItself.id,
                                                },
                                                {
                                                    type: ACTION_CALCULATE,
                                                    operandOne: 'chosen_cost',
                                                    operandTwo: regionPenalty + (baseCard.cost === COST_X_PLUS_ONE ? 1 : 0),
                                                    operator: CALCULATION_ADD,
                                                    variable: 'totalCost',
                                                    generatedBy: cardItself.id,
                                                },
                                                {
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: '$totalCost',
                                                    player: player,
                                                    generatedBy: cardItself.id,
                                                }
                                            ] : [{
                                                    type: ACTION_EFFECT,
                                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                                                    from: activeMagi,
                                                    amount: totalCost,
                                                    player: player,
                                                    generatedBy: cardItself.id,
                                                }
                                            ];
                                            this.transformIntoActions({
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_PLAY_SPELL,
                                                card: cardItself,
                                                player: player,
                                                generatedBy: cardItself.id,
                                            }, {
                                                type: ACTION_CALCULATE,
                                                operator: CALCULATION_SET,
                                                operandOne: player,
                                                variable: 'player',
                                                generatedBy: cardItself.id,
                                            }, ...payEffects, {
                                                type: ACTION_EFFECT,
                                                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                                target: cardItself,
                                                bottom: false,
                                                sourceZone: ZONE_TYPE_HAND,
                                                destinationZone: ZONE_TYPE_DISCARD,
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
                            console.error(`Wrong Priority: current is ${currentPriority} (step ${this.getCurrentStep()}, type is ${cardType})`);
                        }
                    }
                    else {
                        console.error('No card to play');
                    }
                    break;
                }
                case ACTION_EFFECT: {
                    switch (action.effectType) {
                        case EFFECT_TYPE_START_TURN: {
                            if (this.turn === null) {
                                this.turn = 0;
                            }
                            else {
                                this.turn += 1;
                            }
                            this.transformIntoActions({
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
                            this.state = {
                                ...this.state,
                                continuousEffects: this.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean),
                                activePlayer: action.player,
                                step: 0,
                            };
                            break;
                        }
                        case EFFECT_TYPE_START_STEP: {
                            // Player who goes first do not energize on first turn
                            const isFirstEnergize = this.turn === 0 &&
                                action.player === this.state.goesFirst &&
                                action.step === 0;
                            if (steps[action.step].effects && !isFirstEnergize) {
                                const transformedActions = steps[action.step].effects.map(effect => ({
                                    ...effect,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                }));
                                this.addActions(...transformedActions);
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
                            this.state = {
                                ...this.state,
                                step: action.step,
                            };
                            break;
                        }
                        case EFFECT_TYPE_CONDITIONAL: {
                            const metaData = this.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            const self = metaData.source || metaData.new_card || action.triggerSource;
                            // checkCondition(action, self, condition)
                            const results = action.conditions.map(condition => this.checkCondition(action, self, condition));
                            const enrichAction = (effect) => ({
                                source: self,
                                player: self.data.controller,
                                ...effect,
                                generatedBy: action.generatedBy,
                            });
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
                        case EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP: {
                            const numberOfCards = action.numberOfCards;
                            const draws = (new Array(numberOfCards)).fill({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_DRAW,
                                stepEffect: true,
                                player: action.player,
                                generatedBy: action.generatedBy,
                            });
                            this.transformIntoActions(...draws);
                            break;
                        }
                        case EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                            const metaData = this.getSpellMetadata(action.generatedBy);
                            // "new_card" fallback is for "defeated" triggers
                            if ('source' in metaData || 'new_card' in metaData) {
                                const self = metaData.source || metaData.new_card;
                                this.state = {
                                    ...this.state,
                                    delayedTriggers: [
                                        ...this.state.delayedTriggers,
                                        {
                                            id: nanoid(),
                                            self,
                                            ...action.delayedTrigger,
                                        }
                                    ],
                                };
                            }
                            break;
                        }
                        case EFFECT_TYPE_START_OF_TURN: {
                            if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
                                this.getZone(ZONE_TYPE_MAGI_PILE, action.player).length > 0) {
                                const topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards[0];
                                const availableCards = this.getAvailableCards(action.player, topMagi);
                                const firstMagi = this.getZone(ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;
                                const actionsToTake = [
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
                                            cards: topMagi.card.data.startingCards,
                                            availableCards,
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
                                const actions = actionsToTake.map(preAction => ({
                                    ...preAction,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                }));
                                this.transformIntoActions(...actions);
                            }
                            // Reset creatures' actions and attacks
                            const creatures = this.getZone(ZONE_TYPE_IN_PLAY).cards
                                .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === action.player);
                            if (creatures.length > 0) {
                                creatures.forEach(creature => {
                                    creature.clearAttackMarkers();
                                    creature.clearActionsUsed();
                                });
                            }
                            // Reset relics' actions
                            const relics = this.getZone(ZONE_TYPE_IN_PLAY).cards
                                .filter(card => card.card.type === TYPE_RELIC && card.data.controller === action.player);
                            if (relics.length > 0) {
                                relics.forEach(relic => relic.clearActionsUsed());
                            }
                            // if magi is active, reset its actions used too
                            if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
                                this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).card.clearActionsUsed();
                            }
                            break;
                        }
                        case EFFECT_TYPE_FIND_STARTING_CARDS: {
                            const cardsToFind = this.getMetaValue(action.cards, action.generatedBy);
                            let foundCards = [];
                            if (cardsToFind.length) {
                                const deck = this.getZone(ZONE_TYPE_DECK, action.player);
                                const discard = this.getZone(ZONE_TYPE_DISCARD, action.player);
                                const hand = this.getZone(ZONE_TYPE_HAND, action.player);
                                cardsToFind.forEach(cardName => {
                                    if (discard.cards.some(({ card }) => card.name == cardName)) {
                                        const card = discard.cards.find(({ card }) => card.name == cardName);
                                        const newCard = new CardInGame(card.card, action.player);
                                        hand.add([newCard]);
                                        discard.removeById(card.id);
                                        foundCards.push(cardName);
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                            sourceCard: card,
                                            sourceZone: ZONE_TYPE_DISCARD,
                                            destinationCard: newCard,
                                            destinationZone: ZONE_TYPE_HAND,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                    else if (deck.cards.some(({ card }) => card.name == cardName)) {
                                        const card = deck.cards.find(({ card }) => card.name == cardName);
                                        const newCard = new CardInGame(card.card, action.player);
                                        hand.add([newCard]);
                                        deck.removeById(card.id);
                                        foundCards.push(cardName);
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                            sourceCard: card,
                                            sourceZone: ZONE_TYPE_DECK,
                                            destinationCard: newCard,
                                            destinationZone: ZONE_TYPE_HAND,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                });
                            }
                            this.setSpellMetaDataField('foundCards', foundCards, action.generatedBy);
                            break;
                        }
                        case EFFECT_TYPE_DRAW_REST_OF_CARDS: {
                            const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
                            const number = 5 - foundCards.length;
                            if (number > 0) { // who knows
                                for (let i = 0; i < number; i++) {
                                    this.transformIntoActions({
                                        type: ACTION_EFFECT,
                                        effectType: EFFECT_TYPE_DRAW,
                                        player: action.player,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            }
                            break;
                        }
                        case EFFECT_TYPE_MAGI_FLIPPED: {
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: ZONE_TYPE_MAGI_PILE,
                                destinationZone: ZONE_TYPE_ACTIVE_MAGI,
                                bottom: false,
                                target: action.target,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        /* End of starting actions */
                        case EFFECT_TYPE_DISCARD_CARDS_FROM_HAND: {
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, target => target && this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                sourceZone: ZONE_TYPE_HAND,
                                destinationZone: ZONE_TYPE_DISCARD,
                                bottom: false,
                                target,
                                generatedBy: action.generatedBy,
                            }));
                            break;
                        }
                        case EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY: {
                            const card = this.getMetaValue(action.target, action.generatedBy);
                            if (this.isCardAffectedByEffect(card, action)) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    sourceZone: ZONE_TYPE_IN_PLAY,
                                    destinationZone: ZONE_TYPE_HAND,
                                    bottom: false,
                                    target: card,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY: {
                            const card = this.getMetaValue(action.target, action.generatedBy);
                            if (this.isCardAffectedByEffect(card, action)) {
                                const ownersMagi = this.useSelector(SELECTOR_OWN_MAGI, card.owner, null)[0];
                                this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_DRAW_N_CARDS: {
                            const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
                            for (let i = 0; i < numberOfCards; i++) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_DRAW,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_DRAW: {
                            const player = this.getMetaValue(action.player, action.generatedBy);
                            const deck = this.getZone(ZONE_TYPE_DECK, player);
                            const discard = this.getZone(ZONE_TYPE_DISCARD, player);
                            if (deck.length > 0) {
                                const card = deck.cards[0];
                                this.transformIntoActions({
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
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_RESHUFFLE_DISCARD,
                                    player: player,
                                }, action);
                            }
                            break;
                        }
                        case EFFECT_TYPE_RESHUFFLE_DISCARD: {
                            const player = this.getMetaValue(action.player, action.generatedBy);
                            const deck = this.getZone(ZONE_TYPE_DECK, player);
                            const discard = this.getZone(ZONE_TYPE_DISCARD, player);
                            const newCards = discard.cards.map(card => new CardInGame(card.card, card.owner));
                            deck.add(newCards);
                            deck.shuffle();
                            discard.empty();
                            break;
                        }
                        case EFFECT_TYPE_ATTACK: {
                            const source = this.getMetaValue(action.source, action.generatedBy);
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);
                            let attackSequence = [
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
                                const preparedEffects = additionalAttackers.map((card) => [
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
                                ]).flat();
                                attackSequence = [...attackSequence, ...preparedEffects];
                            }
                            this.transformIntoActions(...attackSequence);
                            break;
                        }
                        // Attack sequence
                        case EFFECT_TYPE_BEFORE_DAMAGE: {
                            action.source.markAttackDone();
                            action.target.markAttackReceived();
                            break;
                        }
                        case EFFECT_TYPE_DAMAGE_STEP: {
                            // Here we finalize damage amount from both creatures' energy
                            const attackSource = action.source;
                            const attackTarget = action.target;
                            const damageByAttacker = attackSource.data.energy;
                            const damageByDefender = (attackTarget.card.type === TYPE_CREATURE) ?
                                attackTarget.data.energy :
                                0;
                            const attackerDamageAction = {
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
                            };
                            const damageActions = (attackTarget.card.type === TYPE_CREATURE && !action.packHuntAttack) ? [
                                attackerDamageAction, {
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
                                }
                            ] : [attackerDamageAction];
                            this.transformIntoActions(...damageActions);
                            break;
                        }
                        case EFFECT_TYPE_ATTACKER_DEALS_DAMAGE: {
                            this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_DEFENDER_DEALS_DAMAGE: {
                            this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_DEAL_DAMAGE: {
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                                target: action.target,
                                amount: action.amount,
                                attack: true,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case EFFECT_TYPE_AFTER_DAMAGE: {
                            if (action.source.data.energy === 0) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: action.source,
                                    sourceZone: ZONE_TYPE_IN_PLAY,
                                    destinationZone: ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            if (action.target.data.energy === 0 && action.target.card.type === TYPE_CREATURE) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                                    source: action.source,
                                    target: action.target,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
                                    target: action.target,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                            if (action.target.data.energy === 0) {
                                action.source.markDefeatedCreature();
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: action.target,
                                    bottom: false,
                                    sourceZone: ZONE_TYPE_IN_PLAY,
                                    destinationZone: ZONE_TYPE_DISCARD,
                                    attack: true,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_ROLL_DIE: {
                            const result = action.result ||
                                (this.rollDebugValue === null ? (Math.floor(Math.random() * 6) + 1) : this.rollDebugValue);
                            this.setSpellMetaDataField('roll_result', result, action.generatedBy);
                            break;
                        }
                        case EFFECT_TYPE_ENERGIZE: {
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, (target) => {
                                const amount = this.modifyByStaticAbilities(target, PROPERTY_ENERGIZE);
                                const type = target.card.type;
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: (type == TYPE_CREATURE) ? EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target,
                                    source: null,
                                    amount,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE: {
                            action.from.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        }
                        case EFFECT_TYPE_PLAY_RELIC: {
                            this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_PLAY_CREATURE: {
                            this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                            const targets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(targets, target => target.forbidAttacks());
                            break;
                        }
                        case EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            const zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy);
                            // We assume all cards changing zones are in one zone intially
                            const zoneOwner = zoneChangingTargets[0].owner;
                            const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
                            const destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                            const newCards = [];
                            oneOrSeveral(zoneChangingTargets, zoneChangingCard => {
                                const newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner);
                                if (action.bottom) {
                                    destinationZone.add([newObject]);
                                }
                                else {
                                    destinationZone.addToTop([newObject]);
                                }
                                sourceZone.removeById(zoneChangingCard.id);
                                newCards.push(newObject);
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
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
                        case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                            if (!action.sourceZone || !action.destinationZone) {
                                console.log('Source zone or destination zone invalid');
                                throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                            }
                            const zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                            const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
                            const destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner);
                            if (action.bottom) {
                                destinationZone.add([newObject]);
                            }
                            else {
                                destinationZone.addToTop([newObject]);
                            }
                            sourceZone.removeById(zoneChangingCard.id);
                            this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                                sourceCard: zoneChangingCard,
                                sourceZone: sourceZoneType,
                                destinationCard: newObject,
                                destinationZone: destinationZoneType,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES: {
                            break;
                        }
                        case EFFECT_TYPE_CREATURE_ENTERS_PLAY: {
                            break;
                        }
                        case EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE: {
                            const target = this.getMetaValue(action.target, action.generatedBy);
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target,
                                source: null,
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                generatedBy: action.generatedBy,
                            });
                            break;
                        }
                        case EFFECT_TYPE_MOVE_ENERGY: {
                            const moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
                            const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                            const moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
                            const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                            const amountToMove = this.getMetaValue(action.amount, action.generatedBy);
                            if (moveSource.data.energy >= amountToMove) {
                                moveSource.removeEnergy(amountToMove);
                                moveTarget.addEnergy(amountToMove);
                                if (moveSource.data.energy === 0) {
                                    switch (moveSource.card.type) {
                                        case TYPE_CREATURE: {
                                            // Creature goes to discard
                                            this.transformIntoActions({
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
                            break;
                        }
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI: {
                            const addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addMiltiTarget, (target) => {
                                switch (target.card.type) {
                                    case TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                            amount: action.amount,
                                            target,
                                            source: null,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI: {
                            const discardMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(discardMiltiTarget, target => {
                                switch (target.card.type) {
                                    case TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            amount: action.amount,
                                            attack: action.attack || false,
                                            spell: action.spell || false,
                                            relic: action.relic || false,
                                            source: action.source,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                            source: action.source,
                                            amount: action.amount,
                                            attack: action.attack || false,
                                            spell: action.spell || false,
                                            relic: action.relic || false,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                            oneOrSeveral(this.getMetaValue(action.target, action.generatedBy), target => {
                                target.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                                const hisCreatures = this.useSelector(SELECTOR_OWN_CREATURES, target.data.controller, null);
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
                        case EFFECT_TYPE_DEFEAT_MAGI: {
                            const magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiMiltiTarget, target => {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
                                    target,
                                    source: null,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                            const { target, generatedBy } = action;
                            const stillHasMagi = this.getZone(ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
                            if (stillHasMagi) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: target,
                                    sourceZone: ZONE_TYPE_ACTIVE_MAGI,
                                    destinationZone: ZONE_TYPE_DEFEATED_MAGI,
                                    bottom: false,
                                    generatedBy,
                                }, {
                                    type: ACTION_SELECT,
                                    selector: SELECTOR_OWN_CARDS_IN_PLAY,
                                    player: target.owner,
                                    variable: 'cardsInPlay',
                                    generatedBy,
                                }, {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
                                    target: '$cardsInPlay',
                                    player: target.owner,
                                    generatedBy,
                                });
                            }
                            else {
                                const winner = this.getOpponent(target.owner);
                                this.transformIntoActions({
                                    type: ACTION_PLAYER_WINS,
                                    player: winner,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES: {
                            // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
                            // No cards use this effect now, but some may later
                            // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
                            const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                            var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
                            oneOrSeveral(multiTarget, target => {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                    target,
                                    amount,
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
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                            const multiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(multiTarget, target => {
                                if (this.isCardAffectedByEffect(target, action)) {
                                    var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
                                    const energyLossThreshold = this.modifyByStaticAbilities(target, PROPERTY_ENERGY_LOSS_THRESHOLD);
                                    const energyLostAlready = target.data.energyLostThisTurn;
                                    if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                                        const energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                                        energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
                                    }
                                    target.removeEnergy(energyToLose);
                                    if (target.data.energy == 0 && !action.attack) {
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                            target,
                                            attack: false,
                                            sourceZone: ZONE_TYPE_IN_PLAY,
                                            destinationZone: ZONE_TYPE_DISCARD,
                                            bottom: false,
                                            generatedBy: action.generatedBy,
                                        });
                                    }
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY: {
                            const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
                            const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
                            if (restoreAmount > 0) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                    source: action.source || null,
                                    target: restoreTarget,
                                    amount: restoreAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_POWER: {
                            const payingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const payingAmount = this.getMetaValue(action.amount, action.generatedBy);
                            if (payingAmount > 0) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                    target: payingTarget,
                                    source: null,
                                    amount: payingAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        }
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                            const addTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(addTargets, addTarget => addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10)));
                            break;
                        }
                        case EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI: {
                            const magiTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTargets, magiTarget => {
                                const startingEnergy = this.modifyByStaticAbilities(magiTarget, PROPERTY_MAGI_STARTING_ENERGY);
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                    target: magiTarget,
                                    amount: startingEnergy,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                            const magiTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC: {
                            const discardTargets = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(discardTargets, target => {
                                const targetType = target.card.type;
                                if (targetType === TYPE_CREATURE) {
                                    this.transformIntoActions({
                                        type: ACTION_EFFECT,
                                        effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                                else if (targetType === TYPE_RELIC) {
                                    this.transformIntoActions({
                                        type: ACTION_EFFECT,
                                        effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                                        target,
                                        generatedBy: action.generatedBy,
                                    });
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                            const relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(relicDiscardTarget, relic => {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    target: relic,
                                    sourceZone: ZONE_TYPE_IN_PLAY,
                                    destinationZone: ZONE_TYPE_DISCARD,
                                    bottom: false,
                                    generatedBy: action.generatedBy,
                                });
                            });
                            break;
                        }
                        case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                            const creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            oneOrSeveral(creatureDiscardTarget, creature => {
                                if (this.isCardAffectedByEffect(creature, action)) {
                                    const effect = {
                                        type: ACTION_EFFECT,
                                        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                        target: creature,
                                        sourceZone: ZONE_TYPE_IN_PLAY,
                                        destinationZone: ZONE_TYPE_DISCARD,
                                        bottom: false,
                                        generatedBy: action.generatedBy,
                                    };
                                    this.transformIntoActions(effect);
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                            const id = nanoid();
                            const staticAbilities = (action.staticAbilities || []).map(ability => {
                                switch (ability.selector) {
                                    case SELECTOR_ID: {
                                        const selectorParameterMetaValue = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                                        const selectorParameter = (selectorParameterMetaValue instanceof CardInGame) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                                        return {
                                            ...ability,
                                            selectorParameter,
                                        };
                                    }
                                    case SELECTOR_CREATURES_OF_PLAYER: {
                                        const selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                                        return {
                                            ...ability,
                                            selectorParameter,
                                        };
                                    }
                                    default: {
                                        return ability;
                                    }
                                }
                            }).map(ability => {
                                const operandOne = this.getMetaValue(ability.modifier?.operandOne, action.generatedBy);
                                return {
                                    ...ability,
                                    modifier: {
                                        operator: ability.modifier.operator,
                                        operandOne,
                                    },
                                };
                            });
                            const continuousEffect = {
                                triggerEffects: action.triggerEffects || [],
                                staticAbilities,
                                expiration: action.expiration,
                                player: action.player,
                                id,
                            };
                            this.state = {
                                ...this.state,
                                continuousEffects: [
                                    ...this.state.continuousEffects,
                                    continuousEffect,
                                ],
                            };
                            break;
                        }
                        case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                            const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
                            const ownCreatures = this.useSelector(SELECTOR_OWN_CREATURES, action.player);
                            const totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(card => card.data.energy).reduce((a, b) => a + b, 0) : 0;
                            const newEnergyTotal = Object.values(energyArrangement).reduce((a, b) => a + b, 0);
                            if (newEnergyTotal === totalEnergyOnCreatures) {
                                this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
                                    if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
                                        const newEnergy = energyArrangement[card.id];
                                        card.setEnergy(newEnergy);
                                        if (card.data.energy === 0) {
                                            this.transformIntoActions({
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
                                console.log(`Cannot rearrange energy because new total ${newEnergyTotal} is not equal to old total ${totalEnergyOnCreatures}`);
                            }
                            break;
                        }
                        case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                            const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
                            this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
                                if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
                                    const energyAmount = energyArrangement[card.id];
                                    card.addEnergy(energyAmount);
                                }
                            });
                            break;
                        }
                        case EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
                            const damageArrangement = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
                            this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
                                if (card.card.type === TYPE_CREATURE && card.id in damageArrangement) {
                                    const damageAmount = damageArrangement[card.id];
                                    if (damageAmount > 0) {
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            source: action.source,
                                            target: card,
                                            amount: damageAmount,
                                            generatedBy: action.generatedBy,
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
        } // while(this.hasActions())
        // SBA for Magi losing
        if (!this.state.prompt) {
            const sbActions = [];
            this.players.forEach(player => {
                if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).length === 1) {
                    const magi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
                    const creatures = this.useSelector(SELECTOR_OWN_CREATURES, player, null);
                    if (magi.data.energy === 0 && creatures instanceof Array && creatures.length === 0) {
                        sbActions.push({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
                            source: null,
                            target: magi,
                            generatedBy: nanoid(),
                            player,
                        });
                    }
                }
            });
            if (sbActions.length > 0) {
                this.addActions(...sbActions);
                this.update({
                    type: ACTION_NONE,
                });
            }
        }
        return true;
    }
}
export { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, 
// PREPARATION_ACTION_CHOOSE_MAGI,
// PREPARATION_ACTION_CHOOSE_STARTING_CARDS,
// ACTION_DRAW,
ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, 
// ACTION_RESHUFFLE_DISCARD,
ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, 
// PROPERTY_STARTING_ENERGY,
PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, CALCULATION_MULTIPLY, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, 
// SELECTOR_ACTIVE_MAGI_OF_PLAYER,
SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, };
//# sourceMappingURL=index.js.map