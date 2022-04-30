/* global expect, describe, it */
import * as moonlands from '../src/index.ts';
import { byName } from '../src/cards.ts';
import CardInGame from '../src/classes/CardInGame.ts';
import Card from '../src/classes/Card.ts';
import { caldDeck, naroomDeck } from './testData';

import {
	TYPE_CREATURE,

	ACTION_PLAY,
	ACTION_POWER,
	ACTION_PASS,
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_CONCEDE,
	ACTION_EXIT_PROMPTS,

	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_ADD_DELAYED_TRIGGER,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,

	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES_OF_TYPE,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_CREATURES_OF_TYPE,
	SELECTOR_CREATURES_NOT_OF_TYPE,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_MAGI,
	SELECTOR_CREATURES,
	SELECTOR_OWN_CARDS_IN_PLAY,
	SELECTOR_STATUS,
	SELECTOR_ID,
	SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,

	REGION_NAROOM,
	REGION_CALD,
	REGION_OROTHE,
	REGION_UNDERNEATH,
	REGION_ARDERIAL,

	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,

	ACTION_PROPERTY,

	PROPERTY_ENERGIZE,

	PROMPT_TYPE_CHOOSE_CARDS,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_PLAYER,

	RESTRICTION_REGION,
	RESTRICTION_TYPE,
	RESTRICTION_STATUS,
	RESTRICTION_ENERGY_EQUALS,
	RESTRICTION_OWN_CREATURE,

	CALCULATION_SET,

	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
	EFFECT_TYPE_ATTACK,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
	EFFECT_TYPE_NONE,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_HAND,

	PROPERTY_ENERGY_LOSS_THRESHOLD,
	PROPERTY_STATUS,
	PROPERTY_ABLE_TO_ATTACK,

	EXPIRATION_ANY_TURNS,
	EXPIRATION_NEVER,

	STATUS_BURROWED,
} from '../src/const.ts';

import Zone from '../src/classes/Zone.ts';

import {
	STEP_ENERGIZE,
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_CREATURES,
	STEP_PRS_SECOND,
	STEP_DRAW,
	createZones,
} from './utils.js';
import nanoid from 'nanoid';
import {  } from '../src/const.ts';

describe('Updating state with action', () => {
	it('Pass action', () => {
		const ACTIVE_PLAYER = 367;
		const gameState = new moonlands.State({
			activePlayer: ACTIVE_PLAYER,
			step: STEP_ENERGIZE,
		});

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		expect(gameState.getCurrentStep()).toEqual(STEP_ENERGIZE, 'Intial step is Energize');
		gameState.update(passAction);
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Final step is PRS');
		gameState.update(passAction);
	});

	it('Pass till second player gets priority', () => {
		const ACTIVE_PLAYER = 33;
		const NON_ACTIVE_PLAYER = 66;
		const gameState = new moonlands.State({
			activePlayer: ACTIVE_PLAYER,
			step: STEP_PRS_FIRST,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Initial step is PRS');
		expect(gameState.getActivePlayer()).toEqual(ACTIVE_PLAYER, 'Active player is player 33');
		gameState.update(passAction); // Attack
		gameState.update(passAction); // Creatures
		gameState.update(passAction); // PRS
		gameState.update(passAction); // Draw -> Energize -> PRS
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Initial step is Energize');
		expect(gameState.getActivePlayer()).toEqual(NON_ACTIVE_PLAYER, 'Active player is player 66');
	});

	it('Correct playing priority on each step', () => {
		const ACTIVE_PLAYER = 5;
		const NON_ACTIVE_PLAYER = 7;
		const gameState = new moonlands.State({
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		expect(gameState.getCurrentStep()).toEqual(STEP_ENERGIZE, 'Initial step is Energize');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.NO_PRIORITY, 'There is no priority at Energize');
		gameState.update(passAction); // to PRS
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Current step is PRS');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_PRS, 'There is PRS priority at PRS');
		gameState.update(passAction); // to Attack
		expect(gameState.getCurrentStep()).toEqual(STEP_ATTACK, 'Current step is Attack');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_ATTACK, 'There is Attack priority at Attack');
		gameState.update(passAction); // to Creatures
		expect(gameState.getCurrentStep()).toEqual(STEP_CREATURES, 'Current step is Creatures');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_CREATURES, 'There is Creatures priority at Creatures');
		gameState.update(passAction); // to PRS
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_SECOND, 'Current step is PRS');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_PRS, 'There is Creatures priority at Creatures');
		gameState.update(passAction); // to Draw, and then to Energize, and to PRS
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Current step is PRS again');
		expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_PRS, 'There is no priority at Draw');
	});
});

describe('Magi stuff', () => {
	it('Energizing', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;
		const startingEnergy = 10;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.addEnergy(startingEnergy);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(startingEnergy, 'Grega\'s Energy is 10');

		gameState.update({
			type: moonlands.ACTION_EFFECT,
			target: grega,
			effectType: moonlands.EFFECT_TYPE_ENERGIZE,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(15, 'Grega\'s energy is 15 after energizing');
	});

	it('Energizing a creature', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 3;

		const greenStuff = new CardInGame(byName('Green Stuff'), ACTIVE_PLAYER);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([greenStuff]),
			new Zone('AP current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(0, 'Green Stuff\'s Energy is 0');

		gameState.update({
			type: moonlands.ACTION_EFFECT,
			target: greenStuff,
			effectType: moonlands.EFFECT_TYPE_ENERGIZE,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(1, 'Green Stuff\'s energy is 1 after energizing');
	});

	it('Flipping Magi on beginning of Energize step', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

		const startingEnergy = grega.card.data.startingEnergy;
		const energizeRate = grega.card.data.energize;

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([grega, sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([arbolit]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([quorPup]),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_DRAW,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.state.turn = 1;

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(0, 'No active magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(2, 'Two magi in pile');

		gameState.update({
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		});

		expect(gameState.state.prompt).toEqual(true, 'Game waiting for prompt');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game waiting for active player to resolve prompt');
		expect(gameState.state.promptParams.cards).toEqual(grega.card.data.startingCards, 'Prompt params lists starting cards of Grega');
		expect(gameState.state.promptParams.availableCards).toEqual(['Arbolit', 'Quor Pup'], 'Prompt params says Arbolit from deck and Quor Pup from discard are available');

		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_CARDS, 'Game waiting for you to choose starting cards');

		gameState.update({
			type: moonlands.ACTION_RESOLVE_PROMPT,
			cards: ['Arbolit', 'Quor Pup'],
			generatedBy: gameState.state.promptGeneratedBy,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'Magi is flipped');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy)
			.toEqual(startingEnergy + energizeRate, 'Grega\'s starting energy is 15 after flipping and energizing');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(2, 'Two starting cards in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(card => card.card.name)).toEqual(['Arbolit', 'Quor Pup'], 'Starting cards are Arbolit and Quor Pup');
	});

	it('Flipping Magi on beginning of Energize step (drawing to 5)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

		const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const fireChogoOne = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const fireChogoTwo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const startingEnergy = grega.card.data.startingEnergy;
		const energizeRate = grega.card.data.energize;

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([grega, sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
				arbolit,
				quorOne,
				quorTwo,
				fireChogoOne,
				fireChogoTwo,
			]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([quorPup]),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_DRAW,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(0, 'No active magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(2, 'Two magi in pile');

		gameState.update({
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		});

		expect(gameState.state.prompt).toEqual(true, 'Game waiting for prompt');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_CARDS, 'Game waiting for you to choose starting cards');

		gameState.update({
			type: moonlands.ACTION_RESOLVE_PROMPT,
			cards: ['Arbolit', 'Quor Pup'],
			generatedBy: gameState.state.promptGeneratedBy,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'Magi is flipped');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy)
			.toEqual(startingEnergy + energizeRate, 'Grega\'s starting energy is 15 after flipping and energizing');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length,
		).toEqual(5, 'Two starting cards plus 3 other are in hand');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(card => card.card.name).sort(),
		).toEqual(
			['Arbolit', 'Quor Pup', 'Quor', 'Quor', 'Fire Chogo'].sort(),
			'Starting cards are Arbolit and Quor Pup',
		);
	});

	it('Flipping Magi on beginning of Energize step (not your first Magi)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		const ashgar = new CardInGame(byName('Ashgar'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

		const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const fireChogoOne = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const fireChogoTwo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const startingEnergy = grega.card.data.startingEnergy;
		const energizeRate = grega.card.data.energize;

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([grega, sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER).add([ashgar]),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
				arbolit,
				quorOne,
				quorTwo,
				fireChogoOne,
				fireChogoTwo,
			]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([quorPup]),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_DRAW,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(0, 'No active magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(2, 'Two magi in pile');

		gameState.update({
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		});

		expect(gameState.state.prompt).toEqual(true, 'Game waiting for prompt');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_CARDS, 'Game waiting for you to choose starting cards');

		gameState.update({
			type: moonlands.ACTION_RESOLVE_PROMPT,
			cards: ['Arbolit', 'Quor Pup'],
			generatedBy: gameState.state.promptGeneratedBy,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'Magi is flipped');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy)
			.toEqual(startingEnergy + energizeRate, 'Grega\'s starting energy is 15 after flipping and energizing');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length,
		).toEqual(2, 'Two starting cards are in hand');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(card => card.card.name).sort(),
		).toEqual(
			['Arbolit', 'Quor Pup'].sort(),
			'Starting cards are Arbolit and Quor Pup',
		);
	});

	it('Flipping Magi on beginning of Energize step (not your first Magi, has cards in hand)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		const ashgar = new CardInGame(byName('Ashgar'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

		const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const fireChogoOne = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const fireChogoTwo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const startingEnergy = grega.card.data.startingEnergy;
		const energizeRate = grega.card.data.energize;

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([grega, sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER).add([ashgar]),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([quorOne, fireChogoOne]),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
				arbolit,
				quorTwo,
				fireChogoTwo,
			]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([quorPup]),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_DRAW,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(0, 'No active magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(2, 'Two magi in pile');

		gameState.update({
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		});

		expect(gameState.state.prompt).toEqual(true, 'Game waiting for prompt');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_CARDS, 'Game waiting for you to choose starting cards');

		gameState.update({
			type: ACTION_RESOLVE_PROMPT,
			cards: ['Arbolit', 'Quor Pup'],
			generatedBy: gameState.state.promptGeneratedBy,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'Magi is flipped');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy)
			.toEqual(startingEnergy + energizeRate, 'Grega\'s starting energy is 15 after flipping and energizing');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length,
		).toEqual(4, 'Two starting cards are in hand plus two initial cards');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(card => card.card.name).sort(),
		).toEqual(
			['Arbolit', 'Quor Pup', 'Quor', 'Fire Chogo'].sort(),
			'Starting cards are Arbolit and Quor Pup',
		);
	});
});

