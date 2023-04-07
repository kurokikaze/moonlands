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
	PROMPT_TYPE_PLAYER,
	PROMPT_TYPE_MAY_ABILITY,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,

	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
	EFFECT_TYPE_START_TURN,

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

describe('Motash', () => {
	it('Escape', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER).addEnergy(5);

		const motash = new CardInGame(byName('Motash'), NON_ACTIVE_PLAYER).addEnergy(5);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [ayebaw, mushroomHyren], [grega]);
		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
        
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([motash]);

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

	it('Escape (no energy on Motash)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER).addEnergy(5);

		const motash = new CardInGame(byName('Motash'), NON_ACTIVE_PLAYER).addEnergy(0);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [ayebaw, mushroomHyren], [grega]);
		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
        
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([motash]);

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
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_OWN_SINGLE_CREATURE);

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
	it('Defense (does not apply to Strag)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
	
		const strag = new CardInGame(byName('Strag'), NON_ACTIVE_PLAYER).addEnergy(5);
		const thunderVashp = new CardInGame(byName('Thunder Vashp'), ACTIVE_PLAYER).addEnergy(2);
	
		const gameState = new State({
			zones: [
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([strag]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([thunderVashp]),
			],
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
	
		const attackAction = {
			type: ACTION_ATTACK,
			source: thunderVashp,
			target: strag,
		};
			
		gameState.update(attackAction);
	
		expect(thunderVashp.data.energy).toEqual(2, 'Thunder Vashp loses no energy');
		expect(strag.data.energy).toEqual(3, 'Strag loses 2, gains no energy in process');
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

describe('Fossik', () => {
	it('Strengthen', () => {
		const ACTIVE_PLAYER = 411;
		const NON_ACTIVE_PLAYER = 12;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(10);
		// Underneath player
		const fossik = new CardInGame(byName('Fossik'), ACTIVE_PLAYER).addEnergy(5);

		const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER);
		const furok = new CardInGame(byName('Furok'), ACTIVE_PLAYER);
		const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [], [fossik]);

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
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY, 'Game is asking to use may ability');

		const allowReplaceEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: gameState.state.promptGeneratedBy,
		};

		gameState.update(allowReplaceEffect);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is asking to choose a creature');

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			promptType: PROMPT_TYPE_SINGLE_CREATURE,
			target: furok,
			player: ACTIVE_PLAYER,
			generatedBy: gameState.state.promptGeneratedBy,
		};

		gameState.update(chooseCreatureAction);
    
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		const napPassAction = {
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		};

		// PRS
		gameState.update(napPassAction);
		// Attack
		gameState.update(napPassAction);
		// Creatures
		gameState.update(napPassAction);
		// PRS
		gameState.update(napPassAction);
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER);

		// PRS
		expect(gameState.state.step).toEqual(STEP_PRS_FIRST);
		gameState.update(passAction);
		// Attack
		expect(gameState.state.step).toEqual(STEP_ATTACK);
		gameState.update(passAction);
		// Creatures
		expect(gameState.state.step).toEqual(STEP_CREATURES);
		gameState.update(passAction);
		// PRS

		expect(gameState.state.step).toEqual(STEP_PRS_SECOND);
		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		gameState.update(passAction);
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY, 'Game is asking to use may ability');
	});
});

describe('Parmalag', () => {
	it('Shield', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const parmalag = new CardInGame(byName('Parmalag'), ACTIVE_PLAYER).addEnergy(3);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const ulk = new CardInGame(byName('Ulk'), ACTIVE_PLAYER).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [parmalag, arbolit], [ulk]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: parmalag,
			power: parmalag.card.data.powers[0],
			generatedBy: parmalag.id,
		};

		gameState.update(powerAction);
		expect(parmalag.data.energy).toEqual(2, 'Parmalag uses Shield ability');

		const passAction = {
			type: ACTION_PASS,
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);

		const attackAction = {
			type: ACTION_ATTACK,
			source: parmalag,
			target: arbolit,
		};
		
		gameState.update(attackAction);

		expect(parmalag.data.energy).toEqual(2, 'Parmalag loses no energy in attack');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One card in opponents discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One card in opponents discard');
	});

	it('Attack without Shield', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const parmalag = new CardInGame(byName('Parmalag'), ACTIVE_PLAYER).addEnergy(3);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const ulk = new CardInGame(byName('Ulk'), ACTIVE_PLAYER).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [parmalag, arbolit], [ulk]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const attackAction = {
			type: ACTION_ATTACK,
			source: parmalag,
			target: arbolit,
		};
		
		gameState.update(attackAction);

		expect(parmalag.data.energy).toEqual(1, 'Parmalag loses 2 energy in attack');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One card in opponents discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Arbolit');
	});
});

describe('Thunderquake', () => {
	it('Casting', () => {
		const ACTIVE_PLAYER = 212;
		const NON_ACTIVE_PLAYER = 510;

		const ulk = new CardInGame(byName('Ulk'), ACTIVE_PLAYER).addEnergy(15);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const thunderquake = new CardInGame(byName('Thunderquake'), ACTIVE_PLAYER);
		const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
		const flameHyren = new CardInGame(byName('Flame Hyren'), ACTIVE_PLAYER).addEnergy(15);

		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(3);
		const quorPup = new CardInGame(byName('Quor Pup'), NON_ACTIVE_PLAYER).addEnergy(6);
		const diobor = new CardInGame(byName('Diobor'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag, quorPup, diobor, flameHyren], [ulk]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([thunderquake]);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				player: ACTIVE_PLAYER,
				card: thunderquake,
			},
		};

		gameState.update(spellAction);

		const choosingCostAction = {
			type: ACTION_RESOLVE_PROMPT,
			number: 5,
			generatedBy: thunderquake.id,            
		};

		gameState.update(choosingCostAction);

		const distributeDamageAction = {
			type: ACTION_RESOLVE_PROMPT,
			damageOnCreatures: {
				[quorPup.id]: 1,
				[diobor.id]: 4,
				[flameHyren.id]: 0,
			},
			generatedBy: thunderquake.id,
		};

		gameState.update(distributeDamageAction);

		expect(quorPup.data.energy).toEqual(5);
		expect(diobor.data.energy).toEqual(6);
	});
});

