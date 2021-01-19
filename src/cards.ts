import Card from './classes/Card';

import {
	/* eslint-disable no-unused-vars */
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_ENTER_PROMPT,
	ACTION_CALCULATE,
	ACTION_GET_PROPERTY_VALUE,
	ACTION_PLAY,

	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_SET,

	ACTION_PROPERTY,

	PROPERTY_ENERGY_COUNT,
	PROPERTY_CONTROLLER,
	PROPERTY_TYPE,
	PROPERTY_REGION,
	PROPERTY_COST,
	PROPERTY_ID,
	PROPERTY_ENERGIZE,
	PROPERTY_MAGI_STARTING_ENERGY,
	PROPERTY_ATTACKS_PER_TURN,
	PROPERTY_POWER_COST,
	PROPERTY_CREATURE_TYPES,
	PROPERTY_STATUS_DEFEATED_CREATURE,

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
	SELECTOR_MAGI,
	SELECTOR_OWN_MAGI,
	SELECTOR_CREATURES,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_RELICS,
	SELECTOR_CREATURES_AND_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_TYPE,
	SELECTOR_OWN_CREATURES,
	SELECTOR_ENEMY_CREATURES,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_TOP_MAGI_OF_PILE,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_OWN_CREATURES_OF_TYPE,
	SELECTOR_CREATURES_OF_TYPE,
	SELECTOR_OWN_SPELLS_IN_HAND,
	SELECTOR_OTHER_CREATURES_OF_TYPE,
	SELECTOR_OWN_CREATURES_WITH_STATUS,
	SELECTOR_CREATURES_WITHOUT_STATUS,

	EFFECT_TYPE_END_OF_TURN,
	EFFECT_TYPE_NONE,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
	EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
	EFFECT_TYPE_ADD_DELAYED_TRIGGER,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
	EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_CONDITIONAL,
	EFFECT_TYPE_START_OF_TURN,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
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
	EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
	EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,

	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,

	RESTRICTION_OWN_CREATURE,
	RESTRICTION_OPPONENT_CREATURE,
	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_REGION,
	RESTRICTION_TYPE,
	RESTRICTION_CREATURE_TYPE,
	RESTRICTION_PLAYABLE,
	RESTRICTION_ENERGY_LESS_THAN,
	RESTRICTION_CREATURE_WAS_ATTACKED,

	COST_X,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_DECK,

	STATUS_BURROWED,
	PROPERTY_ABLE_TO_ATTACK,
	RESTRICTION_STATUS,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
	EFFECT_TYPE_ATTACK,
	/* eslint-enable no-unused-vars */
} from './const';

import {
	ConditionType,
	CalculateParams,
	CalculateType, 
	EffectType,
	PromptParams,
	PromptType,
	PropertyGetterType,
	PropertyGetterParams,
	SelectType,
	RefinedSelectParams,
	OperatorType
} from './types';

const effect = (data: any): EffectType => ({
	type: ACTION_EFFECT,
	...data,
});

const select = (data: RefinedSelectParams): SelectType => ({
	type: ACTION_SELECT,
	...data,
});

const getPropertyValue = (data: PropertyGetterParams): PropertyGetterType => ({
	type: ACTION_GET_PROPERTY_VALUE,
	...data,
});

const prompt = (data: PromptParams): PromptType => ({
	type: ACTION_ENTER_PROMPT,
	...data,
});

const calculate = (data: CalculateParams): CalculateType => ({
	type: ACTION_CALCULATE,
	...data,
});

const CONDITION_TARGET_IS_SELF: ConditionType = {
	objectOne: 'target',
	propertyOne: PROPERTY_ID,
	comparator: '=',
	objectTwo: 'self',
	propertyTwo: PROPERTY_ID,
};

const CONDITION_SOURCE_IS_SELF: ConditionType = {
	objectOne: 'source',
	propertyOne: PROPERTY_ID,
	comparator: '=',
	objectTwo: 'self',
	propertyTwo: PROPERTY_ID,
};