describe('Prompts', () => {
	it('Prompt should save actions for later', () => {
		const ACTIVE_PLAYER = 0;
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];
		const addEnergyAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			amount: 2,
			target: arbolit,
		};

		const promptAction = {
			type: ACTION_ENTER_PROMPT,
			player: ACTIVE_PLAYER,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
			actions: [promptAction, addEnergyAction],
		});

		expect(gameState.state.actions.length).toEqual(2, 'Two actions in queue');

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);
		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(2, 'Two actions saved for later');
		expect(arbolit.data.energy).toEqual(0, 'No energy added to creature');
	});

	it('Resolving prompt should resume and apply saved actions', () => {
		const ACTIVE_PLAYER = 0;
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];

		const addEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			amount: 2,
			target: arbolit,
		};

		const promptAction = {
			type: ACTION_ENTER_PROMPT,
			player: ACTIVE_PLAYER,
			promptType: moonlands.PROMPT_TYPE_NUMBER,
		};

		const resolvePromptAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			number: 2,
		};

		const passAction = {
			type: moonlands.ACTION_PASS,

		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
			actions: [promptAction, addEnergyAction],
		});

		expect(gameState.state.actions.length).toEqual(2, 'Two actions in queue');

		gameState.update(passAction);

		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(2, 'Two actions saved for later');
		expect(arbolit.data.energy).toEqual(0, 'No energy added to creature');

		gameState.update(resolvePromptAction);

		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(0, 'No actions saved for later');
		expect(arbolit.data.energy).toEqual(2, 'Energy was added to creature');
	});

	it('Resolving prompt saves number for future action', () => {
		const ACTIVE_PLAYER = 0;
		const PROMPTED_NUMBER = 4;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];

		const addEnergyAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			amount: '$number',
			target: arbolit,
			generatedBy: 1,
		};

		const promptAction = {
			type: moonlands.ACTION_ENTER_PROMPT,
			promptType: moonlands.PROMPT_TYPE_NUMBER,
			player: ACTIVE_PLAYER,
			generatedBy: 1,
		};

		const resolvePromptAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			number: PROMPTED_NUMBER,
			generatedBy: 1,
		};

		const passAction = {
			type: moonlands.ACTION_PASS,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: 0,
			actions: [promptAction, addEnergyAction],
		});

		gameState.update(passAction);

		expect(arbolit.data.energy).toEqual(0, 'No energy added to creature');
		expect(gameState.state.prompt).toEqual(true, 'Game waiting for prompt');
		expect(gameState.state.promptType).toEqual(moonlands.PROMPT_TYPE_NUMBER, 'Game waiting for numeric prompt');

		gameState.update(resolvePromptAction);

		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(0, 'No actions saved for later');
		expect(arbolit.data.energy).toEqual(PROMPTED_NUMBER, 'Energy was added to creature');
		expect(gameState.state.prompt).toEqual(false, 'Game not waiting for prompt anymore');
		expect(gameState.state.promptType).toEqual(null, 'Game not waiting for any prompt');
	});

	it('Resolving prompt saves target for future effect', () => {
		const arbolit = new CardInGame(byName('Arbolit', 0));
		arbolit.addEnergy(5);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];

		const removeEnergyAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			amount: 2,
			target: '$target',
			generatedBy: 1,
		};

		const promptAction = {
			type: moonlands.ACTION_ENTER_PROMPT,
			promptType: moonlands.PROMPT_TYPE_SINGLE_CREATURE,
			player: 0,
			generatedBy: 1,
		};

		const resolvePromptAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			target: arbolit,
			generatedBy: 1,
		};

		const passAction = {
			type: moonlands.ACTION_PASS,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: 0,
			actions: [promptAction, removeEnergyAction],
		});

		gameState.update(passAction);
		expect(arbolit.data.energy).toEqual(5, 'Arbolit has 5 energy');

		gameState.update(resolvePromptAction);

		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(0, 'No actions saved for later');
		expect(arbolit.data.energy).toEqual(3, 'Energy was removed from creature');
	});

	it('Card selection prompt checks restrictions', () => {
		const ACTIVE_PLAYER = 12;
		const arbolit = new CardInGame(byName('Arbolit', ACTIVE_PLAYER));
		const kelthet = new CardInGame(byName('Kelthet', ACTIVE_PLAYER));
		const weebo = new CardInGame(byName('Weebo', ACTIVE_PLAYER));

		arbolit.addEnergy(5);
		kelthet.addEnergy(2);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, kelthet]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		const enterPromptAction = {
			type: ACTION_ENTER_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			zone: ZONE_TYPE_IN_PLAY,
			zoneOwner: ACTIVE_PLAYER,
			restriction: RESTRICTION_REGION,
			restrictionValue: REGION_CALD,
			numberOfCards: 2,
			variable: 'caldCreatures',
		};

		gameState.update(enterPromptAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const tooFewCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit],
		};

		const tooFewResult = gameState.update(tooFewCardsAction);

		expect(tooFewResult).toEqual(false, 'Resolve action with too few cards fails');
		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const wrongRegionCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit, weebo],
		};

		const wrongRegionResult = gameState.update(wrongRegionCardsAction);

		expect(wrongRegionResult).toEqual(false, 'Resolve action with restriction breaking cards fails');
		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const correctCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit, kelthet],
		};

		const correctResult = gameState.update(correctCardsAction);

		expect(correctResult).toEqual(true, 'Resolve action with restriction breaking cards fails');
		expect(gameState.state.prompt).toEqual(false, 'Engine is not in prompt state');
	});

	it('Card selection prompt checks restrictions (multiple restrictions)', () => {
		const ACTIVE_PLAYER = 12;
		const arbolit = new CardInGame(byName('Arbolit', ACTIVE_PLAYER));
		const kelthet = new CardInGame(byName('Kelthet', ACTIVE_PLAYER));
		const thermalBlast = new CardInGame(byName('Thermal Blast', ACTIVE_PLAYER));
		const weebo = new CardInGame(byName('Weebo', ACTIVE_PLAYER));

		arbolit.addEnergy(5);
		kelthet.addEnergy(2);

		const zones = [
			new Zone('Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arbolit, kelthet, thermalBlast, weebo]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		const enterPromptAction = {
			type: ACTION_ENTER_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			zone: ZONE_TYPE_HAND,
			zoneOwner: ACTIVE_PLAYER,
			restrictions: [
				{
					type: RESTRICTION_REGION,
					value: REGION_CALD,
				},
				{
					type: RESTRICTION_TYPE,
					value: TYPE_CREATURE,
				},
			],
			numberOfCards: 2,
			variable: 'caldCreatures',
		};

		gameState.update(enterPromptAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const tooFewCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit],
		};

		const tooFewResult = gameState.update(tooFewCardsAction);

		expect(tooFewResult).toEqual(false, 'Resolve action with too few cards fails');
		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const secondRestrictionAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit, thermalBlast],
		};

		const secondRestrictionResult = gameState.update(secondRestrictionAction);

		expect(secondRestrictionResult).toEqual(false, 'Resolve action with too few cards fails');
		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const wrongRegionCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit, weebo],
		};

		const wrongRegionResult = gameState.update(wrongRegionCardsAction);

		expect(wrongRegionResult).toEqual(false, 'Resolve action with restriction breaking cards fails');
		expect(gameState.state.prompt).toEqual(true, 'Engine is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Prompt type is correct');

		const correctCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			player: ACTIVE_PLAYER,
			cards: [arbolit, kelthet],
		};

		const correctResult = gameState.update(correctCardsAction);

		expect(correctResult).toEqual(true, 'Resolve action with correct cards passes');
		expect(gameState.state.prompt).toEqual(false, 'Engine is not in prompt state');
	});

	it('Turn timer action clears the prompt and saved actions', () => {
		const ACTIVE_PLAYER = 0;
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];

		const promptAction = {
			type: moonlands.ACTION_ENTER_PROMPT,
			player: ACTIVE_PLAYER,
		};

		const exitPromptsAction = { type: ACTION_EXIT_PROMPTS };

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.update(promptAction);
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		gameState.update(exitPromptsAction);
		expect(gameState.state.actions.length).toEqual(0, 'Queue is empty');
		expect(gameState.state.savedActions.length).toEqual(0, 'No actions saved for later');
		expect(gameState.state.prompt).toEqual(false);
		expect(arbolit.data.energy).toEqual(0, 'No energy added to creature');
	});

	it('PROMPT_TYPE_PLAYER', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 44;
		const newId = nanoid();

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const promptAction = {
			type: moonlands.ACTION_ENTER_PROMPT,
			promptType: PROMPT_TYPE_PLAYER,
			player: ACTIVE_PLAYER,
			generatedBy: newId,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_ENERGIZE,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.update(promptAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_PLAYER);
		expect(gameState.state.promptGeneratedBy).toEqual(newId);

		const resolvePromptAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_PLAYER,
			targetPlayer: NON_ACTIVE_PLAYER,
		};

		gameState.update(resolvePromptAction);

		expect(gameState.state.prompt).toEqual(false);
		expect(gameState.getSpellMetadata(newId).targetPlayer).toEqual(NON_ACTIVE_PLAYER);
	});
});

describe('Serializing the state', () => {
	it('Serializing winning state', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 333;

		const zones = [
			new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('AP Magi Pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER),
			new Zone('NAP Magi Pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const firstSerializationResultAP = gameState.serializeData(ACTIVE_PLAYER);
		const firstSerializationResultNAP = gameState.serializeData(NON_ACTIVE_PLAYER);

		expect(firstSerializationResultAP.gameEnded).toEqual(false, 'Game not ended yet');
		expect(firstSerializationResultAP.winner).toEqual(null, 'No winner determined');

		expect(firstSerializationResultNAP.gameEnded).toEqual(false, 'Game not ended yet');
		expect(firstSerializationResultNAP.winner).toEqual(null, 'No winner determined');

		gameState.setWinner(ACTIVE_PLAYER);

		const serializationResultAP = gameState.serializeData(ACTIVE_PLAYER);
		const serializationResultNAP = gameState.serializeData(NON_ACTIVE_PLAYER);

		expect(serializationResultAP.gameEnded).toEqual(true, 'Game ended correctly');
		expect(serializationResultAP.winner).toEqual(ACTIVE_PLAYER, 'Winner saved correctly');

		expect(serializationResultNAP.gameEnded).toEqual(true, 'Game ended correctly (for NAP)');
		expect(serializationResultNAP.winner).toEqual(ACTIVE_PLAYER, 'Winner saved correctly (for NAP)');
	});
});

describe('Losing the game', () => {
	it('Losing your last creature while having 0 energy (AP)', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 44;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, weebo]),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const discardEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: arbolit,
			amount: 10,
			generatedBy: grega.id,
		};

		gameState.update(discardEnergyAction);
		expect(gameState.winner).toEqual(NON_ACTIVE_PLAYER);
	});

	it('Losing all energy on your Magi while having no creatures (AP)', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 44;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo]),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const discardEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
			target: grega,
			amount: 10,
			generatedBy: grega.id,
		};

		gameState.update(discardEnergyAction);
		expect(gameState.winner).toEqual(NON_ACTIVE_PLAYER);
	});

	it('Losing all energy on your Magi while having no creatures (moving energy)', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 44;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo]),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const discardEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			source: grega,
			target: yaki,
			amount: 5,
			generatedBy: grega.id,
		};

		gameState.update(discardEnergyAction);
		expect(gameState.winner).toEqual(NON_ACTIVE_PLAYER);
	});

	it('Losing your last creature while having 0 energy (NAP)', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 44;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, weebo]),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const discardEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: weebo,
			amount: 10,
			player: ACTIVE_PLAYER,
			generatedBy: yaki.id,
		};

		gameState.update(discardEnergyAction);

		expect(gameState.winner).toEqual(ACTIVE_PLAYER);
	});

	it('Losing all energy on your Magi while having no creatures (NAP)', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 44;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(5);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);

		const zones = [
			new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('AP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('NAP Magi Grave', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
			new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const discardEnergyAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
			target: yaki,
			amount: 10,
			player: ACTIVE_PLAYER,
			generatedBy: yaki.id,
		};

		gameState.update(discardEnergyAction);

		expect(gameState.winner).toEqual(ACTIVE_PLAYER);
	});
});

