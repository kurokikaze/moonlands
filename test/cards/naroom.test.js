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
} from '../../src/const.ts';

import {
	STEP_ENERGIZE,
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_CREATURES,
	STEP_PRS_SECOND,
	createZones,
} from '../utils';

describe('Vortex of Knowledge', () => {
	it('Casting Vortex of Knowledge (no region penalty)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [yaki]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
			new CardInGame(byName('Weebo'), ACTIVE_PLAYER),
			new CardInGame(byName('Water of Life'), ACTIVE_PLAYER),
			new CardInGame(byName('Book of Ages'), ACTIVE_PLAYER),
		]);

		gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([
			new CardInGame(byName('Fire Grag'), NON_ACTIVE_PLAYER),
			new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER),
			new CardInGame(byName('Flame Geyser'), NON_ACTIVE_PLAYER),
		]);

		const vortexOfKnowledge = new CardInGame(byName('Vortex of Knowledge'), ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vortexOfKnowledge]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: vortexOfKnowledge,
				player: ACTIVE_PLAYER,
			},
		};

		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(3, 'Active player has 3 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(3, 'Non-active player has 3 cards in deck');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Active player has only Vortex of Knowledge in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player has no cards in hand');
		expect(yaki.data.energy).toEqual(6, 'Yaki has 6 energy');

		gameState.update(playSpellAction);

		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card left in deck');
		expect(gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card left in deck');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Vortex of Knowledge', 'It\'s Vortex of Knowledge');
		expect(yaki.data.energy).toEqual(5, 'Yaki has 5 energy');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(2, 'Active player has 2 cards in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(2, 'Non-active player has 2 cards in hand');
	});
});

describe('Arboll', () => {
	it('Life channel', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: arboll,
			power: arboll.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: grega,
			generatedBy: arboll.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(grega.data.energy).toEqual(9, 'Grega now has 9 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'Arboll removed from play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arboll', 'Card in Player 1 discard is Arboll');
	});
});

describe('Balamant', () => {
	it('Hunt', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const balamant = new CardInGame(byName('Balamant'), ACTIVE_PLAYER).addEnergy(6);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [balamant], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: balamant,
			power: balamant.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: grega,
			generatedBy: balamant.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(balamant.data.energy).toEqual(4, 'Balamant now has 4 energy left');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(6, 'Grega now has 6 energy');
	});
});

describe('Carillion', () => {
	it('Resilience', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER);
		carillion.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), NON_ACTIVE_PLAYER);
		leafHyren.addEnergy(4);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([carillion, weebo, leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: carillion,
			target: weebo,
		};
        
		const attackHyrenAction = {
			type: ACTION_ATTACK,
			source: carillion,
			target: leafHyren,
		};
        
		gameState.update(attackAction);

		expect(carillion.data.energy).toEqual(5, 'Carillion loses no energy in the attack');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');

		carillion.clearAttackMarkers();

		gameState.update(attackHyrenAction);

		expect(carillion.data.energy).toEqual(1, 'Carillion loses 4 energy in the attack');
		expect(leafHyren.data.energy).toEqual(0, 'Hyren is toast');
	});

	it('Resilience (Cave Rudwot)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER);
		carillion.addEnergy(2);
		const caveRudwot = new CardInGame(byName('Cave Rudwot'), NON_ACTIVE_PLAYER);
		caveRudwot.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([carillion, caveRudwot]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: carillion,
			target: caveRudwot,
		};
        
		gameState.update(attackAction);

		expect(carillion.data.energy).toEqual(2, 'Carillion loses no energy in the attack');
		expect(caveRudwot.data.energy).toEqual(2, 'Cave Rudwot is at 2 energy');
	});

	it('Resilience (Carillion is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER);
		carillion.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), NON_ACTIVE_PLAYER);
		leafHyren.addEnergy(4);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([carillion, weebo, leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: carillion,
		};
        
		gameState.update(attackAction);

		expect(carillion.data.energy).toEqual(3, 'Carillion loses 2 energy in the attack, left at 3');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});
});