describe('Vulbor', () => {
	it('Mind Shock', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), ACTIVE_PLAYER).addEnergy(2);

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER);
		const balamantPup = new CardInGame(byName('Balamant Pup'), NON_ACTIVE_PLAYER);
		const eclipse = new CardInGame(byName('Eclipse'), NON_ACTIVE_PLAYER);
		const lavaBalamantInPlay = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(5);
		const vulbor = new CardInGame(byName('Vulbor'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamantInPlay, vulbor], [adis]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).add([lavaBalamant, lavaArboll, balamantPup, eclipse]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: vulbor,
			power: vulbor.card.data.powers[0],
			generatedBy: vulbor.id,
		};
		
		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_PLAYER, 'Game is in player prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const choosePlayerAction = {
			type: ACTION_RESOLVE_PROMPT,
			targetPlayer: NON_ACTIVE_PLAYER,
			generatedBy: vulbor.id,
		};

		gameState.update(choosePlayerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is in cards prompt state');
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.cards).toHaveLength(4);
		expect(gameState.state.promptParams.numberOfCards).toEqual(2);
		expect(gameState.state.promptParams.cards.map(({ card }) => card)).toEqual(['Lava Balamant', 'Lava Arboll', 'Balamant Pup', 'Eclipse']);

		const chooseCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [lavaBalamant, lavaArboll],
			generatedBy: vulbor.id,
		};

		gameState.update(chooseCardsAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).cards.map(({ card }) => card.name)).toEqual(['Lava Balamant', 'Lava Arboll']);
	});
});

describe('Giant Vulbor', () => {
	it('Mind Shock', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), ACTIVE_PLAYER).addEnergy(2);

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER);
		const balamantPup = new CardInGame(byName('Balamant Pup'), NON_ACTIVE_PLAYER);
		const eclipse = new CardInGame(byName('Eclipse'), NON_ACTIVE_PLAYER);
		const lavaBalamantInPlay = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(5);
		const giantVulbor = new CardInGame(byName('Giant Vulbor'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamantInPlay, giantVulbor], [adis]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).add([lavaBalamant, lavaArboll, balamantPup, eclipse]);
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: giantVulbor,
			power: giantVulbor.card.data.powers[0],
			generatedBy: giantVulbor.id,
		};
		
		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE, 'Game is in creature prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamantInPlay,
			generatedBy: giantVulbor.id,
		};

		gameState.update(chooseCreatureAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, 'Game is in cards prompt state');
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER, 'Game is prompting non-active player');
		expect(gameState.state.promptParams.cards).toHaveLength(4);
		expect(gameState.state.promptParams.numberOfCards).toEqual(2);
		expect(gameState.state.promptParams.cards.map(({ card }) => card)).toEqual(['Lava Balamant', 'Lava Arboll', 'Balamant Pup', 'Eclipse']);

		const chooseCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [lavaBalamant, lavaArboll],
			generatedBy: giantVulbor.id,
		};

		gameState.enableDebug();
		gameState.update(chooseCardsAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).cards.map(({ card }) => card.name)).toEqual(['Lava Balamant', 'Lava Arboll']);
		expect(lavaBalamantInPlay.data.energy).toEqual(5, 'Lava Balamant lost no energy');
	});
});

describe('Ulk', () => {
	it('Strengthen', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const korrit = new CardInGame(byName('Korrit'), ACTIVE_PLAYER).addEnergy(3);
		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(2);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const ulk = new CardInGame(byName('Ulk'), ACTIVE_PLAYER).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [korrit, arbolit, mushroomHyren], [ulk]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: NON_ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const passAction = {
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		};

		gameState.update(passAction);
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'New turn has started');

		expect(korrit.data.energy).toEqual(4, 'Korrit got 1 energy');
		expect(mushroomHyren.data.energy).toEqual(2, 'Hyren got no energy');
	});

	it('Strengthen (no korrits)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const mushroomHyren = new CardInGame(byName('Mushroom Hyren'), ACTIVE_PLAYER).addEnergy(2);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const ulk = new CardInGame(byName('Ulk'), ACTIVE_PLAYER).addEnergy(5);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(5);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, mushroomHyren], [ulk]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: NON_ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const passAction = {
			type: ACTION_PASS,
			player: NON_ACTIVE_PLAYER,
		};

		var startTurnId = 'testId';

		gameState.setOnAction((action) => {
			if (action.type === ACTION_EFFECT && action.effectType === EFFECT_TYPE_START_TURN) {
				startTurnId = action.generatedBy;
			}
		});
		gameState.update(passAction);
		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER, 'New turn has started');

		const metaData = gameState.getSpellMetadata(startTurnId);
		expect(metaData.selected).toBeInstanceOf(Array);
		expect(metaData.selected).toHaveLength(0);
		expect(mushroomHyren.data.energy).toEqual(2, 'Hyren got no energy');
	});
});