describe('Effects', () => {
	it('Discard cards from hand [EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 33;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER);

		const zones = [
			new Zone('In play', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arbolit, xyx]),
			new Zone('Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const discardCardsEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
			target: [arbolit, xyx],
			generatedBy: arbolit.id,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
			spellMetaData: {
				[arbolit.id]: {
					target: [arbolit, xyx],
				}
			}
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(2, 'Active player has 2 cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'Discard pile is empty');

		gameState.update(discardCardsEffect);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(0, 'Active player\'s hand is empty');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(2, 'There are two cards in active player\'s Discard');
	});

	it('Discard cards from hand with metadata [EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 33;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER);

		const zones = [
			new Zone('In play', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arbolit, xyx]),
			new Zone('Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
		];

		const discardCardsEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
			target: '$selected',
			generatedBy: arbolit.id,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
			spellMetaData: {
				[arbolit.id]: {
					selected: [arbolit, xyx],
				}
			}
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(2, 'Active player has 2 cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'Discard pile is empty');

		gameState.update(discardCardsEffect);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(0, 'Active player\'s hand is empty');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(2, 'There are two cards in active player\'s Discard');
	});

	it('Discard creature from play [EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
			new Zone('Discard', ZONE_TYPE_DISCARD, activePlayer),
		];

		const discardCreatureEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
			target: arbolit,
			generatedBy: arbolit.id,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: 0,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Arbolit on the field');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, activePlayer).length).toEqual(0, 'Discard pile is empty');

		gameState.update(discardCreatureEffect);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'Field is empty');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, activePlayer).length).toEqual(1, 'Arbolit is in discard pile');
	});

	it('Add energy to creature [EFFECT_TYPE_ADD_ENERGY_TO_CREATURE]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

		const addEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			target: arbolit,
			amount: 2,
		};

		const gameState = new moonlands.State({
			activePlayer,
		});

		expect(arbolit.data.energy).toEqual(0, 'Arbolit has 0 energy');

		gameState.update(addEnergyEffect);

		expect(arbolit.data.energy).toEqual(2, 'Arbolit has 2 energy');
	});

	it('Restore energy to creature [EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY]', () => {
		const activePlayer = 0;
		const quorPup = new CardInGame(byName('Quor Pup'), activePlayer);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(10);
		quorPup.addEnergy(1);

		const restoreEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
			target: quorPup,
			generatedBy: quorPup.id,
		};

		const restoreEnergyEffectNotApplicable = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
			target: fireGrag,
			generatedBy: fireGrag.id,
		};

		const gameState = new moonlands.State({
			activePlayer,
		});

		expect(quorPup.data.energy).toEqual(1, 'Quor Pup has 1 energy');
		expect(fireGrag.data.energy).toEqual(10, 'Fire Grag has 10 energy');

		gameState.update(restoreEnergyEffect);

		expect(quorPup.data.energy).toEqual(2, 'Quor Pup has 2 energy');

		gameState.update(restoreEnergyEffectNotApplicable);

		expect(fireGrag.data.energy).toEqual(10, 'Fire Grag has 10 energy');
	});

	it('Discard energy from creature [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);
		arbolit.addEnergy(5);

		const discardEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: arbolit,
			amount: 2,
		};

		const gameState = new moonlands.State({
			activePlayer,
		});

		expect(arbolit.data.energy).toEqual(5, 'Arbolit has 5 energy');

		gameState.update(discardEnergyEffect);

		expect(arbolit.data.energy).toEqual(3, 'Arbolit has 3 energy');
	});

	it('Moving energy from creature to creature [EFFECT_TYPE_MOVE_ENERGY]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(10);

		const moveEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_MOVE_ENERGY,
			source: fireGrag,
			target: arbolit,
			amount: 4,
		};

		const gameState = new moonlands.State({
			activePlayer,
		});

		gameState.update(moveEnergyEffect);

		expect(arbolit.data.energy).toEqual(9, 'Arbolit has 9 energy');
		expect(fireGrag.data.energy).toEqual(6, 'Fire Grag has 6 energy');
	});

	it('Moving energy from creature to magi [EFFECT_TYPE_MOVE_ENERGY]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);

		const moveEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_MOVE_ENERGY,
			source: arbolit,
			target: grega,
			amount: 4,
		};

		const gameState = new moonlands.State({
			activePlayer,
		});

		gameState.update(moveEnergyEffect);

		expect(arbolit.data.energy).toEqual(1, 'Arbolit has 1 energy');
		expect(grega.data.energy).toEqual(14, 'Grega has 14 energy');
	});

	it('Putting creature into play [EFFECT_TYPE_PLAY_CREATURE]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

		const zones = [
			new Zone('Hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const playCreatureEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_PLAY_CREATURE,
			card: arbolit,
			player: activePlayer,
			generatedBy: 12345,
		};

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'Nothing in play');

		gameState.update(playCreatureEffect);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
		expect(gameState.getSpellMetadata(12345).creature_created.id).toEqual(gameState.getZone(ZONE_TYPE_IN_PLAY).card.id, 'Id saved in metadata');
	});

	it('Moving card between zones [EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES]', () => {
		const activePlayer = 0;
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);

		const zones = [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, activePlayer),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, activePlayer),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, activePlayer),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit]),
		];

		const moveCardEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
			source: arbolit,
			target: grega,
			sourceZone: ZONE_TYPE_ACTIVE_MAGI,
			destinationZone: ZONE_TYPE_MAGI_PILE,
			generatedBy: 'testMoveEffect',
		};

		const gameState = new moonlands.State({
			zones,
			activePlayer,
		});

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).length).toEqual(1, 'Active Magi zone has 1 card');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE).length).toEqual(0, 'Magi pile zone has no cards');

		gameState.update(moveCardEffect);

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).length).toEqual(0, 'Active Magi zone is empty');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE).length).toEqual(1, 'Magi pile zone has 1 card');
		expect(
			gameState.state.spellMetaData.testMoveEffect.new_card.id,
		).toEqual(
			gameState.getZone(ZONE_TYPE_MAGI_PILE).card.id,
			'New card meta data points no new card',
		);
	});

	it('Rearranging energy on creatures [EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]', () => {
		const activePlayer = 0;

		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), activePlayer).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), activePlayer).addEnergy(10);

		const zones = [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, activePlayer),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, activePlayer),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, activePlayer),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, fireGrag, quorPup, diobor]),
		];

		const rearrangeEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
			energyOnCreatures: {
				[fireGrag.id]: 2,
				[arbolit.id]: 1,
				[quorPup.id]: 15,
				[diobor.id]: 7,
			},
			player: activePlayer,
			generatedBy: 'testMoveEffect',
		};

		const gameState = new moonlands.State({
			zones,
			activePlayer,
		});

		gameState.update(rearrangeEnergyEffect);

		expect(arbolit.data.energy).toEqual(1, 'Arbolit has 1 energy');
		expect(fireGrag.data.energy).toEqual(2, 'Fire Grag has 2 energy');
		expect(quorPup.data.energy).toEqual(15, 'Quor Pup has 15 energy');
		expect(diobor.data.energy).toEqual(7, 'Diobor has 7 energy');
	});

	it('Creatures with 0 energy go to discard [EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]', () => {
		const activePlayer = 0;

		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), activePlayer).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), activePlayer).addEnergy(10);

		const zones = [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, activePlayer),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, activePlayer),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, activePlayer),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, fireGrag, quorPup, diobor]),
		];

		const rearrangeEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
			energyOnCreatures: {
				[fireGrag.id]: 0,
				[arbolit.id]: 0,
				[quorPup.id]: 15,
				[diobor.id]: 10,
			},
			player: activePlayer,
			generatedBy: 'testMoveEffect',
		};

		const gameState = new moonlands.State({
			zones,
			activePlayer,
		});

		gameState.update(rearrangeEnergyEffect);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards).toHaveLength(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, activePlayer).cards).toHaveLength(2);

		expect(quorPup.data.energy).toEqual(15, 'Quor Pup has 15 energy');
		expect(diobor.data.energy).toEqual(10, 'Diobor has 7 energy');
	});

	it('Do nothing if the old total is not equal to the new total [EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]', () => {
		const activePlayer = 0;

		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), activePlayer).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), activePlayer).addEnergy(10);

		const zones = [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, activePlayer),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, activePlayer),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, activePlayer),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, fireGrag, quorPup, diobor]),
		];

		const rearrangeEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
			energyOnCreatures: {
				[fireGrag.id]: 2,
				[arbolit.id]: 2,
				[quorPup.id]: 15,
				[diobor.id]: 7,
			},
			player: activePlayer,
			generatedBy: 'testMoveEffect',
		};

		const gameState = new moonlands.State({
			zones,
			activePlayer,
		});

		gameState.update(rearrangeEnergyEffect);

		expect(arbolit.data.energy).toEqual(5, 'Arbolit has 5 energy');
		expect(fireGrag.data.energy).toEqual(4, 'Fire Grag has 4 energy');
		expect(quorPup.data.energy).toEqual(6, 'Quor Pup has 6 energy');
		expect(diobor.data.energy).toEqual(10, 'Diobor has 10 energy');
	});

	it('Distributing energy among creatures [EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]', () => {
		const activePlayer = 0;

		const grega = new CardInGame(byName('Grega'), activePlayer).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), activePlayer).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), activePlayer).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), activePlayer).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), activePlayer).addEnergy(10);

		const zones = [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, activePlayer),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, activePlayer),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, activePlayer),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, fireGrag, quorPup, diobor]),
		];

		const rearrangeEnergyEffect = {
			type: moonlands.ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
			energyOnCreatures: {
				[arbolit.id]: 3,
				[fireGrag.id]: 1,
				[quorPup.id]: 2,
				[diobor.id]: 4,
			},
			player: activePlayer,
			generatedBy: 'testMoveEffect',
		};

		const gameState = new moonlands.State({
			zones,
			activePlayer,
		});

		gameState.update(rearrangeEnergyEffect);

		expect(arbolit.data.energy).toEqual(8);
		expect(fireGrag.data.energy).toEqual(5);
		expect(quorPup.data.energy).toEqual(8);
		expect(diobor.data.energy).toEqual(14);
	});
});

