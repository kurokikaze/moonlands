/* global expect, describe, it */
import {State} from '../src/index.ts';
import {byName} from '../src/cards.ts';
import CardInGame from '../src/classes/CardInGame.ts';
import Zone from '../src/classes/Zone.ts';

import {
	ACTION_PLAY,
	ACTION_ATTACK,
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,
	ACTION_PASS,

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
	PROPERTY_CONTROLLER,
	PROPERTY_ABLE_TO_ATTACK,
	PROPERTY_CAN_BE_ATTACKED,

	RESTRICTION_REGION,
	REGION_OROTHE,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
} from '../src/const.ts';

/* eslint-disable no-unused-vars */
import {
	STEP_ENERGIZE,
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_CREATURES,
	STEP_PRS_SECOND,
	createZones,
} from './utils';

/* eslint-enable no-unused-vars */

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

describe('Shockwave', () => {
	it('Casting Shockwave', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(12);
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(4);
		const rudwot = new CardInGame(byName('Rudwot'), NON_ACTIVE_PLAYER).addEnergy(10);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(1);
		const seaBarl = new CardInGame(byName('Sea Barl'), NON_ACTIVE_PLAYER).addEnergy(4);
		const shockwave = new CardInGame(byName('Shockwave'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [rudwot, arboll, seaBarl], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([shockwave]);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: shockwave,
				player: ACTIVE_PLAYER,
			},
		};

		expect(grega.data.energy).toEqual(12, 'Grega has 12 energy');

		gameState.update(playSpellAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: rudwot,
			generatedBy: shockwave.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(grega.data.energy).toEqual(6, 'Grega has 6 energy');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One creature in NAP discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Rudwot', 'It is Rudwot');
	});
});

describe('Flame Geyser', () => {
	it('Casting Flame Geyser', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(12);
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(4);
		const rudwot = new CardInGame(byName('Rudwot'), NON_ACTIVE_PLAYER).addEnergy(1);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(1);
		const seaBarl = new CardInGame(byName('Sea Barl'), NON_ACTIVE_PLAYER).addEnergy(4);
		const flameGeyser = new CardInGame(byName('Flame Geyser'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [rudwot, arboll, seaBarl], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([flameGeyser]);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const vortexOfKnowledge = new CardInGame(byName('Vortex of Knowledge'), ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vortexOfKnowledge]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: flameGeyser,
				player: ACTIVE_PLAYER,
			},
		};

		expect(grega.data.energy).toEqual(12, 'Grega has 12 energy');
		expect(pruitt.data.energy).toEqual(4, 'Pruitt has 4 energy');

		gameState.update(playSpellAction);

		expect(grega.data.energy).toEqual(2, 'Grega has 2 energy');
		expect(pruitt.data.energy).toEqual(1, 'Pruitt has 1 energy');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY, null).length).toEqual(1, 'Only one creature stayed in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY, null).card.card.name).toEqual('Sea Barl', 'It is Sea Barl');
	});
});

describe('Valkan', () => {
	it('Casting Flame Geyser (by Valkan)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const valkan = new CardInGame(byName('Valkan'), ACTIVE_PLAYER).addEnergy(12);
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(4);
		const rudwot = new CardInGame(byName('Rudwot'), NON_ACTIVE_PLAYER).addEnergy(1);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(1);
		const seaBarl = new CardInGame(byName('Sea Barl'), NON_ACTIVE_PLAYER).addEnergy(6);
		const flameGeyser = new CardInGame(byName('Flame Geyser'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [rudwot, arboll, seaBarl], [valkan]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([flameGeyser]);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const vortexOfKnowledge = new CardInGame(byName('Vortex of Knowledge'), ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vortexOfKnowledge]);

		const playSpellAction = {
			type: ACTION_PLAY,
			payload: {
				card: flameGeyser,
				player: ACTIVE_PLAYER,
			},
		};

		expect(valkan.data.energy).toEqual(12, 'Valkan has 12 energy');
		expect(pruitt.data.energy).toEqual(4, 'Pruitt has 4 energy');

		gameState.update(playSpellAction);

		expect(valkan.data.energy).toEqual(2, 'Valkan has 2 energy');
		expect(pruitt.data.energy).toEqual(1, 'Pruitt has 1 energy');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY, null).length).toEqual(1, 'Only one creature stayed in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY, null).card.card.name).toEqual('Sea Barl', 'It is Sea Barl');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY, null).card.data.energy).toEqual(1, 'Sea Barl has 1 energy left (starting 6, -3 for Flame Geyser, additional -2 for Valkan)');
	});
});

