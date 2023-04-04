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
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_MAY_ABILITY,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,

	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,

	PROPERTY_CONTROLLER,
	PROPERTY_PROTECTION,

	PROTECTION_FROM_SPELLS,
	PROTECTION_TYPE_GENERAL,

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

describe('Hubdra\'s Spear', () => {
	it('Stab', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(12);

		const hubdrasSpear = new CardInGame(byName('Hubdra\'s Spear'), ACTIVE_PLAYER);
		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [hubdrasSpear], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: hubdrasSpear,
			power: hubdrasSpear.card.data.powers[0],
		};

		gameState.update(powerAction);
		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAGI_WITHOUT_CREATURES);


		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: grega,
			generatedBy: hubdrasSpear.id,
		};

		gameState.update(targetingAction);

		expect(grega.data.energy).toEqual(1);
	});

	it('Stab (cannot stab Magi with creatures)', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(12);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const hubdrasSpear = new CardInGame(byName('Hubdra\'s Spear'), ACTIVE_PLAYER);
		const platheus = new CardInGame(byName('Platheus'), ACTIVE_PLAYER).addEnergy(2);
		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(10);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [hubdrasSpear, arbolit, platheus], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		const powerAction = {
			type: ACTION_POWER,
			source: hubdrasSpear,
			power: hubdrasSpear.card.data.powers[0],
		};

		gameState.update(powerAction);
		expect(gameState.state.prompt).toEqual(false);
		expect(grega.data.energy).toEqual(12);
	});

	it('Stab (opponent Magi have creature stolen)', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER).addEnergy(12);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(2);

		const hubdrasSpear = new CardInGame(byName('Hubdra\'s Spear'), ACTIVE_PLAYER);
		const mobis = new CardInGame(byName('Mobis'), ACTIVE_PLAYER).addEnergy(10);
		const abaquist = new CardInGame(byName('Abaquist'), ACTIVE_PLAYER).addEnergy(10);
		const platheus = new CardInGame(byName('Platheus'), ACTIVE_PLAYER).addEnergy(2);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [hubdrasSpear, arbolit, abaquist, platheus], [mobis]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]);

		// Abaquist
		const abaquistPowerAction = {
			type: ACTION_POWER,
			source: abaquist,
			player: ACTIVE_PLAYER,
			power: abaquist.card.data.powers[0],
		};

		// gameState.enableDebug();
		gameState.update(abaquistPowerAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED);

		const targetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: arbolit,
			generatedBy: abaquist.id,
			player: ACTIVE_PLAYER,
		};

		gameState.update(targetAction);
		expect(gameState.state.prompt).toEqual(false);

		const powerAction = {
			type: ACTION_POWER,
			source: hubdrasSpear,
			power: hubdrasSpear.card.data.powers[0],
		};

		gameState.update(powerAction);
		expect(gameState.state.prompt).toEqual(true);

		const spearTargetAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: grega,
			generatedBy: hubdrasSpear.id,
			player: ACTIVE_PLAYER,
		};
		gameState.update(spearTargetAction);
		expect(gameState.state.prompt).toEqual(false);
		expect(grega.data.energy).toEqual(1);
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
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(6, 'O\'Qua has 6 energy left');
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
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).card.data.energy).toEqual(23, 'Jaela has 23 energy because of Legacy trigger (15 starting, 5 energize, 3 from Mobis)');
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
			{
				restrictions: [
					{
						type: RESTRICTION_REGION,
						value: REGION_OROTHE,
					}
				],
			},
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