describe('Match actions', () => {
	it('Matching object property with value', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		// const GENERATED_BY = 123;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		const actionToMatch = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			source: grega,
			target: yaki,
			amount: 5,
		};

		// Seeking Move Energy action where source's Energize rate is 5
		const find = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 'source',
					propertyOne: PROPERTY_ENERGIZE,
					comparator: '=',
					objectTwo: 5,
					propertyTwo: null,
				}
			],
		};

		// Seeking Move Energy action where source's Energize rate is 5
		const findToFail = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 'source',
					propertyOne: PROPERTY_ENERGIZE,
					comparator: '=',
					objectTwo: 6,
					propertyTwo: null,
				}
			],
		};

		expect(gameState.matchAction(actionToMatch, find, yaki)).toEqual(true, 'Action matches');
		expect(gameState.matchAction(actionToMatch, findToFail, yaki)).toEqual(false, 'Action fails to match');
	});

	it('Matching action property with value', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		// const GENERATED_BY = 123;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		const actionToMatch = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			source: grega,
			target: yaki,
			amount: 5,
		};

		// Seeking Move Energy action where amount is 5
		const find = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 'amount',
					propertyOne: ACTION_PROPERTY,
					comparator: '=',
					objectTwo: 5,
					propertyTwo: null,
				}
			],
		};

		const findToFail = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 'amount',
					propertyOne: ACTION_PROPERTY,
					comparator: '=',
					objectTwo: 6,
					propertyTwo: null,
				}
			],
		};

		expect(gameState.matchAction(actionToMatch, find, yaki)).toEqual(true, 'Action matches');
		expect(gameState.matchAction(actionToMatch, findToFail, yaki)).toEqual(false, 'Action fails to match');
	});

	it('Matching value with value', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		// const GENERATED_BY = 123;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		const actionToMatch = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			source: grega,
			target: yaki,
			amount: 5,
		};

		// Comparing 5 with 5
		const find = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 5,
					propertyOne: null,
					comparator: '=',
					objectTwo: 5,
					propertyTwo: null,
				}
			],
		};

		const findToFail = {
			effectType: EFFECT_TYPE_MOVE_ENERGY,
			conditions: [
				{
					objectOne: 5,
					propertyOne: null,
					comparator: '=',
					objectTwo: 6,
					propertyTwo: null,
				}
			],
		};

		expect(gameState.matchAction(actionToMatch, find, yaki)).toEqual(true, 'Action matches');
		expect(gameState.matchAction(actionToMatch, findToFail, yaki)).toEqual(false, 'Action fails to match');
	});
});

describe('Selector actions', () => {
	it('SELECTOR_MAGI', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectMagiAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectMagiAction);
		const selectedMagi = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedMagi).toHaveLength(2, 'Magi selector returns two magi');
		expect([selectedMagi[0].card.name, selectedMagi[1].card.name]).toEqual(['Grega', 'Yaki'], 'Magi selector returns both Magi');
	});

	it('SELECTOR_OWN_CREATURES_OF_TYPE', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectOwnOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_CREATURES_OF_TYPE,
			creatureType: 'Xyx',
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectOwnOfTypeAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(2, 'Creature selector returns both our Xyx and Xyx Elder');
		expect([selectedCreatures[0].card.name, selectedCreatures[1].card.name]).toEqual(['Xyx', 'Xyx Elder'], 'Creature selector returns both Xyx and Xyx Elder');
	});

	it('SELECTOR_CREATURES', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(3);
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx, waterOfLife]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectOwnOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_CREATURES,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectOwnOfTypeAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(4, 'Creature selector returns all 4 creatures');
		expect(selectedCreatures.map(card => card.card.name)).toEqual(['Xyx', 'Xyx Elder', 'Lava Balamant', 'Xyx'], 'Creature selector returns all creatures');
	});

	it('SELECTOR_CREATURES_OF_TYPE', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_CREATURES_OF_TYPE,
			creatureType: 'Xyx',
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfTypeAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(3, 'Creature selector returns both of our Xyx and an opponents Xyx');
		expect([selectedCreatures[0].card.name, selectedCreatures[1].card.name, selectedCreatures[2].card.name]).toEqual(['Xyx', 'Xyx', 'Xyx'], 'Creature selector returns only Xyx-es');
	});

	it('SELECTOR_CREATURES_OF_REGION', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfRegionAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_CREATURES_OF_REGION,
			region: REGION_ARDERIAL,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfRegionAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(3, 'Creature selector returns three creatures');
		expect(selectedCreatures.map(({ card }) => card.name)).toEqual(['Xyx', 'Xyx Elder', 'Xyx'], 'Creature selector returns only Arderial creatures');
	});

	it('SELECTOR_CREATURES_NOT_OF_REGION', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const magmaArmor = new CardInGame(byName('Magma Armor'), ACTIVE_PLAYER);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, magmaArmor, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfRegionAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_CREATURES_NOT_OF_REGION,
			region: REGION_ARDERIAL,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfRegionAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures.map(({ card }) => card.name)).toHaveLength(1, 'Creature selector returns one creature');
		expect(selectedCreatures.map(({ card }) => card.name)).toEqual(['Lava Balamant'], 'Creature selector returns only Lava Balamant');
	});

	it('SELECTOR_CREATURES_NOT_OF_TYPE', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_CREATURES_NOT_OF_TYPE,
			creatureType: 'Xyx',
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfTypeAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(1, 'Creature selector returns only one creature');
		expect(selectedCreatures[0].card.name).toEqual('Lava Balamant', 'Creature selector returns only Lava Balamant');
	});

	it('Selecting Magi by region [SELECTOR_MAGI_OF_REGION]', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const selectOfNaroomAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_OF_REGION,
			region: REGION_NAROOM,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const selectOfCaldAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_OF_REGION,
			region: REGION_CALD,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const selectOfOrotheAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_OF_REGION,
			region: REGION_OROTHE,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.update(selectOfNaroomAction);

		const selectedOfNaroom = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedOfNaroom).toHaveLength(1, '"Of Naroom" selector returns one magi');
		expect(selectedOfNaroom[0].card.name).toEqual('Yaki', '"Of Naroom" selector returns Yaki');

		gameState.update(selectOfCaldAction);

		const selectedOfCald = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedOfCald).toHaveLength(1, '"Of Cald" selector returns one magi');
		expect(selectedOfCald[0].card.name).toEqual('Grega', '"Of Cald" selector returns Grega');

		gameState.update(selectOfOrotheAction);

		const selectedOfOrothe = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedOfOrothe).toHaveLength(0, '"Of Orothe" selector returns no magi');
	});

	it('Selecting Magi not by region [SELECTOR_MAGI_NOT_OF_REGION]', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
		];

		const selectNotOfNaroomAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_NOT_OF_REGION,
			region: REGION_NAROOM,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const selectNotOfCaldAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_NOT_OF_REGION,
			region: REGION_CALD,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const selectNotOfOrotheAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_MAGI_NOT_OF_REGION,
			region: REGION_OROTHE,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.update(selectNotOfNaroomAction);

		const selectedNotOfNaroom = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedNotOfNaroom).toHaveLength(1, '"Not Of Naroom" selector returns one magi');
		expect(selectedNotOfNaroom[0].card.name).toEqual('Grega', '"Not Of Naroom" selector returns Grega');

		gameState.update(selectNotOfCaldAction);

		const selectedNotOfCald = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedNotOfCald).toHaveLength(1, '"Not Of Cald" selector returns one magi');
		expect(selectedNotOfCald[0].card.name).toEqual('Yaki', '"Not Of Cald" selector returns Yaki');

		gameState.update(selectNotOfOrotheAction);

		const selectedNotOfOrothe = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedNotOfOrothe).toHaveLength(2, '"Not Of Orothe" selector returns two magi');
	});

	it('SELECTOR_OWN_CARDS_IN_PLAY', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const nimbulo = new CardInGame(byName('Nimbulo'), ACTIVE_PLAYER).addEnergy(10);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(3);
		const moreXyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([nimbulo]),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([xyx, xyxElder, waterOfLife, lavaBalamant, moreXyx]),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('Player 2 discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('Player 1 defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
		];

		const selectOwnCardsInPlayAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_CARDS_IN_PLAY,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
			variable: 'allOwnCards',
		};

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.update(selectOwnCardsInPlayAction);

		expect(gameState.state.spellMetaData[GENERATED_BY].allOwnCards.length).toEqual(4, '4 cards in play selected');
		expect(gameState.state.spellMetaData[GENERATED_BY].allOwnCards.map(({ card }) => card.name)).toEqual(['Xyx', 'Xyx', 'Water of Life', 'Xyx'], 'Cards are selected correctly');
	});

	it('SELECTOR_CREATURES_WITH_MIN_ENERGY (one creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(4);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfTypeAction);

		const selectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(selectedCreatures).toHaveLength(1, 'Creature selector returns only one creature');
		expect(selectedCreatures[0].card.name).toEqual('Xyx', 'Creature selector returns only Xyx');
	});

	it('SELECTOR_CREATURES_WITH_MIN_ENERGY (three creatures)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(2);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(4);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
		};

		gameState.update(selectCreaturesOfTypeAction);

		const notSelectedCreatures = gameState.state.spellMetaData[GENERATED_BY].selected;

		expect(notSelectedCreatures).toHaveLength(0, 'No creatures selected yet');
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED);
		expect(gameState.state.promptParams).toEqual({
			restrictions: [
				{
					type: RESTRICTION_OWN_CREATURE,
					value: '',
				},
				{
					type: RESTRICTION_ENERGY_EQUALS,
					value: 2,
				}
			],
		});

		const resolvePromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			target: lavaBalamant,
			generatedBy: GENERATED_BY,
		};

		gameState.update(resolvePromptAction);

		const selectedCreature = gameState.state.spellMetaData[GENERATED_BY].selected;
		expect(selectedCreature.card.name).toEqual('Lava Balamant', 'Creature selector returns only Lava Balamant');
	});

	it('SELECTOR_CREATURES_WITH_MIN_ENERGY (three creatures, custom variable)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const GENERATED_BY = 123;

		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const xyxElder = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(2);
		const opponentsXyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(4);

		const zones = [
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			new Zone('In Play', ZONE_TYPE_IN_PLAY, null).add([xyx, xyxElder, lavaBalamant, opponentsXyx]),
		];

		const gameState = new moonlands.State({
			zones,
			ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const selectCreaturesOfTypeAction = {
			type: ACTION_SELECT,
			selector: SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
			player: ACTIVE_PLAYER,
			generatedBy: GENERATED_BY,
			variable: 'leastEnergy'
		};

		gameState.update(selectCreaturesOfTypeAction);

		const notSelectedCreatures = gameState.state.spellMetaData[GENERATED_BY].leastEnergy;

		expect(notSelectedCreatures).toHaveLength(0, 'No creatures selected yet');
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED);

		expect(gameState.state.promptParams).toEqual({
			restrictions: [
				{
					type: RESTRICTION_OWN_CREATURE,
					value: '',
				},
				{
					type: RESTRICTION_ENERGY_EQUALS,
					value: 2,
				}
			],
		});

		const resolvePromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			target: lavaBalamant,
			generatedBy: GENERATED_BY,
		};

		gameState.update(resolvePromptAction);

		const selectedCreature = gameState.state.spellMetaData[GENERATED_BY].leastEnergy;
		expect(selectedCreature.card.name).toEqual('Lava Balamant', 'Creature selector returns only Lava Balamant');
	});
});

