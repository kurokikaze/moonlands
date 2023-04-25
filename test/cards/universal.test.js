/* global expect, describe, it */
import {State} from '../../src/index.ts';
import {byName} from '../../src/cards.ts';
import CardInGame from '../../src/classes/CardInGame.ts';
import Zone from '../../src/classes/Zone.ts';

/* eslint-disable no-unused-vars */
import {
	ACTION_PLAY,
	ACTION_ATTACK,
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,
	ACTION_PASS,
	ACTION_EFFECT,

	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_MAY_ABILITY,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,

	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,

	PROPERTY_CONTROLLER,
	PROPERTY_ABLE_TO_ATTACK,
	PROPERTY_CAN_BE_ATTACKED,

	RESTRICTION_REGION,
	RESTRICTION_ENERGY_LESS_THAN,

	REGION_OROTHE,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
	PROMPT_TYPE_POWER_ON_MAGI,
} from '../../src/const.ts';

import {
	STEP_ENERGIZE,
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_CREATURES,
	STEP_PRS_SECOND,
	createZones,
} from '../utils';

describe('Robes of the Ages', () => {
	it('Spells cost', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const oqua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER).addEnergy(10);
		const robesOfTheAges = new CardInGame(byName('Robes of the Ages'), ACTIVE_PLAYER);
		const seaBarl = new CardInGame(byName('Sea Barl'), ACTIVE_PLAYER).addEnergy(2);
		const undertow = new CardInGame(byName('Undertow'), ACTIVE_PLAYER);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([undertow]),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([oqua]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([robesOfTheAges, seaBarl]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const spellPlayAction = {
			type: ACTION_PLAY,
			payload: {
				card: undertow,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(spellPlayAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is prompting us');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: seaBarl,
			player: ACTIVE_PLAYER,
			generatedBy: undertow.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(oqua.data.energy).toEqual(6, 'O\'Qua has 6 energy (Undertow costed us 4 instead of 5)');
	});
});

describe('Warrior\'s Boots', () => {
	it('Warpath', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(4);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);
		const giantCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arboll, giantCarillion]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		
		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [arboll],
			generatedBy: warriorsBoots.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Hand has 1 card left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Arboll', 'Card in play is Arboll');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(3, 'Arboll has 3 energy - its starting value');

		expect(yaki.data.energy).toEqual(1, 'Yaki paid for Arboll');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card is in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Warrior\'s Boots', 'It is Warriors Boots');
	});

	it('Warpath (just enough energy)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(3);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);
		const giantCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arboll, giantCarillion]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		
		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [arboll],
			generatedBy: warriorsBoots.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Hand has 1 card left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Arboll', 'Card in play is Arboll');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(3, 'Arboll has 3 energy - its starting value');

		expect(yaki.data.energy).toEqual(0, 'Yaki paid for Arboll');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card is in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Warrior\'s Boots', 'It is Warriors Boots');
	});

	it('Warpath (but not enough energy)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);
		const giantCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arboll, giantCarillion]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
	});

	it('Warpath (but not enough energy, Underneath)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const motash = new CardInGame(byName('Motash'), ACTIVE_PLAYER).addEnergy(7);
		const lasada = new CardInGame(byName('Lasada'), NON_ACTIVE_PLAYER).addEnergy(15);

		const ormagonOne = new CardInGame(byName('Ormagon'), ACTIVE_PLAYER);
		const ormagonTwo = new CardInGame(byName('Ormagon'), ACTIVE_PLAYER);
		const caveIn = new CardInGame(byName('Cave In'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([ormagonOne, ormagonTwo, caveIn]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([motash]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([lasada]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
	});

	it('Warpath (from Underneath / Arderial match)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(20);
		const motash = new CardInGame(byName('Motash'), NON_ACTIVE_PLAYER);

		const korrit = new CardInGame(byName('Korrit'), NON_ACTIVE_PLAYER).addEnergy(1);

		const activePlayerHand = [
			new CardInGame(byName('Cyclone Vashp'), ACTIVE_PLAYER),
			new CardInGame(byName('Updraft'), ACTIVE_PLAYER),
			new CardInGame(byName('Updraft'), ACTIVE_PLAYER),
			new CardInGame(byName('Typhoon'), ACTIVE_PLAYER),
			new CardInGame(byName('Typhoon'), ACTIVE_PLAYER),
			new CardInGame(byName('Typhoon'), ACTIVE_PLAYER),
			new CardInGame(byName('Alaban'), ACTIVE_PLAYER),
			new CardInGame(byName('Alaban'), ACTIVE_PLAYER),
			new CardInGame(byName('Pharan'), ACTIVE_PLAYER),
			new CardInGame(byName('Storm Cloud'), ACTIVE_PLAYER),
			new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER),
			new CardInGame(byName('Shooting Star'), ACTIVE_PLAYER),
		];

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add(activePlayerHand),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([jaela]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([motash]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
	});

	it('Warpath (but not enough energy because of region penalty)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const fireChogo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const giantCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fireChogo, giantCarillion]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
	});

	it('Warpath with Robe of the Vines', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(4);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);
		const giantCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);
		const robeOfVines = new CardInGame(byName('Robe of Vines'), ACTIVE_PLAYER);
		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arboll, giantCarillion]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots, robeOfVines]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		
		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [arboll],
			generatedBy: warriorsBoots.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two cards are in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Hand has 1 card left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.map(card => card.card.name)).toEqual(['Arboll', 'Robe of Vines'], 'Cards in play are Arboll and Robe of Vines');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.find(card => card.card.name == 'Arboll').data.energy).toEqual(4, 'Arboll has 4 energy - 3 starting and one from Robe of Vines');

		expect(yaki.data.energy).toEqual(1, 'Yaki paid for Arboll');
	});

	it('Warpath (Orothe creatures)', () => {
		const ACTIVE_PLAYER = 29;
		const NON_ACTIVE_PLAYER = 12;

		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(15);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);

		const bookOfAges = new CardInGame(byName('Book of Ages'), ACTIVE_PLAYER);
		const typhoonOne = new CardInGame(byName('Typhoon'), ACTIVE_PLAYER);
		const typhoonTeo = new CardInGame(byName('Typhoon'), ACTIVE_PLAYER);
		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER);
		const giantParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER);

		const warriorsBoots = new CardInGame(byName('Warrior\'s Boots'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([bookOfAges, giantParathin, typhoonOne, typhoonTeo, deepHyren]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([whall]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([warriorsBoots]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: warriorsBoots,
			power: warriorsBoots.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		
		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [giantParathin],
			generatedBy: warriorsBoots.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(4, 'Hand has 1 card left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Giant Parathin', 'Card in play is Giant Parathin');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(10, 'Giant Parathin has 10 energy - its starting value');

		expect(whall.data.energy).toEqual(5, 'Whall paid for Giant Parathin');
	});
});

describe('Ancestral Flute', () => {
	it('Song of the Family', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(6);

		const flute = new CardInGame(byName('Ancestral Flute'), ACTIVE_PLAYER);

		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(4);
		const pharanTwo = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);
		const pharanThree = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);

		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [flute, pharan], [jaela]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([pharanTwo, pharanThree, xyxElder]);

		const powerAction = {
			type: ACTION_POWER,
			source: flute,
			power: flute.card.data.powers[0],
			generatedBy: flute.id,
		};
		
		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE);

		const creatureChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: flute.id,
		};

		gameState.update(creatureChoiceAction);

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE);
		expect(gameState.state.promptParams.cards.length).toEqual(2);
		expect(gameState.state.promptParams.cards.map(c => c.card)).toEqual(['Pharan', 'Pharan']);

		const cardsChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [pharanTwo, pharanThree],
			player: ACTIVE_PLAYER,
			generatedBy: flute.id,
		};

		gameState.update(cardsChoiceAction);

		expect(gameState.state.prompt).toEqual(false); // Game is in prompt state
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Ancestral Flute');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Pharan');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(c => c.card.name)).toEqual(['Pharan', 'Pharan']);
	});

	it('Song of the Family (Only one card chosen)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(6);

		const flute = new CardInGame(byName('Ancestral Flute'), ACTIVE_PLAYER);

		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(4);
		const pharanTwo = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);
		const pharanThree = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);

		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [flute, pharan], [jaela]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([pharanTwo, pharanThree, xyxElder]);

		const powerAction = {
			type: ACTION_POWER,
			source: flute,
			power: flute.card.data.powers[0],
			generatedBy: flute.id,
		};
		
		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE);

		const creatureChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: flute.id,
		};

		gameState.update(creatureChoiceAction);

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE);
		expect(gameState.state.promptParams.cards.length).toEqual(2);
		expect(gameState.state.promptParams.cards.map(c => c.card)).toEqual(['Pharan', 'Pharan']);

		const cardsChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [pharanTwo],
			player: ACTIVE_PLAYER,
			generatedBy: flute.id,
		};

		gameState.update(cardsChoiceAction);

		expect(gameState.state.prompt).toEqual(false); // Game is in prompt state
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Pharan');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Ancestral Flute');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Pharan');
	});
});