describe('Bhatar', () => {
	it('Charge (non-Underneath Creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const bhatar = new CardInGame(byName('Bhatar'), ACTIVE_PLAYER);
		bhatar.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bhatar, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: bhatar,
			target: weebo,
		};
        
		gameState.update(attackAction);

		expect(bhatar.data.energy).toEqual(4, 'bhatar gains 1 energy and loses 2 energy in attack, left at 4');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Charge (Bhatar is attacked by non-Underneath Creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const bhatar = new CardInGame(byName('Bhatar'), NON_ACTIVE_PLAYER);
		bhatar.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bhatar, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: bhatar,
		};
        
		gameState.update(attackAction);

		expect(bhatar.data.energy).toEqual(3, 'Bhatar loses 2 energy in attack, left at 3');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Charge (Underneath Creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const bhatar = new CardInGame(byName('Bhatar'), ACTIVE_PLAYER);
		bhatar.addEnergy(5);
		const agovo = new CardInGame(byName('Agovo'), NON_ACTIVE_PLAYER);
		agovo.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bhatar, agovo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: bhatar,
			target: agovo,
		};
        
		gameState.update(attackAction);

		expect(bhatar.data.energy).toEqual(6, 'Bhatar gains 3 energy and loses 2 energy in attack, left at 6');
		expect(agovo.data.energy).toEqual(0, 'Agovo is toast');
	});

	it('Charge (Bhatar is attacked by Underneath Creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const bhatar = new CardInGame(byName('Bhatar'), NON_ACTIVE_PLAYER);
		bhatar.addEnergy(5);
		const agovo = new CardInGame(byName('Agovo'), ACTIVE_PLAYER);
		agovo.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bhatar, agovo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: agovo,
			target: bhatar,
		};
        
		gameState.update(attackAction);

		expect(bhatar.data.energy).toEqual(3, 'Bhatar loses 2 energy in attack, left at 3');
		expect(agovo.data.energy).toEqual(0, 'Agovo is toast');
	});
});

describe('Furok', () => {
	it('Retrieve', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		yaki.addEnergy(5);

		const furok = new CardInGame(byName('Furok'), ACTIVE_PLAYER);
		furok.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(3);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([furok, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: furok,
			target: weebo,
		};
        
		gameState.update(attackAction);

		expect(furok.data.energy).toEqual(2, 'Furok loses 3 energy in attack, left at 2');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
		expect(yaki.data.energy).toEqual(7, 'Yaki gains 2 energy from Retrieve, left at 7');
	});

	it('Retrieve (Furok is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		yaki.addEnergy(5);

		const furok = new CardInGame(byName('Furok'), NON_ACTIVE_PLAYER);
		furok.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(3);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([furok, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: furok,
		};
        
		gameState.update(attackAction);

		expect(furok.data.energy).toEqual(2, 'Furok loses 3 energy in attack, left at 2');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
		expect(yaki.data.energy).toEqual(5, 'Yaki gains no energy');
	});
});

describe('Robe of Vines', () => {
	it('Strengthen', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const yaki = new CardInGame(byName('Yaki'), activePlayer);
		yaki.addEnergy(15);

		const weebo = new CardInGame(byName('Weebo'), activePlayer);
		const robeOfVines = new CardInGame(byName('Robe of Vines'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([weebo]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([yaki]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([robeOfVines]),
		];

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer,
		});
        
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Yaki\'s Energy is 15');

		gameState.update({
			type: ACTION_PLAY, 
			payload: {
				player: activePlayer,
				card: weebo,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'In play has two cards');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.name == 'Weebo')).toEqual(true, 'One of them is Weebo');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(13, 'Yaki\'s energy is 13');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.find(card => card.card.name == 'Weebo').data.energy).toEqual(3, 'Weebo\'s energy is 3');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(0, 'No cards in hand now');
	});

	it('Strenghten (opponent controls it)', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const grega = new CardInGame(byName('Grega'), activePlayer);
		grega.addEnergy(15);

		const arbolit = new CardInGame(byName('Arbolit'), activePlayer);
		const robeOfVines = new CardInGame(byName('Robe of Vines'), notActivePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([robeOfVines]),
		];

		const gameState = new State({
			zones,
			step: 3,
			activePlayer: 0,
		});
        
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Grega\'s Energy is 15');

		gameState.update({
			type: ACTION_PLAY, 
			payload: {
				player: activePlayer,
				card: arbolit,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'In play has two cards');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.name == 'Arbolit')).toEqual(true, 'One of them is Arbolit');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(14, 'Grega\'s energy is 14');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(1, 'Arbolit\'s energy is 1');
		expect(gameState.getZone(ZONE_TYPE_HAND, activePlayer).length).toEqual(0, 'No cards in hand now');
	});
});

