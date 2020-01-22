/* global expect, describe, it */
const nanoid = require('nanoid');
const moonlands = require('../src/index');
const {
	ACTION_PASS,
	ACTION_CALCULATE,
	ACTION_SELECT,
	ACTION_GET_PROPERTY_VALUE,

	SELECTOR_OWN_MAGI,
	PROPERTY_ENERGIZE,

	CALCULATION_SET,

	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
} = require('../src/const');

const {caldDeck, naroomDeck} = require('./testData');

describe('Stream of actions', () => {
	it('Streams actions', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, PLAYER_ONE).length).toEqual(3, 'Player one magi transferred into pile zone');
		expect(gameState.getZone(ZONE_TYPE_DECK, PLAYER_ONE).length).toEqual(40, 'Player one deck transferred into zone');

		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, PLAYER_TWO).length).toEqual(3, 'Player two magi transferred into pile zone');
		expect(gameState.getZone(ZONE_TYPE_DECK, PLAYER_TWO).length).toEqual(40, 'Player two deck transferred into zone');

		expect(gameState.state.step).toEqual(0, 'Step is 0 (STEP_ENERGIZE)');
		expect(gameState.state.turn).toEqual(1, 'Turn is 1');
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true, 'One of the players goes first');
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst, 'First turn, player who goes first is active');

		const seenActions = [];

		gameState.actionStreamOne.on('action', function(action) {
			seenActions.push(action);
		});

		gameState.commandStream.write({
			type: ACTION_PASS,
		});

		expect(gameState.state.step).toEqual(1, 'Step is 1 (STEP_PRS_FIRST)');
		expect(seenActions.length).toBeGreaterThan(0, 'Actions are coming via events');
		expect(seenActions[0]).toEqual({type: ACTION_PASS}, 'Pass actions are sent as is');
	});

	it('Streams skipping calculations', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions = [];

		gameState.actionStreamOne.on('action', function(action) {
			seenActions.push(action);
		});

		gameState.commandStream.write({
			type: ACTION_CALCULATE,
			operator: CALCULATION_SET,
			operandOne: 14,
			variable: 'result',
			generatedBy: nanoid(),
		});

		expect(seenActions.length).toEqual(0, 'Calculate actions are not relayed to players');
	});

	it('Streams skipping selectors', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions = [];

		gameState.actionStreamOne.on('action', function(action) {
			seenActions.push(action);
		});

		gameState.commandStream.write({
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_MAGI,
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		});

		expect(seenActions.length).toEqual(0, 'Select actions are not relayed to players');
	});

	it('Streams skipping property getters', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions = [];

		gameState.actionStreamOne.on('action', function(action) {
			seenActions.push(action);
		});

		const spellId = nanoid();

		gameState.commandStream.write({
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_MAGI,
			player: PLAYER_ONE,
			variable: 'our_magi',
			generatedBy: spellId,
		});

		gameState.commandStream.write({
			type: ACTION_GET_PROPERTY_VALUE,
			property: PROPERTY_ENERGIZE,
			target: '$our_magi',
			player: PLAYER_ONE,
			generatedBy: spellId,
		});

		expect(seenActions.length).toEqual(0, 'Property getter actions are not relayed to players');
	});
});