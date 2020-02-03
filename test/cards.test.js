/* global expect, describe, it */
const moonlands = require('../src/index');
const {byName} = require('../src/cards');
const CardInGame = require('../src/classes/CardInGame');
const Zone = require('../src/classes/Zone');

const {
	ACTION_PLAY,
	ACTION_ATTACK,
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,

	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_NUMBER,

	RESTRICTION_REGION,
	REGION_OROTHE,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
} = require('../src/const');

/* eslint-disable no-unused-vars */
const STEP_ENERGIZE = 0;
const STEP_PRS_FIRST = 1;
const STEP_ATTACK = 2;
const STEP_CREATURES = 3;
const STEP_PRS_SECOND = 4;
const STEP_DRAW = 5;
/* eslint-enable no-unused-vars */

const createZones = (player1, player2, creatures = [], activeMagi = []) => [
	new Zone('Player 1 hand', ZONE_TYPE_HAND, player1),
	new Zone('Player 2 hand', ZONE_TYPE_HAND, player2),
	new Zone('Player 1 deck', ZONE_TYPE_DECK, player1),
	new Zone('Player 2 deck', ZONE_TYPE_DECK, player2),
	new Zone('Player 1 discard', ZONE_TYPE_DISCARD, player1),
	new Zone('Player 2 discard', ZONE_TYPE_DISCARD, player2),
	new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, player1).add(activeMagi),
	new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, player2),
	new Zone('Player 1 active magi', ZONE_TYPE_MAGI_PILE, player1),
	new Zone('Player 2 active magi', ZONE_TYPE_MAGI_PILE, player2),
	new Zone('In play', ZONE_TYPE_IN_PLAY, null).add(creatures),
];

describe('Vortex of Knowledge', () => {
	it('Casting Vortex of Knowledge (no region penalty)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [yaki]);

		const gameState = new moonlands.State({
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

describe('Alaban', () => {
	it('Undream', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(6);
		const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: alaban,
			power: alaban.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: caveHyren,
			generatedBy: alaban.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Alaban', 'Alaban is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'One creature in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Cave Hyren', 'Cave Hyren is in hand');
	});

	it('Undream (opponents creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(6);
		const caveHyren = new CardInGame(byName('Cave Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: alaban,
			power: alaban.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: caveHyren,
			generatedBy: alaban.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Alaban', 'Alaban is in play');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'One creature in opponents hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Cave Hyren', 'Cave Hyren is in opponents hand');
	});
});

describe('Arbolit', () => {
	it('Healing Flame (own creature)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(2);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: arbolit,
			power: arbolit.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: fireGrag,
			generatedBy: arbolit.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(fireGrag.id).data.energy).toEqual(7, 'Fire Grag now has 7 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
	});

	it('Healing Flame (opponent creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(2);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, pharan]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: arbolit,
			power: arbolit.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: pharan,
			generatedBy: arbolit.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(7, 'Pharan now has less than 7 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
	});
});

describe('Arboll', () => {
	it('Life channel', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll], [grega]);

		const gameState = new moonlands.State({
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

		const gameState = new moonlands.State({
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

describe('Cave Hyren', () => {
	it('Energy Transfer', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, fireGrag]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: caveHyren,
			power: caveHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const costChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 3,
			generatedBy: caveHyren.id,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: fireGrag,
			generatedBy: caveHyren.id,
		};

		gameState.update(powerAction);
		gameState.update(costChoiceAction);
		gameState.update(targetingAction);

		expect(caveHyren.data.energy).toEqual(2, 'Cave Hyren now has 2 energy');
		expect(fireGrag.data.energy).toEqual(5, 'Fire Grag restored to 5 energy');
	});
});

describe('Diobor', () => {
	it('Fireball', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(6);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, diobor]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: diobor,
			power: diobor.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: weebo,
			generatedBy: diobor.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(weebo.id).data.energy).toEqual(1, 'Weebo now has 1 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one card is now in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Weebo', 'Card in play is Weebo');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one card is now in player one discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Diobor', 'Card in player one discard is Diobor');
	});

	it('Energy Transfer', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(6);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [diobor], [grega]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: diobor,
			power: diobor.card.data.powers[1],
			player: ACTIVE_PLAYER,
		};

		const costChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 3,
			generatedBy: diobor.id,
		};

		gameState.update(powerAction);
		gameState.update(costChoiceAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(diobor.id).data.energy).toEqual(3, 'Diobor now has 3 energy left');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(13, 'Grega now has 13 energy');
	});
});