describe('Calculation actions', () => {
	/**
		CALCULATION_SET,
		CALCULATION_DOUBLE,
		CALCULATION_ADD,
		CALCULATION_SUBTRACT,
		CALCULATION_HALVE_ROUND_DOWN,
		CALCULATION_HALVE_ROUND_UP,
		 */
	it('Addition - variables [CALCULATION_ADD]', () => {
		const gameState = new moonlands.State({
			spellMetaData: {
				'test': {
					'operandOne': 4,
					'operandTwo': 5,
				},
			},
		});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_ADD,
			operandOne: '$operandOne',
			operandTwo: '$operandTwo',
			variable: 'newResult',
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.newResult).toEqual(9, 'Addition result saved in "newResult" metadata field');
		gameState.closeStreams();
	});

	it('Addition - values [CALCULATION_ADD]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_ADD,
			operandOne: 123,
			operandTwo: 200,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(323, 'Addition result saved in "result" metadata field');
		gameState.closeStreams();
	});

	it('Subtraction - variables [CALCULATION_SUBTRACT]', () => {
		const gameState = new moonlands.State({
			spellMetaData: {
				'test': {
					'operandOne': 11,
					'operandTwo': 7,
				},
			},
		});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_SUBTRACT,
			operandOne: '$operandOne',
			operandTwo: '$operandTwo',
			variable: 'newResult',
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.newResult).toEqual(4, 'Subtraction result saved in "newResult" metadata field');
		gameState.closeStreams();
	});

	it('Subtraction - values [CALCULATION_SUBTRACT]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_SUBTRACT,
			operandOne: 231,
			operandTwo: 120,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(111, 'Addition result saved in "result" metadata field');
		gameState.closeStreams();
	});

	it('Doubling - variables [CALCULATION_DOUBLE]', () => {
		const gameState = new moonlands.State({
			spellMetaData: {
				'test': {
					'operandOne': 13,
				},
			},
		});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_DOUBLE,
			operandOne: '$operandOne',
			variable: 'newResult',
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.newResult).toEqual(26, 'Double result saved in "newResult" metadata field');
		gameState.closeStreams();
	});

	it('Doubling - values [CALCULATION_DOUBLE]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_DOUBLE,
			operandOne: 35,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(70, 'Doubling result saved in "result" metadata field');
		gameState.closeStreams();
	});

	it('Halve round up [CALCULATION_HALVE_ROUND_UP]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_HALVE_ROUND_UP,
			operandOne: 11,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(6, 'Halving 11 rounding up yields 6');
		gameState.closeStreams();
	});

	it('Halve round down [CALCULATION_HALVE_ROUND_DOWN]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_HALVE_ROUND_DOWN,
			operandOne: 11,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(5, 'Halving 11 rounding up yields 5');
		gameState.closeStreams();
	});

	it('Maximum [CALCULATION_MAX]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_MAX,
			operandOne: 102,
			operandTwo: 7,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(102, 'Max operator works');
		gameState.closeStreams();
	});

	it('Minimum [CALCULATION_MIN]', () => {
		const gameState = new moonlands.State({});

		gameState.update({
			type: moonlands.ACTION_CALCULATE,
			operator: CALCULATION_MIN,
			operandOne: 49,
			operandTwo: 51,
			generatedBy: 'test',
		});

		expect(gameState.state.spellMetaData.test.result).toEqual(49, 'Min operator works');
		gameState.closeStreams();
	});
});

describe('Activating power', () => {
	it('Simple power with prompting and no cost', () => {
		const ACTIVE_PLAYER = 0;
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

		const gameState = new moonlands.State({
			zones: [
				new Zone('Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, quorPup]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		const powerAction = {
			type: moonlands.ACTION_POWER,
			source: arbolit,
			power: arbolit.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			promptType: moonlands.PROMPT_TYPE_SINGLE_CREATURE,
			target: quorPup,
			generatedBy: arbolit.id,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures in play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No creatures in discard');
		expect(gameState.state.prompt).toEqual(true, 'Waiting for prompt');

		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One creature in discard');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Quor Pup', 'Creature is Quor Pup');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(2, 'Quor Pup has 2 energy');
		gameState.closeStreams();
	});

	it('Simple power with prompting and cost', () => {
		const ACTIVE_PLAYER = 0;
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(3);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);
		quorPup.addEnergy(1);

		const gameState = new moonlands.State({
			zones: [
				new Zone('Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo, quorPup]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		const powerAction = {
			type: moonlands.ACTION_POWER,
			source: weebo,
			power: weebo.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			promptType: moonlands.PROMPT_TYPE_SINGLE_CREATURE,
			target: quorPup,
			generatedBy: weebo.id,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures in play');
		expect(gameState.state.prompt).toEqual(true, 'Waiting for prompt');

		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures in play');
		expect(weebo.data.energy).toEqual(1, 'Weebo has 2 energy');
		expect(quorPup.data.energy).toEqual(2, 'Quor Pup has 2 energy');
		gameState.closeStreams();
	});

	it('Simple power with X in cost', () => {
		const ACTIVE_PLAYER = 0;

		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER);
		diobor.addEnergy(6);

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([diobor]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		const powerAction = {
			type: moonlands.ACTION_POWER,
			source: diobor,
			power: diobor.card.data.powers[1],
			player: ACTIVE_PLAYER,
		};

		const choosingCostAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			number: 5,
			generatedBy: diobor.id,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(grega.data.energy).toEqual(10, 'Grega have 10 energy');
		expect(gameState.state.prompt).toEqual(true, 'Waiting for prompt');

		gameState.update(choosingCostAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(grega.data.energy).toEqual(15, 'Grega now have 15 energy');
		gameState.closeStreams();
	});

	it('Simple power auto-targeting a magi', () => {
		const ACTIVE_PLAYER = 0;

		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER);
		diobor.addEnergy(6);

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([diobor]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		const powerAction = {
			type: moonlands.ACTION_POWER,
			source: diobor,
			power: diobor.card.data.powers[1],
			player: ACTIVE_PLAYER,
		};

		const choosingCostAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			number: 5,
			generatedBy: diobor.id,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(grega.data.energy).toEqual(10, 'Grega have 10 energy');
		expect(gameState.state.prompt).toEqual(true, 'Waiting for prompt');

		gameState.update(choosingCostAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(grega.data.energy).toEqual(15, 'Grega now have 15 energy');
		gameState.closeStreams();
	});

	it('Simple power targeting a magi', () => {
		const ACTIVE_PLAYER = 0;
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);
		arboll.addEnergy(2);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.addEnergy(15);

		const gameState = new moonlands.State({
			zones: [
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arboll]),
				new Zone('Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		const powerAction = {
			type: moonlands.ACTION_POWER,
			source: arboll,
			power: arboll.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: moonlands.ACTION_RESOLVE_PROMPT,
			promptType: moonlands.PROMPT_TYPE_SINGLE_MAGI,
			target: grega,
			generatedBy: arboll.id,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No creatures in discard');
		expect(gameState.state.prompt).toEqual(true, 'Waiting for prompt');
		expect(gameState.state.promptGeneratedBy).toEqual(arboll.id, 'Source of prompt is saved in the state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Active player is prompted');
		expect(gameState.state.promptMessage).toEqual('Choose a Magi to add 4 energy to', 'Prompt message is saved in the state');
		expect(grega.data.energy).toEqual(15, 'Grega has 15 energy');

		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No creatures in play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One creature in discard');
		expect(grega.data.energy).toEqual(19, 'Grega has 19 energy');
		gameState.closeStreams();
	});
});

describe('Static abilities', () => {
	it('Simple modifier of attribute (your source)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 6;

		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.data.energy = 15;

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([waterOfLife]),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const result = gameState.modifyByStaticAbilities(grega, PROPERTY_ENERGIZE);
		expect(result).toEqual(6, 'Grega\'s energize rate is increased by one');
		gameState.closeStreams();
	});

	it('Simple modifier of attribute (two source)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const waterOfLifeTwo = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.data.energy = 15;

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([waterOfLife, waterOfLifeTwo]),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const result = gameState.modifyByStaticAbilities(grega, PROPERTY_ENERGIZE);
		expect(result).toEqual(7, 'Grega\'s energize rate is increased by two');
		gameState.closeStreams();
	});

	it('Simple modifier of attribute (our source, enemy source)', () => {
		const ACTIVE_PLAYER = 0;
		const ENEMY_PLAYER = 1;
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);
		const waterOfLifeTwo = new CardInGame(byName('Water of Life'), ENEMY_PLAYER);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
		grega.data.energy = 15;

		const zones = [
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([waterOfLife, waterOfLifeTwo]),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Enemy player current magi', ZONE_TYPE_ACTIVE_MAGI, ENEMY_PLAYER),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, ENEMY_PLAYER);

		const result = gameState.modifyByStaticAbilities(grega, PROPERTY_ENERGIZE);
		expect(result).toEqual(6, 'Grega\'s energize rate is increased by one');
		gameState.closeStreams();
	});
});

describe('Deck drawing', () => {
	it('Simple draw', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
				new CardInGame(byName('Arbolit'), ACTIVE_PLAYER),
				new CardInGame(byName('Flame Geyser'), ACTIVE_PLAYER),
				new CardInGame(byName('Water of Life'), ACTIVE_PLAYER)
			]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('Non-active player discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			activePlayer: ACTIVE_PLAYER,
		});

		const drawAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DRAW,
			player: ACTIVE_PLAYER,
			generatedBy: 'testId',
		};

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(3, 'We have 3 cards in deck');

		gameState.update(drawAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'We now have 1 card in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'We now have 2 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'We have drawn first card of the deck');
		gameState.closeStreams();
	});

	it('Draw with discard reshuffle', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([
				new CardInGame(byName('Arbolit'), ACTIVE_PLAYER),
				new CardInGame(byName('Flame Geyser'), ACTIVE_PLAYER),
				new CardInGame(byName('Water of Life'), ACTIVE_PLAYER)
			]),
			new Zone('Non-active player discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			activePlayer: ACTIVE_PLAYER,
		});

		const drawAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DRAW,
			player: ACTIVE_PLAYER,
			generatedBy: 'testId',
		};

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in deck');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(3, 'We have 3 cards in discard');

		gameState.update(drawAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'We now have 1 card in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'We now have 2 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'We now have no cards in deck');
		expect(['Arbolit', 'Flame Geyser', 'Water of Life']).toContain(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name, 'We have drawn one of the discard cards');
		gameState.closeStreams();
	});

	it('Simple draw (non-active player)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([
				new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER),
				new CardInGame(byName('Flame Geyser'), NON_ACTIVE_PLAYER),
				new CardInGame(byName('Water of Life'), NON_ACTIVE_PLAYER)
			]),
			new Zone('Non-active player discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			activePlayer: ACTIVE_PLAYER,
		});

		const drawAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DRAW,
			player: NON_ACTIVE_PLAYER,
			generatedBy: 'testId',
		};

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(3, 'We have 3 cards in deck');

		gameState.update(drawAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'We now have 1 card in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(2, 'We now have 2 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'We have drawn first card of the deck');
		gameState.closeStreams();
	});

	it('Draw with discard reshuffle (non-active player)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('Non-active player discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).add([
				new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER),
				new CardInGame(byName('Flame Geyser'), NON_ACTIVE_PLAYER),
				new CardInGame(byName('Water of Life'), NON_ACTIVE_PLAYER)
			]),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			activePlayer: ACTIVE_PLAYER,
		});

		const drawAction = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DRAW,
			player: NON_ACTIVE_PLAYER,
			generatedBy: 'testId',
		};

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(0, 'We have no cards in deck');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(3, 'We have 3 cards in discard');

		gameState.update(drawAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'We now have 1 card in hand');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(2, 'We now have 2 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0, 'We now have no cards in deck');
		expect(['Arbolit', 'Flame Geyser', 'Water of Life'])
			.toContain(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name, 'We have drawn one of the discard cards');
		gameState.closeStreams();
	});
});

