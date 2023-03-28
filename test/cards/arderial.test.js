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
	PROMPT_TYPE_PLAYER,
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
			player: NON_ACTIVE_PLAYER,
		};

		expect(gameState.state.activePlayer).toEqual(ACTIVE_PLAYER);
		gameState.update(activePlayerPassAction);
		// Opponents turn
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER);
		expect(gameState.state.step).toEqual(STEP_PRS_FIRST);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		expect(gameState.state.step).toEqual(STEP_ATTACK);
		// Attack
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// Creatures
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		gameState.update(opponentPassAction);
		// PRS
		expect(gameState.modifyByStaticAbilities(arboll, PROPERTY_CAN_BE_ATTACKED)).toEqual(false);
		expect(gameState.state.activePlayer).toEqual(NON_ACTIVE_PLAYER);

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

describe('Ayebaw', () => {
	it('can attack twice per turn', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER);
		ayebaw.addEnergy(2);
		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [ayebaw], [grega]);
		const gameState = new State({
			zones,
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

describe('Storm Ring', () => {
	it('adds energy to attacking creature', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;
		const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER).addEnergy(2);
		const stormRing = new CardInGame(byName('Storm Ring'), ACTIVE_PLAYER);

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
		grega.addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [ayebaw, stormRing], [grega]);
		const gameState = new State({
			zones,
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

		expect(ayebaw.data.energy).toEqual(3, 'Ayebaw has 3 energy now');
		expect(grega.data.energy).toEqual(7, 'Grega has 7 energy left');

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(4, 'Ayebaw has 4 energy');
		expect(grega.data.energy).toEqual(3, 'Grega has 3 energy left (second attack connected)');

		gameState.update(attackAction);

		expect(ayebaw.data.energy).toEqual(4, 'Ayebaw still has 4 energy');
		expect(grega.data.energy).toEqual(3, 'Grega has 3 energy left (third attack did not happen)');
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

describe('Adis', () => {
	it('Haunt', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(2);
		const jaela = new CardInGame(byName('Jaela'), NON_ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);
		const lavaAq = new CardInGame(byName('Lava Aq'), ACTIVE_PLAYER);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant], [grega]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([adis]);
		gameState.getZone(ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([jaela]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([lavaAq]);
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
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Zone is correct');
		expect(gameState.state.promptParams.zoneOwner).toEqual(ACTIVE_PLAYER, 'Zone owner is correct');
		expect(gameState.state.promptParams.restrictions).toEqual(null, 'No restrictions here');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Number of cards is correct (player only have one in hand)');
		expect(gameState.state.promptParams.cards).toHaveLength(1, 'Cards are correct (player only have one in hand)');
		expect(gameState.state.promptParams.cards[0].card).toEqual('Lava Aq', 'Card itself is correct (player only have one in hand)');
	});

	it('Haunt (on our turn)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(15);
		const adis = new CardInGame(byName('Adis'), ACTIVE_PLAYER).addEnergy(0);
		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER);
		const lavaAq = new CardInGame(byName('Lava Aq'), NON_ACTIVE_PLAYER);

		const pharan = new CardInGame(byName('Pharan'), ACTIVE_PLAYER).addEnergy(1);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [adis]);

		const gameState = new State({
			zones,
			step: STEP_ATTACK,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);
		gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([jaela]);
		gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).add([lavaAq]);
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
		expect(gameState.state.promptParams.zone).toEqual(ZONE_TYPE_HAND, 'Zone is correct');
		expect(gameState.state.promptParams.zoneOwner).toEqual(NON_ACTIVE_PLAYER, 'Zone owner is correct');
		expect(gameState.state.promptParams.restrictions).toEqual(null, 'No restrictions here');
		expect(gameState.state.promptParams.numberOfCards).toEqual(1, 'Number of cards is correct (player only have one in hand)');
		expect(gameState.state.promptParams.cards).toHaveLength(1, 'Cards are correct (player only have one in hand)');
		expect(gameState.state.promptParams.cards[0].card).toEqual('Lava Aq', 'Card itself is correct (player only have one in hand)');
		// expect(gameState.state.promptParams).toEqual({
		// 	zone: ZONE_TYPE_HAND,
		// 	cards: [],
		// 	restrictions: null,
		// 	zoneOwner: NON_ACTIVE_PLAYER,
		// 	numberOfCards: 3,
		// }, 'Game prompt params are right');
	});

	it('Haunt (no cards to discard)', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), NON_ACTIVE_PLAYER).addEnergy(2);
		const jaela = new CardInGame(byName('Jaela'), NON_ACTIVE_PLAYER);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), ACTIVE_PLAYER).addEnergy(5);
		const lavaAq = new CardInGame(byName('Lava Aq'), ACTIVE_PLAYER);
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

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
	});
});