describe('Mirror Pendant', () => {
	it('Auraflection', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(7);
		const pendant = new CardInGame(byName('Mirror Pendant'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan, pendant], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const pendantAction = {
			type: ACTION_POWER,
			source: pendant,
			power: pendant.card.data.powers[0],
			player: ACTIVE_PLAYER,	
		};

		gameState.update(pendantAction);
		
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_POWER_ON_MAGI);

		const choosingPowerAction = {
			type: ACTION_RESOLVE_PROMPT,
			power: grega.card.data.powers[0],
			source: grega,
			player: ACTIVE_PLAYER,
			generatedBy: pendant.id,
		};

		gameState.update(choosingPowerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		};

		// gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeLessThan(7, 'Pharan now has less than 7 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeGreaterThan(0, 'Pharan now more than 0 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No cards in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).card.data.energy).toEqual(1, 'Grega now has 2 energy');
		expect(grega.data.actionsUsed).toEqual([]);
	});
});

describe('Book of Ages', () => {
	it('Lore', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);
		const bookOfAges = new CardInGame(byName('Book of Ages'), ACTIVE_PLAYER);

		const seaBarl = new CardInGame(byName('Sea Barl'), ACTIVE_PLAYER);
		const ormagon = new CardInGame(byName('Ormagon'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [bookOfAges], [ebylon]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([seaBarl, ormagon]);

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: bookOfAges,
			power: bookOfAges.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(ebylon.data.energy).toEqual(4, 'Ebylon has 4 energy left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Book of Ages', 'Book of Ages is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'One card in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Sea Barl', 'Sea Barl is in hand');
	});
});