describe('Rudwot', () => {
	it('Trample', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const rudwot = new CardInGame(byName('Rudwot'), ACTIVE_PLAYER);
		rudwot.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), NON_ACTIVE_PLAYER);
		leafHyren.addEnergy(4);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([rudwot, weebo, leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: rudwot,
			target: weebo,
		};
        
		const attackHyrenAction = {
			type: ACTION_ATTACK,
			source: rudwot,
			target: leafHyren,
		};
        
		gameState.update(attackAction);

		expect(rudwot.data.energy).toEqual(5, 'Rudwot loses 2 energy but gains 2 energy in the attack');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');

		rudwot.clearAttackMarkers();

		gameState.update(attackHyrenAction);

		expect(rudwot.data.energy).toEqual(1, 'Rudwot loses 4 energy in the attack, gaining none');
		expect(leafHyren.data.energy).toEqual(0, 'Hyren is toast');
	});

	it('Trample (Cave Rudwot)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const rudwot = new CardInGame(byName('Rudwot'), ACTIVE_PLAYER);
		rudwot.addEnergy(3);
		const caveRudwot = new CardInGame(byName('Cave Rudwot'), NON_ACTIVE_PLAYER);
		caveRudwot.addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([rudwot, caveRudwot]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: rudwot,
			target: caveRudwot,
		};
        
		gameState.update(attackAction);

		expect(rudwot.data.energy).toEqual(1, 'Rudwot loses 4 energy but gains 2 energy in the attack');
		expect(caveRudwot.data.energy).toEqual(0, 'Cave Rudwot is toast');
	});
});

describe('Hyren\'s Call', () => {
	it('Casting', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const oqua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER).addEnergy(10);
		const hyrensCall = new CardInGame(byName('Hyren\'s Call'), ACTIVE_PLAYER);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER);
		const paralith = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);
		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([hyrensCall]),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([deepHyren, paralith, bwill]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([oqua]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: hyrensCall,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playSpellAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_DECK, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [deepHyren],
			generatedBy: hyrensCall.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'Deck has 2 cards left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Deep Hyren', 'Card is Deep Hyren');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(6, 'Deep Hyren has 6 energy - its starting value');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.attacked).toEqual(100, 'Deep Hyren will not be able to attack this turn');
	});
});

describe('Giant Carillion', () => {
	it('Stomp', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const greatCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER).addEnergy(8);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [greatCarillion, pharan]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: greatCarillion,
			power: greatCarillion.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: pharan,
			generatedBy: greatCarillion.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one creature in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Giant Carillion', 'It is Giant Carillion');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 2 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Pharan', 'It is Pharan');
	});
});

describe('Balamant Pup', () => {
	it('Support (target is not Balamant)', () => {
		const ACTIVE_PLAYER = 421;
		const NON_ACTIVE_PLAYER = 160;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(7);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const balamantPup = new CardInGame(byName('Balamant Pup'), ACTIVE_PLAYER).addEnergy(2);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll, balamantPup], [yaki]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: balamantPup,
			power: balamantPup.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: arboll,
			player: ACTIVE_PLAYER,
			generatedBy: balamantPup.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is prompting you for a single creature or Magi');

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state anymore');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player discard has one card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Balamant Pup', 'It is Balamant Pup');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arboll.id).data.energy).toEqual(4, 'Arboll now has 4 energy');
	});

	it('Support (target is a Balamant)', () => {
		const ACTIVE_PLAYER = 421;
		const NON_ACTIVE_PLAYER = 160;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(7);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(2);
		const balamantPup = new CardInGame(byName('Balamant Pup'), ACTIVE_PLAYER).addEnergy(2);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, balamantPup], [yaki]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: balamantPup,
			power: balamantPup.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: balamantPup.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is prompting you for a single creature or Magi');

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state anymore');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player discard has one card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Balamant Pup', 'It is Balamant Pup');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(lavaBalamant.id).data.energy).toEqual(6, 'Lava Balamant now has 6 energy');
	});
});