describe('Abaquist', () => {
	it('Posess', () => {
		const ACTIVE_PLAYER = 104;
		const NON_ACTIVE_PLAYER = 12;
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(10);
		const magam = new CardInGame(byName('Magam'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(3);
		const abaquist = new CardInGame(byName('Abaquist'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, abaquist], [whall]);

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

		const seenActions = [];

		gameState.setOnAction(function(action) {
			seenActions.push(action);
		});

		gameState.update(powerAction);


		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptParams.restrictions).toHaveLength(1);
		expect(gameState.state.promptParams.restrictions[0].type).toEqual(RESTRICTION_ENERGY_LESS_THAN);
		expect(gameState.state.promptParams.restrictions[0].value).toEqual(6);

		expect(seenActions[1].restrictions[0].type).toEqual(RESTRICTION_ENERGY_LESS_THAN);
		expect(seenActions[1].restrictions[0].value).toEqual(6);

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
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).cards.length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Abaquist', 'It is Abaquist');

		const staticAbilityAction = seenActions.find(a => a.type === ACTION_EFFECT && a.effectType === EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT);
		expect(staticAbilityAction).not.toBeNull();
		expect(staticAbilityAction.staticAbilities).toHaveLength(1);
		expect(staticAbilityAction.staticAbilities[0].modifier.operandOne).toEqual(ACTIVE_PLAYER);
		expect(staticAbilityAction.staticAbilities[0].selectorParameter).toEqual(lavaBalamant.id);
	});

	it('Activating ability of a posessed creature', () => {
		const ACTIVE_PLAYER = 104;
		const NON_ACTIVE_PLAYER = 12;
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(10);
		const magam = new CardInGame(byName('Magam'), NON_ACTIVE_PLAYER).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), NON_ACTIVE_PLAYER).addEnergy(3);
		const abaquist = new CardInGame(byName('Abaquist'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, abaquist], [whall]);

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
		expect(gameState.state.promptParams.restrictions).toHaveLength(1);
		expect(gameState.state.promptParams.restrictions[0].type).toEqual(RESTRICTION_ENERGY_LESS_THAN);
		expect(gameState.state.promptParams.restrictions[0].value).toEqual(6);

		const chooseCreatureAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: arbolit,
			player: ACTIVE_PLAYER,
			generatedBy: abaquist.id,
		};

		gameState.update(chooseCreatureAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');

		expect(gameState.state.continuousEffects).toHaveLength(2, 'Game has 2 continuous effects added');

		expect(gameState.modifyByStaticAbilities(arbolit, PROPERTY_CONTROLLER)).toEqual(ACTIVE_PLAYER, 'Active player controls Lava Balamant now');

		const arbolitPowerAction = {
			type: ACTION_POWER,
			source: arbolit,
			power: arbolit.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: abaquist.id,
		};

		gameState.update(arbolitPowerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptPlayer).toEqual(ACTIVE_PLAYER, 'Game is prompting active player');		
	});

	it('Choosing posessed creature as your own', () => {
		const ACTIVE_PLAYER = 104;
		const NON_ACTIVE_PLAYER = 12;
		const whall = new CardInGame(byName('Whall'), ACTIVE_PLAYER).addEnergy(10);
		const giantParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER);
		const magam = new CardInGame(byName('Magam'), NON_ACTIVE_PLAYER).addEnergy(10);
		const lavaBalamant = new CardInGame(byName('Lava Balamant'), NON_ACTIVE_PLAYER).addEnergy(3);
		const abaquist = new CardInGame(byName('Abaquist'), ACTIVE_PLAYER).addEnergy(6);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [lavaBalamant, abaquist], [whall]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});

		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([magam]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([giantParathin]);

		const powerAction = {
			type: ACTION_POWER,
			source: abaquist,
			power: abaquist.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: abaquist.id,
		};

		const seenActions = [];

		gameState.setOnAction(function(action) {
			seenActions.push(action);
		});

		gameState.update(powerAction);

		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptParams.restrictions).toHaveLength(1);
		expect(gameState.state.promptParams.restrictions[0].type).toEqual(RESTRICTION_ENERGY_LESS_THAN);
		expect(gameState.state.promptParams.restrictions[0].value).toEqual(6);

		expect(seenActions[1].restrictions[0].type).toEqual(RESTRICTION_ENERGY_LESS_THAN);
		expect(seenActions[1].restrictions[0].value).toEqual(6);

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
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).cards.length).toEqual(1, 'Active player has 1 card in discard');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Abaquist', 'It is Abaquist');

		const staticAbilityAction = seenActions.find(a => a.type === ACTION_EFFECT && a.effectType === EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT);
		expect(staticAbilityAction).not.toBeNull();
		expect(staticAbilityAction.staticAbilities).toHaveLength(1);
		expect(staticAbilityAction.staticAbilities[0].modifier.operandOne).toEqual(ACTIVE_PLAYER);
		expect(staticAbilityAction.staticAbilities[0].selectorParameter).toEqual(lavaBalamant.id);

		const whallPowerAction = {
			type: ACTION_POWER,
			source: whall,
			power: whall.card.data.powers[0],
			player: ACTIVE_PLAYER,
			generatedBy: whall.id,
		};

		// gameState.enableDebug(true);
		gameState.update(whallPowerAction);
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');

		const chooseBalamantAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: lavaBalamant,
			player: ACTIVE_PLAYER,
			generatedBy: whall.id,
		};

		gameState.update(chooseBalamantAction);
		expect(gameState.state.prompt).toEqual(true, 'Game is in prompt state');
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, 'Game is waiting for a card from hand');

		const chooseCardAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: giantParathin,
			player: ACTIVE_PLAYER,
			generatedBy: whall.id,
		};

		gameState.update(chooseCardAction);

		expect(gameState.state.prompt).toEqual(false, 'Game is not in prompt state');
	});
});