describe('Casting things', () => {
	it('Creating and getting zones', () => {
		const grega = new CardInGame(byName('Grega'), 0);
		grega.data.energy = 15;

		const arbolit = new CardInGame(byName('Arbolit'), 0);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, 0).add([arbolit]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, 1),
			new Zone('Active player deck', ZONE_TYPE_DECK, 0),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, 1),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, 0).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: 0,
		});

		expect(gameState.getZone(ZONE_TYPE_HAND, 0).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_HAND, 1).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_DECK, 0).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_DECK, 0).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, 0).length).toEqual(1);
		gameState.closeStreams();
	});

	it('Cast creature from hand (not enough energy)', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		grega.addEnergy(2);

		const kelthet = new CardInGame(byName('Kelthet'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([kelthet]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: 3,
			activePlayer: 0,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(2, 'Grega\'s Energy is 2');

		gameState.update({
			type: ACTION_PLAY,
			payload: {
				player: 0,
				card: kelthet,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty after');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(2, 'Grega\'s Energy is still 2');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(1, 'One card in hand');
		gameState.closeStreams();
	});

	it('Cast creature from hand', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		grega.addEnergy(15);

		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: 3,
			activePlayer: 0,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s Energy is 15');

		gameState.update({
			type: moonlands.ACTION_PLAY,
			payload: {
				player: 0,
				card: arbolit,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Arbolit', 'It is Arbolit');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(14, 'Grega\'s energy is 14');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(1, 'Arbolit\'s energy is 1');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(0, 'No cards in hand now');
		gameState.closeStreams();
	});

	it('Cast relic from hand (no energy)', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		const kelthet = new CardInGame(byName('Kelthet'), activePlayer).addEnergy(4);

		const waterOfLife = new CardInGame(byName('Water of Life'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([waterOfLife]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([kelthet]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: 0,
		});
		gameState.setPlayers(0, 1);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only Kelthet is in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(0, 'Grega\'s Energy is 0');

		gameState.update({
			type: moonlands.ACTION_PLAY,
			payload: {
				player: 0,
				card: waterOfLife,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'In play has two cards');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(0, 'Grega\'s energy is 0');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(0, 'Water of Life\'s energy is 0');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(0, 'No cards in hand now');
		gameState.closeStreams();
	});


	it('Cast relic from hand', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		grega.addEnergy(15);

		const waterOfLife = new CardInGame(byName('Water of Life'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([waterOfLife]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: 0,
		});
		gameState.setPlayers(0, 1);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s Energy is 15');

		gameState.update({
			type: moonlands.ACTION_PLAY,
			payload: {
				player: 0,
				card: waterOfLife,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Water of Life', 'It is Water of Life');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s energy is 15');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(0, 'Water of Life\'s energy is 2');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(0, 'No cards in hand now');
		gameState.closeStreams();
	});

	it('Cast relic from hand (another one in play)', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		grega.addEnergy(15);

		const waterOfLife = new CardInGame(byName('Water of Life'), activePlayer);
		const anotherWaterOfLife = new CardInGame(byName('Water of Life'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([waterOfLife]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([anotherWaterOfLife]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer,
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s Energy is 15');

		gameState.update({
			type: moonlands.ACTION_PLAY,
			payload: {
				player: activePlayer,
				card: waterOfLife,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Water of Life', 'It is Water of Life');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s energy is 15');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(0, 'Water of Life\'s energy is 0');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(1, 'Water of Life is still in hand');
		gameState.closeStreams();
	});

	it('Cast from hand (region penalty)', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const yaki = new CardInGame(byName('Yaki'), activePlayer);
		yaki.addEnergy(15);

		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([yaki]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new moonlands.State({
			zones,
			step: 3,
			activePlayer: 0,
		});
		gameState.setPlayers(activePlayer, notActivePlayer);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Yaki\'s Energy is 15');

		gameState.update({
			type: moonlands.ACTION_PLAY, payload: {
				player: 0,
				card: arbolit,
			}
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Arbolit', 'It is Arbolit');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(13, 'Yaki\'s energy is 13');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(1, 'Arbolit\'s energy is 1');
		gameState.closeStreams();
	});
});

describe('Attacking', () => {
	it('Simple attack from creature to creature (small to large)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const quorPup = new CardInGame(byName('Quor Pup'), NON_ACTIVE_PLAYER);
		quorPup.addEnergy(3);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo, quorPup]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: quorPup,
		};

		gameState.update(attackAction);

		expect(weebo.data.energy).toEqual(0, 'Weebo has 0 energy');
		expect(quorPup.data.energy).toEqual(1, 'Quor Pup has 1 energy');
		gameState.closeStreams();
	});

	it('Simple attack from creature to creature (large to small)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const leafHyren = new CardInGame(byName('Leaf Hyren'), ACTIVE_PLAYER);
		leafHyren.addEnergy(5);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER);
		arbolit.addEnergy(2);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([leafHyren, arbolit]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: leafHyren,
			target: arbolit,
		};

		gameState.update(attackAction);

		expect(leafHyren.data.energy).toEqual(3, 'Leaf Hyren has 3 energy');
		expect(arbolit.data.energy).toEqual(0, 'Arbolit has 0 energy');
		gameState.closeStreams();
	});

	it('Simple attack from creature to magi', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const leafHyren = new CardInGame(byName('Leaf Hyren'), ACTIVE_PLAYER);
		leafHyren.addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: leafHyren,
			target: grega,
		};

		gameState.update(attackAction);

		expect(leafHyren.data.energy).toEqual(5, 'Leaf Hyren still has 5 energy');
		expect(grega.data.energy).toEqual(5, 'Grega has 5 energy left');
		gameState.closeStreams();
	});

	it('Most creatures can attack only once', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const leafHyren = new CardInGame(byName('Leaf Hyren'), ACTIVE_PLAYER);
		leafHyren.addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: leafHyren,
			target: grega,
		};

		gameState.update(attackAction);

		expect(leafHyren.data.energy).toEqual(5, 'Leaf Hyren still has 5 energy');
		expect(grega.data.energy).toEqual(5, 'Grega has 5 energy left');

		gameState.update(attackAction);

		expect(leafHyren.data.energy).toEqual(5, 'Leaf Hyren still has 5 energy');
		expect(grega.data.energy).toEqual(5, 'Grega has 5 energy left (second attack wasnt made)');
		gameState.closeStreams();
	});
});

describe('Initializing game from set of decks', () => {
	it('Initialization', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;


		const zones = [
			new Zone('Player One hand', ZONE_TYPE_HAND, PLAYER_ONE),
			new Zone('Player 2 hand', ZONE_TYPE_HAND, PLAYER_TWO),
			new Zone('Player 1 deck', ZONE_TYPE_DECK, PLAYER_ONE),
			new Zone('Player 2 deck', ZONE_TYPE_DECK, PLAYER_TWO),
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, PLAYER_ONE),
			new Zone('Player 2 discard', ZONE_TYPE_DISCARD, PLAYER_TWO),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, PLAYER_ONE),
			new Zone('Player 2 magi pile', ZONE_TYPE_MAGI_PILE, PLAYER_TWO),
			new Zone('Player 1 magi pile', ZONE_TYPE_DEFEATED_MAGI, PLAYER_ONE),
			new Zone('Player 2 magi pile', ZONE_TYPE_DEFEATED_MAGI, PLAYER_TWO),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

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

		expect(gameState.state.step).toEqual(null, 'Step is null (Nullstart)');
		expect(gameState.state.turn).toEqual(1, 'Turn is 1');
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true, 'One of the players goes first');
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst, 'First turn, player who goes first is active');
		gameState.closeStreams();
	});

	it('Initialization (internal zones creation)', () => {
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

		expect(gameState.state.step).toEqual(null, 'Step is null (nullstart)');
		expect(gameState.state.turn).toEqual(1, 'Turn is 1');
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true, 'One of the players goes first');
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst, 'First turn, player who goes first is active');
		gameState.closeStreams();
	});
});

describe('Zones', () => {
	it('Serialization', () => {
		const ACTIVE_PLAYER = 2;
		const testZone = new Zone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add(caldDeck.map(card => new CardInGame(byName(card), ACTIVE_PLAYER)));

		const serialized = testZone.serialize();

		serialized.forEach(card => {
			expect(card).toHaveProperty('card');
			expect(card).toHaveProperty('id');
			expect(card).toHaveProperty('data.actionsUsed');
			expect(card).toHaveProperty('data.attacked');
			expect(card).toHaveProperty('data.controller', ACTIVE_PLAYER);
			expect(card).toHaveProperty('data.energy');
		});
	});
});