export const cards = [
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
						effectType: EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Corf', TYPE_CREATURE, REGION_OROTHE, 3, {
		powers: [
			{
				name: 'Final Blow',
				text: 'Choose a creature in play that was attacked this turn. Discard chosen Creature from play',
				cost: 3,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_CREATURE_WAS_ATTACKED,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
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
	new Card('Amulet of Ombor', TYPE_RELIC, REGION_OROTHE, 0, {
		powers: [
			{
				name: 'Energy Boost',
				text: 'Roll a die. 1-3: add one energy to each of opponents Creatures. 4-5: Add two energy to a Creature of your choice. 6: Add four energy to a Creature of your choice.',
				cost: 0,
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
					}),
					effect({ // 1-3: Add one energy to each of opponent's creatures
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '<=',
								objectTwo: 3,
								propertyTwo: null,
							}
						],
						thenEffects: [
							select({
								selector: SELECTOR_ENEMY_CREATURES,
							}),
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$selected',
								amount: 1,
							}),
						],
					}),
					effect({ // 4: add two energy to target Creature
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '=',
								objectTwo: 4,
								propertyTwo: null,
							}
						],
						thenEffects: [
							prompt({
								promptType: PROMPT_TYPE_SINGLE_CREATURE,
							}),
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$target',
								amount: 2,
							}),
						],
					}),
					effect({ // 5: add two energy to target Creature
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '=',
								objectTwo: 5,
								propertyTwo: null,
							}
						],
						thenEffects: [
							prompt({
								promptType: PROMPT_TYPE_SINGLE_CREATURE,
							}),
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$target',
								amount: 2,
							}),
						],
					}),
					effect({ // 6: add four energy to target Creature
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '=',
								objectTwo: 6,
								propertyTwo: null,
							}
						],
						thenEffects: [
							prompt({
								promptType: PROMPT_TYPE_SINGLE_CREATURE,
							}),
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$target',
								amount: 4,
							}),
						],
					}),					
				],
			},
		],
	}),
	new Card('Hyren\'s Call', TYPE_SPELL, REGION_NAROOM, 6, {
		text: 'Search your deck for Hyren Creature card, place into play with its starting energy. That Creature cannot attack this turn.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
				zone: ZONE_TYPE_DECK,
				zoneOwner: '$player',
				restrictions: [
					{
						type: RESTRICTION_TYPE,
						value: TYPE_CREATURE,
					},
					{
						type: RESTRICTION_CREATURE_TYPE,
						value: 'Hyren',
					},
				],
				numberOfCards: 1,
				variable: 'chosenHyren',
			}),
			effect({
				effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
				sourceZone: ZONE_TYPE_DECK,
				destinationZone: ZONE_TYPE_IN_PLAY,
				target: '$chosenHyren',
			}),
			getPropertyValue({
				property: PROPERTY_COST,
				target: '$new_card',
				variable: 'startingEnergy',
			}),
			effect({
				effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
				target: '$new_card',
				amount: '$startingEnergy',
			}),
			effect({
				effectType: EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
				target: '$new_card',
			}),
		],
	}),
	new Card('O\'Qua', TYPE_MAGI, REGION_OROTHE,null, {
		startingEnergy: 11,
		energize: 4,
		startingCards: ['Orothean Belt', 'Submerge', 'Implosion'],
		powers: [
			{
				name: 'Conjure',
				cost: 4,
				text: 'Search your deck for any Orothe Creature. Play that Creature with four energy counters. It may not attack this turn.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_DECK,
						zoneOwner: '$player',
						restrictions: [
							{
								type: RESTRICTION_TYPE,
								value: TYPE_CREATURE,
							},
							{
								type: RESTRICTION_REGION,
								value: REGION_OROTHE,
							},
						],
						numberOfCards: 1,
						variable: 'orotheCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_DECK,
						destinationZone: ZONE_TYPE_IN_PLAY,
						target: '$orotheCreature',
					}),
					effect({
						effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
						target: '$new_card',
						amount: 4,
					}),
					effect({
						effectType: EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
						target: '$new_card',
					}),
				],
			},
		],
	}),
	new Card('Ebylon', TYPE_MAGI, REGION_OROTHE, null, {
		startingEnergy: 13,
		energize: 5,
		startingCards: ['Orpus', 'Sea Barl', 'Submerge'],
		powers: [
			{
				name: 'Shatterwave',
				text: 'Choose a Relic in play. Discard the chosen Relic from play.',
				cost: 1,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_RELIC,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Relic Stalker', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Pound Pound Pound',
				text: 'Choose a Relic in play. Discard Relic Stalker from play. Discard the chosen Relic from play.',
				cost: 1,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_RELIC,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$source',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Dream Balm', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Vitalize',
				cost: 2,
				text: 'Choose a Creature in play with less than its starting energy. Discard Dream Balm from play. Restore that Creature to its starting energy.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$source',
					}),
					effect({
						effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Thermal Blast', TYPE_SPELL, REGION_CALD, 3, {
		effects: [
			effect({
				effectType: EFFECT_TYPE_ROLL_DIE,
			}),
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
				message: 'Choose Creature or Magi to discard ${roll_result} energy from',
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
				target: '$target',
				amount: '$roll_result',
			}),
		],
	}),
	new Card('Ground Breaker', TYPE_SPELL, REGION_UNDERNEATH, 3, {
		text: 'Roll one die. Discard that amount of energy from a chosen Magi.',
		effects: [
			effect({
				effectType: EFFECT_TYPE_ROLL_DIE,
			}),
			prompt({
				promptType: PROMPT_TYPE_SINGLE_MAGI,
				message: 'Choose Magi to discard ${roll_result} energy from',
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
				target: '$target',
				amount: '$roll_result',
			}),
		],
	}),
	new Card('Ayebaw', TYPE_CREATURE, REGION_ARDERIAL, 5, {
		attacksPerTurn: 2,
	}),
	new Card('Adis', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 15,
		energize: 5,
		startingCards: ['Epik', 'Orish', 'Shooting Star'],
		triggerEffects: [
			{
				name: 'Haunt',
				text: 'When Adis is defeated, each opponent discards three cards',
				find: {
					effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						target: '$source',
						variable: 'adisController', 
					}),
					select({
						selector: SELECTOR_OPPONENT_ID,
						opponentOf: '$adisController',
						variable: 'opponentId',
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_HAND,
						player: '$opponentId',
						zoneOwner: '$opponentId',
						numberOfCards: 3,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
						target: '$targetCards',
					}),
				],
			},
		],
	}),
	new Card('Bottomless Pit', TYPE_SPELL, REGION_UNDERNEATH, 3, {
		text: 'Choose a Creature in play with less than five energy. Discard the chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
				restriction: RESTRICTION_ENERGY_LESS_THAN,
				restrictionValue: 5,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
				target: '$target',
			}),
		],
	}),
	new Card('Rod of Coals', TYPE_RELIC, REGION_CALD, 0, {
		powers: [{
			name: 'Snuff Out',
			text: 'Choose a Creature in play with 1 energy. Discard the chosen Creature from play.',
			cost: 0,
			effects: [
				prompt({
					promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
					restriction: RESTRICTION_ENERGY_LESS_THAN,
					restrictionValue: 2,
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '$target',
				}),
			],	
		}],
	}),
	new Card('Thunder Vashp', TYPE_CREATURE, REGION_ARDERIAL, 2, {
		powers: [{
			name: 'Thunderclap',
			text: 'Choose a Creature in play with less than 4 energy. Discard Thunder Vashp from play. Discard the chosen Creature from play.',
			cost: 0,
			effects: [
				prompt({
					promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
					restriction: RESTRICTION_ENERGY_LESS_THAN,
					restrictionValue: 4,
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '$source',
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '$target',
				}),
			],	
		}],
	}),
	new Card('Warrior\'s Boots', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Warpath',
				text: 'Discard Warrior\'s Boots from play. Immediately select and play a Creature from your hand. You must still pay all costs of the Creature.',
				cost: 0,
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$source',
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_HAND,
						zoneOwner: '$player',
						numberOfCards: 1,
						restrictions: [
							{
								type: RESTRICTION_TYPE,
								value: TYPE_CREATURE,
							},
							{
								type: RESTRICTION_PLAYABLE,
							}
						],
					}),
					{
						type: ACTION_PLAY,
						sourceZone: ZONE_TYPE_HAND,
						destinationZone: ZONE_TYPE_IN_PLAY,
						forcePriority: true,
						card: '$targetCards'
					},
				],
			},
		],
	}),
	new Card('Whall', TYPE_MAGI, REGION_OROTHE, null, {
		startingEnergy: 10,
		energize: 5,
		startingCards: ['Deep Hyren', 'Karak', 'Submerge'],
		powers: [
			{
				name: 'Dream Twist',
				cost: 5,
				text: 'Choose your Creature and discard it from play. Choose a Creature from your hand. Put it onto the battlefield. Place energy on it equal to its starting energy.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$target',
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_HAND,
						restriction: RESTRICTION_TYPE,
						restrictionValue: TYPE_CREATURE,
						zoneOwner: '$player',
						numberOfCards: 1,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_HAND,
						destinationZone: ZONE_TYPE_IN_PLAY,
						target: '$targetCards'
					}),
					getPropertyValue({
						property: PROPERTY_COST,
						target: '$new_card',
						variable: 'startingEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$new_card',
						amount: '$startingEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
						target: '$new_card',
					}),
				],
			},
		],
	}),
	new Card('Paralit', TYPE_CREATURE, REGION_OROTHE, 3, {
		powers: [
			{
				name: 'Life Channel',
				text: 'Discard Paralit from play. Add five energy to your Magi. Discard one energy from each of your Creatures in play.',
				cost: 1,
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$source',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
						variable: 'ownMagi',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$ownMagi',
						amount: 5,
					}),
					select({
						selector: SELECTOR_OWN_CREATURES,
						variable: 'selected',
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
	new Card('Gruk', TYPE_MAGI, REGION_UNDERNEATH, null, {
		startingEnergy: 13,
		energize: 5,
		startingCards: ['Agovo', 'Crystal Arboll', 'Gloves of Crystal'],
		powers: [
			{
				name: 'Undream',
				cost: 1,
				text: 'Choose one of your Creatures in play. Return it to your hand and place its energy to Gruk.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Crystal Arboll', TYPE_CREATURE, REGION_UNDERNEATH, 2, {
		powers: [
			{
				name: 'Healing Light',
				text: 'Choose any one Creature in play. Discard Crystal Arboll from play. Add two energy to the chosen Creature. Add two additional energy if that Creature is Underneath.',
				cost: 0,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$source',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 2,
					}),
					effect({
						effectType: EFFECT_TYPE_CONDITIONAL,
						chosenCreature: '$target',
						conditions: [
							{
								objectOne: 'chosenCreature',
								propertyOne: PROPERTY_REGION,
								comparator: '=',
								objectTwo: REGION_UNDERNEATH,
								propertyTwo: null,
							}
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$target',
								amount: 2,
							}),
						],
					}),

				]
			},
		],
	}),
	new Card('Motash', TYPE_MAGI, REGION_UNDERNEATH, null, {
		startingEnergy: 16,
		energize: 4,
		startingCards: ['Crystal Arboll', 'Mushroom Hyren', 'Digging Goggles'],
		replacementEffects: [
			{
				name: 'Escape',
				text: 'Whenever one of your Creatures is defeated in attack, return it to your hand instead of discarding it',
				find: {
					effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
						{
							objectOne: 'attack',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: true,
							propertyTwo: null,
						}
					],
				},
				replaceWith: effect({
					effectType: EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
					target: '%target',
				}),
			},
		],
	}),
	new Card('Motash\'s Staff', TYPE_RELIC, REGION_UNDERNEATH, 0, {
		replacementEffects: [{
			name: 'Dreamcatch',
			text: 'If one of your creatures is returned to your hand, place its energy back on your Magi instead of discarding it',
			find: {
				effectType: EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
				conditions: [
					{
						objectOne: 'target',
						propertyOne: PROPERTY_CONTROLLER,
						comparator: '=',
						objectTwo: 'self',
						propertyTwo: PROPERTY_CONTROLLER,
					},
					{
						objectOne: 'source',
						propertyOne: PROPERTY_CONTROLLER,
						comparator: '!=',
						objectTwo: 'self',
						propertyTwo: PROPERTY_CONTROLLER,
					}
				],
			},
			replaceWith: {
				effectType: EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
				target: '%target',
			},
		}],
	}),
	new Card('Scroll of Fire', TYPE_RELIC, REGION_CALD, 0, {
		triggerEffects: [
			{
				name: 'Pyromancy',
				text: 'Whenever a Spell you control discards energy from any number of Creatures, discard one additional energy from each of those Creatures.',
				find: {
					effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_SPELL,
							propertyTwo: null,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
			{
				name: 'Pyromancy',
				text: 'Whenever a Power on a Creature you control discards energy from any number of Creatures, discard one additional energy from each of those Creatures.',
				find: {
					effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
					conditions: [
						{
							objectOne: 'power',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: true,
							propertyTwo: null,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_CREATURE,
							propertyTwo: null,
						},
						{
							objectOne: 'player',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Vellup', TYPE_CREATURE, REGION_ARDERIAL, 2, {
		triggerEffects: [
			{
				name: 'Flock',
				text: 'When you play Vellup, you may search your deck for another Vellup. Show it to your opponent and put it into your hand. Shuffle the deck.',
				mayEffect: true,
				find: {
					effectType: EFFECT_TYPE_CREATURE_ENTERS_PLAY,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_DECK,
						zoneOwner: '$player',
						restrictions: [{
							type: RESTRICTION_CREATURE_TYPE,
							value: 'Vellup',
						}],
						numberOfCards: 1,
						variable: 'targetCard',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_DECK,
						destinationZone: ZONE_TYPE_HAND,
						target: '$targetCard',
					}),
				],
			},
		],
	}),
	new Card('Orothean Belt', TYPE_RELIC, REGION_OROTHE, 0, {
		triggerEffects: [
			{
				name: 'Hydromancy',
				text: 'Whenever a Spell you control adds energy to any number of Creatures, add one additional energy to each of those Creatures.',
				find: {
					effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_SPELL,
							propertyTwo: null,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Valkan', TYPE_MAGI, REGION_CALD, null, {
		startingEnergy: 12,
		energize: 4,
		startingCards: ['Arbolit', 'Quor', 'Spirit of the Flame'],
		triggerEffects: [
			{
				name: 'Pyromancy',
				text: 'Whenever a Spell Valkan plays discards energy from any number of Creatures, discard two additional energy from each of those Creatures.',
				find: {
					effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_SPELL,
							propertyTwo: null,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '%target',
						amount: 2,
					}),
				],
			},
		],
	}),
	new Card('Arderial\'s Crown', TYPE_RELIC, REGION_ARDERIAL, 0, {
		triggerEffects: [
			{
				name: 'Strengthen',
				text: 'At the start of your turn choose any one Creature in play. Add one energy to chosen Creature.',
				find: {
					effectType: EFFECT_TYPE_START_OF_TURN,
					conditions: [
						{
							objectOne: 'player',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Ulk', TYPE_MAGI, REGION_UNDERNEATH, null, {
		startingEnergy: 12,
		energize: 6,
		startingCards: ['Korrit', 'Gum-Gum', 'Burrow'],
		triggerEffects: [
			{
				name: 'Strengthen',
				text: 'At the start of your turn add one energy to each Korrit you control',
				find: {
					effectType: EFFECT_TYPE_START_OF_TURN,
					conditions: [
						{
							objectOne: 'player',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					select({
						selector: SELECTOR_OWN_CREATURES_OF_TYPE,
						creatureType: 'Korrit',
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
	new Card('Strag', TYPE_MAGI, REGION_UNDERNEATH, null, {
		startingEnergy: 13,
		energize: 5,
		startingCards: ['Giant Parmalag', 'Gum-Gum', 'Bottomless Pit'],
		triggerEffects: [
			{
				name: 'Defense',
				text: 'Whenever one of your creature is attacked, add one energy to it before energy is removed',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Stradus', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 12,
		energize: 5,
		startingCards: ['Lightning Hyren', 'Lightning', 'Shooting Star'],
		triggerEffects: [
			{
				name: 'Backlash',
				text: 'Whenever one of your Creatures is attacked, you may discard one energy from the attacking Creature before energy is removed.',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
						{
							objectOne: 'target',
							propertyOne: PROPERTY_TYPE,
							comparator: '=',
							objectTwo: TYPE_CREATURE,
							propertyTwo: null,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '%source',
						amount: 1,
					}),
				],
				mayEffect: true,
			},
		],
	}),
	new Card('Gum-Gum', TYPE_CREATURE, REGION_UNDERNEATH, 2, {
		replacementEffects: [
			{
				name: 'Slide',
				text: 'If Gum-Gum is attacked, you may switch it with any other Creature you control before energy is removed.',
				find: {
					effectType: EFFECT_TYPE_ATTACK,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				replaceWith: [
					prompt({
						promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
						variable: 'target',
					}),
					effect({
						effectType: EFFECT_TYPE_ATTACK,
						source: '%source',
						target: '$target',
						additionalAttackers: '%additionalAttackers',
					})
				],
				mayEffect: true,
			},
		],
	}),
	new Card('Trug', TYPE_MAGI, REGION_UNDERNEATH, null, {
		startingEnergy: 9,
		energize: 5,
		powers: [{
			name: 'Cataclysm',
			cost: 15,
			text: 'Discard all cards in play. Defeat all Magi.',
			effects: [
				select({
					selector: SELECTOR_CREATURES,
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
				}),
				select({
					selector: SELECTOR_RELICS,
				}),
				effect({
					effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
					target: '$target',
				}),
				select({
					selector: SELECTOR_MAGI,
				}),
				effect({
					effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
				})
			]
		}],
	}),
	new Card('Korrit', TYPE_CREATURE, REGION_UNDERNEATH, 3, {
		canPackHunt: true,
	}),
	new Card('Giant Korrit', TYPE_CREATURE, REGION_UNDERNEATH, 5, {
		canPackHunt: true,
	}),
	new Card('Pack Korrit', TYPE_CREATURE, REGION_UNDERNEATH, 1, {
		powers: [
			{
				name: 'Morale',
				cost: 1,
				text: 'Add 1 energy to each other Korrit in play',
				effects: [
					select({
						selector: SELECTOR_OTHER_CREATURES_OF_TYPE,
						creatureType: 'Korrit',
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
	new Card('Nimbulo', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 14,
		energize: 5,
		startingCards: ['Fog Bank', 'Lovian', 'Shooting Star'],
		powers: [
			{
				name: 'Energy Drain',
				text: 'Choose any two Creatures in play. Move one energy from one creature to another',
				cost: 1,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
						message: 'Choose a Creature to drain one energy from',
						variable: 'donor',
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
						message: 'Choose a Creature to give one energy to',
						variable: 'recipient',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$donor',
						target: '$recipient',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Undertow', TYPE_SPELL, REGION_OROTHE, 5, {
		text: 'Choose any one Creature in play. Discard the chosen Creature from play, but shuffle it into its owner\'s deck instead of placing it into the discard pile.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
				message: 'Choose a Creature to discard and shuffle into deck',
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
				target: '$target',
			}),
			effect({
				effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
				sourceZone: ZONE_TYPE_DISCARD,
				destinationZone: ZONE_TYPE_DECK,
				target: '$new_card',
			}),
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '%target',
						amount: 2,
					}),
				],
			}
		],
	}),
	new Card('Giant Parathin', TYPE_CREATURE, REGION_OROTHE, 10, {
		powers: [
			{
				name: 'Intercharge',
				text: 'Discard Giant Parathin from play. Place your active Magi on the bottom of your Magi pile face down. Bring in your next Magi with his or her starting energy. Do not search for their starting cards. You keep your Relics and Creatures.',
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
						message: 'Choose your creature to move its energy to Kelthet',
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
	new Card('Thunder Hyren', TYPE_CREATURE, REGION_ARDERIAL, 7, {
		powers: [
			{
				name: 'Shockstorm',
				cost: 6,
				text: 'Discard 2 energy from each non-Arderial Creature.',
				effects: [
					select({
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_ARDERIAL,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
						target: '$selected',
						amount: 2,
					}),
				],
			},
			{
				name: 'Replenish',
				cost: 2,
				text: 'Discard Thunder Hyren from play. Add 2 energy to each hyren you control.',
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$sourceCreature',
					}),
					select({
						selector: SELECTOR_OWN_CREATURES_OF_TYPE,
						creatureType: 'Hyren',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$selected',
						amount: 2,
					}),
				],
			},
		]
	}),
	new Card('Baloo Root', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Nourish',
				text: 'Choose a Creature in play. Discard Baloo Root from play. Add one energy to the chosen Creature.',
				cost: 0,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
						target: '$source',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Book of Life', TYPE_RELIC, REGION_NAROOM, 0, {
		powers: [
			{
				name: 'Relearn',
				text: 'Choose a Spell card in your discard. Place it on top of your deck.',
				cost: 3,
				effects: [
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						target: '$source',
						variable: 'relicController', 
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_DISCARD,
						zoneOwner: '$spellController',
						restriction: RESTRICTION_TYPE,
						restrictionValue: TYPE_SPELL,
						numberOfCards: 1,
						variable: 'selectedCard',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
						target: '$selectedCard',
						sourceZone: ZONE_TYPE_DISCARD,
						destinationZone: ZONE_TYPE_DECK,
					}),
				],
			},
		],
	}),
	new Card('Orwin\'s Gaze', TYPE_SPELL, REGION_NAROOM, 3, {
		text: 'Take any one card from your discard pile and place it on top of your deck.',
		effects: [
			getPropertyValue({
				property: PROPERTY_CONTROLLER,
				target: '$source',
				variable: 'spellController', 
			}),
			prompt({
				promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
				zone: ZONE_TYPE_DISCARD,
				zoneOwner: '$spellController',
				numberOfCards: 1,
				variable: 'selectedCard',
			}),
			effect({
				effectType: EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
				target: '$selectedCard',
				sourceZone: ZONE_TYPE_DISCARD,
				destinationZone: ZONE_TYPE_DECK,
			}),
		],
	}),
	new Card('Channeler\'s Gloves', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Channeling',
				text: 'Discard two cards from your hand. Add two energy to your Magi.',
				cost: 0,
				effects: [
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						variable: 'relicController',
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_HAND,
						zoneOwner: '$relicController',
						numberOfCards: 2,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
						target: '$targetCards',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
						variable: 'selectedMagi',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$selectedMagi',
						amount: 2,
					}),
				],
			}
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
						message: 'Choose your creature to discard it from play.',
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
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
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
						message: 'Choose a creature to discard 1 energy from',
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
						message: 'Choose a creature to add 2 energy to.',
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
						CONDITION_SOURCE_IS_SELF,
					],
				},
				effects: [
					select({
						selector: SELECTOR_ENEMY_MAGI,
						variable: 'enemyMagi',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
						target: '$enemyMagi',
						amount: 2,
					}),
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$creature_created',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Gloves of Crystal', TYPE_RELIC, REGION_NAROOM, 0, {
		triggerEffects: [
			{
				name: 'Strenghten',
				text: 'Whenever you play an Underneath Creature, you may move one additional energy from your Magi to that Creature.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_REGION,
							comparator: '=',
							objectTwo: REGION_UNDERNEATH,
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
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$selected',
						target: '$creature_created',
						amount: 1,
					}),
				],
				mayEffect: true,
			},
			{
				name: 'Strenghten',
				text: 'Whenever you play an Underneath Creature and it is a Bisiwog, you may move one additional energy from your Magi to that Creature.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_REGION,
							comparator: '=',
							objectTwo: REGION_UNDERNEATH,
							propertyTwo: null,
						},
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CREATURE_TYPES,
							comparator: 'includes',
							objectTwo: 'Bisiwog',
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
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$selected',
						target: '$creature_created',
						amount: 1,
					}),
				],
				mayEffect: true,
			},
		],
	}),
	new Card('Staff of Hyren', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		triggerEffects: [
			{
				name: 'Strenghten',
				text: 'Whenever you play Hyren creature, add one additional energy to it.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CREATURE_TYPES,
							comparator: 'includes',
							objectTwo: 'Hyren',
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Xyx', TYPE_CREATURE, REGION_ARDERIAL, 3, {
		powers: [
			{
				name: 'Shock',
				text: 'Choose a Magi. Discard 4 energy from the chosen Magi.',
				cost: 3,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_MAGI,
						message: 'Choose a Magi to discard 4 energy from.',
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
	new Card('Xyx Elder', TYPE_CREATURE, REGION_ARDERIAL, 6, {
		powers: [
			{
				name: 'Shockstorm',
				text: 'Roll one die. Discard energy equal to the dice roll from each non-Xyx Creature in play.',
				cost: 6,
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
					}),
					select({
						selector: SELECTOR_CREATURES_NOT_OF_TYPE,
						creatureType: 'Xyx',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
						target: '$selected',
						amount: '$roll_result',
					}),
				],
			},
		],
	}),
	new Card('Ora', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 12,
		energize: 5,
		startingCards: ['Xyx Elder', 'Xyx Minor', 'Shooting Star'],
		triggerEffects: [
			{
				name: 'Strenghten',
				text: 'Whenever you play a Arderial creature, add one additional energy to it.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_REGION,
							comparator: '=',
							objectTwo: REGION_ARDERIAL,
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Xyx Minor', TYPE_CREATURE, REGION_ARDERIAL, 2, {
		powers: [
			{
				name: 'Gathering Clouds',
				text: 'Choose any one Xyx in play. Add 4 energy to the chosen Xyx.',
				cost: 2,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_CREATURE_TYPE,
						restrictionValue: 'Xyx',
						message: 'Choose a Creature to add 4 energy to',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 4,
					}),
				],
			},
		],
	}),
	new Card('Ring of Secrets', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		triggerEffects: [
			{
				find: {
					effectType: EFFECT_TYPE_PLAY_RELIC,
					conditions: [
						{
							objectOne: 'player',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
						message: 'Choose a Creature to add 1 energy to',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Sphor', TYPE_CREATURE, REGION_OROTHE, 2, {
		triggerEffects: [
			{
				find: {
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					conditions: [
						{
							objectOne: 'target',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Storm Ring', TYPE_RELIC, REGION_ARDERIAL, 0, {
		triggerEffects: [
			{
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%source',
						amount: 1,
					}),
				],
			},
			{
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CREATURE_TYPES,
							comparator: 'includes',
							objectTwo: 'Hyren',
							propertyTwo: null,
						},					
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%source',
						amount: 1,
					}),
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
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						target: '%self',
						variable: 'controller',
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}),
				],
			}
		],
	}),
	new Card('Updraft', TYPE_SPELL, REGION_ARDERIAL, 1, {
		text: 'Choose your creature. Move its energy onto your Magi. Return chosen Creature into your hand.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
				message: 'Select your creature. Its energy will be moved onto your Magi and the creature will return to your hand.',
			}),
			effect({
				effectType: EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
				target: '$target',
			}),
		],
	}),
	new Card('Greater Vaal', TYPE_CREATURE, REGION_CALD, 5, {
		powers: [
			{
				name: 'Immolate',
				cost: 5,
				text: 'Roll two die. Choose a Creature or Magi in play. Discard energy equal to the die rolls total from the chosen Creature or Magi',
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
						variable: 'diceOne',
					}),
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
						variable: 'diceTwo',
					}),
					calculate({
						operandOne: '$diceOne',
						propertyOne: null,
						operandTwo: '$diceTwo',
						propertyTwo: null,
						operator: CALCULATION_ADD,
						variable: 'roll_result',
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
						message: 'Choose Creature or Magi to discard ${roll_result} energy from',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
						target: '$target',
						amount: '$roll_result',
					}),
				],
			},
		],
	}),
	new Card('Carnivorous Cave', TYPE_SPELL, REGION_UNDERNEATH, 3, {
		text: 'Discard 1 energy from each Magi and each non-Burrowed Creature in play.',
		effects: [
			select({
				selector: SELECTOR_MAGI,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
				target: '$selected',
				amount: 1,
			}),
			select({
				selector: SELECTOR_CREATURES_WITHOUT_STATUS,
				status: STATUS_BURROWED,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
				target: '$selected',
				amount: 1,
			}),
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
						message: 'Choose Creature or Magi to discard ${roll_result} energy from',
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
	new Card('Orwin\'s Staff', TYPE_RELIC, REGION_NAROOM, 0, {
		powers: [
			{
				name: 'Preordinance',
				cost: 0,
				text: 'Discard Orwin\'s Staff from play and discard two cards from your hand. Search your deck for any one card. Place that card in your hand without showing it to your opponents. Shuffle your deck.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_HAND,
						zoneOwner: '$player',
						numberOfCards: 2,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
						target: '$targetCards',
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_DECK,
						zoneOwner: '$player',
						numberOfCards: 1,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_DECK,
						destinationZone: ZONE_TYPE_HAND,
						target: '$targetCard',
					}),
				],
			},
		],
	}),
	new Card('Book of Ages', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		powers: [
			{
				name: 'Lore',
				cost: 2,
				text: 'Draw a card',
				effects: [
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						target: '$source',
						variable: 'controller',
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}),
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
						message: 'Choose a Creature to add 2 energy to.',
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
						message: 'Choose a Creature to add 2 energy to. Arbolit will be discarded from play.',
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
					promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
					restriction: RESTRICTION_OWN_CREATURE,
					message: 'Choose your creature',
					variable: 'yourCreature',
				}),
				prompt({
					promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
					restriction: RESTRICTION_OPPONENT_CREATURE,
					message: 'Choose opponent\'s creature',
					variable: 'opponentCreature',
				}),
				getPropertyValue({
					target: '$yourCreature',
					property: PROPERTY_ENERGY_COUNT,
					variable: 'creaturePower',
				}),
				calculate({
					operator: CALCULATION_DOUBLE,
					operandOne: '$creaturePower',
					variable: 'doubleEnergy', 
				}),
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
						message: 'Choose a Creature to discard from play.',
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
						CONDITION_SOURCE_IS_SELF,
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
					calculate({
						operator: CALCULATION_MIN,
						operandOne: '$magi_energy',
						operandTwo: 2,
						variable: 'max_tribute',
					}),
					prompt({
						promptType: PROMPT_TYPE_NUMBER,
						message: 'Choose up to ${max_tribute} energy to move to Quor Pup',
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
			select({
				selector: SELECTOR_OWN_MAGI,
			}),
			getPropertyValue({
				target: '$selected',
				property: PROPERTY_ENERGY_COUNT,
				variable: 'magi_energy',
			}),
			calculate({
				operator: CALCULATION_MIN,
				operandOne: '$magi_energy',
				operandTwo: 4,
				variable: 'max_amount',
			}),
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
				message: 'Choose a Creature to move up to ${max_amount} energy from your Magi to it',
			}),
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
	new Card('Enrich', TYPE_SPELL, REGION_UNDERNEATH, 1, {
		text: 'Choose any Burrowed Creature in play. Add 3 energy to the chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
				restriction: RESTRICTION_STATUS,
				restrictionValue: STATUS_BURROWED,
			}),
			effect({
				effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
				target: '$target',
				amount: 3,
			}),
		],
	}),
	new Card('Cloud Narth', TYPE_CREATURE, REGION_ARDERIAL, 2, {
		powers: [
			{
				name: 'Healing Rain',
				cost: 0,
				text: 'Choose a Creature or Magi. Move Cloud Narth\'s energy to the chosen Creature or Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					getPropertyValue({
						property: PROPERTY_ENERGY_COUNT,
						target: '$source',
						variable: 'energyToRestore',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$source',
						target: '$target',
						amount: '$energyToRestore',
					}),
				],
			},
			{
				name: 'Healing Storm',
				cost: 0,
				text: 'Choose a Creature or Magi and a Pharan you control. Move Cloud Narth\'s energy to the chosen Creature or Magi. Move chosen Pharan\'s energy to the chosen Creature or Magi. Add three additional energy to the chosen Creature or Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_CREATURE_TYPE,
						restrictionValue: 'Pharan',
						message: 'Choose a Pharan',
						variable: 'chosenPharan',
					}),
					getPropertyValue({
						property: PROPERTY_ENERGY_COUNT,
						target: '$source',
						variable: 'energyToRestore',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$source',
						target: '$target',
						amount: '$energyToRestore',
					}),
					getPropertyValue({
						property: PROPERTY_ENERGY_COUNT,
						target: '$chosenPharan',
						variable: 'pharanEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$chosenPharan',
						target: '$target',
						amount: '$pharanEnergy',
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
						property: PROPERTY_ENERGY_COUNT,
						target: '$source',
						variable: 'energyToRestore',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$source',
						target: '$target',
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
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_CALD,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
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
	new Card('Cave Rudwot', TYPE_CREATURE, REGION_UNDERNEATH, 3, {
		triggerEffects: [
			{
				name: 'Defense',
				text: 'If Cave Rudwot is attacked, add 2 energy to it.',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [CONDITION_TARGET_IS_SELF],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 2,
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
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					getPropertyValue({
						target: '%targetAtStart',
						property: PROPERTY_ENERGY_COUNT,
						variable: 'furokEnergy',
					}),
					calculate({
						operator: CALCULATION_MIN,
						operandOne: '%amount',
						operandTwo: '$furokEnergy',
						variable: 'damageToFurok',
					}),
					calculate({
						operator: CALCULATION_HALVE_ROUND_UP,
						operandOne: '$damageToFurok',
						variable: 'energyToRetrieve',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
						variable: 'ownMagi',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
						target: '$ownMagi',
						amount: '$energyToRetrieve',
					}),
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
					CONDITION_SOURCE_IS_SELF,
				],
			},
			effects: [
				effect({
					effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
					target: '%self',
					amount: 1,
				}),
			],
		}],
	}),
	new Card('Lightning Hyren', TYPE_CREATURE, REGION_ARDERIAL, 5, {
		powers: [
			{
				name: 'Shockstorm',
				cost: 4,
				text: 'Discard one energy from each non-Arderial Creature in play.',
				effects: [
					select({
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_ARDERIAL,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Mushroom Hyren', TYPE_CREATURE, REGION_UNDERNEATH, 7, {
		powers: [
			{
				name: 'Sanctuary',
				text: 'Choose your Creature in play. Move its energy to your Magi and return the Creature to your hand.',
				cost: 1,
				effects: [
					prompt({
						promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
						message: 'Select your creature. Its energy will be moved onto your Magi and the creature will return to your hand.',
					}),
					getPropertyValue({
						property: PROPERTY_ENERGY_COUNT,
						target: '$target',
						variable: 'creatureEnergy',
					}),
					select({
						selector: SELECTOR_OWN_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_ENERGY,
						source: '$target',
						target: '$selected',
						amount: '$creatureEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						sourceZone: ZONE_TYPE_IN_PLAY,
						destinationZone: ZONE_TYPE_HAND,
						target: '$target',
					}),
				],
			}
		],
	}),
	new Card('Gorgle\'s Ring', TYPE_RELIC, REGION_CALD, 0, {
		powers: [{
			name: 'Wild Fire',
			cost: 0,
			text: 'Roll a die. 1, 2 or 3: Discard 1 energy from each of your Creatures. 4 or 5: Choose any one Creature in play. Discard 2 energy from the chosen Creature. 6: Choose a Magi in play. Discard 4 energy from the chosen Magi.',
			effects: [
				effect({
					effectType: EFFECT_TYPE_ROLL_DIE,
				}),
				effect({ // 1-3: Discard 1 energy from each of your Creatures
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '<=',
							objectTwo: 3,
							propertyTwo: null,
						}
					],
					thenEffects: [
						select({
							selector: SELECTOR_OWN_CREATURES,
						}),
						effect({
							effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
							target: '$selected',
							amount: 1,
						}),
					],
				}),
				effect({ // 5-6: discard Wellisk Pup from play
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '>=',
							objectTwo: 4,
							propertyTwo: null,
						},
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '<=',
							objectTwo: 5,
							propertyTwo: null,
						}
					],
					thenEffects: [
						prompt({
							promptType: PROMPT_TYPE_SINGLE_CREATURE,
						}),
						effect({
							effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
							target: '$target',
							amount: 2,
						}),
					],
				}),
				effect({ // 6: discard 4 energy from chosen Magi
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 6,
							propertyTwo: null,
						},
					],
					thenEffects: [
						prompt({
							promptType: PROMPT_TYPE_SINGLE_MAGI,
						}),
						effect({
							effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
							target: '$target',
							amount: 4,
						}),
					],
				}),
			],
		}],
	}),
	new Card('Corf Pearl', TYPE_RELIC, REGION_CALD, 0, {
		powers: [{
			name: 'Wild Fire',
			cost: 0,
			text: 'Roll a die. 1, 2 or 3: Discard 1 energy from each of your Creatures. 4 or 5: Choose any one Creature in play. Discard 2 energy from the chosen Creature. 6: Choose a Creature in play. Add 3 energy to the chosen Creature.',
			effects: [
				effect({
					effectType: EFFECT_TYPE_ROLL_DIE,
				}),
				effect({ // 1-3: Discard 1 energy from each of your Creatures
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '<=',
							objectTwo: 3,
							propertyTwo: null,
						}
					],
					thenEffects: [
						select({
							selector: SELECTOR_OWN_MAGI,
						}),
						effect({
							effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
							target: '$selected',
							amount: 3,
						}),
					],
				}),
				effect({ // 4-5: discard Wellisk Pup from play
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '>=',
							objectTwo: 4,
							propertyTwo: null,
						},
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '<=',
							objectTwo: 5,
							propertyTwo: null,
						}
					],
					thenEffects: [
						prompt({
							promptType: PROMPT_TYPE_SINGLE_CREATURE,
						}),
						effect({
							effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
							target: '$target',
							amount: 2,
						}),
					],
				}),
				effect({ // 6: add 3 energy to target Creature
					effectType: EFFECT_TYPE_CONDITIONAL,
					rollResult: '$roll_result',
					conditions: [
						{
							objectOne: 'rollResult',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 6,
							propertyTwo: null,
						},
					],
					thenEffects: [
						prompt({
							promptType: PROMPT_TYPE_SINGLE_CREATURE,
						}),
						effect({
							effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
							target: '$target',
							amount: 3,
						}),
					],
				}),
			],
		}],
	}),
	new Card('Wellisk Pup', TYPE_CREATURE, REGION_OROTHE, 2, {
		triggerEffects: [
			{
				name: 'Erratic shield',
				text: 'Whenever Wellisk Pup is attacked, roll one die before energy is removed. 1, 2, 3 or 4: Add 3 energy to Wellisk Pup. 5, 6: Discard Wellisk Pup from play.',
				find: {
					effectType: EFFECT_TYPE_CREATURE_ATTACKS,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ROLL_DIE,
					}),
					effect({ // 1-4: Add 3 energy to Wellisk Pup
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '<=',
								objectTwo: 4,
								propertyTwo: null,
							}
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$source',
								amount: 3,
							}),
						],
					}),
					effect({ // 5-6: discard Wellisk Pup from play
						effectType: EFFECT_TYPE_CONDITIONAL,
						rollResult: '$roll_result',
						conditions: [
							{
								objectOne: 'rollResult',
								propertyOne: ACTION_PROPERTY,
								comparator: '>=',
								objectTwo: 5,
								propertyTwo: null,
							}
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
								target: '$source',
							}),
						],
					}),
				],
			},
		],
	}),
	new Card('Bhatar', TYPE_CREATURE, REGION_CALD, 5, {
		triggerEffects: [{
			name: 'Charge',
			text: 'If Bhatar attacks non-Underneath Creature, add one energy to Bhatar before energy is removed.',
			find: {
				effectType: EFFECT_TYPE_CREATURE_ATTACKS,
				conditions: [
					CONDITION_SOURCE_IS_SELF,
					{
						objectOne: 'target',
						propertyOne: PROPERTY_REGION,
						comparator: '!=',
						objectTwo: REGION_UNDERNEATH,
						propertyTwo: null,
					},
				],
			},
			effects: [
				effect({
					effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
					target: '%self',
					amount: 1,
				}),
			],
		}, {
			name: 'Tunneling Charge',
			text: 'If Bhatar attacks Underneath Creature, add three energy to Bhatar before energy is removed.',
			find: {
				effectType: EFFECT_TYPE_CREATURE_ATTACKS,
				conditions: [
					CONDITION_SOURCE_IS_SELF,
					{
						objectOne: 'target',
						propertyOne: PROPERTY_REGION,
						comparator: '=',
						objectTwo: REGION_UNDERNEATH,
						propertyTwo: null,
					},
				],
			},
			effects: [
				effect({
					effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
					target: '%self',
					amount: 3,
				}),
			],
		}],
	}),
	new Card('Megathan', TYPE_CREATURE, REGION_OROTHE, 8, {
		triggerEffects: [
			{
				name: 'Feed',
				find: {
					effectType: EFFECT_TYPE_END_OF_TURN,
					conditions: [],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_CONDITIONAL,
						conditions: [
							{
								objectOne: 'self',
								propertyOne: PROPERTY_STATUS_DEFEATED_CREATURE,
								comparator: '=',
								objectTwo: true,
								propertyTwo: null,
							},
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$sourceCreature',
								amount: 1,
							}),
						]
					})
				],
			},
		],
	}),
	new Card('Mobis', TYPE_MAGI, REGION_OROTHE, null, {
		startingCards: ['Bwill', 'Wellisk', 'Submerge'],
		startingEnergy: 16,
		energize: 5,
		triggerEffects: [
			{
				name: 'Legacy',
				find: {
					effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_DELAYED_TRIGGER,
						delayedTrigger: {
							name: 'Legacy',
							find: {
								effectType: EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
								conditions: [
									{
										objectOne: '%target',
										propertyOne: PROPERTY_CONTROLLER,
										comparator: '=',
										objectTwo: '$source',
										propertyTwo: PROPERTY_CONTROLLER,
									},
								],
							},
							effects: [
								effect({
									type: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
									target: '%target',
									amount: 3,
								}),
							],
						},
					}),
				],
			}
		]
	}),
	new Card('Lava Arboll', TYPE_CREATURE, REGION_CALD, 2, {
		powers: [
			{
				name: 'Healing Flame',
				cost: 2,
				text: 'Choose a Creature or Magi in play. Discard Lava Arboll from play. Add 3 energy to the chosen Creature or Magi.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$source',
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
						restriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
					}),
					effect({
						effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
						target: '$target',
					}),
				],
			},
		],
	}),
	new Card('Sap of Life', TYPE_SPELL, REGION_NAROOM, 3, {
		text: 'Choose a Creature in play with less than its starting energy. Restore that Creature to its starting energy.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
				restriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
			}),
			effect({
				effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
				target: '$target',
			}),
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
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 3,
					}),
				],
			},
		],
	}),
	new Card('Lasada', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 11,
		energize: 6,
		startingCards: ['Thunder Vashp', 'Xyx', 'Shooting Star'],
		triggerEffects: [
			{
				name: 'Warning',
				text: 'When Lasada is defeated, draw three cards',
				find: {
					effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DRAW,
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
					}),
				],
			},
		],
	}),
	new Card('Jaela', TYPE_MAGI, REGION_ARDERIAL, null, {
		startingEnergy: 15,
		energize: 5,
		startingCards: ['Xyx Elder', 'Lightning', 'Shooting Star'],
		triggerEffects: [
			{
				name: 'Spite',
				text: 'When Jaela is defeated, discard 1 energy from each Creature in play',
				find: {
					effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					select({
						selector: SELECTOR_CREATURES,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Bwill', TYPE_CREATURE, REGION_OROTHE, 1, {
		triggerEffects: [
			{
				name: 'Karma',
				text: 'If a Creature attacks and defeats Bwill, discard that Creature from play',
				find: {
					effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
					conditions: [
						CONDITION_TARGET_IS_SELF,
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '%source',
					}),
				],
			},
		],
	}),
	new Card('Evu', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 15,
		energize: 4,
		startingCards: ['Plith', 'Furok', 'Vortex of Knowledge'],
		triggerEffects: [
			{
				name: 'Lore',
				text: 'At the end of each of your turns, draw a card.',
				find: {
					effectType: EFFECT_TYPE_END_OF_TURN,
					conditions: [
						{
							objectOne: 'player',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_DRAW,
					}),
				],
			},
		],
	}),
	new Card('Tryn', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 14,
		energize: 5,
		startingCards: ['Rudwot', 'Hood of Hiding', 'Grow'],
		powers: [
			{
				name: 'Refresh',
				cost: 0,
				text: 'Choose a creature in play. Add 2 energy to the chosen Creature.',
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
		],
	}),
	new Card('Eebit', TYPE_CREATURE, REGION_NAROOM, 2, {
		triggerEffects: [
			{
				name: 'Escape',
				text: 'If Eebit is defeated in attack, return it to its owners hand',
				find: {
					effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
					conditions: [
						CONDITION_TARGET_IS_SELF,
						{
							objectOne: 'sourceZone',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: ZONE_TYPE_IN_PLAY,
							propertyTwo: null,
						},
						{
							objectOne: 'destinationZone',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: ZONE_TYPE_DISCARD,
							propertyTwo: null,
						},
						{
							objectOne: 'attack',
							propertyOne: ACTION_PROPERTY,
							comparator: '=',
							objectTwo: true,
							propertyTwo: null,
						},
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
						target: '$new_card',
						sourceZone: ZONE_TYPE_DISCARD,
						destinationZone: ZONE_TYPE_HAND,
					}),
				],
			},
		],
	}),
	new Card('Orwin', TYPE_MAGI, REGION_NAROOM, null, {
		startingEnergy: 16,
		energize: 5,
		startingCards: ['Eebit', 'Leaf Hyren', 'Grow'],
		powers: [
			{
				name: 'Recall',
				cost: 2,
				text: 'Add one energy to each of your Creatures',
				effects: [
					getPropertyValue({
						property: PROPERTY_CONTROLLER,
						target: '$source',
						variable: 'spellController', 
					}),
					prompt({
						promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
						zone: ZONE_TYPE_DISCARD,
						zoneOwner: '$spellController',
						numberOfCards: 1,
						variable: 'selectedCard',
					}),
					effect({
						effectType: EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
						target: '$selectedCard',
						sourceZone: ZONE_TYPE_DISCARD,
						destinationZone: ZONE_TYPE_DECK,
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_DELAYED_TRIGGER,
						delayedTrigger: {
							find: {
								effectType: EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
								conditions: [
									{
										objectOne: '%player',
										propertyOne: ACTION_PROPERTY,
										comparator: '=',
										objectTwo: '$source',
										propertyTwo: PROPERTY_CONTROLLER,
									},
								],
							},
							effects: [],
						}
					})
				],
			},
		],
	}),
	new Card('Brub', TYPE_CREATURE, REGION_UNDERNEATH, 2, {
		powers: [
			{
				name: 'Scrub',
				text: 'Choose a Korrit in play. If you control that Korrit, move its energy onto Brub. If not, discard the chosen Korrit from play.',
				cost: 0,
				effects: [
					prompt({
						message: 'Choose a Korrit in play',
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_CREATURE_TYPE,
						restrictionValue: 'Korrit',
					}),
					effect({
						effectType: EFFECT_TYPE_CONDITIONAL,
						chosenKorrit: '$target',
						conditions: [
							{
								objectOne: 'chosenKorrit',
								propertyOne: PROPERTY_CONTROLLER,
								comparator: '=',
								objectTwo: 'self',
								propertyTwo: PROPERTY_CONTROLLER,
							},
						],
						thenEffects: [
							getPropertyValue({
								target: '$target',
								property: PROPERTY_ENERGY_COUNT,
								variable: 'korritEnergy',
							}),
							effect({
								effectType: EFFECT_TYPE_MOVE_ENERGY,
								source: '$target',
								target: '$source',
								amount: '$korritEnergy',
							}),	
						],
					}),
					effect({
						effectType: EFFECT_TYPE_CONDITIONAL,
						chosenKorrit: '$target',
						conditions: [
							{
								objectOne: 'chosenKorrit',
								propertyOne: PROPERTY_CONTROLLER,
								comparator: '!=',
								objectTwo: 'self',
								propertyTwo: PROPERTY_CONTROLLER,
							},
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
								target: '$target',
							}),
						],
					}),
				],
			},
		],
	}),
	new Card('Balamant Pup', TYPE_CREATURE, REGION_NAROOM, 4, {
		powers: [
			{
				name: 'Support', 
				cost: 2,
				text: 'Choose a Creature in play. Add 2 energy to the chosen Creature. Add additional 2 energy if the chosen Creature is a Balamant.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE,
						message: 'Choose a Creature to add 2 energy to',
					}),
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '$target',
						amount: 2,
					}),
					effect({
						effectType: EFFECT_TYPE_CONDITIONAL,
						chosenCreature: '$target',
						conditions: [
							{
								objectOne: 'chosenCreature',
								propertyOne: PROPERTY_CREATURE_TYPES,
								comparator: 'includes',
								objectTwo: 'Balamant',
								propertyTwo: null,
							},
						],
						thenEffects: [
							effect({
								effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
								target: '$target',
								amount: 2,
							}),	
						],
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
	new Card('Typhoon', TYPE_SPELL, REGION_OROTHE, 8, {
		text: 'Roll one die. Discard energy equal to the die roll from each non-Orothe Creature in play',
		effects: [
			effect({
				effectType: EFFECT_TYPE_ROLL_DIE,
			}),
			select({
				selector: SELECTOR_CREATURES_NOT_OF_REGION,
				region: REGION_OROTHE,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
				target: '$selected',
				amount: 2,
			}),
		],
	}),
	new Card('Agovo', TYPE_CREATURE, REGION_UNDERNEATH, 4, {
		powers: [
			{
				name: 'Lore',
				cost: 2,
				text: 'Draw a card',
				effects: [
					getPropertyValue({
						target: '$sourceCreature',
						property: PROPERTY_CONTROLLER,
						variable: 'controller',
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}),
				],
			},
		],
	}),
	new Card('Sea Barl', TYPE_CREATURE, REGION_OROTHE, 4, {
		powers: [
			{
				name: 'Lore',
				cost: 3,
				text: 'Draw 2 cards',
				effects: [
					getPropertyValue({
						target: '$sourceCreature',
						property: PROPERTY_CONTROLLER,
						variable: 'controller',
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}),
					effect({
						effectType: EFFECT_TYPE_DRAW,
						player: '$controller',
					}),
				],
			},
		],
	}),	
	new Card('Vortex of Knowledge', TYPE_SPELL, REGION_NAROOM, 1, {
		text: 'You and your opponent each draw two cards.',
		effects: [
			effect({
				effectType: EFFECT_TYPE_DRAW,
				player: '$player',
			}),
			effect({
				effectType: EFFECT_TYPE_DRAW,
				player: '$player',
			}),
			select({
				selector: SELECTOR_OPPONENT_ID,
				opponentOf: '$player',
				variable: 'opponent',
			}),
			effect({
				effectType: EFFECT_TYPE_DRAW,
				player: '$opponent',
			}),
			effect({
				effectType: EFFECT_TYPE_DRAW,
				player: '$opponent',
			}),			
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
					calculate({
						operator: CALCULATION_MIN,
						operandOne: '$magi_energy',
						operandTwo: 5,
						variable: 'max_tribute',
					}),
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
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
						target: '$selected',
						amount: 1,
					}),
				],
			},
		],
	}),
	new Card('Ormagon', TYPE_CREATURE, REGION_UNDERNEATH, 10, {
		powers: [
			{
				name: 'Devastate',
				cost: 10,
				text: 'Discard every non-Underneath Creature in play.',
				effects: [
					select({
						selector: SELECTOR_CREATURES_NOT_OF_REGION,
						region: REGION_UNDERNEATH,
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: '$selected',
					}),
				],
			},
		],
	}),
	new Card('Orathan', TYPE_CREATURE, REGION_OROTHE, 5, {
		triggerEffects: [
			{
				name: 'Engulf',
				text: 'If Orathan attacks a Creature with less than three energy, add two energy to Orathan before energy is removed.',
				find: {
					effectType: EFFECT_TYPE_BEFORE_DAMAGE,
					conditions: [
						CONDITION_SOURCE_IS_SELF,
						{
							objectOne: 'target',
							propertyOne: PROPERTY_ENERGY_COUNT,
							comparator: '<',
							objectTwo: 3,
							propertyTwo: null,
						}
					],
				},
				effects: [
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 2,
					}),
				],
			}
		]
	}),
	new Card('Carillion', TYPE_CREATURE, REGION_NAROOM, 4, {
		replacementEffects: [
			{
				name: 'Resilience',
				text: 'If Carillion attacks a Creature that starts the attack with less than three energy, Carillion loses no energy in attack.',
				find: {
					effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
					conditions: [
						CONDITION_TARGET_IS_SELF,
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
						CONDITION_SOURCE_IS_SELF,
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 2,
					}),
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
	new Card('Orothean Gloves', TYPE_RELIC, REGION_OROTHE, 0, {
		staticAbilities: [
			{
				name: 'Empower',
				text: 'Powers on Creatures you control cost one less to a minimum of one',
				selector: SELECTOR_OWN_CREATURES,
				property: PROPERTY_POWER_COST,
				modifier: {
					operator: CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
					operandOne: 1,
				},
			},
		],
	}),
	new Card('Digging Goggles', TYPE_RELIC, REGION_UNDERNEATH, 0, {
		staticAbilities: [
			{
				name: 'Tunnelling Attack',
				text: 'Your Burrowed creatures may attack as normal',
				selector: SELECTOR_OWN_CREATURES_WITH_STATUS,
				selectorParameter: STATUS_BURROWED,
				property: PROPERTY_ABLE_TO_ATTACK,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: true,
				},
			},
		],
	}),
	new Card('Robes of the Ages', TYPE_RELIC, REGION_UNIVERSAL, 0, {
		staticAbilities: [
			{
				name: 'Ancestral Favor',
				text: 'Your Spells cost one less to a minimum of one',
				selector: SELECTOR_OWN_SPELLS_IN_HAND,
				property: PROPERTY_COST,
				modifier: {
					operator: CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
					operandOne: 1,
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
						message: 'Choose a Magi to add 4 energy to',
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
						restriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
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
						message: 'Choose creature to discard ${roll_result} energy from',
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
	new Card('Cave In', TYPE_SPELL, REGION_UNDERNEATH, 4, {
		text: 'Discard one energy from each non-Underneath Creature and Magi in play. Then discard one additional energy from each Arderial Creature and Magi.',
		effects: [
			select({
				selector: SELECTOR_CREATURES_NOT_OF_REGION,
				region: REGION_UNDERNEATH,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
				target: '$selected',
				amount: 1,
			}),
			select({
				selector: SELECTOR_MAGI_NOT_OF_REGION,
				region: REGION_UNDERNEATH,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
				target: '$selected',
				amount: 1,
			}),
			select({
				selector: SELECTOR_CREATURES_OF_REGION,
				region: REGION_ARDERIAL,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
				target: '$selected',
				amount: 1,
			}),
			select({
				selector: SELECTOR_MAGI_OF_REGION,
				region: REGION_ARDERIAL,
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
				target: '$selected',
				amount: 1,
			}),
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
	new Card('Cyclone Vashp', TYPE_CREATURE, REGION_ARDERIAL, 4, {
		powers: [
			{
				name: 'Cyclone',
				cost: 1,
				text: 'Choose your Creature and opponent\'s Creature. Discard energy from opponent\'s chosen Creature equal to energy on your chosen Creature. Discard your chosen Creature from play.',
				effects: [
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_OWN_CREATURE,
						message: 'Choose your creature',
						variable: 'ownCreature',
					}),
					prompt({
						promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
						restriction: RESTRICTION_OPPONENT_CREATURE,
						message: 'Choose opponent\'s creature',
						variable: 'opponentCreature',
					}),
					getPropertyValue({
						property: PROPERTY_ENERGY_COUNT,
						target: '$ownCreature',
						variable: 'creatureEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
						target: '$opponentCreature',
						amount: '$creatureEnergy',
					}),
					effect({
						effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
						target: 'ownCreature',
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
						message: 'Choose a creature to discard 1 energy from',
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
	new Card('Orpus', TYPE_CREATURE, REGION_OROTHE, 3, {
		replacementEffects: [
			{
				name: 'Relic Guard',
				text: 'If your opponent discards one of your Relics from play, you may discard one energy from Orpus instead of discarding the Relic.',
				find: {
					effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_CONTROLLER,
							comparator: '!=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_CONTROLLER,
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
				replaceWith: {
					effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
					target: '%self',
					amount: 1,
				},
				mayEffect: true,
			},
		],
	}),
	new Card('Wellisk', TYPE_CREATURE, REGION_OROTHE, 3, {
		replacementEffects: [
			{
				name: 'Dream Barrier',
				text: 'Immediately after a Creature is played, you may discard Wellisk from play. If you do so, also discard the Creature played and all energy used to play the Creature.',
				find: {
					effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
					conditions: [
						{
							objectOne: 'source',
							propertyOne: PROPERTY_ID,
							comparator: '!=',
							objectTwo: 'self',
							propertyTwo: PROPERTY_ID,
						}
					],
				},
				replaceWith: [{
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '%self',
				}, {
					effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
					target: '%target',
				}],
				mayEffect: true,
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
				message: 'Choose a creature to add ${roll_result} energy to',
			}),
			effect({
				effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
				target: '$target',
				amount: '$roll_result',
			}),
		],
	}),
	new Card('Shooting Star', TYPE_SPELL, REGION_ARDERIAL, 1, {
		text: 'Choose an Arderial Creature. Add two energy to the chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
				restriction: RESTRICTION_REGION,
				restrictionValue: REGION_ARDERIAL,
			}),
			effect({
				effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
				target: '$target',
				amount: 2,
			}),
		],
	}),
	new Card('Storm Cloud', TYPE_SPELL, REGION_ARDERIAL, 5, {
		text: 'Choose an Arderial Creature. Add two energy to the chosen Creature.',
		effects: [
			prompt({
				promptType: PROMPT_TYPE_SINGLE_CREATURE,
			}),
			getPropertyValue({						
				target: '$target',
				property: PROPERTY_ENERGY_COUNT,
				variable: 'creatureEnergy',
			}),
			calculate({
				operator: CALCULATION_SUBTRACT,
				operandOne: '$creatureEnergy',
				operandTwo: 1,
				variable: 'energyToDiscard',
			}),
			effect({
				effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
				target: '$target',
				amount: '$energyToDiscard',
			}),
		],
	}),
	new Card('Shockwave', TYPE_SPELL, REGION_ARDERIAL, 5, {
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
				text: 'When you play an Orothe spell, add 1 energy to Coral Hyren',
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
					effect({
						effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
						target: '%self',
						amount: 1,
					}),
				],
			},
		],
	}),
];

export const byName = name => cards.find(card => card.name === name);