describe('Drakan', () => {
	it('Thermal Blast', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const drakan = new CardInGame(byName('Drakan'), ACTIVE_PLAYER).addEnergy(6);
		const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(7);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [drakan, caveHyren]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: drakan,
			power: drakan.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: caveHyren,
			generatedBy: drakan.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(caveHyren.data.energy).toBeLessThan(7, 'Cave Hyren now has <7 energy');
		expect(caveHyren.data.energy).toBeGreaterThan(0, 'Cave Hyren now has >0 energy');
		expect(drakan.data.energy).toEqual(3, 'Drakan has now 3 energy');
	});
});

describe('Ayebaw', () => {
	it('can attack twice per turn', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER);
		ayebaw.addEnergy(2);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: ayebaw,
			target: grega,
		};

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
		expect(grega.data.energy).toEqual(8, 'Grega has 8 energy left');

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
		expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (second attack connected)');

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
		expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (third attack did not happen)');
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

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
			source: carillion,
			target: weebo,
		};
        
		const attackHyrenAction = {
			type: moonlands.ACTION_ATTACK,
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

	it('Resilience (Carillion is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER);
		carillion.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const leafHyren = new CardInGame(byName('Leaf Hyren'), NON_ACTIVE_PLAYER);
		leafHyren.addEnergy(4);

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: carillion,
		};
        
		gameState.update(attackAction);

		expect(carillion.data.energy).toEqual(3, 'Carillion loses 2 energy in the attack, left at 3');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});
});

describe('Lava Balamant', () => {
	it('Charge', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER);
		lavaBalamant.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([lavaBalamant, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: lavaBalamant,
			target: weebo,
		};
        
		gameState.update(attackAction);

		expect(lavaBalamant.data.energy).toEqual(4, 'Lava Balamant gains 1 energy and loses 2 energy in attack, left at 4');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Charge (Lava Balamant is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER);
		lavaBalamant.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([lavaBalamant, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: lavaBalamant,
		};
        
		gameState.update(attackAction);

		expect(lavaBalamant.data.energy).toEqual(3, 'Lava Balamant loses 2 energy in attack, left at 3');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
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

		const gameState = new moonlands.State({
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
		gameState.enableDebug();

		const attackAction = {
			type: moonlands.ACTION_ATTACK,
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

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: furok,
		};
        
		gameState.update(attackAction);

		expect(furok.data.energy).toEqual(2, 'Furok loses 3 energy in attack, left at 2');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
		expect(yaki.data.energy).toEqual(5, 'Yaki gains no energy');
	});
});

describe('Magma Armor', () => {
	it('Defense', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(8);
		const magmaArmor = new CardInGame(byName('Magma Armor'), NON_ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(1);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo, magmaArmor]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackMagiAction = {
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: grega,
		};
        
		gameState.update(attackMagiAction);

		expect(weebo.data.energy).toEqual(1, 'Weebo loses no energy in the attack');
		expect(grega.data.energy).toEqual(9, 'Grega loses 1 energy in attack but gains 2 from Magma Armor');
	});

	it('Defense, but attacker controls the Armor', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(8);
		const magmaArmor = new CardInGame(byName('Magma Armor'), ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(1);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo, magmaArmor]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackMagiAction = {
			type: moonlands.ACTION_ATTACK,
			source: weebo,
			target: grega,
		};
        
		gameState.update(attackMagiAction);

		expect(weebo.data.energy).toEqual(1, 'Weebo loses no energy in the attack');
		expect(grega.data.energy).toEqual(7, 'Grega loses 1 energy in attack and gains none from opponents Magma Armor');
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

		const gameState = new moonlands.State({
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

		const gameState = new moonlands.State({
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

describe('Magma Hyren', () => {
	it('Fireball', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const magmaHyren = new CardInGame(byName('Magma Hyren'), ACTIVE_PLAYER);
		magmaHyren.addEnergy(3);

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(1);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo, magmaHyren]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const fireballWeeboAction = {
			type: ACTION_POWER,
			source: magmaHyren,
			power: magmaHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetWeeboAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: weebo,
			generatedBy: magmaHyren.id,
		};
        
		gameState.update(fireballWeeboAction);
		gameState.update(targetWeeboAction);

		expect(magmaHyren.data.energy).toEqual(2, 'Magma Hyren has 2 energy left');        
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Healing Flame', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const magmaHyren = new CardInGame(byName('Magma Hyren'), ACTIVE_PLAYER);
		magmaHyren.addEnergy(3);

		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER);
		fireGrag.addEnergy(2);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([magmaHyren, fireGrag]),
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

		const targetFireGragAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: fireGrag,
			generatedBy: magmaHyren.id,
		};
        
		gameState.update(healingFlameAction);

		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, 'Prompt type is correct');
		expect(gameState.state.promptParams.source.id).toEqual(magmaHyren.id, 'Exclusion for prompt is passed correctly');

		gameState.update(targetFireGragAction);

		expect(magmaHyren.data.energy).toEqual(2, 'Magma Hyren has 2 energy left');        
		expect(fireGrag.data.energy).toEqual(4, 'Fire Grag has 4 energy');
	});
});

describe('Ashgar', () => {
	it('Nerve', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const ashgar = new CardInGame(byName('Ashgar'), NON_ACTIVE_PLAYER);
		ashgar.addEnergy(6);

		const flameGeyser = new CardInGame(byName('Flame Geyser'), NON_ACTIVE_PLAYER);

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		yaki.addEnergy(7);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([yaki]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([ashgar]),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
				new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([flameGeyser]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: ashgar,
		};

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player has no cards in hand');

		gameState.update(attackAction);

		expect(ashgar.data.energy).toEqual(4, 'Ashgar has 4 energy left');        
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has drawn a card');        
		expect(weebo.data.energy).toEqual(2, 'Weebo still has 2 energy');
	});
});

describe('Quor', () => {
	it('Battering Ram', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const ashgar = new CardInGame(byName('Ashgar'), ACTIVE_PLAYER);
		ashgar.addEnergy(6);

		const quor = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		quor.addEnergy(3);

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);
		yaki.addEnergy(7);

		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([ashgar]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
				new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([quor, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: quor,
			target: weebo,
		};

		gameState.update(attackAction);

		expect(quor.data.energy).toEqual(1, 'Quor has 1 energy left');        
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
		expect(yaki.data.energy).toEqual(5, 'Yaki lost 2 energy to Quor ability');
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

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
			source: rudwot,
			target: weebo,
		};
        
		const attackHyrenAction = {
			type: moonlands.ACTION_ATTACK,
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
});

describe('Giant Parathin', () => {
	it('Interchange', () => {
		const ACTIVE_PLAYER = 5;
		const NON_ACTIVE_PLAYER = 15;

		const giantParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER).addEnergy(10);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [giantParathin], [grega]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([yaki]);

		const powerAction = {
			type: ACTION_POWER,
			source: giantParathin,
			power: giantParathin.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Grega', 'Grega is active Magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Yaki', 'Yaki is in pile');

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No cards in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Yaki', 'Yaki is active Magi');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(14, 'Yaki has 14 energy');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Grega', 'Grega is in pile');
	});
});

describe('Giant Carillion', () => {
	it('Stomp', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const greatCarillion = new CardInGame(byName('Giant Carillion'), ACTIVE_PLAYER).addEnergy(8);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [greatCarillion, pharan]);

		const gameState = new moonlands.State({
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

describe('Grega', () => {
	it('Thermal blast (target is creature)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(7);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [grega]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: grega,
			power: grega.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeLessThan(7, 'Pharan now has less than 7 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeGreaterThan(0, 'Pharan now more than 0 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No cards in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).card.data.energy).toEqual(2, 'Grega now has 2 energy');
	});

	it('Thermal blast (target is Magi)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(7);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [grega]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: grega,
			power: grega.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: yaki,
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(7, 'Pharan now has less than 7 energy');

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).byId(yaki.id).data.energy).toBeLessThan(7, 'Yaki now has less than 7 energy');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).byId(yaki.id).data.energy).toBeGreaterThan(0, 'Yaki now more than 0 energy');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No cards in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).card.data.energy).toEqual(2, 'Grega now has 2 energy');
	});
});

