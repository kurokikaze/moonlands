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

	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
} from '../../src/const.ts';

import {
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_PRS_SECOND,
	createZones,
} from '../utils';

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

describe('Scroll of Fire', () => {
	it('Fire Chogo', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;
		const STARTING_ENERGY = 5;

		const mobis = new CardInGame(byName('Mobis'), NON_ACTIVE_PLAYER).addEnergy(12);
		const orathan = new CardInGame(byName('Orathan'), NON_ACTIVE_PLAYER).addEnergy(STARTING_ENERGY);

		const scrollOfFire = new CardInGame(byName('Scroll of Fire'), ACTIVE_PLAYER);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const fireChogo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER).addEnergy(2);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), ACTIVE_PLAYER).addEnergy(STARTING_ENERGY);
		const balamantPup = new CardInGame(byName('Balamant Pup'), ACTIVE_PLAYER).addEnergy(STARTING_ENERGY);
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

		expect(orathan.data.energy).toEqual(STARTING_ENERGY - 2);
		expect(balamantPup.data.energy).toEqual(STARTING_ENERGY - 2);
		expect(lavaArboll.data.energy).toEqual(STARTING_ENERGY);
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

describe('Flame Control', () => {
	it('Rearranges energy on creatures', () => {
		const ACTIVE_PLAYER = 212;
		const NON_ACTIVE_PLAYER = 510;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(15);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(10);
		const flameControl = new CardInGame(byName('Flame Control'), ACTIVE_PLAYER);

		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag, quorPup, diobor], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([flameControl]);

		const playAction = {
			type: ACTION_PLAY,
			payload: {
				card: flameControl,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(playAction);
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES);

		const resolvePromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			energyOnCreatures: {
				[arbolit.id]: 1,
				[fireGrag.id]: 5,
				[quorPup.id]: 10,
				[diobor.id]: 9,
			},
			player: ACTIVE_PLAYER,
			generatedBy: flameControl.id,
		};

		gameState.update(resolvePromptAction);

		expect(arbolit.data.energy).toEqual(1);
		expect(fireGrag.data.energy).toEqual(5);
		expect(quorPup.data.energy).toEqual(10);
		expect(diobor.data.energy).toEqual(9);
	});
});

describe('Flame Hyren', () => {
	it('Distributes energy among creatures', () => {
		const ACTIVE_PLAYER = 212;
		const NON_ACTIVE_PLAYER = 510;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(15);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(10);
		const flameHyren = new CardInGame(byName('Flame Hyren'), ACTIVE_PLAYER).addEnergy(15);

		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(3);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag, quorPup, diobor, flameHyren], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);

		const powerAction = {
			type: ACTION_POWER,
			source: flameHyren,
			power: flameHyren.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES);

		const resolvePromptAction = {
			type: ACTION_RESOLVE_PROMPT,
			energyOnCreatures: {
				[arbolit.id]: 0,
				[fireGrag.id]: 5,
				[quorPup.id]: 10,
				[diobor.id]: 0,
			},
			player: ACTIVE_PLAYER,
			generatedBy: flameHyren.id,
		};

		gameState.update(resolvePromptAction);

		expect(arbolit.data.energy).toEqual(5);
		expect(fireGrag.data.energy).toEqual(9);
		expect(quorPup.data.energy).toEqual(16);
		expect(diobor.data.energy).toEqual(10);
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