describe('Pruitt', () => {
	it('Refresh', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(4);
		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(7);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [pruitt]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: pruitt,
			power: pruitt.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: pruitt.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(10, 'Pharan now has less than 7 energy');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).card.data.energy).toEqual(2, 'Pruitt now has 2 energy');
	});
});

describe('Weebo', () => {
	it('Vitalize', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(3);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, fireGrag]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: weebo,
			power: weebo.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: fireGrag,
			generatedBy: weebo.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(weebo.id).data.energy).toEqual(1, 'Weebo now has 1 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(fireGrag.id).data.energy).toEqual(6, 'Fire Grag restored to 6 energy');
	});
});

describe('Stagadan', () => {
	it('Agility', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const stagadan = new CardInGame(byName('Stagadan'), ACTIVE_PLAYER);
		stagadan.addEnergy(3);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER);
		arbolit.addEnergy(3);

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		yaki.addEnergy(10);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
				new Zone('In play', ZONE_TYPE_IN_PLAY).add([stagadan, arbolit, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackByArbolitAction = {
			type: ACTION_ATTACK,
			source: arbolit,
			target: yaki,
		};

		const attackByStagadanAction = {
			type: ACTION_ATTACK,
			source: stagadan,
			target: yaki,
		};

		gameState.update(attackByArbolitAction);

		expect(yaki.data.energy).toEqual(10, 'Yaki still has 10 energy left');

		gameState.update(attackByStagadanAction);

		expect(yaki.data.energy).toEqual(7, 'Yaki now has 7 energy left');
	});
});

describe('Yaki', () => {
	it('Double Strike', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		yaki.addEnergy(10);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: grega,
		};

		gameState.update(attackAction);

		expect(weebo.data.energy).toEqual(2, 'Weebo still has 2 energy');
		expect(grega.data.energy).toEqual(8, 'Grega has 8 energy left');

		gameState.update(attackAction);

		expect(weebo.data.energy).toEqual(2, 'Weebo still has 2 energy');
		expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (second attack successful)');

		gameState.update(attackAction);

		expect(weebo.data.energy).toEqual(2, 'Weebo still has 2 energy');
		expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (third attack did not happen)');
	});
});

describe('Timber Hyren', () => {
	it('Tribute', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		yaki.addEnergy(10);
		const timberHyren = new CardInGame(byName('Timber Hyren'), ACTIVE_PLAYER);
		timberHyren.addEnergy(1);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [timberHyren], [yaki]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: timberHyren,
			power: timberHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const numberPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: '4',
			player: ACTIVE_PLAYER,
			generatedBy: timberHyren.id,
		};

		gameState.update(powerAction);
		// After this, engine will ask us how much energy do we want to Tribute
		// Let's say 4
		gameState.update(numberPromptAction);

		expect(timberHyren.data.energy).toEqual(5, 'Timber Hyren got 4 energy and now has 5');
		expect(yaki.data.energy).toEqual(6, 'Yaki lost 4 energy and now has 6');
	});

	it('Tribute (draining Magi to 0)', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		yaki.addEnergy(3);
		const timberHyren = new CardInGame(byName('Timber Hyren'), ACTIVE_PLAYER);
		timberHyren.addEnergy(1);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [timberHyren], [yaki]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: timberHyren,
			power: timberHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const numberPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 3,
			player: ACTIVE_PLAYER,
			generatedBy: timberHyren.id,
		};

		gameState.update(powerAction);
		// After this, engine will ask us how much energy do we want to Tribute
		// Max will be set to 3 (our Magi energy)
		// Let's say we need all of it
		expect(gameState.state.promptParams.max).toEqual(3, 'Prompt params signal that we may Tribute up to 3 energy');
		gameState.update(numberPromptAction);

		expect(timberHyren.data.energy).toEqual(4, 'Timber Hyren got 3 energy and now has 4');
		expect(yaki.data.energy).toEqual(0, 'Yaki lost 3 energy and now has 0');
	});
});

