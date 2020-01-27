/* global expect, describe, it */
const moonlands = require('../src/index');
const {byName} = require('../src/cards');
const CardInGame = require('../src/classes/CardInGame');
const {caldDeck, naroomDeck} = require('./testData');

const {
	ACTION_SELECT,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_MAGI_OF_REGION,
	REGION_NAROOM,
	REGION_CALD,
	REGION_OROTHE,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,
	PROPERTY_ENERGIZE,
	PROMPT_TYPE_CHOOSE_CARDS,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_HAND,
} = require('../src/const');

const Zone = require('../src/classes/Zone');

const STEP_ENERGIZE = 0;
const STEP_PRS_FIRST = 1;
const STEP_ATTACK = 2;
const STEP_CREATURES = 3;
const STEP_PRS_SECOND = 4;
const STEP_DRAW = 5;

describe('Updating state with action', () => {
	it('Pass action', () => {
		const gameState = new moonlands.State();

		const passAction = {type: moonlands.ACTION_PASS};

		expect(gameState.getCurrentStep()).toEqual(STEP_ENERGIZE, 'Intial step is Energize');
		gameState.update(passAction);
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Final step is PRS');
		gameState.update(passAction);
	});

	it('Pass till second player gets priority', () => {
		const gameState = new moonlands.State();
		const passAction = {type: moonlands.ACTION_PASS};

		expect(gameState.getCurrentStep()).toEqual(STEP_ENERGIZE, 'Initial step is Energize');
		expect(gameState.getActivePlayer()).toEqual(0, 'Active player is player 0');
		gameState.update(passAction); // PRS
		gameState.update(passAction); // Attack
		gameState.update(passAction); // Creatures
		gameState.update(passAction); // PRS
		gameState.update(passAction); // Draw -> Energize -> PRS
		expect(gameState.getCurrentStep()).toEqual(STEP_PRS_FIRST, 'Initial step is Energize');
		expect(gameState.getActivePlayer()).toEqual(1, 'Active player is player 1');
	});

	it('Correct playing priority on each step', () => {
		const gameState = new moonlands.State();
		const passAction = {type: moonlands.ACTION_PASS};

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
			type: moonlands.ACTION_PASS,
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
			type: moonlands.ACTION_PASS,
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
			type: moonlands.ACTION_PASS,
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
			type: moonlands.ACTION_PASS,
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
		).toEqual(4, 'Two starting cards are in hand plus two initial cards');
		expect(
			gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards.map(card => card.card.name).sort(),
		).toEqual(
			['Arbolit', 'Quor Pup','Quor', 'Fire Chogo'].sort(),
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
			type: moonlands.ACTION_ENTER_PROMPT,
			player: ACTIVE_PLAYER,
		};

		const passAction = {type: moonlands.ACTION_PASS};

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
	});

	it('Resolving prompt should resume and apply saved actions', () => {
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
			type: moonlands.ACTION_ENTER_PROMPT,
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
});

describe('Effects', () => {
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
});

describe('Selector actions', () => {
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
		expect(grega.data.energy).toEqual(15, 'Grega has 15 energy');

		gameState.update(targetingAction);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No creatures in play');
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One creature in discard');
		expect(grega.data.energy).toEqual(19, 'Grega has 19 energy');
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

		gameState.update({type:moonlands.ACTION_PLAY, payload: {
			player: 0,
			card: arbolit,
		}});

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Arbolit', 'It is Arbolit');
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(13, 'Yaki\'s energy is 13');
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(1, 'Arbolit\'s energy is 1');
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

		expect(gameState.state.step).toEqual(0, 'Step is 0 (STEP_ENERGIZE)');
		expect(gameState.state.turn).toEqual(1, 'Turn is 1');
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true, 'One of the players goes first');
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst, 'First turn, player who goes first is active');
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

		expect(gameState.state.step).toEqual(0, 'Step is 0 (STEP_ENERGIZE)');
		expect(gameState.state.turn).toEqual(1, 'Turn is 1');
		expect(
			gameState.state.goesFirst == PLAYER_ONE || gameState.state.goesFirst == PLAYER_TWO,
		).toEqual(true, 'One of the players goes first');
		expect(gameState.state.activePlayer).toEqual(gameState.state.goesFirst, 'First turn, player who goes first is active');
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