describe('Sinder', () => {
	it('Refresh', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(3);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit], [sinder]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: sinder,
			power: sinder.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: arbolit,
			generatedBy: sinder.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(arbolit.data.energy).toEqual(5, 'Arbolit refreshed to 5 energy');
		expect(sinder.data.energy).toEqual(3, 'Sinder paid 1 energy for power');
	});
});

describe('Weebo', () => {
	it('Vitalize', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(3);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, fireGrag]);

		const gameState = new moonlands.State({
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

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
			source: arbolit,
			target: yaki,
		};

		const attackByStagadanAction = {
			type: moonlands.ACTION_ATTACK,
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

		const gameState = new moonlands.State({
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
			type: moonlands.ACTION_ATTACK,
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

		const gameState = new moonlands.State({
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
			number: 4,
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

		const gameState = new moonlands.State({
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

describe('Quor Pup', () => {
	it('Charge', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		sinder.addEnergy(10);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);
		quorPup.addEnergy(2);
		const weebo = new CardInGame(byName('Weebo', NON_ACTIVE_PLAYER));
		weebo.addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [quorPup, weebo], [sinder]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: quorPup,
			target: weebo,
			player: ACTIVE_PLAYER,
		};

		const numberPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 2,
			player: ACTIVE_PLAYER,
			generatedBy: quorPup.id,
		};

		gameState.update(attackAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine stops the attack and prompts us for Charge amount');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_NUMBER, 'Engine waits specifically for Number');
		expect(gameState.state.promptParams).toEqual({min: 0, max: 2}, 'Engine specifies min and max for expected number');

		gameState.update(numberPromptAction);

		expect(quorPup.data.energy).toEqual(2, 'Quor Pup lost 2 energy in attack but was Charged by 2 and now has 2 left');
		expect(sinder.data.energy).toEqual(8, 'Sinder gave 2 energy to Quor Pup in attack, and now has 8');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Charge (attack target is Magi)', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		sinder.addEnergy(10);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);
		quorPup.addEnergy(2);
		const yaki = new CardInGame(byName('Yaki', NON_ACTIVE_PLAYER));
		yaki.addEnergy(12);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [quorPup], [sinder]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
	

		const attackAction = {
			type: ACTION_ATTACK,
			source: quorPup,
			target: yaki,
			player: ACTIVE_PLAYER,
		};

		const numberPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 2,
			player: ACTIVE_PLAYER,
			generatedBy: quorPup.id,
		};

		gameState.update(attackAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine stops the attack and prompts us for Charge amount');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_NUMBER, 'Engine waits specifically for Number');
		expect(gameState.state.promptParams).toEqual({min: 0, max: 2}, 'Engine specifies min and max for expected number');

		gameState.update(numberPromptAction);

		expect(quorPup.data.energy).toEqual(4, 'Quor Pup lost no energy in attack on Magi and was Charged by 2 and now has 4');
		expect(sinder.data.energy).toEqual(8, 'Sinder gave 2 energy to Quor Pup in attack, and now has 8');
		expect(yaki.data.energy).toEqual(8, 'Yaki lost 4 because Quor Pup was charged before damage, so she is at 8');
	});
});

describe('Coral Hyren', () => {
	it('Spelltap', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		sinder.addEnergy(10);
		const coralHyren = new CardInGame(byName('Coral Hyren'), ACTIVE_PLAYER);
		coralHyren.addEnergy(2);
		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER);
		deepHyren.addEnergy(2);
		const submerge = new CardInGame(byName('Submerge'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [coralHyren, deepHyren], [sinder]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([submerge]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: submerge,
				player: ACTIVE_PLAYER,
			},
		};

		const targetPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: deepHyren,
			player: ACTIVE_PLAYER,
			generatedBy: submerge.id,
		};

		gameState.update(playSpellAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine stops the attack and prompts us for Charge amount');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED, 'Engine waits for Creature with specified parameters');
		expect(gameState.state.promptParams).toEqual(
			{restriction: RESTRICTION_REGION, restrictionValue: REGION_OROTHE},
			'Engine wants us to choose specifically Orothe creature',
		);

		gameState.update(targetPromptAction);

		expect(deepHyren.data.energy).toEqual(5, 'Deep Hyren got 3 energy from Submerge, now at 5');
		expect(sinder.data.energy).toEqual(7, 'Sinder paid 3 for Submerge (2 + region penalty)');
		expect(coralHyren.data.energy).toEqual(3, 'Coral Hyren got 1 energy from Spelltap and now at 3');		
	});

	it('Spelltap (not activating on non-orothe spell)', () => {
		const ACTIVE_PLAYER = 100;
		const NON_ACTIVE_PLAYER = 1;
		const HYREN_STARTING_ENERGY = 2;
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);
		sinder.addEnergy(10);
		const coralHyren = new CardInGame(byName('Coral Hyren'), ACTIVE_PLAYER);
		coralHyren.addEnergy(HYREN_STARTING_ENERGY);
		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER);
		deepHyren.addEnergy(3);
		const fireball = new CardInGame(byName('Fire Ball'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [coralHyren, deepHyren], [sinder]);

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fireball]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: fireball,
				player: ACTIVE_PLAYER,
			},
		};

		const targetPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: deepHyren,
			player: ACTIVE_PLAYER,
			generatedBy: fireball.id,
		};

		gameState.update(playSpellAction);

		expect(gameState.state.prompt).toEqual(true, 'Engine stops the attack and prompts us for Charge amount');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, 'Engine waits for any Creature or Magi');
		expect(gameState.state.promptParams).toEqual({}, 'Engine gives us no restrictions on target');

		// We'll Fireball our own Deep Hyren, for simplicity's sake
		gameState.update(targetPromptAction);

		expect(deepHyren.data.energy).toEqual(1, 'Deep Hyren got hit by 2 from Fireball. Poor thing.');
		expect(sinder.data.energy).toEqual(8, 'Sinder paid 2 for Fire Ball');
		expect(coralHyren.data.energy).toEqual(
			HYREN_STARTING_ENERGY,
			'Coral Hyren did not got 1 energy from Fire Ball as it is not an Orothe spell',
		);
	});
});
