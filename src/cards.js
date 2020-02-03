const Card = require('./classes/Card');

const {
	/* eslint-disable no-unused-vars */
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_ENTER_PROMPT,
	ACTION_CALCULATE,
	ACTION_GET_PROPERTY_VALUE,

	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_SET,

	PROPERTY_ENERGY_COUNT,
	PROPERTY_CONTROLLER,
	PROPERTY_TYPE,
	PROPERTY_REGION,
	PROPERTY_COST,
	PROPERTY_ID,
	PROPERTY_ENERGIZE,
	PROPERTY_MAGI_STARTING_ENERGY,
	PROPERTY_ATTACKS_PER_TURN,

	REGION_ARDERIAL,
	REGION_CALD,
	REGION_NAROOM,
	REGION_OROTHE,
	REGION_UNDERNEATH,
	REGION_BOGRATH,
	REGION_UNIVERSAL,

	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

	SELECTOR_OPPONENT_ID,
	SELECTOR_OWN_MAGI,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_CREATURES_AND_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES,
	SELECTOR_OPPONENT_CREATURES,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_TOP_MAGI_OF_PILE,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,

	EFFECT_TYPE_NONE,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_BEFORE_DAMAGE,

	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_NUMBER,

	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_REGION,

	COST_X,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	/* eslint-enable no-unused-vars */
} = require('./const');

const effect = data => ({
	type: ACTION_EFFECT,
	...data,
});

const select = data => ({
	type: ACTION_SELECT,
	...data,
});

const getPropertyValue = data => ({
	type: ACTION_GET_PROPERTY_VALUE,
	...data,
});

const prompt = data => ({
	type: ACTION_ENTER_PROMPT,
	...data,
});