describe('Epik', () => {
	it('Dream Feast', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(4);
		const adis = new CardInGame(byName('Adis'), ACTIVE_PLAYER).addEnergy(2);

		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER);
		const lavaArboll = new CardInGame(byName('Lava Arboll'), NON_ACTIVE_PLAYER);
		const balamantPup = new CardInGame(byName('Balamant Pup'), NON_ACTIVE_PLAYER);
		const eclipse = new CardInGame(byName('Eclipse'), NON_ACTIVE_PLAYER);
		const lavaBalamantInPlay = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(5);
		const epik = new CardInGame(byName('Epik'), ACTIVE_PLAYER).addEnergy(4);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamantInPlay, epik], [adis]);

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
			source: epik,
			power: epik.card.data.powers[0],
			generatedBy: epik.id,
		};
		
		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_PLAYER, 'Game is in player prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');

		const choosePlayerAction = {
			type: ACTION_RESOLVE_PROMPT,
			targetPlayer: NON_ACTIVE_PLAYER,
			generatedBy: epik.id,
		};

		gameState.update(choosePlayerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, 'Game is in cards prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');
		expect(gameState.state.promptParams.cards).toHaveLength(3);
		expect(gameState.state.promptParams.numberOfCards).toEqual(2);
		expect(gameState.state.promptParams.cards.map(({ card }) => card)).toEqual(['Lava Balamant', 'Lava Arboll', 'Balamant Pup']);

		const chooseCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [lavaBalamant, lavaArboll],
			generatedBy: epik.id,
		};

		gameState.update(chooseCardsAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
		expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(2);
		expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).cards.map(({ card }) => card.name)).toEqual(['Lava Balamant', 'Lava Arboll']);
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
			player: ACTIVE_PLAYER,
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
			player: ACTIVE_PLAYER,
		};

		gameState.update(passAction);

		expect(lavaArboll.data.energy).toEqual(3, 'Lava Arboll lost no energy');
		expect(kelthet.data.energy).toEqual(5, 'Kelthet lost no energy');

		expect(thunderVashp.data.energy).toEqual(5, 'Thunder Vashp has 5 energy');
		expect(pharan.data.energy).toEqual(2, 'Pharan has 2 energy');
	});
});

describe('Cloud Sceptre', () => {
	it('Generate', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 1;

		const jaela = new CardInGame(byName('Jaela'), ACTIVE_PLAYER).addEnergy(10);

		const cloudSceptre = new CardInGame(byName('Cloud Sceptre'), ACTIVE_PLAYER).addEnergy(5);

		const pharanOne = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);
		const pharanTwo = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);
		const pharanThree = new CardInGame(byName('Pharan'), ACTIVE_PLAYER);

		const xyxOne = new CardInGame(byName('Xyx'), ACTIVE_PLAYER);
		const xyxTwo = new CardInGame(byName('Xyx'), ACTIVE_PLAYER);
		const xyxThree = new CardInGame(byName('Xyx'), ACTIVE_PLAYER);


		const gameState = new State({
			zones: [
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([pharanOne, pharanTwo, pharanThree]),
				new Zone('NAP Hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
				new Zone('AP Deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([xyxOne, xyxTwo, xyxThree]),
				new Zone('NAP Deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
				new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
				new Zone('NAP Discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([jaela]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([cloudSceptre]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		const powerAction = {
			type: ACTION_POWER,
			source: cloudSceptre,
			power: cloudSceptre.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE);

		const chooseCardsAction = {
			type: ACTION_RESOLVE_PROMPT,
			cards: [pharanOne, pharanTwo, pharanThree],
			generatedBy: cloudSceptre.id,
		};

		gameState.update(chooseCardsAction);

		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(3);
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toEqual(0);
		expect(jaela.data.energy).toEqual(9);
	});
});