describe('Alaban', () => {
	it('Undream', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(6);
		const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

		const gameState = new State({
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
		const trug = new CardInGame(byName('Trug'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([trug]);
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
		expect(trug.data.energy).toEqual(2, 'Trug energy is not changed, Cave Hyren energy was discarded');
	});
});

describe('Motash\'s Staff', () => {
	it('Returns energy to Magi when creature is returned to hand', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(7);
		const caveHyren = new CardInGame(byName('Cave Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);
		const trug = new CardInGame(byName('Trug'), NON_ACTIVE_PLAYER).addEnergy(5);
		const motashsStaff = new CardInGame(byName('Motash\'s Staff'), NON_ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban, motashsStaff]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([trug]);

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

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two cards in play');

		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'One creature in opponents hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Cave Hyren', 'Cave Hyren is in opponents hand');
		expect(trug.data.energy).toEqual(7, 'Energy from Cave Hyren was placed onto Trug instead of being discarded');
	});
});

describe('Arbolit', () => {
	it('Healing Flame (own creature)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(2);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag]);

		const gameState = new State({
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

		const gameState = new State({
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

describe('Orpus', () => {
	it('Relic Guard (use effect)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);
		const bookOfAges = new CardInGame(byName('Book of Ages'), NON_ACTIVE_PLAYER);
		const orpus = new CardInGame(byName('Orpus'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [bookOfAges, orpus], [ebylon]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: ebylon,
			power: ebylon.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_RELIC);
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: bookOfAges,
			generatedBy: ebylon.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);

		const allowReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: orpus.id,
		};

		gameState.update(allowReplaceEffect);

		expect(gameState.state.prompt).toEqual(false);

		expect(gameState.state.savedActions).toHaveLength(0);
		expect(gameState.state.mayEffectActions).toHaveLength(0);
		expect(gameState.state.fallbackActions).toHaveLength(0);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0);
		expect(orpus.data.energy).toEqual(2);
	});

	it('Relic Guard (do not use effect)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);
		const bookOfAges = new CardInGame(byName('Book of Ages'), NON_ACTIVE_PLAYER);
		const orpus = new CardInGame(byName('Orpus'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [bookOfAges, orpus], [ebylon]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: ebylon,
			power: ebylon.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_RELIC);
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: bookOfAges,
			generatedBy: ebylon.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);

		const denyReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: false,
			generatedBy: orpus.id,
		};

		gameState.update(denyReplaceEffect);

		expect(gameState.state.prompt).toEqual(false);

		expect(gameState.state.savedActions).toHaveLength(0);
		expect(gameState.state.mayEffectActions).toHaveLength(0);
		expect(gameState.state.fallbackActions).toHaveLength(0);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Book of Ages');
		expect(orpus.data.energy).toEqual(3);
	});
});

describe('Crystal Arbol', () => {
	it('Healing Light (Underneath creature)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const crystalArboll = new CardInGame(byName('Crystal Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [crystalArboll, mushroomHyren]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: crystalArboll,
			power: crystalArboll.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: mushroomHyren,
			generatedBy: crystalArboll.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');

		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(mushroomHyren.id).data.energy).toEqual(9, 'Mushroom Hyren now has 9 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Crystal Arboll', 'Card in Player 1 discard is Crystal Arboll');
	});

	it('Healing Light (Non-Underneath Creature)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const crystalArboll = new CardInGame(byName('Crystal Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(3);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [crystalArboll, pharan]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: crystalArboll,
			power: crystalArboll.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: pharan,
			generatedBy: crystalArboll.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(5, 'Pharan now has 5 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Crystal Arboll', 'Card in Player 1 discard is Crystal Arboll');
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

describe('Fog Bank', () => {
	it('Prevents creature from being attacked for two opponents turns', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const fogBank = new CardInGame(byName('Fog Bank'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(7);
		const nimbulo = new CardInGame(byName('Nimbulo'), NON_ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fogBank]);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);

		const castingAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: fogBank,
			},
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: arboll,
			generatedBy: fogBank.id,
		};

		gameState.update(castingAction);
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		gameState.update(targetingAction);
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		expect(grega.data.energy).toEqual(3, 'Grega now has 3 energy');
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		
		const activePlayerPassAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		const opponentPassAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(activePlayerPassAction);
		// Opponents turn
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Attack
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Creatures
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Active player turn
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER);
		// PRS
		gameState.update(activePlayerPassAction);
		// Attack
		gameState.update(activePlayerPassAction);
		// Creatures
		gameState.update(activePlayerPassAction);
		// PRS
		gameState.update(activePlayerPassAction);
		// Opponents turn
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Attack
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Creatures
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Active player turn
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER);
		// PRS
		gameState.update(activePlayerPassAction);
		// Attack
		gameState.update(activePlayerPassAction);
		// Creatures
		gameState.update(activePlayerPassAction);
		// PRS
		gameState.update(activePlayerPassAction);
		// Opponents turn
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(true);
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

describe('Cave Hyren', () => {
	it('Energy Transfer', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, fireGrag]);

		const gameState = new State({
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

		const gameState = new State({
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

		const gameState = new State({
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

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_NUMBER, 'Game is waiting for number');
		expect(gameState.state.promptParams).toEqual({min: 1, max: 6}, 'Min and max energy passed correctly');

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

		const gameState = new State({
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

		const gameState = new State({
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
			type: ACTION_ATTACK,
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

describe('Motash', () => {
	it('Escape', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER).addEnergy(5);

		const motash = new CardInGame(byName('Motash'), NON_ACTIVE_PLAYER).addEnergy(5);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([motash]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw, mushroomHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: ayebaw,
			target: mushroomHyren,
		};

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(3, 'Ayebaw has 3 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).cards.length).toEqual(0, 'No cards in non-active player discard');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).cards.length).toEqual(1, 'One card in non-active player hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
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

describe('Lava Balamant', () => {
	it('Charge', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER);
		lavaBalamant.addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);

		const gameState = new State({
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
			type: ACTION_ATTACK,
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

		const gameState = new State({
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
			type: ACTION_ATTACK,
			source: weebo,
			target: lavaBalamant,
		};
        
		gameState.update(attackAction);

		expect(lavaBalamant.data.energy).toEqual(3, 'Lava Balamant loses 2 energy in attack, left at 3');
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

describe('Cave Rudwot', () => {
	it('Defense', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const caveRudwot = new CardInGame(byName('Cave Rudwot'), ACTIVE_PLAYER);
		caveRudwot.addEnergy(3);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([caveRudwot, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: caveRudwot,
		};
        
		gameState.update(attackAction);

		expect(caveRudwot.data.energy).toEqual(3, 'Cave Rudwot loses 2 energy in attack and gain 2 from Defense, left at 3');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});

	it('Defense (Cave Rudwot attacks)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(2);
		const caveRudwot = new CardInGame(byName('Cave Rudwot'), NON_ACTIVE_PLAYER);
		caveRudwot.addEnergy(3);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([caveRudwot, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: caveRudwot,
			target: weebo,
		};
        
		gameState.update(attackAction);

		expect(caveRudwot.data.energy).toEqual(1, 'Cave Rudwot loses 2 energy in attack and gains none, left at 1');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');
	});
});

describe('Gum-Gum', () => {
	it('Slide (use effect)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(4);
		const gumGum = new CardInGame(byName('Gum-Gum'), NON_ACTIVE_PLAYER).addEnergy(2);

		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(7);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([gumGum, weebo, mushroomHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: gumGum,
		};
        
		gameState.update(attackAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);

		const allowReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: gumGum.id,
		};

		gameState.update(allowReplaceEffect);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE);

		const slideTargetEffect = {
			type: ACTION_RESOLVE_PROMPT,
			target: mushroomHyren,
			generatedBy: gameState.state.promptGeneratedBy,
		};

		gameState.update(slideTargetEffect);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Weebo');
		expect(mushroomHyren.data.energy).toEqual(3);
		expect(gumGum.data.energy).toEqual(2);
	});

	it('Slide (do not use effect)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(4);
		const gumGum = new CardInGame(byName('Gum-Gum'), NON_ACTIVE_PLAYER).addEnergy(2);

		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(7);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([gumGum, weebo, mushroomHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: weebo,
			target: gumGum,
		};
        
		gameState.update(attackAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);

		const allowReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: false,
			generatedBy: gumGum.id,
		};

		gameState.update(allowReplaceEffect);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Gum-Gum');
		expect(mushroomHyren.data.energy).toEqual(7);
		expect(weebo.data.energy).toEqual(2);
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

describe('Magma Armor', () => {
	it('Defense', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(8);
		const magmaArmor = new CardInGame(byName('Magma Armor'), NON_ACTIVE_PLAYER);
		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		weebo.addEnergy(1);

		const gameState = new State({
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
			type: ACTION_ATTACK,
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

		const gameState = new State({
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
			type: ACTION_ATTACK,
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

describe('Ora', () => {
	it('Strengthen', () => {
		const activePlayer = 0;
		const notActivePlayer = 1;

		const ora = new CardInGame(byName('Ora'), activePlayer);
		ora.addEnergy(15);

		const pharan = new CardInGame(byName('Pharan'), activePlayer);

		const zones = [
			new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([pharan]),
			new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
			new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
			new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([ora]),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer,
		});
        
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, 'Ora\'s Energy is 15');

		gameState.update({
			type: ACTION_PLAY, 
			payload: {
				player: activePlayer,
				card: pharan,
			},
		});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one cards');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Pharan', 'Card in play is Pharan');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(12, 'Ora\'s energy is 12 (Pharan costs 3)');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.find(card => card.card.name == 'Pharan').data.energy).toEqual(4, 'Pharan\'s energy is 4');
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

		const gameState = new State({
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

		const gameState = new State({
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

		const gameState = new State({
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

		const gameState = new State({
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

describe('Wellisk', () => {
	it('Dream Barrier (use ability)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);
		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER);
		const wellisk = new CardInGame(byName('Wellisk'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [wellisk], [ebylon]);

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([bwill]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: bwill,
				player: ACTIVE_PLAYER,
			}
		};

		gameState.update(playAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);

		const allowReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: wellisk.id,
		};

		gameState.update(allowReplaceEffect);

		expect(gameState.state.prompt).toEqual(false);

		expect(gameState.state.savedActions).toHaveLength(0);
		expect(gameState.state.mayEffectActions).toHaveLength(0);
		expect(gameState.state.fallbackActions).toHaveLength(0);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Wellisk');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Bwill');
	});

	it('Dream Barrier (do not use ability)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const ebylon = new CardInGame(byName('Ebylon'), ACTIVE_PLAYER).addEnergy(6);
		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER);
		const wellisk = new CardInGame(byName('Wellisk'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [wellisk], [ebylon]);

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([bwill]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: bwill,
				player: ACTIVE_PLAYER,
			}
		};

		gameState.update(playAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);

		const forbidReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: false,
			generatedBy: wellisk.id,
		};

		gameState.update(forbidReplaceEffect);

		expect(gameState.state.prompt).toEqual(false);

		expect(gameState.state.savedActions).toHaveLength(0);
		expect(gameState.state.mayEffectActions).toHaveLength(0);
		expect(gameState.state.fallbackActions).toHaveLength(0);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0);
	});
});

describe('Orathan', () => {
	it('Engulf', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const orathan = new CardInGame(byName('Orathan'), ACTIVE_PLAYER);
		orathan.addEnergy(5);
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
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([orathan, weebo, leafHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: orathan,
			target: weebo,
		};
        
		const attackHyrenAction = {
			type: ACTION_ATTACK,
			source: orathan,
			target: leafHyren,
		};
        
		gameState.update(attackAction);

		expect(orathan.data.energy).toEqual(5, 'Orathan loses 2 energy but gains 2 energy in the attack');
		expect(weebo.data.energy).toEqual(0, 'Weebo is toast');

		orathan.clearAttackMarkers();

		gameState.update(attackHyrenAction);

		expect(orathan.data.energy).toEqual(1, 'Orathan loses 4 energy in the attack, gaining none');
		expect(leafHyren.data.energy).toEqual(0, 'Hyren is toast');
	});

	it('Engulf (Cave Rudwot)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const orathan = new CardInGame(byName('Orathan'), ACTIVE_PLAYER);
		orathan.addEnergy(5);
		const caveRudwot = new CardInGame(byName('Cave Rudwot'), NON_ACTIVE_PLAYER);
		caveRudwot.addEnergy(1);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([orathan, caveRudwot]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: orathan,
			target: caveRudwot,
		};
        
		gameState.update(attackAction);

		expect(orathan.data.energy).toEqual(2, 'Orathan loses 3 energy, gaining none, because at damage step Cave Rudwot has 3 energy');
		expect(caveRudwot.data.energy).toEqual(0, 'Cave Rudwot is toast');
	});
});

describe('Strag', () => {
	it('Defense', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
	
		const strag = new CardInGame(byName('Strag'), NON_ACTIVE_PLAYER).addEnergy(5);
		const thunderVashp = new CardInGame(byName('Thunder Vashp'), ACTIVE_PLAYER).addEnergy(2);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);
	
		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([strag]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([thunderVashp, mushroomHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
	
		const attackAction = {
			type: ACTION_ATTACK,
			source: thunderVashp,
			target: mushroomHyren,
		};
			
		gameState.update(attackAction);
	
		expect(thunderVashp.data.energy).toEqual(0, 'Thunder Vashp loses 2 energy, dies');
		expect(mushroomHyren.data.energy).toEqual(1, 'Mushroom Hyren gains 1 energy, loses 2, survives');
	});
});

describe('Whall', () => {
	it('Dream Twist', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const orathan = new CardInGame(byName('Orathan'), ACTIVE_PLAYER).addEnergy(1);
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(10);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const paralith = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([paralith, waterOfLife]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([whall]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([orathan]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: whall,
			power: whall.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};
        
		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_OWN_SINGLE_CREATURE, 'Game is prompting for own single creature');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			prompt: ACTIVE_PLAYER,
			target: orathan,
			generatedBy: whall.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		expect(gameState.state.promptParams.cards).toHaveLength(1, 'Only 1 card we can choose');
		expect(gameState.state.promptParams.cards[0].card).toEqual('Paralit');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [paralith],
			generatedBy: whall.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Paralit', 'Card is Paralit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.cost, 'Card has starting energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.attacked).toEqual(100, 'Paralit will not be able to attack this turn');
	});

	it('Dream Twist through the death zone (no creatures, no energy on Magi)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER).addEnergy(1);
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(5);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const paralith = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([paralith, waterOfLife]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([whall]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bwill]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: whall,
			power: whall.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};
        
		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_OWN_SINGLE_CREATURE, 'Game is prompting for own single creature');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			prompt: ACTIVE_PLAYER,
			target: bwill,
			generatedBy: whall.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		expect(gameState.state.promptParams.cards).toHaveLength(1, 'Only 1 card we can choose');
		expect(gameState.state.promptParams.cards[0].card).toEqual('Paralit');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [paralith],
			generatedBy: whall.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Paralit', 'Card is Paralit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.cost, 'Card has starting energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.attacked).toEqual(100, 'Paralit will not be able to attack this turn');
	});
});

describe('Orothean Gloves', () => {
	it('Powers cost', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const oqua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER).addEnergy(10);
		const orotheanGloves = new CardInGame(byName('Orothean Gloves'), ACTIVE_PLAYER);
		const seaBarl = new CardInGame(byName('Sea Barl'), ACTIVE_PLAYER).addEnergy(4);

		const undertow = new CardInGame(byName('Undertow'), ACTIVE_PLAYER);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([undertow]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([oqua]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([orotheanGloves, seaBarl]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: seaBarl,
			power: seaBarl.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'Lore drawn us a card');
		expect(seaBarl.data.energy).toEqual(2, 'Lore costs 2 instead of usual 3');
	});
});

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

describe('Scroll of Fire', () => {
	it('Fire Chogo', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const mobis = new CardInGame(byName('Mobis'), NON_ACTIVE_PLAYER).addEnergy(12);
		const orathan = new CardInGame(byName('Orathan'), NON_ACTIVE_PLAYER).addEnergy(5);

		const scrollOfFire = new CardInGame(byName('Scroll of Fire'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const fireChogo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER).addEnergy(2);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), ACTIVE_PLAYER).addEnergy(5);
		const balamantPup = new CardInGame(byName('Balamant Pup'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [fireChogo, scrollOfFire, orathan, balamantPup, lavaArboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([mobis]);

		const powerAction = {
			type: ACTION_POWER,
			source: fireChogo,
			power: fireChogo.card.data.powers[0],
		};

		gameState.update(powerAction);

		expect(orathan.data.energy).toEqual(3);
		expect(balamantPup.data.energy).toEqual(3);
		expect(lavaArboll.data.energy).toEqual(5);
	});

	it('Syphon Stone (should not be affected by the Scroll)', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const mobis = new CardInGame(byName('Mobis'), NON_ACTIVE_PLAYER).addEnergy(12);
		const orathan = new CardInGame(byName('Orathan'), NON_ACTIVE_PLAYER).addEnergy(5);

		const scrollOfFire = new CardInGame(byName('Scroll of Fire'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const syphonStone = new CardInGame(byName('Syphon Stone'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [scrollOfFire, orathan, syphonStone], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([mobis]);

		const powerAction = {
			type: ACTION_POWER,
			source: syphonStone,
			power: syphonStone.card.data.powers[0],
		};

		gameState.update(powerAction);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: orathan,
			generatedBy: syphonStone.id,
		};

		gameState.update(targetingAction);

		expect(orathan.data.energy).toEqual(4);
	});
});

describe('Vellup', () => {
	it('Flock (use ability)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(6);

		const vellup = new CardInGame(byName('Vellup'), ACTIVE_PLAYER);
		const vellupTwo = new CardInGame(byName('Vellup'), ACTIVE_PLAYER);

		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [jaela]);

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vellup]);
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([vellupTwo, xyxElder]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: vellup,
				player: ACTIVE_PLAYER,
			}
		};
		
		gameState.update(playAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Vellup');

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);

		const newVellup = gameState.getZone(ZONE_TYPE_IN_PLAY).card;

		const allowEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: newVellup.id,
		};

		gameState.update(allowEffect);

		expect(gameState.state.prompt).toEqual(true); // Game is in prompt state
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE);

		const selectCardAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [vellupTwo],
			generatedBy: vellup.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(selectCardAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Vellup');

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Vellup');
	});

	it('Flock (use ability)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(6);

		const vellup = new CardInGame(byName('Vellup'), ACTIVE_PLAYER);
		const vellupTwo = new CardInGame(byName('Vellup'), ACTIVE_PLAYER);

		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [jaela]);

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vellup]);
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([vellupTwo, xyxElder]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: vellup,
				player: ACTIVE_PLAYER,
			}
		};
		
		gameState.update(playAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Vellup');

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptParams.effect.name).toEqual('Flock');
		expect(gameState.state.promptParams.effect.text).toEqual('When you play Vellup, you may search your deck for another Vellup. Show it to your opponent and put it into your hand. Shuffle the deck.');
		
		const denyEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: false,
			generatedBy: vellup.id,
		};

		gameState.update(denyEffect);

		expect(gameState.state.prompt).toEqual(false);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Vellup');
	});

	it('Flock (no cards to find)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(6);

		const vellup = new CardInGame(byName('Vellup'), ACTIVE_PLAYER);

		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [jaela]);

		const gameState = new State({
			zones,
			step: STEP_CREATURES,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([vellup]);
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([xyxElder]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: vellup,
				player: ACTIVE_PLAYER,
			}
		};
		
		gameState.update(playAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Vellup');

		expect(gameState.state.prompt).toEqual(false); // Game is not in prompt state, because you have no Vellups in the deck
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

describe('O\'Qua', () => {
	it('Conjure', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const oqua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER).addEnergy(10);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const orathan = new CardInGame(byName('Orathan'), ACTIVE_PLAYER);
		const paralith = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);
		const bwill = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([orathan, paralith, bwill]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([oqua]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: oqua,
			power: oqua.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};
        
		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_DECK, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [paralith],
			generatedBy: oqua.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'Deck has 2 cards left');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Paralit', 'Card is Paralit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(4, 'Paralit has 4 energy');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.attacked).toEqual(100, 'Paralit will not be able to attack this turn');
	});

	it('Conjure (additional energy on cast)', () => {
		const ACTIVE_PLAYER = 40;
		const NON_ACTIVE_PLAYER = 1;

		const oqua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER).addEnergy(10);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const staffOfHyren = new CardInGame(byName('Staff of Hyren'), ACTIVE_PLAYER);
		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER);
		const paralith = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);
		const bwill = new CardInGame(byName('Paralit'), ACTIVE_PLAYER);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([deepHyren, paralith, bwill]),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([oqua]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([staffOfHyren]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerUseAction = {
			type: ACTION_POWER,
			source: oqua,
			power: oqua.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};
        
		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_DECK, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [deepHyren],
			generatedBy: oqua.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'One card is in play');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(2, 'Deck has 2 cards left');
		// expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Deep Hyren', 'Card is Deep Hyren');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.find(card => card.card.name === 'Deep Hyren').data.energy).toEqual(5, 'Deep Hyren has 5 energy (4 from ability and 1 from Staff of Hyren)');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.find(card => card.card.name === 'Deep Hyren').data.attacked).toEqual(100, 'Deep Hyren will not be able to attack this turn');
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

		const gameState = new State({
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

	it('Interchange Juggle', () => {
		const ACTIVE_PLAYER = 5;
		const NON_ACTIVE_PLAYER = 15;

		const oneParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER).addEnergy(10);
		const twoParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER);
		const threeParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER);
		const orathan = new CardInGame(byName('Orathan'), ACTIVE_PLAYER);
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(4);
		const oQua = new CardInGame(byName('O\'Qua'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [oneParathin], [whall]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([oQua]);
		gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).add([twoParathin]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([threeParathin, orathan]);

		const powerAction = {
			type: ACTION_POWER,
			source: oneParathin,
			power: oneParathin.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Whall', 'Whall is active Magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('O\'Qua', 'O\'Qua is in pile');

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No cards in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('O\'Qua', 'Yaki is active Magi');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(11, 'O\'Qua has 11 energy');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Whall', 'Whall is in pile');

		const newOQua = gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card;
		const conjureAction = {
			type: ACTION_POWER,
			source: newOQua,
			power: newOQua.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(conjureAction);
		
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE);
		expect(gameState.state.promptParams.cards[0].id).toEqual(twoParathin.id);

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [twoParathin],
			generatedBy: newOQua.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);
		expect(gameState.state.prompt).toEqual(false);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Giant Parathin');

		const newTwoParathin = gameState.getZone(ZONE_TYPE_IN_PLAY).card;

		const secondPowerAction = {
			type: ACTION_POWER,
			source: newTwoParathin,
			power: newTwoParathin.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(secondPowerAction);

		expect(gameState.state.prompt).toEqual(false);
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Whall', 'Whall is active Magi');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('O\'Qua', 'O\'Qua is in pile');

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);

		expect(gameState.state.step).toEqual(STEP_ATTACK);

		gameState.update(passAction);

		expect(gameState.state.step).toEqual(STEP_CREATURES);

		const playOrathanAction = {
			type: ACTION_PLAY,
			payload: {
				card: orathan,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playOrathanAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Orathan');

		gameState.update(passAction);

		expect(gameState.state.step).toEqual(STEP_PRS_SECOND);

		const newWhall = gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card;
		expect(newWhall.data.energy).toEqual(5);
		const newOrathan = gameState.getZone(ZONE_TYPE_IN_PLAY).card;

		const powerUseAction = {
			type: ACTION_POWER,
			source: newWhall,
			power: newWhall.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerUseAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_OWN_SINGLE_CREATURE, 'Game is prompting for own single creature');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			prompt: ACTIVE_PLAYER,
			target: newOrathan,
			generatedBy: newWhall.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in Prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is prompting for cards from zone');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Prompt awaiting card from hand');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Prompt awaiting one card');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Prompt awaiting card from active players hand');
		expect(gameState.state.promptParams.cards).toHaveLength(1, 'Only 1 card we can choose');
		expect(gameState.state.promptParams.cards[0].card).toEqual('Giant Parathin');
		expect(gameState.state.promptParams.cards[0].id).toEqual(threeParathin.id);

		const anotherCardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [threeParathin],
			generatedBy: newWhall.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(anotherCardChoiceAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Giant Parathin');

		const newThreeParathin = gameState.getZone(ZONE_TYPE_IN_PLAY).card;

		const finalInterchangeAction = {
			type: ACTION_POWER,
			source: newThreeParathin,
			power: newThreeParathin.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(finalInterchangeAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No cards in play');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('O\'Qua', 'O\'Qua is active Magi');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(11, 'O\'Qua has 11 energy');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
		expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Whall', 'Whall is in pile');
		expect(gameState.hasWinner()).toEqual(false);
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

describe('Grega', () => {
	it('Thermal blast (target is creature)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(7);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [grega]);

		const gameState = new State({
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

		const gameState = new State({
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

describe('Adis', () => {
	it('Haunt', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(2);
		const jaela = new CardInGame(byName('Jaela'), NON_ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant], [grega]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);
		gameState.getZone(ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([jaela]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: lavaBalamant,
			target: adis,
		};
		
		gameState.update(attackAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is in prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams).toEqual({
			cards: [],
			zone: ZONE_TYPE_HAND,
			zoneOwner: ACTIVE_PLAYER,
			restrictions: null,
			numberOfCards: 3,
		}, 'Game prompt params are right');
	});

	it('Haunt (on our turn)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);
		const adis = new CardInGame(byName('Adis'), ACTIVE_PLAYER).addEnergy(0);
		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER);

		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [adis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([jaela]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: pharan,
			power: pharan.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: grega,
			player: ACTIVE_PLAYER,
			generatedBy: pharan.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is in correct prompt type');
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER, 'Game is prompting non-active player');
		expect(gameState.state.promptParams).toEqual({
			zone: ZONE_TYPE_HAND,
			cards: [],
			restrictions: null,
			zoneOwner: NON_ACTIVE_PLAYER,
			numberOfCards: 3,
		}, 'Game prompt params are right');
	});
});

describe('Mobis', () => {
	it('Legacy', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const mobis = new CardInGame(byName('Mobis'), NON_ACTIVE_PLAYER).addEnergy(2);
		const jaela = new CardInGame(byName('Jaela'), NON_ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant], [grega]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([mobis]);
		gameState.getZone(ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([jaela]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: lavaBalamant,
			target: mobis,
		};
		
		gameState.update(attackAction);

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_CREATURES, 'Creatures step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_PRS_SECOND, 'Creatures step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_ENERGIZE, 'Next turn! Card prompt.');
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER, '"Non-active" player is active');

		const cardChoiceAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [],
			generatedBy: gameState.state.promptGeneratedBy,
			player: NON_ACTIVE_PLAYER,
		};

		gameState.update(cardChoiceAction);

		expect(gameState.state.step).toEqual(STEP_PRS_FIRST, 'Cards chosen, PRS first!');
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER, '"Non-active" player is active');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER)).toHaveLength(1, 'Magi flipped succesfully');

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).card.card.name).toEqual('Jaela', 'Magi flipped succesfully');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).card.data.energy).toEqual(20, 'Jaela has 20 energy because of Legacy trigger');
	});
});

describe('Amulet of Ombor', () => {
	it('Roll value of 1~3', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(12);
		const amuletOfOmbor = new CardInGame(byName('Amulet of Ombor'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(3);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const fireChogo = new CardInGame(byName('Fire Chogo'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll, arbolit, fireChogo, amuletOfOmbor], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: amuletOfOmbor,
			power: amuletOfOmbor.card.data.powers[0],
		};

		gameState.setRollDebugValue(3);

		gameState.update(powerAction);

		expect(arbolit.data.energy).toEqual(3, 'Arbolit gained 1 energy due to Amulet of Ombor controller rolling 3');
		expect(fireChogo.data.energy).toEqual(3, 'Fire Chogo gained 1 energy due to Amulet of Ombor controller rolling 3');
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
	});

	it('Roll value of 5', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(12);
		const amuletOfOmbor = new CardInGame(byName('Amulet of Ombor'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(3);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const fireChogo = new CardInGame(byName('Fire Chogo'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll, arbolit, fireChogo, amuletOfOmbor], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: amuletOfOmbor,
			power: amuletOfOmbor.card.data.powers[0],
		};

		gameState.setRollDebugValue(5);

		gameState.update(powerAction);

		expect(arbolit.data.energy).toEqual(2, 'Arbolit gained no energy');
		expect(fireChogo.data.energy).toEqual(2, 'Fire Chogo gained no energy');
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is in prompting for single creature');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: arboll,
			generatedBy: amuletOfOmbor.id,
		};

		gameState.update(targetingAction);
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(arboll.data.energy).toEqual(5, 'Arboll got 2 energy from Amulet of Ombor');
	});

	it('Roll value of 6', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(12);
		const amuletOfOmbor = new CardInGame(byName('Amulet of Ombor'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(3);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);
		const fireChogo = new CardInGame(byName('Fire Chogo'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll, arbolit, fireChogo, amuletOfOmbor], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: amuletOfOmbor,
			power: amuletOfOmbor.card.data.powers[0],
		};

		gameState.setRollDebugValue(6);

		gameState.update(powerAction);

		expect(arbolit.data.energy).toEqual(2, 'Arbolit gained no energy');
		expect(fireChogo.data.energy).toEqual(2, 'Fire Chogo gained no energy');
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is in prompting for single creature');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: arboll,
			generatedBy: amuletOfOmbor.id,
		};

		gameState.update(targetingAction);
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(arboll.data.energy).toEqual(7, 'Arboll got 4 energy from Amulet of Ombor');
	});
});

describe('Megathan', () => {
	it('Feed', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(12);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const megathan = new CardInGame(byName('Megathan'), ACTIVE_PLAYER).addEnergy(8);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [megathan, arbolit], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: megathan,
			target: arbolit,
		};
		
		gameState.update(attackAction);
		expect(megathan.data.defeatedCreature).toEqual(true, 'Megathan marked as defeated a creature');

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_CREATURES, 'Creatures step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_PRS_SECOND, 'Second PRS step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');
		expect(megathan.data.energy).toEqual(7, 'Megathan has 7 energy');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_PRS_FIRST, 'Next turn! Card prompt.');
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER, '"Non-active" player is active');
		expect(megathan.data.energy).toEqual(8, 'Feed ability gave 1 energy to Megathan');
	});

	it('Feed (no killings, to trigger)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(12);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const megathan = new CardInGame(byName('Megathan'), ACTIVE_PLAYER).addEnergy(7);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [megathan, arbolit], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		expect(megathan.data.defeatedCreature).toEqual(false, 'Megathan is not marked as defeated a creature');

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_CREATURES, 'Creatures step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_PRS_SECOND, 'Second PRS step');
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'Active player is active');
		expect(megathan.data.energy).toEqual(7, 'Megathan has 7 energy');

		gameState.update(passAction);
		expect(gameState.state.step).toEqual(STEP_PRS_FIRST, 'Next turn!');
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER, '"Non-active" player is active');
		expect(megathan.data.energy).toEqual(7, 'Megathan still has 7 energy');
	});
});

describe('Cloud Narth', () => {
	it('Healing Rain', () => {
		const ACTIVE_PLAYER = 421;
		const NON_ACTIVE_PLAYER = 160;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const cloudNarth = new CardInGame(byName('Cloud Narth'), ACTIVE_PLAYER).addEnergy(2);
		const thunderVashp = new CardInGame(byName('Cloud Narth'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [cloudNarth, thunderVashp], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: cloudNarth,
			power: cloudNarth.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: thunderVashp,
			player: ACTIVE_PLAYER,
			generatedBy: cloudNarth.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, 'Game is prompting you for a single creature or Magi');

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state anymore');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player discard has one card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Cloud Narth', 'It is Cloud Narth');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(thunderVashp.id).data.energy).toEqual(3, 'Thunder Vashp now has 3 energy');
	});

	it('Healing Storm', () => {
		const ACTIVE_PLAYER = 421;
		const NON_ACTIVE_PLAYER = 160;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const cloudNarth = new CardInGame(byName('Cloud Narth'), ACTIVE_PLAYER).addEnergy(2);
		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(2);
		const thunderVashp = new CardInGame(byName('Cloud Narth'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [cloudNarth, pharan, thunderVashp], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: cloudNarth,
			power: cloudNarth.card.data.powers[1],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: thunderVashp,
			player: ACTIVE_PLAYER,
			generatedBy: cloudNarth.id,
		};

		const pharanChoosingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: cloudNarth.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, 'Game is prompting you for a single creature or Magi');

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state still');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED, 'Game is prompting you for a Pharan');

		gameState.update(pharanChoosingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state anymore');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(2, 'Active player discard has two cards');
	
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(thunderVashp.id).data.energy).toEqual(8, 'Thunder Vashp now has 8 energy');
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

describe('Xyx', () => {
	it('Shock', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(3);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [xyx], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: xyx,
			power: xyx.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_MAGI,
			target: yaki,
			player: ACTIVE_PLAYER,
			generatedBy: xyx.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player discard has one card (Xyx)');

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).byId(yaki.id).data.energy).toEqual(3, 'Yaki now has 3 energy');
	});
});

describe('Xyx Elder', () => {
	it('Shockstorm', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(7);
		const xyx = new CardInGame(byName('Xyx'), ACTIVE_PLAYER).addEnergy(2);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [xyx, xyxElder, arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.setRollDebugValue(3);

		const powerAction = {
			type: ACTION_POWER,
			source: xyxElder,
			power: xyxElder.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'Active player discard has no cards');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player discard has 1 card');
		expect(xyx.data.energy).toEqual(2, 'Another Xyx lost no energy');
		expect(xyxElder.data.energy).toEqual(1, 'Xyx Elder lost only 6 energy as power cost');
	});

	it('Shockstorm (hitting own creatures)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(7);
		const xyxElder = new CardInGame(byName('Xyx Elder'), ACTIVE_PLAYER).addEnergy(7);
		const xyx = new CardInGame(byName('Xyx'), NON_ACTIVE_PLAYER).addEnergy(2);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [xyx, xyxElder, arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.setRollDebugValue(3);

		const powerAction = {
			type: ACTION_POWER,
			source: xyxElder,
			power: xyxElder.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player discard has one card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player discard has 0 cards');
		expect(xyx.data.energy).toEqual(2, 'Another Xyx lost no energy');
		expect(xyxElder.data.energy).toEqual(1, 'Xyx Elder lost only 6 energy as power cost');
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

describe('Sinder', () => {
	it('Refresh', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(3);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit], [sinder]);

		const gameState = new State({
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

describe('Corf', () => {
	it('Final Blow', () => {
		const ACTIVE_PLAYER = 15;
		const NON_ACTIVE_PLAYER = 1;

		const corf = new CardInGame(byName('Corf'), ACTIVE_PLAYER).addEnergy(6);
		const fireGrag = new CardInGame(byName('Fire Grag'), NON_ACTIVE_PLAYER).addEnergy(4);

		fireGrag.markAttackReceived();

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [corf, fireGrag]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: corf,
			power: corf.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			target: fireGrag,
			generatedBy: corf.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.length).toEqual(1, 'Only one card is in play');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(corf.id).data.energy).toEqual(3, 'Corf now has 3 energy');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-Active player has one card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Fire Grag', 'It is Fire Grag');
	});

	it('Final Blow (no targets)', () => {
		const ACTIVE_PLAYER = 15;
		const NON_ACTIVE_PLAYER = 1;

		const corf = new CardInGame(byName('Corf'), ACTIVE_PLAYER).addEnergy(6);
		const fireGrag = new CardInGame(byName('Fire Grag'), NON_ACTIVE_PLAYER).addEnergy(4);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [corf, fireGrag]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: corf,
			power: corf.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
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

describe('Wellisk Pup', () => {
	it('Erratic Shield (roll <= 4)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const welliskPup = new CardInGame(byName('Wellisk Pup'), ACTIVE_PLAYER).addEnergy(2);

		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(3);

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(2);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
				new Zone('In play', ZONE_TYPE_IN_PLAY).add([welliskPup, arbolit, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.setRollDebugValue(3);

		const attackByArbolitAction = {
			type: ACTION_ATTACK,
			source: arbolit,
			target: welliskPup,
		};

		gameState.update(attackByArbolitAction);

		expect(welliskPup.data.energy).toEqual(2, 'Wellisk pup gains 3 energy and loses 3 energy, left at 2');
	});

	it('Erratic Shield (roll >= 5)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const welliskPup = new CardInGame(byName('Wellisk Pup'), ACTIVE_PLAYER).addEnergy(2);

		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(1);

		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(2);

		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(2);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
				new Zone('In play', ZONE_TYPE_IN_PLAY).add([welliskPup, arbolit, weebo]),
			],
			step: STEP_ATTACK,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.setRollDebugValue(6);

		const attackByArbolitAction = {
			type: ACTION_ATTACK,
			source: arbolit,
			target: welliskPup,
		};

		gameState.update(attackByArbolitAction);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).cards.length).toEqual(1, 'NAP discard has 1 card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'It\'s Arbolit');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).cards.length).toEqual(1, 'AP discard has 1 card');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Wellisk Pup', 'It\'s Wellisk Pup');
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

		const gameState = new State({
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

		const gameState = new State({
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

		const gameState = new State({
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

		const gameState = new State({
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

describe('Deep Hyren', () => {
	it('Hurricane', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Orothe player
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(10);
		const deepHyren = new CardInGame(byName('Deep Hyren'), ACTIVE_PLAYER).addEnergy(8);
		const orotheanGloves = new CardInGame(byName('Orothean Gloves'), ACTIVE_PLAYER);
		const waterOfLife = new CardInGame(byName('Water of Life'), ACTIVE_PLAYER);

		// Naroom player
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(7);
		const balamant = new CardInGame(byName('Balamant'), ACTIVE_PLAYER).addEnergy(7);
		const carillion = new CardInGame(byName('Carillion'), ACTIVE_PLAYER).addEnergy(5);
		const rudwot = new CardInGame(byName('Rudwot'), ACTIVE_PLAYER).addEnergy(4);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [deepHyren, balamant, carillion, rudwot, orotheanGloves, waterOfLife], [whall]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const powerAction = {
			type: ACTION_POWER,
			source: deepHyren,
			power: deepHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true);

		const targetPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: deepHyren,
			player: ACTIVE_PLAYER,
			generatedBy: deepHyren.id,
		};

		gameState.update(targetPromptAction);

		expect(gameState.state.prompt).toEqual(false);

		expect(pruitt.data.energy).toEqual(4);
		expect(balamant.data.energy).toEqual(4);
		expect(carillion.data.energy).toEqual(2);
		expect(rudwot.data.energy).toEqual(1);
	});
});

describe('Magam', () => {
	it('Vitalize', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(2);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER).addEnergy(7);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(1);

		// Cald player
		const magam = new CardInGame(byName('Magam'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaArboll, lavaBalamant], [magam]);

		const gameState = new State({
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

		const targetPromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: magam.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in the Prompt state');

		gameState.update(targetPromptAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in Prompt state');
		expect(lavaBalamant.data.energy).toEqual(5, 'Lava Balamant energy is restored to 5');
	});
});

describe('Updraft', () => {
	it('Casting', () => {
		const NON_ACTIVE_PLAYER = 104;
		const ACTIVE_PLAYER = 12;

		const nimbulo = new CardInGame(byName('Nimbulo'), ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);
		const updraft = new CardInGame(byName('Updraft'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant], [nimbulo]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([updraft]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: updraft,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: updraft.id,
		};
		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.length).toEqual(1, 'Active player has 1 card in hand');
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Lava Balamant', 'It is Lava Balamant');

		expect(nimbulo.data.energy).toEqual(14, 'Nimbulo energy is now 14 (10 -1 for Updraft +5 from Lava Balamant');
	});
});

describe('Nimbulo', () => {
	it('Energy Drain', () => {
		const NON_ACTIVE_PLAYER = 104;
		const ACTIVE_PLAYER = 12;

		const magam = new CardInGame(byName('Magam'), NON_ACTIVE_PLAYER).addEnergy(10);
		const nimbulo = new CardInGame(byName('Nimbulo'), ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, fireGrag], [nimbulo]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);

		const powerAction = {
			type: ACTION_POWER,
			source: nimbulo,
			power: nimbulo.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: nimbulo.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: nimbulo.id,
		};

		gameState.update(chooseCreatureAction);

		expect(gameState.state.prompt).toEqual(true, 'Game still in prompt state');

		const chooseTargetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: fireGrag,
			player: ACTIVE_PLAYER,
			generatedBy: nimbulo.id,
		};

		gameState.update(chooseTargetAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		expect(lavaBalamant.data.energy).toEqual(2, 'Lava Balamant now has 2 energy');
		expect(fireGrag.data.energy).toEqual(7, 'Fire Grag now has 7 energy');
	});
});

describe('Fire Grag', () => {
	it('Metabolize', () => {
		const ACTIVE_PLAYER = 104;
		const NON_ACTIVE_PLAYER = 12;
		const magam = new CardInGame(byName('Magam'), ACTIVE_PLAYER).addEnergy(10);
		const nimbulo = new CardInGame(byName('Nimbulo'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(3);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(6);
		const thunderHyren = new CardInGame(byName('Thunder Hyren'), NON_ACTIVE_PLAYER).addEnergy(7);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, fireGrag, thunderHyren], [magam]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);

		const powerAction = {
			type: ACTION_POWER,
			source: fireGrag,
			power: fireGrag.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: fireGrag.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: fireGrag.id,
		};

		gameState.update(chooseCreatureAction);

		expect(gameState.state.prompt).toEqual(true, 'Game still in prompt state');

		const chooseTargetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: thunderHyren,
			player: ACTIVE_PLAYER,
			generatedBy: fireGrag.id,
		};

		gameState.update(chooseTargetAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(thunderHyren.data.energy).toEqual(1, 'Thunder Hyren has 1 energy left');
	});
});

describe('Lava Aq', () => {
	it('Firestorm', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const lavaAq = new CardInGame(byName('Lava Aq'), ACTIVE_PLAYER).addEnergy(6);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(1);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(1);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaAq, arbolit, weebo], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const powerAction = {
			type: ACTION_POWER,
			source: lavaAq,
			power: lavaAq.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
			target: arbolit,
			generatedBy: lavaAq.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one creature left on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Lava Aq', 'It is Lava Aq');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(4, 'It has 4 energy left');
		
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(2, 'Grega has 2 energy');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).card.data.energy).toEqual(4, 'Pruitt has 4 energy');
	});

	it('Firestorm (Lava Aq is the only creature)', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const lavaAq = new CardInGame(byName('Lava Aq'), ACTIVE_PLAYER).addEnergy(4);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(1);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(1);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaAq, weebo, arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const powerAction = {
			type: ACTION_POWER,
			source: lavaAq,
			power: lavaAq.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
			target: lavaAq,
			generatedBy: lavaAq.id,
		};

		gameState.update(powerAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No creatures left on the field');
		
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(2, 'Grega has 2 energy');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).card.data.energy).toEqual(4, 'Pruitt has 4 energy');
	});

	it('Firestorm (Lava Aq is the only creature that wont survive the ability)', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		// Cald player
		const lavaAq = new CardInGame(byName('Lava Aq'), ACTIVE_PLAYER).addEnergy(2);
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(2);

		// Naroom player
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(5);
		const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(1);
		const arboll = new CardInGame(byName('Arboll'), NON_ACTIVE_PLAYER).addEnergy(1);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaAq, weebo, arboll], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]);

		const powerAction = {
			type: ACTION_POWER,
			source: lavaAq,
			power: lavaAq.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);
		expect(gameState.state.prompt).toEqual(false);
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

describe('Bwill', () => {
	it('Karma (Bwill is attacked)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Orothe side
		const pruitt = new CardInGame(byName('Pruitt'), NON_ACTIVE_PLAYER).addEnergy(10);
		const bwill = new CardInGame(byName('Bwill'), NON_ACTIVE_PLAYER).addEnergy(1);

		// Cald side
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([pruitt]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bwill, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: kelthet,
			target: bwill,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Bwill', 'It is Bwill');
	});

	it('Karma (Bwill attacks)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Orothe side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER).addEnergy(1);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([bwill, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: bwill,
			target: kelthet,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Bwill', 'It is Bwill');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player has 0 card in discard');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card is on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});
});

describe('Staff of Korrits', () => {
	it('Adding energy to pack hunting Korrit', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const staffOfKorrits = new CardInGame(byName('Staff of Korrits'), ACTIVE_PLAYER);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren, kelthet, staffOfKorrits]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(4, 'Four cards on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two cards on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.map(card => card.card.name)).toEqual(['Korrit', 'Staff of Korrits'], 'It is Korrit and the Staff');
		expect(korrit.data.energy).toEqual(4, 'It has 4 energy');		

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});

	it('Not adding energy to Korrit that attacks as usual', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const staffOfKorrits = new CardInGame(byName('Staff of Korrits'), ACTIVE_PLAYER);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, kelthet, staffOfKorrits]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: korrit,
			target: kelthet,
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three cards on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two cards on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.map(card => card.card.name)).toEqual(['Kelthet', 'Staff of Korrits'], 'It is Kelthet and the Staff');
		expect(kelthet.data.energy).toEqual(3, 'Kelthet has 3 energy');		

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Korrit', 'It is Korrit');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(0, 'Non-active player has no cards in discard');
	});

	it('Not adding energy to enemy pack hunting Korrit', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const staffOfKorrits = new CardInGame(byName('Staff of Korrits'), NON_ACTIVE_PLAYER);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren, kelthet, staffOfKorrits]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(4, 'Four cards on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two cards on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.map(card => card.card.name)).toEqual(['Korrit', 'Staff of Korrits'], 'It is Korrit and the Staff');
		expect(korrit.data.energy).toEqual(3, 'It has 3 energy');		

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});
});

describe('Korrit', () => {
	it('Pack Hunt (one additional attacker)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Korrit', 'It is Korrit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(3, 'It has 3 energy');		

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});

	it('Pack Hunt (monstrous Korrit)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(13);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Korrit', 'It is Korrit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.data.energy).toEqual(13, 'It has 13 energy');		

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});

	it('Pack Hunt (three additional attackers)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const korritTwo = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const korritThree = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(12);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, korritTwo, korritThree, mushroomHyren, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit, korritTwo, korritThree],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(5, 'Five creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three creatures on the field');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.every(card => card.card.name === 'Korrit')).toEqual(true, 'They are all Korrit');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.every(card => card.data.energy === 3)).toEqual(true, 'They all have 3 energy');

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards.every(card => card.data.attacked === 1)).toEqual(true, 'They all have attacked once');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Mushroom Hyren', 'It is Mushroom Hyren');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'Non-active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Kelthet', 'It is Kelthet');
	});

	it('Pack Hunt (target is Magi)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: grega,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2, 'Two creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2,'Two creatures on the field');

		expect(grega.data.energy).toEqual(9, 'Grega has 9 energy left');
		expect(mushroomHyren.data.energy).toEqual(3, 'Mushroom Hyren has 3 energy');
		expect(korrit.data.energy).toEqual(3, 'Korrit has 3 energy');
	});

	it('Pack Hunt (but no attacks left on pack hunter)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(3);

		korrit.data.attacked = 1;

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([korrit, mushroomHyren, kelthet]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const attackAction = {
			type: ACTION_ATTACK,
			source: mushroomHyren,
			target: kelthet,
			additionalAttackers: [korrit],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three creatures on the field');

		gameState.update(attackAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(3, 'Three creatures on the field');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'Active player has no cards in discard');
	});
});

describe('Eclipse', () => {
	it('Target is enemy magi', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(10);
		const vellup = new CardInGame(byName('Vellup'), ACTIVE_PLAYER).addEnergy(3);
		const eclipse = new CardInGame(byName('Eclipse'), ACTIVE_PLAYER);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([eclipse]),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([jaela]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([vellup, kelthet]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: eclipse,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playAction);
		expect(gameState.state.prompt).toEqual(true);

		const targetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: grega,
			player: ACTIVE_PLAYER,
			generatedBy: eclipse.id,
		};

		gameState.update(targetAction);
		expect(gameState.state.prompt).toEqual(false);

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction); // pass to first PRS
		const kelthetAbleToAttack = gameState.modifyByStaticAbilities(kelthet, PROPERTY_ABLE_TO_ATTACK);
		expect(kelthetAbleToAttack).toEqual(false);
	});

	it('Target is own magi', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(10);
		const vellup = new CardInGame(byName('Vellup'), ACTIVE_PLAYER).addEnergy(3);
		const eclipse = new CardInGame(byName('Eclipse'), ACTIVE_PLAYER);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);

		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([eclipse]),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([jaela]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([vellup, kelthet]),
			],
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: eclipse,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playAction);
		expect(gameState.state.prompt).toEqual(true);

		const targetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: jaela,
			player: ACTIVE_PLAYER,
			generatedBy: eclipse.id,
		};

		gameState.update(targetAction);
		expect(gameState.state.prompt).toEqual(false);

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction); // pass to first PRS
		const kelthetAbleToAttack = gameState.modifyByStaticAbilities(kelthet, PROPERTY_ABLE_TO_ATTACK);
		expect(kelthetAbleToAttack).toEqual(true);
		gameState.update(passAction); // pass to attack
		gameState.update(passAction); // pass to creatures
		gameState.update(passAction); // pass to second PRS
		gameState.update(passAction); // pass to our turn

		const vellupAbleToAttack = gameState.modifyByStaticAbilities(vellup, PROPERTY_ABLE_TO_ATTACK);
		expect(vellupAbleToAttack).toEqual(false);
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

describe('Pack Korrit', () => {
	it('Morale', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const korritTwo = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const packKorrit = new CardInGame(byName('Pack Korrit'), ACTIVE_PLAYER).addEnergy(1);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(6);
		const enemyKorrit = new CardInGame(byName('Korrit'), NON_ACTIVE_PLAYER).addEnergy(1);
		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([packKorrit, korrit, korritTwo, kelthet, enemyKorrit]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: packKorrit,
			power: packKorrit.card.data.powers[0],
		};

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(5, 'Five creatures on the field');

		gameState.update(powerAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(4, 'Four creatures on the field');
		expect(korrit.data.energy).toEqual(4, 'Korrit has 4 energy');
		expect(korritTwo.data.energy).toEqual(4, 'Korrit Two has 4 energy');
		expect(kelthet.data.energy).toEqual(6, 'Kelthet has 6 energy');
		expect(enemyKorrit.data.energy).toEqual(2, 'Enemy Korrit has 2 energy');

		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Pack Korrit', 'It is Pack Korrit');
	});

	it('Morale (should not include itself)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		// Naroom/Underneath side
		const pruitt = new CardInGame(byName('Pruitt'), ACTIVE_PLAYER).addEnergy(10);
		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const korritTwo = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const packKorrit = new CardInGame(byName('Pack Korrit'), ACTIVE_PLAYER).addEnergy(2);

		// Cald side
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);
		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([pruitt]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([packKorrit, korrit, korritTwo]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: packKorrit,
			power: packKorrit.card.data.powers[0],
		};

		gameState.update(powerAction);
		expect(korrit.data.energy).toEqual(4, 'Korrit has 4 energy');
		expect(korritTwo.data.energy).toEqual(4, 'Korrit Two has 4 energy');
		expect(packKorrit.data.energy).toEqual(1, 'Pack Korrit has 1 energy');
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
		};

		gameState.update(passAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(3, 'Active player drawn 3 cards');
	});
});

describe('Undertow', () => {
	it('Target is own Creature', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const poad = new CardInGame(byName('Poad'), ACTIVE_PLAYER).addEnergy(7);
		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(1);
		const undertow = new CardInGame(byName('Undertow'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [poad]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([undertow]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: undertow,
				player: ACTIVE_PLAYER,
			},
		};

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			target: pharan,
			player: ACTIVE_PLAYER,
			generatedBy: undertow.id,
		};

		gameState.update(playAction);
		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No cards on the battlefield');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(1, 'One card in the deck');
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).card.card.name).toEqual('Pharan', 'It is Pharan');
		// WRONG
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Undertow', 'It is played Undertow');
	});
});

describe('Shimmer', () => {
	it('Creature Bond', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER).addEnergy(3);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(5);
		// Arderial player
		const shimmer = new CardInGame(byName('Shimmer'), ACTIVE_PLAYER);

		const thunderVashp = new CardInGame(byName('Thunder Vashp'), ACTIVE_PLAYER).addEnergy(5);
		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaArboll, thunderVashp, pharan, kelthet], [shimmer]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const passAction = {
			type: ACTION_PASS,
		};

		gameState.update(passAction);

		expect(lavaArboll.data.energy).toEqual(2, 'Lava Arboll lost 1 energy');
		expect(kelthet.data.energy).toEqual(4, 'Kelthet lost 1 energy');

		expect(thunderVashp.data.energy).toEqual(5, 'Thunder Vashp has 5 energy');
		expect(pharan.data.energy).toEqual(2, 'Pharan has 2 energy');
	});

	it('Creature Bond (energy on Shimmer, doesnt activate)', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER).addEnergy(3);
		const kelthet = new CardInGame(byName('Kelthet'), NON_ACTIVE_PLAYER).addEnergy(5);
		// Arderial player
		const shimmer = new CardInGame(byName('Shimmer'), ACTIVE_PLAYER).addEnergy(5);

		const thunderVashp = new CardInGame(byName('Thunder Vashp'), ACTIVE_PLAYER).addEnergy(5);
		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaArboll, thunderVashp, pharan, kelthet], [shimmer]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const passAction = {
			type: ACTION_PASS,
		};

		gameState.update(passAction);

		expect(lavaArboll.data.energy).toEqual(3, 'Lava Arboll lost no energy');
		expect(kelthet.data.energy).toEqual(5, 'Kelthet lost no energy');

		expect(thunderVashp.data.energy).toEqual(5, 'Thunder Vashp has 5 energy');
		expect(pharan.data.energy).toEqual(2, 'Pharan has 2 energy');
	});
});

describe('Abaquist', () => {
	it('Posess', () => {
		const ACTIVE_PLAYER = 104;
		const NON_ACTIVE_PLAYER = 12;
		const nimbulo = new CardInGame(byName('Nimbulo'), ACTIVE_PLAYER).addEnergy(10);
		const magam = new CardInGame(byName('Magam'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(3);
		const abaquist = new CardInGame(byName('Abaquist'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, abaquist], [nimbulo]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);

		const powerAction = {
			type: ACTION_POWER,
			source: abaquist,
			power: abaquist.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: abaquist.id,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: abaquist.id,
		};

		gameState.update(chooseCreatureAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		expect(gameState.state.continuousEffects).toHaveLength(2, 'Game has 2 continuous effects added');

		expect(gameState.modifyByStaticAbilities(lavaBalamant, PROPERTY_CONTROLLER)).toEqual(ACTIVE_PLAYER, 'Active player controls Lava Balamant now');
	});
});