describe('Orwin\'s Gaze', () => {
	it('Casting', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(10);
		const coralHyren = new CardInGame(byName('Coral Hyren'), ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		const orwinsGaze = new CardInGame(byName('Orwin\'s Gaze'), ACTIVE_PLAYER);

		const sinder = new CardInGame(byName('Sinder'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [yaki]);
		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		// Deck content to verify card goes to the top of the deck, not the bottom
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([weebo]);
		gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([coralHyren]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([orwinsGaze]);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([sinder]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: orwinsGaze,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playSpellAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine prompts us for the card');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Engine waits for a Card from discard');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(1, 'One card in player deck');

		const choicePromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [coralHyren],
			player: ACTIVE_PLAYER,
			generatedBy: orwinsGaze.id,
		};

		gameState.update(choicePromptAction);

		expect(gameState.state.prompt).toEqual(false, 'Prompt is resolved');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Player discard pile contains just one card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Orwin\'s Gaze', 'It is Orwin\'s Gaze');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'Two cards in player deck');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).cards[0].card.name).toEqual('Coral Hyren', 'Coral Hyren is on top');
	});
});

describe('Eebit', () => {
	it('Escape (Eebit is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom side
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(10);
		const eebit = new CardInGame(byName('Eebit'), NON_ACTIVE_PLAYER).addEnergy(1);

		// Cald side
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([eebit, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: kelthet,
			target: eebit,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Kelthet is still on the field');
	
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player has no cards in discard');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has one card in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Eebit', 'It is Eebit');
	});

	it('Escape (Eebit attacks)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const eebit = new CardInGame(byName('Eebit'), ACTIVE_PLAYER).addEnergy(1);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([eebit, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: eebit,
			target: kelthet,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Kelthet is still on the field');
	
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'Active player has no cards in discard');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Active player has one card in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Eebit', 'It is Eebit');
	});
});

describe('Plith', () => {
	it('Warning (magi is not Evu)', () => {
		const ACTIVE_PLAYER = 44;
		const NON_ACTIVE_PLAYER = 21;

		// Naroom/Orothe side
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(10);
		const plith = new CardInGame(byName('Plith'), NON_ACTIVE_PLAYER).addEnergy(1);
		const grow = new CardInGame(byName('Grow'), NON_ACTIVE_PLAYER);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER);

		// Cald side
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([grow, arboll]),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([plith, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: kelthet,
			target: plith,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Plith', 'It is Plith');

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has drawn 1 card');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Grow', 'It is Grow');		
	});

	it('Warning (magi is Evu)', () => {
		const ACTIVE_PLAYER = 44;
		const NON_ACTIVE_PLAYER = 21;

		// Naroom/Orothe side
		const evu = new CardInGame(byName('Evu'), NON_ACTIVE_PLAYER).addEnergy(10);
		const plith = new CardInGame(byName('Plith'), NON_ACTIVE_PLAYER).addEnergy(1);
		const grow = new CardInGame(byName('Grow'), NON_ACTIVE_PLAYER);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER);

		// Cald side
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([grow, arboll]),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([evu]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([plith, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: kelthet,
			target: plith,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Plith', 'It is Plith');

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(2, 'Non-active player has drawn 2 cards');
	});
});

describe('Evu', () => {
	it('Lore', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		// Naroom player
		const evu = new CardInGame(byName('Evu'), ACTIVE_PLAYER).addEnergy(5);

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		const furok = new CardInGame(byName('Furok'), ACTIVE_PLAYER);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [evu]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([weebo, furok, arboll]);
		gameState.getZone(ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([arbolit]);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(3, 'Active player drawn 3 cards');
	});
});