describe('Delayed Triggers', () => {
	it('Action adds delayed trigger', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const leafHyren = new CardInGame(byName('Leaf Hyren'), PLAYER_ONE);

		const zones = [];

		const gameState = new moonlands.State({
			zones,
			step: null,
			activePlayer: PLAYER_ONE,
			spellMetaData: {
				[leafHyren.id]: {
					source: leafHyren,
				},
			},
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const delayedTrigger = {
			name: 'Lore',
			text: 'At the card draw step, draw an additional card',
			find: {
				effectType: EFFECT_TYPE_DRAW,
				conditions: [
					{
						objectOne: 'stepEffect',
						propertyOne: ACTION_PROPERTY,
						comparator: '=',
						objectTwo: true,
						propertyTwo: null,
					}
				],
			},
			effects: [
				{
					type: ACTION_EFFECT,
					effectType: EFFECT_TYPE_DRAW,
				},
			],
		};

		const delayedTriggerAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ADD_DELAYED_TRIGGER,
			delayedTrigger,
			generatedBy: leafHyren.id,
		};

		gameState.update(delayedTriggerAction);

		expect(gameState.state.delayedTriggers).toHaveLength(1, 'Delayed trigger added to state');
		expect(gameState.state.delayedTriggers[0].name).toEqual('Lore', 'Trigger name saved');
		expect(gameState.state.delayedTriggers[0].id).toEqual(expect.any(String), 'Trigger has id');
		expect(gameState.state.delayedTriggers[0].self.id).toEqual(leafHyren.id, 'Source is assigned from spell metadata');
		gameState.closeStreams();
	});

	it('Delayed trigger triggers on conditions', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const leafHyren = new CardInGame(byName('Leaf Hyren'), PLAYER_ONE);

		const arbollOne = new CardInGame(byName('Arboll'), PLAYER_ONE);
		const arbollTwo = new CardInGame(byName('Arboll'), PLAYER_ONE);
		const arbollThree = new CardInGame(byName('Arboll'), PLAYER_ONE);

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
			spellMetaData: {
				[leafHyren.id]: {
					source: leafHyren,
				},
			},
		});
		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);
		gameState.state.zones = gameState.createZones();

		gameState.getZone(ZONE_TYPE_DECK, PLAYER_ONE).add([arbollOne, arbollTwo, arbollThree]);

		const delayedTrigger = {
			name: 'Lore',
			text: 'At the card draw step, draw an additional card',
			find: {
				effectType: EFFECT_TYPE_DRAW,
				conditions: [
					{
						objectOne: 'stepEffect',
						propertyOne: ACTION_PROPERTY,
						comparator: '=',
						objectTwo: true,
						propertyTwo: null,
					}
				],
			},
			effects: [
				{
					type: ACTION_EFFECT,
					effectType: EFFECT_TYPE_DRAW,
				},
			],
		};

		const delayedTriggerAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ADD_DELAYED_TRIGGER,
			delayedTrigger,
			generatedBy: leafHyren.id,
		};

		gameState.update(delayedTriggerAction);

		expect(gameState.state.delayedTriggers).toHaveLength(1, 'Delayed trigger added to state');

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);
		expect(gameState.getZone(ZONE_TYPE_HAND, PLAYER_ONE)).toHaveLength(3, 'Three cards drawn');
		expect(gameState.getZone(ZONE_TYPE_DECK, PLAYER_ONE)).toHaveLength(0, 'Deck is empty');
		expect(gameState.state.delayedTriggers).toHaveLength(0, 'Delayed trigger expires after matching');
		gameState.closeStreams();
	});
});

describe('Debugging roll values', () => {
	it('Setting roll value through action', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const rollAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ROLL_DIE,
			result: 10,
			generatedBy: 'test',
		};

		gameState.update(rollAction);

		expect(gameState.state.spellMetaData.test.roll_result).toEqual(10, 'Dice roll action uses action result value');
		gameState.closeStreams();
	});

	it('Resetting roll value', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setRollDebugValue(7);

		const rollAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ROLL_DIE,
			generatedBy: 'test',
		};

		gameState.update(rollAction);

		expect(gameState.state.spellMetaData.test.roll_result).toEqual(7, 'Dice roll action uses debug value');
		gameState.closeStreams();
	});

	it('Setting roll value', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		gameState.setRollDebugValue(7);
		gameState.resetRollDebugValue();
		const rollAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_ROLL_DIE,
			generatedBy: 'test',
		};

		gameState.update(rollAction);

		expect(gameState.state.spellMetaData.test.roll_result).toBeLessThan(7, 'Dice roll action stops using debug value after reset');
		gameState.closeStreams();
	});
});

describe('Continuous Effects', () => {
	it('Creating continuous effect', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testTriggerEffect = {
			find: {
				effectType: EFFECT_TYPE_ATTACK,
				conditions: [],
			},
			effects: [{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_NONE,
			}]
		};

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_CREATURES,
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [testTriggerEffect],
			player: PLAYER_ONE,
			expiration: {
				type: EXPIRATION_NEVER,
				turns: 0,
			},
			generatedBy: nanoid(),
		};

		gameState.update(createEffectAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].triggerEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].triggerEffects[0]).toEqual(testTriggerEffect);
		expect(gameState.state.continuousEffects[0].staticAbilities.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities[0]).toEqual(testStaticAbility);
		gameState.closeStreams();
	});

	it('Ticking down turns on continuous effects', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_CREATURES,
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 2,
			},
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		};

		gameState.update(createEffectAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities[0]).toEqual(testStaticAbility);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(2);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);
		gameState.closeStreams();
	});

	it('Removing continuous effects when turns run out', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_CREATURES,
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 1,
			},
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		};

		gameState.update(createEffectAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities[0]).toEqual(testStaticAbility);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		expect(gameState.state.continuousEffects.length).toEqual(0);
		gameState.closeStreams();
	});

	it('Do not remove continuous effects with EXPIRATION_NEVER when turns run out', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;

		const gameState = new moonlands.State({
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_CREATURES,
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_NEVER,
				turns: 1,
			},
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		};

		gameState.update(createEffectAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities.length).toEqual(1);
		expect(gameState.state.continuousEffects[0].staticAbilities[0]).toEqual(testStaticAbility);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		expect(gameState.state.continuousEffects.length).toEqual(1);
		gameState.closeStreams();
	});

	it('Continuous effects set properties', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;
		const ayebaw = new CardInGame(byName('Ayebaw'), PLAYER_ONE).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), PLAYER_TWO).addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, PLAYER_ONE),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, PLAYER_TWO),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_CREATURES,
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
			player: PLAYER_ONE,
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 1,
			},
			player: PLAYER_ONE,
			generatedBy: nanoid(),
		};

		gameState.update(createEffectAction);

		const creatureAbleToAttack = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);

		expect(creatureAbleToAttack).toEqual(false);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		// In the new turn, creatures are finally able to attack
		const creatureAbleToAttackNow = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);
		expect(creatureAbleToAttackNow).toEqual(true);
		gameState.closeStreams();
	});

	it('Continuous effects set properties by card id (id)', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;
		const ayebaw = new CardInGame(byName('Ayebaw'), PLAYER_ONE).addEnergy(2);
		const bwill = new CardInGame(byName('Bwill'), PLAYER_ONE).addEnergy(2);
		const arboll = new CardInGame(byName('Arboll'), PLAYER_ONE).addEnergy(2);

		const grega = new CardInGame(byName('Grega'), PLAYER_TWO).addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, PLAYER_ONE),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, PLAYER_TWO),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw, bwill, arboll]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
			spellMetaData: {
				[ayebaw.id]: {
					targetId: ayebaw.id,
				},
			},
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_ID,
			selectorParameter: '$targetId',
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
			player: PLAYER_ONE,
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 1,
			},
			player: PLAYER_ONE,
			generatedBy: ayebaw.id,
		};

		gameState.update(createEffectAction);

		const creatureAbleToAttack = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);
		const bwillAbleToAttack = gameState.modifyByStaticAbilities(bwill, PROPERTY_ABLE_TO_ATTACK);
		const arbollAbleToAttack = gameState.modifyByStaticAbilities(arboll, PROPERTY_ABLE_TO_ATTACK);

		expect(creatureAbleToAttack).toEqual(false);
		expect(bwillAbleToAttack).toEqual(true);
		expect(arbollAbleToAttack).toEqual(true);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		// In the new turn, creatures are finally able to attack
		const creatureAbleToAttackNow = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);
		expect(creatureAbleToAttackNow).toEqual(true);
		expect(bwillAbleToAttack).toEqual(true);
		expect(arbollAbleToAttack).toEqual(true);
		gameState.closeStreams();
	});

	it('Continuous effects set properties by card id (card)', () => {
		const PLAYER_ONE = 10;
		const PLAYER_TWO = 12;
		const ayebaw = new CardInGame(byName('Ayebaw'), PLAYER_ONE).addEnergy(2);
		const bwill = new CardInGame(byName('Bwill'), PLAYER_ONE).addEnergy(2);
		const arboll = new CardInGame(byName('Arboll'), PLAYER_ONE).addEnergy(2);

		const grega = new CardInGame(byName('Grega'), PLAYER_TWO).addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, PLAYER_ONE),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, PLAYER_TWO),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw, bwill, arboll]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: PLAYER_ONE,
			spellMetaData: {
				[ayebaw.id]: {
					targetId: ayebaw,
				},
			},
		});

		gameState.setPlayers(PLAYER_ONE, PLAYER_TWO);

		const testStaticAbility = {
			name: 'Test static ability',
			text: 'Static ability text',
			selector: SELECTOR_ID,
			selectorParameter: '$targetId',
			property: PROPERTY_ABLE_TO_ATTACK,
			modifier: {
				operator: CALCULATION_SET,
				operandOne: false,
			},
			player: PLAYER_ONE,
		};

		const createEffectAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [testStaticAbility],
			triggerEffects: [],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 1,
			},
			player: PLAYER_ONE,
			generatedBy: ayebaw.id,
		};

		gameState.update(createEffectAction);

		const creatureAbleToAttack = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);
		const bwillAbleToAttack = gameState.modifyByStaticAbilities(bwill, PROPERTY_ABLE_TO_ATTACK);
		const arbollAbleToAttack = gameState.modifyByStaticAbilities(arboll, PROPERTY_ABLE_TO_ATTACK);

		expect(creatureAbleToAttack).toEqual(false);
		expect(bwillAbleToAttack).toEqual(true);
		expect(arbollAbleToAttack).toEqual(true);

		expect(gameState.state.continuousEffects[0].expiration.turns).toEqual(1);

		const passAction = {
			type: ACTION_PASS,
			player: PLAYER_ONE,
		};

		gameState.update(passAction);

		// In the new turn, creatures are finally able to attack
		const creatureAbleToAttackNow = gameState.modifyByStaticAbilities(ayebaw, PROPERTY_ABLE_TO_ATTACK);
		expect(creatureAbleToAttackNow).toEqual(true);
		expect(bwillAbleToAttack).toEqual(true);
		expect(arbollAbleToAttack).toEqual(true);
		gameState.closeStreams();
	});
});