const cards = [
	new Card('Alaban', TYPE_CREATURE, REGION_ARDERIAL, 6, {
		powers: [
			{
				name: 'Undream',
				text: 'Choose a creature in play. Return the chosen Creature to its owner\'s hand. Discard the chosen Creature\'s energy.',
				cost: 5,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_IN_PLAY,
						destinationZone: ZONE_TYPE_HAND,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Water of Life', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		staticAbilities: [{
			name: 'Invigorate',
			text: 'Your Magi\'s energize rate is increased by one',
			selector: SELECTOR_OWN_MAGI,
			property: PROPERTY_ENERGIZE,
			modifier: {
				operator: CALCULATION_ADD,
				operandOne: 1,
			},
		}],
	}),
	new Card('Thermal Blast', TYPE_SPELL, REGION_CALD, 3, {
		effects: [
			effect({
				effectType: EFFECT_TYPE_ROLL_DIE,
			}),
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
				target: '$target',
				amount: '$roll_result',
			}),
		],
	}),
	new Card('Ayebaw', TYPE_CREATURE, REGION_ARDERIAL, 5, {
		attacksPerTurn: 2,
	}),
	new Card('Paralit', TYPE_CREATURE, REGION_OROTHE, 3, {
		powers: [
			{
				name: 'Life Channel',
				cost: 0,
				text: 'Discard Paralit from play. Add 5 energy to your Magi. Discard one energy from each of your Creatures.',
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$selected',
						amount: 5,
					}),
					select({
						selector: SELECTOR_OWN_CREATURES,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Magma Armor', TYPE_RELIC, REGION_CALD, 0, {
		triggerEffects: [
			{
				name: 'Defense',
				text: 'When a Creature attacks your Magi directly, add two Energy to your Magi before energy is removed',
				find: {
					effectType: EFFECT_TYPE_BEFORE_DAMAGE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_MAGI,
							propertyTwo: null,
						},
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						}
					],
				},
				effects: [
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '%target',
						amount: 2,
					},
				],
			}
		],
	}),
	new Card('Giant Parathin', TYPE_CREATURE, REGION_OROTHE, 10, {
		powers: [
			{
				name: 'Intercharge',
				cost: 0,
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_ACTIVE_MAGI,
						destinationZone: ZONE_TYPE_MAGI_PILE,
						target: '$selected',
						bottom: true,
					}),
					select({
						selector: SELECTOR_TOP_MAGI_OF_PILE,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_MAGI_PILE,
						destinationZone: ZONE_TYPE_ACTIVE_MAGI,
						target: '$selected',
					}),
					getPropertyValue({
						property: PROPERTY_MAGI_STARTING_ENERGY,
						target: '$new_card',
						variable: 'starting_energy',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$new_card',
						amount: '$starting_energy',
					}),
				],
			},
		],
	}),
	new Card('Kelthet', TYPE_CREATURE, REGION_CALD, 4, {
		powers: [
			{
				name: 'Consume',
				text: 'Choose your Creature. Move all of the chosen Creature\'s energy to Kelthet.',
				cost: 1,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
					}),
					getPropertyValue({
						target: '$target',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'creature_energy',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$target',
						target: '$sourceCreature',
						amount: '$creature_energy',
					}),
				],
			},
		],
	}),
	new Card('Deep Hyren', TYPE_CREATURE, REGION_OROTHE, 6, {
		powers: [
			{
				name: 'Hurricane',
				cost: 6,
				text: 'Choose your Creature. Discard chosen Creature from play. Discard 3 energy from each non-Orothe Creature in play.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$target',
					}),
					select({
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_OROTHE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$selected',
						amount: 3,
					}),
					select({
						selector: SELECTOR_MAGI_NOT_OF_REGION,
						region: REGION_OROTHE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
						target: '$selected',
						amount: 3,
					}),
				],
			},
		],
	}),
	new Card('Magma Hyren', TYPE_CREATURE, REGION_CALD, 3, {
		powers: [
			{
				name: 'Fireball',
				cost: 1,
				text: 'Choose a Creature. Discard one energy from the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$target',
						amount: 1,
					}),
				],
			},
			{
				name: 'Healing Flame',
				cost: 1,
				text: 'Choose another Creature. Add 2 energy to the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
						source: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 2,
					}),
				],
			},
		],
	}),
	new Card('Quor', TYPE_CREATURE, REGION_CALD, 4, {
		triggerEffects: [
			{
				name: 'Battering ram',
				text: 'When Quor attacks an opposing Creature, discard two energy from that Creature\'s Magi',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_CREATURE,
							propertyTwo: null,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_ID,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						}
					],
				},
				effects: [
					{
						type: ACTION_SELECT,
						selector: SELECTOR_ENEMY_MAGI,
						variable: 'enemyMagi',
					},
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
						target: '$enemyMagi',
						amount: 2,
					},
				],
			}
		],
	}),
	new Card('Robe of Vines', TYPE_RELIC, REGION_NAROOM, 0, {
		triggerEffects: [
			{
				name: 'Strenghten',
				text: 'Whenever you play a Naroom creature, add one additional energy to it.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_REGION,
							comparator: '=',
							objectTwo: REGION_NAROOM,
							propertyTwo: null,
						},
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						}
					],
				},
				effects: [
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$creature_created',
						amount: 1,
					}
				],
			},
		],
	}),
	new Card('Ashgar', TYPE_MAGI, REGION_CALD, null, {
		startingEnergy: 10,
		energize: 6,
		startingCards: ['Arbolit', 'Quor', 'Flame Geyser'],
		triggerEffects: [
			{
				find: {
					effectType: EFFECT_TYPE_BEFORE_DAMAGE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_MAGI,
							propertyTwo: null,
						},
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						}
					],
				},
				effects: [
					{
						type: ACTION_GET_PROPERTY_VALUE,
						property: PROPERTY_CONTROLLER,
						target: '%self',
						variable: 'controller',
					},
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					},
				],
			}
		],
	}),
	new Card('Grega', TYPE_MAGI, REGION_CALD, null, {
		startingEnergy: 10,
		energize: 5,
		startingCards: ['Arbolit', 'Quor Pup', 'Fire Flow'],
		powers: [
			{
				name: 'Thermal Blast',
				cost: 2,
				text: 'Roll one die. Choose a Creature or Magi in play. Discard energy equal to the die roll from the chosen Creature or Magi',
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
						target: '$target',
						amount: '$roll_result',
					}),
				],
			},
		]
	}),
	new Card('Book of Ages', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Lore',
				cost: 2,
				text: 'Draw a card',
				effects: [
					{
						type: ACTION_GET_PROPERTY_VALUE,
						property: PROPERTY_CONTROLLER,
						target: '$source',
						variable: 'controller',
					},
					{
						type: ACTION_EFFECT,
						effect: EFFECT_TYPE_DRAW,
						player: '$controller',
					}
				],
			}
		],
	}),
	new Card('Sinder', TYPE_MAGI, REGION_CALD, null, {
		startingEnergy: 12,
		energize: 5,
		startingCards: ['Fire Grag', 'Arbolit', 'Flame Control'],
		powers: [
			{
				name: 'Refresh',
				cost: 1,
				text: 'Choose a Creature. Add 2 energy to the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 2,
					}),
				],
			},
		]
	}),
	new Card('Arbolit', TYPE_CREATURE, REGION_CALD, 1, {
		powers: [
			{
				name: 'Healing Flame',
				cost: 0,
				text: 'Choose a Creature in play. Discard Arbolit from play. Add 2 energy to the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 2,
					}),
				],
			},
		],
	}),
	new Card('Fire Grag', TYPE_CREATURE, REGION_CALD, 6, {
		powers: [{
			name: 'Metabolize',
			cost: 3,
			text: 'Choose your Creature and opponent\'s Creature. Discard twice your Creature\'s energy from opponent\'s Creature. Discard your Creature from play.',
			effects: [
				prompt({
					promptType: PROMPT_TYPE_SINGLE_CREATURE,
					variable: 'yourCreature',
				}),
				prompt({
					promptType: PROMPT_TYPE_SINGLE_CREATURE,
					variable: 'opponentCreature',
				}),
				getPropertyValue({
					target: '$yourCreature',
					property: PROPERTY_ENERGY_COUNT,
				}),
				{
					type: ACTION_CALCULATE,
					operator: CALCULATION_DOUBLE,
					operandOne: '$creaturePower',
					variable: 'doubleEnergy', 
				},
				effect({
					effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
					target: '$opponentCreature',
					amount: '$doubleEnergy',
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '$yourCreature',
				}),
			],
		}],
	}),
	new Card('Green Stuff', TYPE_CREATURE, REGION_BOGRATH, 0, {energize: 1}),
	new Card('Giant Carillion', TYPE_CREATURE, REGION_NAROOM, 8, {
		powers: [
			{
				name: 'Stomp',
				cost: 6,
				text: 'Choose a Creature. Discard chosen Creature from play.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$target',
					}),                    
				],
			},
		],
	}),
	new Card('Quor Pup', TYPE_CREATURE, REGION_CALD, 2, {
		triggerEffects: [
			{
				name: 'Charge',
				text: 'When Quor Pup attacks, move up to two energy from it to your Magi',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_ID,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						},
					],
				},
				effects: [
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					getPropertyValue({
						target: '$selected',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'magi_energy',
					}),
					{
						type: ACTION_CALCULATE,
						operator: CALCULATION_MIN,
						operandOne: '$magi_energy',
						operandTwo: 2,
						variable: 'max_tribute',
					},
					prompt({
						promptType: PROMPT_TYPE_NUMBER,
						min: 0,
						max: '$max_tribute',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$selected',
						target: '%self',
						amount: '$number',
					}),
				],
			},
		],
	}),
	new Card('Fire Flow', TYPE_SPELL, REGION_CALD, 1, {
		text: 'Choose a Creature. Move up to 4 energy from your Magi to chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
			}),
			select({
				selector: SELECTOR_OWN_MAGI,
			}),
			getPropertyValue({
				target: '$selected',
				property: PROPERTY_ENERGY_COUNT,
				variable: 'magi_energy',
			}),
			{
				type: ACTION_CALCULATE,
				operator: CALCULATION_MIN,
				operandOne: '$magi_energy',
				operandTwo: 4,
				variable: 'max_amount',
			},
			prompt({
				promptType: PROMPT_TYPE_NUMBER,
				min: 1,
				max: '$max_amount',
			}),
			select({
				selector: SELECTOR_OWN_MAGI,
			}),
			effect({
				effectType: EFFECT_TYPE_MOVE_ENERGY,
				source: '$selected',
				target: '$target',
				amount: '$number',
			}),
		],
	}),
	new Card('Stagadan', TYPE_CREATURE, REGION_NAROOM, 3, {
		canAttackMagiDirectly: true,
	}),
	new Card('Fire Ball', TYPE_SPELL, REGION_CALD, 2, {
		text: 'Choose a Creature or Magi. Discard 2 energy from chosen Creature or Magi.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
				target: '$target',
				amount: '2',
			}),
		],
	}),
	new Card('Pharan', TYPE_CREATURE, REGION_ARDERIAL, 3, {
		powers: [
			{
				name: 'Healing Rain',
				cost: 0,
				text: 'Choose a Creature or Magi. Discard Pharan from play and move its energy to chosen Creature or Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					getPropertyValue({
						target: '$yourCreature',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'energyToRestore',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$targetMagi',
						amount: '$energyToRestore',
					}),
				],
			},
		],
	}),
	new Card ('Lava Aq', TYPE_CREATURE, REGION_CALD, 4, {
		powers: [
			{
				name: 'Firestorm',
				cost: 2,
				text: 'Choose your Creature. Discard the chosen Creature from play. Discard 1 energy from each non-Cald Creature and Magi in play.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$target',
					}),
					select({
						type: ACTION_SELECT,
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_CALD,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$selected',
						amount: 1,
					}),
					select({
						selector: SELECTOR_MAGI_NOT_OF_REGION,
						region: REGION_CALD,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
						target: '$selected',
						amount: 1,
					}),                    
				],
			},
		],
	}),
	new Card('Furok', TYPE_CREATURE, REGION_NAROOM, 4, {
		triggerEffects: [
			{
				name: 'Retrieve',
				text: 'When a defending Creature removes energy from Furok, place half of that energy, rounded up, on your Magi',
				find: {
					effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_ID,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						},
					],
				},
				effects: [
					{
						type: ACTION_GET_PROPERTY_VALUE,
						target: '%targetAtStart',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'furokEnergy',
					},
					{
						type: ACTION_CALCULATE,
						operator: CALCULATION_MIN,
						operandOne: '%amount',
						operandTwo: '$furokEnergy',
						variable: 'damageToFurok',
					},
					{
						type: ACTION_CALCULATE,
						operator: CALCULATION_HALVE_ROUND_UP,
						operandOne: '$damageToFurok',
						variable: 'energyToRetrieve',
					},
					{
						type: ACTION_SELECT,
						selector: SELECTOR_OWN_MAGI,
						variable: 'ownMagi',
					},
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$ownMagi',
						amount: '$energyToRetrieve',
					},
				],
			},
		],
	}),
	new Card('Lava Balamant', TYPE_CREATURE, REGION_CALD, 5, {
		triggerEffects: [{
			name: 'Charge',
			text: 'If Lava Balamant attacks, add one energy to it.',
			find: {
				effectType: EFFECT_TYPE_CREATURE_ATTACKS,
				conditions: [
					{
						objectOne: 'source',
						propertyOne: PROPERTY_ID,
						comparator: '=',
						objectTwo: 'self',
						propertyTwo: PROPERTY_ID,
					},
				],
			},
			effects: [
				{
					type: ACTION_EFFECT,
					effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
					target: '%self',
					amount: 1,
				},
			],
		}],
	}),
	new Card('Lava Arboll', TYPE_CREATURE, REGION_CALD, 2, {
		powers: [
			{
				name: 'Healing Flame',
				cost: 2,
				text: 'Choose a Creature or Magi in play. Add 3 energy to the chosen Creature or Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
						target: '$target',
						amount: 3,
					}),
				],
			},
		],
	}),
	new Card('Magam', TYPE_MAGI, REGION_CALD, null, {
		startingEnergy: 13,
		energize: 5,
		startingCards: ['Flame Control', 'Lava Balamant', 'Arbolit'],
		powers: [
			{
				name: 'Vitalize',
				cost: 4,
				text: 'Choose a Creature in play with less than its starting energy. Restore that Creature to its starting energy.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						targetRestriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
					}),
					effect({
						effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Pruitt', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 15,
		energize: 5,
		startingCards: ['Vinoc', 'Carillion', 'Grow'],
		powers: [
			{
				name: 'Refresh',
				cost: 2,
				text: 'Choose a creature in play. Add 3 energy to the chosen Creature.',
				effects: [
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					getPropertyValue({
						target: '$selected',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'magi_energy',
					}),
					{
						type: ACTION_CALCULATE,
						operator: CALCULATION_MIN,
						operandOne: '$magi_energy',
						operandTwo: 7,
						variable: 'max_tribute',
					},
					prompt({
						promptType: PROMPT_TYPE_NUMBER,
						min: 1,
						max: '$max_tribute',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$selected',
						target: '$sourceCreature',
						amount: '$number',
					}),
				],
			},
		],
	}),
	new Card('Poad', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 13,
		energize: 5,
		startingCards: ['Leaf Hyren', 'Balamant Pup', 'Vortex of Knowledge'],
		powers: [
			{
				name: 'Heroes\' Feast',
				cost: 2,
				text: 'Add one energy to each of your Creatures',
				effects: [
					select({
						selector: SELECTOR_OWN_CREATURES,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Agovo', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
		powers: [
			{
				name: 'Lore',
				cost: 2,
				text: 'Draw a card',
				effects: [
					{
						type: ACTION_GET_PROPERTY_VALUE,
						target: '$sourceCreature',
						property: PROPERTY_CONTROLLER,
						variable: 'controller',
					},
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}
				],
			},
		],
	}),
	new Card('Sea Barl', TYPE_CREATURE, REGION_OROTHE, 4, {
		powers: [
			{
				name: 'Lore',
				cost: 3,
				text: 'Draw a card',
				effects: [
					{
						type: ACTION_GET_PROPERTY_VALUE,
						target: '$sourceCreature',
						property: PROPERTY_CONTROLLER,
						variable: 'controller',
					},
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}
				],
			},
		],
	}),	
	new Card('Vortex of Knowledge', TYPE_SPELL, REGION_NAROOM, 1, {
		text: 'You and your opponent each draw two cards.',
		effects: [
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_DRAW,
				player: '$player',
			},
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_DRAW,
				player: '$player',
			},
			{
				type: ACTION_SELECT,
				selector: SELECTOR_OPPONENT_ID,
				opponentOf: '$player',
				variable: 'opponent',
			},
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_DRAW,
				player: '$opponent',
			},
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_DRAW,
				player: '$opponent',
			},			
		],
	}),
	new Card('Timber Hyren', TYPE_CREATURE, REGION_NAROOM, 7, {
		powers: [
			{
				name: 'Tribute',
				cost: 0,
				text: 'Move up to five energy from your Magi to Timber Hyren.',
				effects: [
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					getPropertyValue({
						target: '$selected',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'magi_energy',
					}),
					{
						type: ACTION_CALCULATE,
						operator: CALCULATION_MIN,
						operandOne: '$magi_energy',
						operandTwo: 5,
						variable: 'max_tribute',
					},
					prompt({
						promptType: PROMPT_TYPE_NUMBER,
						min: 1,
						max: '$max_tribute',
					}),				
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$selected',
						target: '$sourceCreature',
						amount: '$number',
					}),
				],
			},
		],
	}),
	new Card('Fire Chogo', TYPE_CREATURE, REGION_CALD, 2, {
		powers: [
			{
				name: 'Heat Storm',
				cost: 0,
				text: 'Discard Fire Chogo from play. Discard one energy from each non-Cald Creature in play.',
				effects: [
					select({
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_CALD,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
						amount: 1,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Carillion', TYPE_CREATURE, REGION_NAROOM, 4, {
		replacementEffects: [
			{
				name: 'Resilience',
				text: 'If Carillion attacks a Creature that starts the attack with less than three energy, Carillion loses no energy in attack.',
				find: {
					effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_ID,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						},
						{
							objectOne: 'sourceAtStart',
							propertyOne: PROPERTY_ENERGY_COUNT,
							comparator: '<',
							objectTwo: 3,
							propertyTwo: null,
						}
					],
				},
				replaceWith: {
					effectType: EFFECT_TYPE_NONE,
				},
			}
		],
	}),
	new Card('Rudwot', TYPE_CREATURE, REGION_NAROOM, 3, {
		triggerEffects: [
			{
				name: 'Trample',
				text: 'If Rudwot attack a creature that starts the attack with less than three energy, add two energy to Rudwot before energy is removed',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_ID,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						},
						{
							objectOne: 'targetAtStart',
							propertyOne: PROPERTY_ENERGY_COUNT,
							comparator: '<',
							objectTwo: 3,
							propertyTwo: null,
						}
					],
				},
				effects: [
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 2,
					},
				],
			}
		],
	}),
	new Card('Yaki', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 14,
		energize: 5,
		startingCards: ['Arboll', 'Weebo', 'Furok', 'Grow'],
		staticAbilities: [
			{
				name: 'Double strike',
				text: 'Your creatures may attack twice each turn',
				selector: SELECTOR_OWN_CREATURES,
				property: PROPERTY_ATTACKS_PER_TURN,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: 2,
				},
			},
		],
	}),
	new Card('Arboll', TYPE_CREATURE, REGION_NAROOM, 3, {
		powers: [
			{
				name: 'Life Channel', 
				cost: 0,
				text: 'Choose a Magi in play. Discard Arboll from play. Add four energy to the chosen Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$targetMagi',
						amount: 4,
					}),
				],
			},
		],
	}),
	new Card('Weebo', TYPE_CREATURE, REGION_NAROOM, 2, {
		powers: [
			{
				name: 'Vitalize',
				cost: 2,
				text: 'Choose a creature in play with energy less than its starting energy. Restore that creature to its starting energy.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
						targetRestriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
					}),
					effect({
						effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Balamant', TYPE_CREATURE, REGION_NAROOM, 6, {
		powers: [
			{
				name: 'Hunt',
				cost: 2,
				text: 'Choose a Magi in play. Discard 4 energy from the chosen Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
						target: '$targetMagi',
						amount: 4,
					}),
				],
			},
		],
	}),
	new Card('Diobor', TYPE_CREATURE, REGION_CALD, 6, {
		powers: [
			{
				name: 'Fireball',
				cost: 0,
				text: 'Choose a Creature in play. Discard Diobor from play. Discard 2 energy from the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$target',
						amount: 2,
					}),
				],
			},
			{
				name: 'Energy Transfer',
				cost: COST_X,
				text: 'Add X energy to your Magi',
				effects: [
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$selected',
						amount: '$chosen_cost',
					}),
				],
			},
		],
	}),
	new Card('Drakan', TYPE_CREATURE, REGION_CALD, 6, {
		powers: [
			{
				name: 'Thermal Blast',
				cost: 3,
				text: 'Roll one die. Choose a Creature in play. Discard energy equal to the dice roll from the chosen Creature.',
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$target',
						amount: '$roll_result',
					}),
				],
			},
		],
	}),
	new Card('Cave Hyren', TYPE_CREATURE, REGION_UNDERNEATH, 5, {
		powers: [
			{
				name: 'Energy Transfer',
				cost: COST_X,
				text: 'Choose a Creature in play. Add X energy to the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: '$chosen_cost',
					}),
				],
			},
		],
	}),
	new Card('Leaf Hyren', TYPE_CREATURE, REGION_NAROOM, 4, {
		powers: [
			{
				name: 'Energy Transfer',
				cost: COST_X,
				text: 'Choose a Creature. Add X energy to the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: '$chosen_cost',
					}),
				],
			},
		],
	}),
	new Card('Flame Geyser', TYPE_SPELL, REGION_CALD, 7, {
		text: 'Discard 3 energy from each Creature and Magi.',
		effects: [
			select({
				selector: SELECTOR_CREATURES_AND_MAGI,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
				target: '$selected',
				amount: 3,
			}),
		],
	}),
	new Card('Syphon Stone', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Syphon', 
				cost: 0,
				text: 'Choose a Creature. Discard Syphon Stone. Discard 1 energy from the chosen Creature.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$source',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Grow', TYPE_SPELL, REGION_NAROOM, 3, {
		text: 'Roll a die. Choose a Creature. Add energy equal to the die roll to the chosen Creature.',
		effects: [
			effect({
				effectType: EFFECT_TYPE_ROLL_DIE,
			}),
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
			}),
			effect({
				effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
				target: '$target',
				amount: '$roll_result',
			}),
		],
	}),
	new Card('Submerge', TYPE_SPELL, REGION_OROTHE, 2, {
		text: 'Choose an Orothe Creature. Add 3 energy to the chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
				restriction: RESTRICTION_REGION,
				restrictionValue: REGION_OROTHE,
			}),
			effect({
				effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
				target: '$target',
				amount: 3,
			}),
		],
	}),
	new Card('Coral Hyren', TYPE_CREATURE, REGION_OROTHE, 4, {
		triggerEffects: [
			{
				name: 'Spelltap',
				text: 'When you play an Orothe spell, add 1 energy to Coral Hyren.',
				find: {
					effectType: EFFECT_TYPE_PLAY_SPELL,
					conditions: [
						{
							objectOne: 'card',
							propertyOne: PROPERTY_REGION,
							comparator: '=',
							objectTwo: REGION_OROTHE,
							propertyTwo: null,
						},
						{
							objectOne: 'card',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						}
					],
				},
				effects: [
					{
						type: ACTION_EFFECT,
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 1,
					},
				],
			},
		],
	}),
];

const byName = name => cards.find(card => card.name === name);

module.exports = {
	cards,
	byName,
};