describe('Orlon', () => {
	it('Anti-Magic', () => {
		const ACTIVE_PLAYER = 422;
		const NON_ACTIVE_PLAYER = 1310;

		const welliskPup = new CardInGame(byName('Wellisk Pup'), ACTIVE_PLAYER).addEnergy(2);
		const seaBarl = new CardInGame(byName('Sea Barl'), ACTIVE_PLAYER).addEnergy(4);
		const orlon = new CardInGame(byName('Orlon'), ACTIVE_PLAYER).addEnergy(7);
		const bwill = new CardInGame(byName('Bwill'), ACTIVE_PLAYER).addEnergy(4);

		const nimbulo = new CardInGame(byName('Nimbulo'), NON_ACTIVE_PLAYER).addEnergy(5);
		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [welliskPup, seaBarl, bwill], [orlon]);

		const gameState = new State({
			zones,
			step: STEP_PRS_SECOND,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([nimbulo]);

		expect(gameState.modifyByStaticAbilities(welliskPup, PROPERTY_PROTECTION)).toEqual({
			type: PROTECTION_TYPE_GENERAL,
			from: PROTECTION_FROM_SPELLS,
		});

		expect(gameState.modifyByStaticAbilities(seaBarl, PROPERTY_PROTECTION)).toEqual({
			type: PROTECTION_TYPE_GENERAL,
			from: PROTECTION_FROM_SPELLS,
		});

		expect(gameState.modifyByStaticAbilities(bwill, PROPERTY_PROTECTION)).toEqual(undefined);
	});
});

describe('Orthea', () => {
	it('Spell (Fireball)', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const orthea = new CardInGame(byName('Orthea'), NON_ACTIVE_PLAYER).addEnergy(12);
		const orathan = new CardInGame(byName('Orathan'), NON_ACTIVE_PLAYER).addEnergy(5);

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
		const fireBall = new CardInGame(byName('Fire Ball'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [orathan], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([orthea]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fireBall]);

		const spellAction = {
			type: ACTION_PLAY,
			payload: {
				card: fireBall,
				player: ACTIVE_PLAYER,
			},
		};

		gameState.update(spellAction);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: orthea,
			generatedBy: fireBall.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_MAY_ABILITY);
		expect(gameState.state.promptGeneratedBy).toEqual(orthea.id);

		const allowTriggerEffect = {
			type: ACTION_RESOLVE_PROMPT,
			useEffect: true,
			generatedBy: gameState.state.promptGeneratedBy,
		};

		gameState.update(allowTriggerEffect);

		expect(gameState.state.prompt).toEqual(true);
		expect(gameState.state.promptPlayer).toEqual(NON_ACTIVE_PLAYER);
		expect(gameState.state.promptType).toEqual(PROMPT_TYPE_SINGLE_CREATURE_FILTERED);
		expect(gameState.state.promptGeneratedBy).toEqual(fireBall.id);

		const chooseOrathanAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: orathan,
			generatedBy: fireBall.id,
		};

		gameState.update(chooseOrathanAction);

		expect(orathan.data.energy).toEqual(7); // Orathan has 7 energy: 5 starting and 2 from fireball
		expect(orthea.data.energy).toEqual(10); // Orthea still loses energy
	});

	it('Power (Shouldnt trigger)', () => {
		const ACTIVE_PLAYER = 432;
		const NON_ACTIVE_PLAYER = 710;

		const orthea = new CardInGame(byName('Orthea'), NON_ACTIVE_PLAYER).addEnergy(12);
		const orathan = new CardInGame(byName('Orathan'), NON_ACTIVE_PLAYER).addEnergy(5);

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(6);
		const fireBall = new CardInGame(byName('Fire Ball'), ACTIVE_PLAYER);

		const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [orathan], [grega]);

		const gameState = new State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([orthea]);
		gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).add([fireBall]);

		const powerAction = {
			type: ACTION_POWER,
			source: grega,
			power: grega.card.data.powers[0],
			player: ACTIVE_PLAYER,
		};

		gameState.update(powerAction);

		const targetingAction = {
			type: ACTION_RESOLVE_PROMPT,
			target: orthea,
			generatedBy: grega.id,
		};

		gameState.update(targetingAction);

		expect(gameState.state.prompt).toEqual(false);
		expect(orthea.data.energy).toBeLessThan(12); // Orthea still loses energy
	});
});
