/* global expect, describe, it */
import {nanoid} from 'nanoid';
import * as moonlands from '../src/index';

import {
	ACTION_PASS,
	ACTION_CALCULATE,
	ACTION_SELECT,
	ACTION_GET_PROPERTY_VALUE,
	ACTION_RESOLVE_PROMPT,

	SELECTOR_OWN_MAGI,
	PROPERTY_ENERGIZE,

	CALCULATION_SET,

	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
} from '../src/const';

import {caldDeck, naroomDeck} from './testData';
import { AnyEffectType } from '../src/types';

describe('Stream of actions', () => {
	it('Streams actions', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			prompt: false,
			promptType: null,
			promptParams: {},
			players: [],
			log: [],
			actions: [],
			savedActions: [],
			mayEffectActions: [],
			fallbackActions: [],
			continuousEffects: [],
			spellMetaData: {},
			delayedTriggers: [],
			attachedTo: {},
			cardsAttached: {}
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		// Player one magi transferred into pile zone
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, PLAYER_ONE).length).toEqual(3);
		// Player one deck transferred into zone
		expect(gameState.getZone(ZONE_TYPE_DECK, PLAYER_ONE).length).toEqual(40);

		// Player two magi transferred into pile zone
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, PLAYER_TWO).length).toEqual(3);
		// Player two deck transferred into zone
		expect(gameState.getZone(ZONE_TYPE_DECK, PLAYER_TWO).length).toEqual(40);

		// Step is null (Nullstart)
		expect(gameState.state.step).toEqual(null);
		// Turn is 1
		expect(gameState.state.turn).toEqual(1);
		// One of the players goes first
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true);
		// First turn, player who goes first is active
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst);

		const seenActions: AnyEffectType[] = [];

    gameState.setOnAction(function(action: AnyEffectType) {
			seenActions.push(action);
		})

		// This initial action will change step to 0 while keeping current active player
		gameState.update({
			type: ACTION_PASS,
      player: 1,
		});

		// Step is 0 (STEP_ENERGIZE)
		expect(gameState.state.step).toEqual(0);
		// Actions are coming via events
		expect(seenActions.length).toBeGreaterThan(0);
		// Pass actions are sent as is
		expect(seenActions[0]).toEqual({type: ACTION_PASS, player: 1});
		gameState.closeStreams();
	});

	it('Streams skipping calculations', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			prompt: false,
			promptType: null,
			promptParams: {},
			players: [],
			log: [],
			actions: [],
			savedActions: [],
			mayEffectActions: [],
			fallbackActions: [],
			continuousEffects: [],
			spellMetaData: {},
			delayedTriggers: [],
			attachedTo: {},
			cardsAttached: {}
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions: AnyEffectType[] = [];

    gameState.setOnAction(function(action: AnyEffectType) {
			seenActions.push(action);
		});

		gameState.update({
			type: ACTION_CALCULATE,
			operator: CALCULATION_SET,
			operandOne: 14,
			variable: 'result',
			generatedBy: nanoid(),
		});

		// Calculate actions are not relayed to players
		expect(seenActions.length).toEqual(0);
	});

	it('Streams skipping selectors', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			prompt: false,
			promptType: null,
			promptParams: {},
			players: [],
			log: [],
			actions: [],
			savedActions: [],
			mayEffectActions: [],
			fallbackActions: [],
			continuousEffects: [],
			spellMetaData: {},
			delayedTriggers: [],
			attachedTo: {},
			cardsAttached: {}
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions: AnyEffectType[] = [];

    gameState.setOnAction(function(action: AnyEffectType) {
			seenActions.push(action);
		})

		gameState.update({
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_MAGI,
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		});

		// Select actions are not relayed to players
		expect(seenActions.length).toEqual(0);
	});

	it('Streams not skipping prompt resolutions', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			prompt: false,
			promptType: null,
			promptParams: {},
			players: [],
			log: [],
			actions: [],
			savedActions: [],
			mayEffectActions: [],
			fallbackActions: [],
			continuousEffects: [],
			spellMetaData: {},
			delayedTriggers: [],
			attachedTo: {},
			cardsAttached: {}
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions: AnyEffectType[] = [];

    gameState.setOnAction(function(action: AnyEffectType) {
			seenActions.push(action);
		});

		gameState.update({
			type: ACTION_RESOLVE_PROMPT,
			number: 12,
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		});

		// Prompt resolution actions are relayed to players
		expect(seenActions.length).toEqual(1);
	});

	it('Streams skipping property getters', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			prompt: false,
			promptType: null,
			promptParams: {},
			players: [],
			log: [],
			actions: [],
			savedActions: [],
			mayEffectActions: [],
			fallbackActions: [],
			continuousEffects: [],
			spellMetaData: {},
			delayedTriggers: [],
			attachedTo: {},
			cardsAttached: {}
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setDeck(PLAYER_ONE, caldDeck);
		gameState.setDeck(PLAYER_TWO, naroomDeck);

		gameState.setup();

		const seenActions: AnyEffectType[] = [];

    gameState.setOnAction(function(action: AnyEffectType) {
			seenActions.push(action);
		});

		const spellId = nanoid();

		gameState.update({
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_MAGI,
			player: PLAYER_ONE,
			variable: 'our_magi',
			generatedBy: spellId,
		});

		gameState.update({
			type: ACTION_GET_PROPERTY_VALUE,
			property: PROPERTY_ENERGIZE,
			target: '$our_magi',
			player: PLAYER_ONE,
			generatedBy: spellId,
			variable: 'energizeValue'
		});

		// Property getter actions are not relayed to players
		expect(seenActions.length).toEqual(0);
	});
});