describe('Not entering prompts when spell being cast will lead to inescapable prompt', () => {
	it('No creatures on the field [PROMPT_TYPE_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(17);
		const grow = new CardInGame(byName('Grow'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([grow]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: grow,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(false, 'No cards to cast Grow on, so the cast does not happen');
		gameState.closeStreams();
	});

	it('Have creatures on the field [PROMPT_TYPE_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(17);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const grow = new CardInGame(byName('Grow'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([grow]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: grow,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(true, 'One creature is present, can cast');
		gameState.closeStreams();
	});

	it('No own creatures on the field [PROMPT_TYPE_OWN_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(17);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), NON_ACTIVE_PLAYER).addEnergy(5);
		const updraft = new CardInGame(byName('Updraft'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [leafHyren], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([updraft]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: updraft,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(false, 'No cards to cast Updraft on, so the cast does not happen');
		gameState.closeStreams();
	});


	it('Have own creatures on the field [PROMPT_TYPE_OWN_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(17);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), ACTIVE_PLAYER).addEnergy(5);
		const updraft = new CardInGame(byName('Updraft'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [leafHyren], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([updraft]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: updraft,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(true, 'Have creature to cast Updraft on, so the cast does happen');
		gameState.closeStreams();
	});

	it('No creatures on the field satisfying the restriction [PROMPT_TYPE_OWN_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(17);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), ACTIVE_PLAYER).addEnergy(5);
		const shootingStar = new CardInGame(byName('Shooting Star'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, leafHyren], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([shootingStar]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: shootingStar,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(false, 'No cards to cast Shooting Star on, so the cast does not happen');
		gameState.closeStreams();
	});

	it('Creatures on the field satisfying the restriction [PROMPT_TYPE_OWN_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(17);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(5);
		const shootingStar = new CardInGame(byName('Shooting Star'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, alaban], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([shootingStar]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: shootingStar,
			},
		};

		gameState.update(spellAction);

		expect(gameState.state.prompt).toEqual(true, 'No cards to cast Shooting Star on, so the cast does not happen');
		gameState.closeStreams();
	});
});

describe('Conceding the game', () => {
	it('Concede action', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [ebylon]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const concedeAction = {
			type: ACTION_CONCEDE,
			player: ACTIVE_PLAYER,
		};

		expect(gameState.hasWinner()).toEqual(false, 'No winner before Active player concedes');
		gameState.update(concedeAction);
		expect(gameState.hasWinner()).toEqual(true, 'Game has winner after active player concedes');
		expect(gameState.winner).toEqual(NON_ACTIVE_PLAYER, 'Active player has conceded, so the winner is Non-active player');
		gameState.closeStreams();
	});
});

describe('Not entering prompts when activating power will lead to inescapable prompt', () => {
	it('No creatures on battlefield [PROMPT_TYPE_SINGLE_CREATURE]', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(5);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [pruitt]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: pruitt,
			power: pruitt.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(false, 'Pruitt cannot activate power as no creatures are present');
		gameState.closeStreams();
	});

	it('No relics on battlefield [PROMPT_TYPE_RELIC]', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [ebylon]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: ebylon,
			power: ebylon.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(false, 'Ebylon cannot activate power as no relic is present');
		gameState.closeStreams();
	});

	it('No own creatures on battlefield [PROMPT_TYPE_SINGLE_OWN_CREATURE]', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER).addEnergy(7);

		// Naroom player
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaArboll], [whall]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: whall,
			power: whall.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(false, 'Whall cannot activate power as he controls no creatures');
		gameState.closeStreams();
	});

	it('No creatures matching restriction on battlefield [PROMPT_TYPE_SINGLE_CREATURE_FILTERED]', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER).addEnergy(7);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);

		// Cald player
		const magam = new CardInGame(byName('Magam'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaArboll, lavaBalamant], [magam]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: magam,
			power: magam.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(false, 'Magam cannot activate power as he controls no creatures with less than starting energy');
		gameState.closeStreams();
	});

	it('Cannot activate power that references "other creature" if no other creatures are present', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const magmaHyren = new CardInGame(byName('Magma Hyren'), ACTIVE_PLAYER);
		magmaHyren.addEnergy(3);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([magmaHyren]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const healingFlameAction = {
			type: ACTION_POWER,
			source: magmaHyren,
			power: magmaHyren.card.data.powers[1],
			player: ACTIVE_PLAYER,
		};

		gameState.update(healingFlameAction);

		expect(gameState.state.prompt).toEqual(false, 'Power is not activated');
		gameState.closeStreams();
	});
});

describe('Burrowed status', () => {
	it('Burrowed status prevents attacking', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ABLE_TO_ATTACK)).toEqual(false, 'Proto-Pylofuf is unable to attack');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			attack: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});

	it('Digging Goggles allow attacking by Burrowed creatures', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const diggingGoggles = new CardInGame(byName('Digging Goggles'), ACTIVE_PLAYER);
		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf, diggingGoggles]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ABLE_TO_ATTACK)).toEqual(true, 'Proto-Pylofuf is able to attack because of Digging Goggles');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			attack: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});

	it('Opponents Digging Goggles do not affect our Burrowed creatures', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const diggingGoggles = new CardInGame(byName('Digging Goggles'), NON_ACTIVE_PLAYER);
		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf, diggingGoggles]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ABLE_TO_ATTACK)).toEqual(false, 'Proto-Pylofuf is unable to attack, Goggles do not affect him');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			attack: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});

	it('Burrowed status limits energy loss from attacks', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED).length).toEqual(1, 'Only one card matches the Burrowed status selector');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED)[0].card.name).toEqual('Proto-Pylofuf', 'It is Proto-Pylofuf');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ENERGY_LOSS_THRESHOLD)).toEqual(2, 'Proto-Pylofuf is considered protected by his Burrowed status');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			attack: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});

	it('Burrowed status limits energy loss from enemy powers', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED).length).toEqual(1, 'Only one card matches the Burrowed status selector');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED)[0].card.name).toEqual('Proto-Pylofuf', 'It is Proto-Pylofuf');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ENERGY_LOSS_THRESHOLD)).toEqual(2, 'Proto-Pylofuf is considered protected by his Burrowed status');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			power: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});

	it('Burrowed status limits energy loss from enemy spells', () => {
		const ACTIVE_PLAYER = 12;
		const NON_ACTIVE_PLAYER = 22;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_STATUS, STATUS_BURROWED)).toEqual(true, 'Proto-Pylofuf is considered Burrowed by engine');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED).length).toEqual(1, 'Only one card matches the Burrowed status selector');
		expect(gameState.useSelector(SELECTOR_STATUS, ACTIVE_PLAYER, STATUS_BURROWED)[0].card.name).toEqual('Proto-Pylofuf', 'It is Proto-Pylofuf');
		expect(gameState.modifyByStaticAbilities(protoPylofuf, PROPERTY_ENERGY_LOSS_THRESHOLD)).toEqual(2, 'Proto-Pylofuf is considered protected by his Burrowed status');

		const fiveEnergyLossAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			target: protoPylofuf,
			spell: true,
			amount: 5,
			generatedBy: 'test',
		};

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost only 2 energy due to being Burrowed');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf has energy loss marked');

		gameState.update(fiveEnergyLossAction);

		expect(protoPylofuf.data.energy).toEqual(2, 'Proto-Pylofuf lost no energy due to being Burrowed and already losing his limit of 2 energy');
		expect(protoPylofuf.data.energyLostThisTurn).toEqual(2, 'Proto-Pylofuf still has energy loss marked');
		gameState.closeStreams();
	});
});

describe('Enrich', () => {
	it('Affects burrowed creatures', () => {
		const ACTIVE_PLAYER = 64;
		const NON_ACTIVE_PLAYER = 30;

		const protoPylofufCard = new Card('Proto-Pylofuf', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
			burrowed: true,
		});

		const motash = new CardInGame(byName('Motash'), ACTIVE_PLAYER).addEnergy(4);
		const protoPylofuf = new CardInGame(protoPylofufCard, ACTIVE_PLAYER).addEnergy(4);
		const enrich = new CardInGame(byName('Enrich'), ACTIVE_PLAYER);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([enrich]),
				new Zone('NAP Discard', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([motash]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([protoPylofuf]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: enrich,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED, 'Prompt is of correct type');
		expect(gameState.state.promptParams.restriction).toEqual(RESTRICTION_STATUS, 'Prompt is restricted by status');
		expect(gameState.state.promptParams.restrictionValue).toEqual(STATUS_BURROWED, 'Status is Burrowed');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: protoPylofuf,
			generatedBy: enrich.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
		expect(protoPylofuf.data.energy).toEqual(7, 'Proto-Pylofuf has 7 energy now');
		gameState.closeStreams();
	});
});

describe('Protection', () => {
	it('Protection from non-Arderial spells', () => {
		const ACTIVE_PLAYER = 64;
		const NON_ACTIVE_PLAYER = 30;

		const lovian = new CardInGame(byName('Lovian'), ACTIVE_PLAYER).addEnergy(4);
		const lasada = new CardInGame(byName('Lasada'), ACTIVE_PLAYER).addEnergy(10);
		const thermalBlast = new CardInGame(byName('Thermal Blast'), NON_ACTIVE_PLAYER);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([lasada]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([lovian]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		const energyDiscardAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			amount: 5,
			target: lovian,
			source: thermalBlast,
			spell: true,
			generatedBy: thermalBlast.id,
		};

		gameState.update(energyDiscardAction);

		expect(lovian.data.energy).toEqual(4, 'Lovian is protected from Thermal Blast and lost no energy');
		gameState.closeStreams();
	});

	it('Protection from non-Arderial spells does not apply against Arderial spells', () => {
		const ACTIVE_PLAYER = 64;
		const NON_ACTIVE_PLAYER = 30;

		const lovian = new CardInGame(byName('Lovian'), ACTIVE_PLAYER).addEnergy(4);
		const lasada = new CardInGame(byName('Lasada'), ACTIVE_PLAYER).addEnergy(10);
		const stormCloud = new CardInGame(byName('Storm Cloud'), NON_ACTIVE_PLAYER);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([lasada]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([lovian]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		const energyDiscardAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
			amount: 3,
			target: lovian,
			source: stormCloud,
			spell: true,
			generatedBy: stormCloud.id,
		};

		gameState.update(energyDiscardAction);

		expect(lovian.data.energy).toEqual(1, 'Lovian is not protected from Storm Cloud');
		gameState.closeStreams();
	});
});
