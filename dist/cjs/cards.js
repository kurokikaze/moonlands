"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.byName = exports.cards = void 0;
const Card_1 = __importDefault(require("./classes/Card"));
const const_1 = require("./const");
const effect = (data) => ({
    type: const_1.ACTION_EFFECT,
    ...data,
});
const select = (data) => ({
    type: const_1.ACTION_SELECT,
    ...data,
});
const getPropertyValue = (data) => ({
    type: const_1.ACTION_GET_PROPERTY_VALUE,
    ...data,
});
const prompt = (data) => {
    switch (data.promptType) {
        case const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES:
            return {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
        case const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
            return {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
        case const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE:
            return {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
        case const_1.PROMPT_TYPE_POWER_ON_MAGI: {
            return {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
        }
        case const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
            const promptAction = {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
            return promptAction;
        }
        case const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            const promptAction = {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
            return promptAction;
        }
        case const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            const promptAction = {
                type: const_1.ACTION_ENTER_PROMPT,
                ...data,
            };
            return promptAction;
        }
    }
    return ({
        type: const_1.ACTION_ENTER_PROMPT,
        ...data,
    });
};
const calculate = (data) => ({
    type: const_1.ACTION_CALCULATE,
    ...data,
});
const CONDITION_TARGET_IS_SELF = {
    objectOne: 'target',
    propertyOne: const_1.PROPERTY_ID,
    comparator: '=',
    objectTwo: 'self',
    propertyTwo: const_1.PROPERTY_ID,
};
const CONDITION_SOURCE_IS_SELF = {
    objectOne: 'source',
    propertyOne: const_1.PROPERTY_ID,
    comparator: '=',
    objectTwo: 'self',
    propertyTwo: const_1.PROPERTY_ID,
};
exports.cards = [
    new Card_1.default('Alaban', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 6, {
        powers: [
            {
                name: 'Undream',
                text: 'Choose a creature in play. Return the chosen Creature to its owner\'s hand. Discard the chosen Creature\'s energy.',
                cost: 5,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Corf', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 3, {
        powers: [
            {
                name: 'Final Blow',
                text: 'Choose a creature in play that was attacked this turn. Discard chosen Creature from play',
                cost: 3,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_CREATURE_WAS_ATTACKED,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Water of Life', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        staticAbilities: [{
                name: 'Invigorate',
                text: 'Your Magi\'s energize rate is increased by one',
                selector: const_1.SELECTOR_OWN_MAGI,
                property: const_1.PROPERTY_ENERGIZE,
                modifier: {
                    operator: const_1.CALCULATION_ADD,
                    operandOne: 1,
                },
            }],
    }),
    new Card_1.default('Amulet of Ombor', const_1.TYPE_RELIC, const_1.REGION_UNDERNEATH, 0, {
        powers: [
            {
                name: 'Energy Boost',
                text: 'Roll a die. 1-3: add one energy to each of opponents Creatures. 4-5: Add two energy to a Creature of your choice. 6: Add four energy to a Creature of your choice.',
                cost: 0,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 3,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_ENEMY_CREATURES,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$selected',
                                amount: 1,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 4,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 5,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 6,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 4,
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Hyren\'s Call', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 6, {
        text: 'Search your deck for Hyren Creature card, place into play with its starting energy. That Creature cannot attack this turn.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                promptParams: {
                    zone: const_1.ZONE_TYPE_DECK,
                    zoneOwner: '$player',
                    restrictions: [
                        {
                            type: const_1.RESTRICTION_TYPE,
                            value: const_1.TYPE_CREATURE,
                        },
                        {
                            type: const_1.RESTRICTION_CREATURE_TYPE,
                            value: 'Hyren',
                        },
                    ],
                    numberOfCards: 1,
                },
                variable: 'chosenHyren',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                sourceZone: const_1.ZONE_TYPE_DECK,
                destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                target: '$chosenHyren',
            }),
            getPropertyValue({
                property: const_1.PROPERTY_COST,
                target: '$new_card',
                variable: 'startingEnergy',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                target: '$new_card',
                amount: '$startingEnergy',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                target: '$new_card',
            }),
        ],
    }),
    new Card_1.default('Ancestral Flute', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [{
                name: 'Song of the Family',
                text: 'Choose any one Creature in play. Discard Ancestral Flute from play. Search your deck for up to two copies of the chosen Creature. Show the cards to your opponents, and put them into your hand. Shuffle your deck.',
                cost: 2,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    getPropertyValue({
                        target: '$target',
                        property: const_1.PROPERTY_CREATURE_NAME,
                        variable: 'creatureName',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DECK,
                            restriction: const_1.RESTRICTION_CREATURE_NAME,
                            restrictionValue: '$creatureName',
                            zoneOwner: '$player',
                            numberOfCards: 2,
                        },
                        variable: 'chosenCards',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DECK,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                        target: '$chosenCards',
                    }),
                ],
            }],
    }),
    new Card_1.default('O\'Qua', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
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
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DECK,
                            zoneOwner: '$player',
                            restrictions: [
                                {
                                    type: const_1.RESTRICTION_TYPE,
                                    value: const_1.TYPE_CREATURE,
                                },
                                {
                                    type: const_1.RESTRICTION_REGION,
                                    value: const_1.REGION_OROTHE,
                                },
                            ],
                            numberOfCards: 1,
                        },
                        variable: 'orotheCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DECK,
                        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                        target: '$orotheCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                        target: '$new_card',
                        amount: 4,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                        target: '$new_card',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Implosion', const_1.TYPE_SPELL, const_1.REGION_OROTHE, 1, {
        text: 'Choose any one Creature or Magi in play. Discard X Orothe cards from your hand. Discard X energy from the chosen Creature or Magi.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
            }),
            getPropertyValue({
                target: '$target',
                property: const_1.PROPERTY_ENERGY_COUNT,
                variable: 'targetEnergy',
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                promptParams: {
                    restriction: const_1.RESTRICTION_REGION,
                    restrictionValue: const_1.REGION_OROTHE,
                    zone: const_1.ZONE_TYPE_HAND,
                    zoneOwner: '$player',
                    numberOfCards: '$targetEnergy',
                },
                variable: 'chosenCards'
            }),
            getPropertyValue({
                target: '$chosenCards',
                property: const_1.CARD_COUNT,
                variable: 'energyToDiscard',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                target: '$chosenCards',
                sourceZone: const_1.ZONE_TYPE_HAND,
                destinationZone: const_1.ZONE_TYPE_DISCARD,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                target: '$target',
                amount: '$energyToDiscard',
            }),
        ],
    }),
    new Card_1.default('Spirit of the Flame', const_1.TYPE_SPELL, const_1.REGION_CALD, 1, {
        text: 'Choose any one Creature in play. Discard X Cald Creatures from your hand. Add X energy to the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                message: 'Choose any number of Cald creature cards to discard',
                promptParams: {
                    restrictions: [
                        {
                            type: const_1.RESTRICTION_REGION,
                            value: const_1.REGION_CALD,
                        },
                        {
                            type: const_1.RESTRICTION_TYPE,
                            value: const_1.TYPE_CREATURE,
                        },
                    ],
                    zone: const_1.ZONE_TYPE_HAND,
                    zoneOwner: '$player',
                    numberOfCards: 100,
                },
            }),
            getPropertyValue({
                target: '$targetCards',
                property: const_1.CARD_COUNT,
                variable: 'energyToAdd',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                target: '$targetCards',
                sourceZone: const_1.ZONE_TYPE_HAND,
                destinationZone: const_1.ZONE_TYPE_DISCARD,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: '$energyToAdd',
            }),
        ],
    }),
    new Card_1.default('Cloud Sceptre', const_1.TYPE_RELIC, const_1.REGION_ARDERIAL, 0, {
        powers: [{
                name: 'Mindwinds',
                text: 'Discard up to five cards from your hand to draw the same number of cards.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$player',
                            numberOfCards: 5,
                        },
                    }),
                    getPropertyValue({
                        target: '$targetCards',
                        property: const_1.CARD_COUNT,
                        variable: 'cardsToDraw',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        target: '$targetCards',
                        sourceZone: const_1.ZONE_TYPE_HAND,
                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW_N_CARDS,
                        numberOfCards: '$cardsToDraw',
                    }),
                ],
            }],
    }),
    new Card_1.default('Vinoc', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 3, {
        powers: [{
                name: 'Generate',
                text: 'Discard any number of cards from your hand. For each card discarded, add one energy to Vinoc.',
                cost: 0,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$player',
                            numberOfCards: 100,
                        },
                    }),
                    getPropertyValue({
                        target: '$targetCards',
                        property: const_1.CARD_COUNT,
                        variable: 'energyToAdd',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        target: '$targetCards',
                        sourceZone: const_1.ZONE_TYPE_HAND,
                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$source',
                        amount: '$energyToAdd',
                    }),
                ],
            }],
    }),
    new Card_1.default('Ebylon', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
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
                        promptType: const_1.PROMPT_TYPE_RELIC,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Lovian', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 4, {
        protection: {
            from: [const_1.PROTECTION_FROM_SPELLS],
            type: const_1.PROTECTION_TYPE_GENERAL,
            restrictions: [
                {
                    type: const_1.RESTRICTION_REGION_IS_NOT,
                    value: const_1.REGION_ARDERIAL,
                },
            ],
        },
    }),
    new Card_1.default('Relic Stalker', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Pound Pound Pound',
                text: 'Choose a Relic in play. Discard Relic Stalker from play. Discard the chosen Relic from play.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_RELIC,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Dream Balm', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Vitalize',
                cost: 2,
                text: 'Choose a Creature in play with less than its starting energy. Discard Dream Balm from play. Restore that Creature to its starting energy.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Thermal Blast', const_1.TYPE_SPELL, const_1.REGION_CALD, 3, {
        effects: [
            effect({
                effectType: const_1.EFFECT_TYPE_ROLL_DIE,
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                message: 'Choose Creature or Magi to discard ${roll_result} energy from',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                target: '$target',
                amount: '$roll_result',
            }),
        ],
    }),
    new Card_1.default('Ground Breaker', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, 3, {
        text: 'Roll one die. Discard that amount of energy from a chosen Magi.',
        effects: [
            effect({
                effectType: const_1.EFFECT_TYPE_ROLL_DIE,
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
                message: 'Choose Magi to discard ${roll_result} energy from',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                target: '$targetMagi',
                amount: '$roll_result',
            }),
        ],
    }),
    new Card_1.default('Ayebaw', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 5, {
        attacksPerTurn: 2,
    }),
    new Card_1.default('Colossus', const_1.TYPE_CREATURE, const_1.REGION_UNIVERSAL, 12, {
        protection: {
            type: const_1.PROTECTION_TYPE_DISCARDING_FROM_PLAY,
            from: [const_1.PROTECTION_FROM_SPELLS, const_1.PROTECTION_FROM_EFFECTS, const_1.PROTECTION_FROM_POWERS],
        },
        energyStasis: true,
    }),
    new Card_1.default('Adis', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingEnergy: 15,
        energize: 5,
        startingCards: ['Epik', 'Orish', 'Shooting Star'],
        triggerEffects: [
            {
                name: 'Haunt',
                text: 'When Adis is defeated, each opponent discards three cards',
                find: {
                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$source',
                        variable: 'adisController',
                    }),
                    select({
                        selector: const_1.SELECTOR_OPPONENT_ID,
                        opponentOf: '$adisController',
                        variable: 'opponentId',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$opponentId',
                            numberOfCards: 3,
                        },
                        player: '$opponentId',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Epik', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 4, {
        powers: [{
                name: 'Dream Feast',
                text: 'Choose any one player. Discard Epik from play. Look at the chosen player\'s hand and choose up to two Creature cards there. The player discards the chosen cards.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_PLAYER,
                        message: 'Choose a player who will discard the cards',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        message: 'Choose up to two creature cards to be discarded',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            restriction: const_1.RESTRICTION_TYPE,
                            restrictionValue: const_1.TYPE_CREATURE,
                            zoneOwner: '$targetPlayer',
                            numberOfCards: 2,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                ],
            }],
    }),
    new Card_1.default('Heat Lens', const_1.TYPE_RELIC, const_1.REGION_CALD, 0, {
        powers: [{
                name: 'Mind Burn',
                text: 'Choose any one player. Look at the chosen player\'s hand and choose up to one card there. The player discards the chosen card.',
                cost: 2,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_PLAYER,
                        message: 'Choose a player who will discard the cards',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        message: 'Choose up to one card to be discarded',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$targetPlayer',
                            numberOfCards: 1,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                ],
            }],
    }),
    new Card_1.default('Vulbor', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 3, {
        powers: [{
                name: 'Mind Shock',
                text: 'Choose any one player. The chosen player must discard two cards of his or her choice from his or her hand.',
                cost: 3,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_PLAYER,
                        message: 'Choose a player who will discard the cards',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        message: 'Choose two cards to be discarded',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$targetPlayer',
                            numberOfCards: 2,
                        },
                        player: '$targetPlayer',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                ],
            }],
    }),
    new Card_1.default('Giant Vulbor', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 4, {
        powers: [{
                name: 'Mind Shock',
                text: 'Remove four energy from any one Creature. That Creature\'s Magi may discard up to two cards. For each card discarded, remove two less energy.',
                cost: 2,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a creature to discard 4 energy from',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$target',
                        variable: 'creatureController',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
                        message: 'Choose up to two cards to be discarded. For each discarded card Giant Vulbor will remove two less energy.',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$creatureController',
                            numberOfCards: 2,
                        },
                        player: '$creatureController',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                    getPropertyValue({
                        property: const_1.CARD_COUNT,
                        target: '$targetCards',
                        variable: 'numberDiscarded',
                    }),
                    calculate({
                        operandOne: '$numberDiscarded',
                        operandTwo: 2,
                        operator: const_1.CALCULATION_MULTIPLY,
                        variable: 'damageReduction',
                    }),
                    calculate({
                        operandOne: 4,
                        operandTwo: '$damageReduction',
                        operator: const_1.CALCULATION_SUBTRACT,
                        variable: 'vulborDamage',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        amount: '$vulborDamage',
                        target: '$target',
                    })
                ],
            }],
    }),
    new Card_1.default('Bottomless Pit', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, 3, {
        text: 'Choose a Creature in play with less than five energy. Discard the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                promptParams: {
                    restriction: const_1.RESTRICTION_ENERGY_LESS_THAN,
                    restrictionValue: 5,
                },
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                target: '$target',
            }),
        ],
    }),
    new Card_1.default('Rod of Coals', const_1.TYPE_RELIC, const_1.REGION_CALD, 0, {
        powers: [{
                name: 'Snuff Out',
                text: 'Choose a Creature in play with 1 energy. Discard the chosen Creature from play.',
                cost: 0,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_ENERGY_LESS_THAN,
                            restrictionValue: 2,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            }],
    }),
    new Card_1.default('Hubdra\'s Spear', const_1.TYPE_RELIC, const_1.REGION_OROTHE, 0, {
        powers: [{
                name: 'Stab',
                text: 'Choose any one Magi with no Creatures in play. Discard Hubdra\'s Spear from play. Discard all but one energy from the chosen Magi.',
                cost: 4,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
                        variable: 'targetMagi',
                    }),
                    getPropertyValue({
                        target: '$targetMagi',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'magiEnergy',
                    }),
                    calculate({
                        operandOne: '$magiEnergy',
                        operandTwo: 1,
                        operator: const_1.CALCULATION_SUBTRACT,
                        variable: 'rawAmount',
                    }),
                    calculate({
                        operandOne: '$rawAmount',
                        propertyOne: null,
                        operandTwo: 0,
                        propertyTwo: null,
                        operator: const_1.CALCULATION_MAX,
                        variable: 'amountToDiscard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$targetMagi',
                        amount: '$amountToDiscard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    })
                ],
            }],
    }),
    new Card_1.default('Thunder Vashp', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 2, {
        powers: [{
                name: 'Thunderclap',
                text: 'Choose a Creature in play with less than 4 energy. Discard Thunder Vashp from play. Discard the chosen Creature from play.',
                cost: 0,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_ENERGY_LESS_THAN,
                            restrictionValue: 4,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            }],
    }),
    new Card_1.default('Warrior\'s Boots', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Warpath',
                text: 'Discard Warrior\'s Boots from play. Immediately select and play a Creature from your hand. You must still pay all costs of the Creature.',
                cost: 0,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$player',
                            numberOfCards: 1,
                            restrictions: [
                                {
                                    type: const_1.RESTRICTION_TYPE,
                                    value: const_1.TYPE_CREATURE,
                                },
                                {
                                    type: const_1.RESTRICTION_PLAYABLE,
                                }
                            ],
                        },
                    }),
                    {
                        type: const_1.ACTION_PLAY,
                        sourceZone: const_1.ZONE_TYPE_HAND,
                        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                        forcePriority: true,
                        card: '$targetCards'
                    },
                ],
            },
        ],
    }),
    new Card_1.default('Whall', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
        startingEnergy: 10,
        energize: 5,
        startingCards: ['Deep Hyren', 'Karak', 'Submerge'],
        powers: [
            {
                name: 'Dream Twist',
                cost: 5,
                text: 'Choose your Creature and discard it from play. Choose a Creature from your hand. Put it onto the battlefield. Place energy on it equal to its starting energy. That Creature may not attack this turn',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            restriction: const_1.RESTRICTION_TYPE,
                            restrictionValue: const_1.TYPE_CREATURE,
                            zoneOwner: '$player',
                            numberOfCards: 1,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_HAND,
                        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
                        target: '$targetCards'
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_COST,
                        target: '$new_card',
                        variable: 'startingEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$new_card',
                        amount: '$startingEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                        target: '$new_card',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Raxis', const_1.TYPE_CREATURE, const_1.REGION_CALD, 4, {
        powers: [
            {
                name: 'Shatterfire',
                text: 'Choose any one Relic in play. The Relic\'s controller may discard four energy from his or her Magi. If he or she doesn\'t, discard the chosen Relic from play.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_RELIC,
                    }),
                    getPropertyValue({
                        target: '$target',
                        property: const_1.PROPERTY_CONTROLLER,
                        variable: 'relicController',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_ALTERNATIVE,
                        // message: 'Do you want to discard 4 energy to avoid discarding ${target}?',
                        promptParams: {
                            alternatives: [
                                {
                                    name: 'Discard the relic',
                                    value: 'discardRelic',
                                },
                                {
                                    name: 'Discard 4 energy from Magi',
                                    value: 'discardEnergy'
                                }
                            ],
                        },
                        variable: 'choice',
                        player: '$relicController',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        choseToDiscard: '$choice',
                        conditions: [
                            {
                                objectOne: 'choseToDiscard',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 'discardEnergy',
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_MAGI_OF_PLAYER,
                                owner: '$relicController',
                                variable: 'relicMagi',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                target: '$relicMagi',
                                amount: 4,
                            }),
                        ],
                        elseEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                                target: '$target',
                            }),
                        ],
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Paralit', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 3, {
        powers: [
            {
                name: 'Life Channel',
                text: 'Discard Paralit from play. Add five energy to your Magi. Discard one energy from each of your Creatures in play.',
                cost: 1,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'ownMagi',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$ownMagi',
                        amount: 5,
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_CREATURES,
                        variable: 'selected',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Gruk', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 13,
        energize: 5,
        startingCards: ['Agovo', 'Crystal Arboll', 'Gloves of Crystal'],
        powers: [
            {
                name: 'Undream',
                cost: 1,
                text: 'Choose one of your Creatures in play. Return it to your hand and place its energy on Gruk.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Crystal Arboll', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 2, {
        powers: [
            {
                name: 'Healing Light',
                text: 'Choose any one Creature in play. Discard Crystal Arboll from play. Add two energy to the chosen Creature. Add two additional energy if that Creature is Underneath.',
                cost: 0,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        chosenCreature: '$target',
                        conditions: [
                            {
                                objectOne: 'chosenCreature',
                                propertyOne: const_1.PROPERTY_REGION,
                                comparator: '=',
                                objectTwo: const_1.REGION_UNDERNEATH,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                ]
            },
        ],
    }),
    new Card_1.default('Motash', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 16,
        energize: 4,
        startingCards: ['Crystal Arboll', 'Mushroom Hyren', 'Digging Goggles'],
        replacementEffects: [
            {
                name: 'Escape',
                text: 'Whenever one of your Creatures is defeated in attack, return it to your hand instead of discarding it',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'attack',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        }
                    ],
                },
                replaceWith: effect({
                    effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
                    target: '%target',
                }),
            },
        ],
    }),
    new Card_1.default('Motash\'s Staff', const_1.TYPE_RELIC, const_1.REGION_UNDERNEATH, 0, {
        replacementEffects: [{
                name: 'Dreamcatch',
                text: 'If one of your creatures is returned to your hand, place its energy back on your Magi instead of discarding it',
                find: {
                    effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                replaceWith: effect({
                    effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
                    target: '%target',
                }),
            }],
    }),
    new Card_1.default('Eclipse', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 5, {
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
            }),
            getPropertyValue({
                target: '$targetMagi',
                property: const_1.PROPERTY_CONTROLLER,
                variable: 'controller',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                staticAbilities: [
                    {
                        name: 'Eclipse',
                        text: 'Creatures of the chosen Magi cannot attack',
                        selector: const_1.SELECTOR_CREATURES_OF_PLAYER,
                        selectorParameter: '$controller',
                        property: const_1.PROPERTY_ABLE_TO_ATTACK,
                        modifier: {
                            operator: const_1.CALCULATION_SET,
                            operandOne: false,
                        },
                    },
                ],
                expiration: {
                    type: const_1.EXPIRATION_ANY_TURNS,
                    turns: 3,
                },
            }),
        ]
    }),
    new Card_1.default('Fog Bank', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 3, {
        text: 'Choose any one Creature in play. The chosen Creature cannot be attacked during your opponents\' next two turns. Place this card on the chosen Creature while Fog Bank is in effect.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                staticAbilities: [
                    {
                        name: 'Fog Bank',
                        text: 'Creature cannot be attacked for next two opponents turns',
                        selector: const_1.SELECTOR_ID,
                        selectorParameter: '$target',
                        property: const_1.PROPERTY_CAN_BE_ATTACKED,
                        modifier: {
                            operator: const_1.CALCULATION_SET,
                            operandOne: false,
                        },
                    },
                ],
                expiration: {
                    type: const_1.EXPIRATION_OPPONENT_TURNS,
                    turns: 2,
                },
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE,
                target: '$source',
                attachmentTarget: '$target',
            }),
            // effect({
            // 	effectType: EFFECT_TYPE_ADD_DELAYED_TRIGGER,
            // })
        ],
    }),
    new Card_1.default('Burrow', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, const_1.COST_X_PLUS_ONE, {
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                staticAbilities: [
                    {
                        name: 'Burrow',
                        text: 'Creature is considered Burrowed for X turns',
                        selector: const_1.SELECTOR_ID,
                        selectorParameter: '$target',
                        property: const_1.PROPERTY_STATUS,
                        subProperty: const_1.STATUS_BURROWED,
                        modifier: {
                            operator: const_1.CALCULATION_SET,
                            operandOne: true,
                        },
                    },
                ],
                expiration: {
                    type: const_1.EXPIRATION_ANY_TURNS,
                    turns: '$chosen_cost',
                },
            }),
        ],
    }),
    new Card_1.default('Giant Parmalag', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 5, {
        powers: [
            {
                name: 'Withdraw',
                cost: 3,
                text: 'Giant Parmalag cannot be attacked during your opponents\' next turn.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                        staticAbilities: [
                            {
                                name: 'Withdraw',
                                text: 'Giant Parmalag cannot be attacked for next opponents\' turn',
                                selector: const_1.SELECTOR_ID,
                                selectorParameter: '$sourceCreature',
                                property: const_1.PROPERTY_CAN_BE_ATTACKED,
                                modifier: {
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: false,
                                },
                            },
                        ],
                        expiration: {
                            type: const_1.EXPIRATION_OPPONENT_TURNS,
                            turns: 1,
                        },
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Parmalag', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 3, {
        powers: [
            {
                name: 'Withdraw',
                cost: 1,
                text: 'Giant Parmalag cannot be attacked during your opponents\' next turn.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                        staticAbilities: [
                            {
                                name: 'Shield',
                                text: 'Parmalag is prevented from losing any energy from attacks until the end of your turn',
                                selector: const_1.SELECTOR_ID,
                                selectorParameter: '$sourceCreature',
                                property: const_1.PROPERTY_PROTECTION,
                                modifier: {
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: {
                                        type: const_1.PROTECTION_TYPE_ENERGY_LOSS,
                                        from: const_1.PROTECTION_FROM_ATTACKS,
                                    },
                                },
                            },
                        ],
                        expiration: {
                            type: const_1.EXPIRATION_ANY_TURNS,
                            turns: 1,
                        },
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Abaquist', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 1, {
        powers: [
            {
                name: 'Posess',
                cost: 0,
                text: 'Choose any one Creature in play with less energy than Abaquist. Discard Abaquist from play. Gain control of the chosen Creature. That Creature may not attack this turn.',
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$sourceCreature',
                        variable: 'abaquistEnergy',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restrictions: [{
                                    type: const_1.RESTRICTION_ENERGY_LESS_THAN,
                                    value: '$abaquistEnergy',
                                }],
                        },
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$sourceCreature',
                        variable: 'controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                        staticAbilities: [
                            {
                                name: 'Abaquist',
                                text: 'Gain control of the creature',
                                selector: const_1.SELECTOR_ID,
                                selectorParameter: '$target',
                                property: const_1.PROPERTY_CONTROLLER,
                                modifier: {
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: '$controller',
                                },
                            },
                        ],
                        expiration: {
                            type: const_1.EXPIRATION_NEVER,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                        staticAbilities: [
                            {
                                name: 'Abaquist',
                                text: 'Chosen creature cannot attack',
                                selector: const_1.SELECTOR_ID,
                                selectorParameter: '$target',
                                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                                modifier: {
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: false,
                                },
                            },
                        ],
                        expiration: {
                            type: const_1.EXPIRATION_ANY_TURNS,
                            turns: 1,
                        },
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Platheus', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 6, {
        powers: [{
                name: 'Soporific',
                cost: 2,
                text: 'Choose any one Creature in play. The chosen Creature cannot attack until after your next turn.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                        staticAbilities: [
                            {
                                name: 'Soporific',
                                text: 'Creature cannot attack until after Platheus\'s controller next turn',
                                selector: const_1.SELECTOR_ID,
                                selectorParameter: '$target',
                                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                                modifier: {
                                    operator: const_1.CALCULATION_SET,
                                    operandOne: false,
                                },
                            },
                        ],
                        expiration: {
                            type: const_1.EXPIRATION_ANY_TURNS,
                            turns: 3,
                        },
                    }),
                ]
            }]
    }),
    new Card_1.default('Scroll of Fire', const_1.TYPE_RELIC, const_1.REGION_CALD, 0, {
        triggerEffects: [
            {
                name: 'Pyromancy',
                text: 'Whenever a Spell you control discards energy from any number of Creatures, discard one additional energy from each of those Creatures.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_SPELL,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
            {
                name: 'Pyromancy',
                text: 'Whenever a Power on a Creature you control discards energy from any number of Creatures, discard one additional energy from each of those Creatures.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    conditions: [
                        {
                            objectOne: 'power',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_CREATURE,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Vellup', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 2, {
        triggerEffects: [
            {
                name: 'Flock',
                text: 'When you play Vellup, you may search your deck for another Vellup. Show it to your opponent and put it into your hand. Shuffle the deck.',
                mayEffect: true,
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$sourceCreature',
                        variable: 'controller',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        message: 'Search your deck for another Vellup',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DECK,
                            zoneOwner: '$controller',
                            restrictions: [{
                                    type: const_1.RESTRICTION_CREATURE_TYPE,
                                    value: 'Vellup',
                                }],
                            numberOfCards: 1,
                        },
                        variable: 'targetCard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DECK,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                        target: '$targetCard',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orothean Belt', const_1.TYPE_RELIC, const_1.REGION_OROTHE, 0, {
        triggerEffects: [
            {
                name: 'Hydromancy',
                text: 'Whenever a Spell you control adds energy to any number of Creatures, add one additional energy to each of those Creatures.',
                find: {
                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_SPELL,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Valkan', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
        startingEnergy: 12,
        energize: 4,
        startingCards: ['Arbolit', 'Quor', 'Spirit of the Flame'],
        triggerEffects: [
            {
                name: 'Pyromancy',
                text: 'Whenever a Spell Valkan plays discards energy from any number of Creatures, discard two additional energy from each of those Creatures.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_SPELL,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '%target',
                        amount: 2,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Arderial\'s Crown', const_1.TYPE_RELIC, const_1.REGION_ARDERIAL, 0, {
        triggerEffects: [
            {
                name: 'Strengthen',
                text: 'At the start of your turn choose any one Creature in play. Add one energy to chosen Creature.',
                find: {
                    effectType: const_1.EFFECT_TYPE_START_OF_TURN,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to add one energy to',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Ulk', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 12,
        energize: 6,
        startingCards: ['Korrit', 'Gum-Gum', 'Burrow'],
        triggerEffects: [
            {
                name: 'Strengthen',
                text: 'At the start of your turn add one energy to each Korrit you control',
                find: {
                    effectType: const_1.EFFECT_TYPE_START_OF_TURN,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_CREATURES_OF_TYPE,
                        creatureType: 'Korrit',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Strag', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 13,
        energize: 5,
        startingCards: ['Giant Parmalag', 'Gum-Gum', 'Bottomless Pit'],
        triggerEffects: [
            {
                name: 'Defense',
                text: 'Whenever one of your creature is attacked, add one energy to it before energy is removed',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_CREATURE,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Stradus', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingEnergy: 12,
        energize: 5,
        startingCards: ['Lightning Hyren', 'Lightning', 'Shooting Star'],
        triggerEffects: [
            {
                name: 'Backlash',
                text: 'Whenever one of your Creatures is attacked, you may discard one energy from the attacking Creature before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_CREATURE,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '%source',
                        amount: 1,
                    }),
                ],
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Gum-Gum', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 2, {
        replacementEffects: [
            {
                name: 'Slide',
                text: 'If Gum-Gum is attacked, you may switch it with any other Creature you control before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_ATTACK,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                replaceWith: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        variable: 'target',
                        promptParams: {
                            source: '%self',
                        }
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ATTACK,
                        source: '%source',
                        target: '$target',
                        additionalAttackers: '%additionalAttackers',
                    })
                ],
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Trug', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 9,
        energize: 5,
        startingCards: ['Giant Parmalag', 'Crystal Arboll'],
        powers: [{
                name: 'Cataclysm',
                cost: 15,
                text: 'Discard all cards in play. Defeat all Magi.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    }),
                    select({
                        selector: const_1.SELECTOR_RELICS,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$target',
                    }),
                    select({
                        selector: const_1.SELECTOR_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                    })
                ]
            }],
    }),
    new Card_1.default('Korrit', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 3, {
        canPackHunt: true,
    }),
    new Card_1.default('Giant Korrit', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 5, {
        canPackHunt: true,
    }),
    new Card_1.default('Pack Korrit', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 1, {
        powers: [
            {
                name: 'Morale',
                cost: 1,
                text: 'Add 1 energy to each other Korrit in play',
                effects: [
                    select({
                        selector: const_1.SELECTOR_OTHER_CREATURES_OF_TYPE,
                        creatureType: 'Korrit',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Nimbulo', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to drain one energy from',
                        variable: 'donor',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to give one energy to',
                        variable: 'recipient',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$donor',
                        target: '$recipient',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Undertow', const_1.TYPE_SPELL, const_1.REGION_OROTHE, 5, {
        text: 'Choose any one Creature in play. Discard the chosen Creature from play, but shuffle it into its owner\'s deck instead of placing it into the discard pile.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                message: 'Choose a Creature to discard and shuffle into deck',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                target: '$target',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                sourceZone: const_1.ZONE_TYPE_DISCARD,
                destinationZone: const_1.ZONE_TYPE_DECK,
                target: '$new_card',
            }),
        ],
    }),
    new Card_1.default('Magma Armor', const_1.TYPE_RELIC, const_1.REGION_CALD, 0, {
        triggerEffects: [
            {
                name: 'Defense',
                text: 'When a Creature attacks your Magi directly, add two Energy to your Magi before energy is removed',
                find: {
                    effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_MAGI,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '%target',
                        amount: 2,
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Giant Parathin', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 10, {
        powers: [
            {
                name: 'Intercharge',
                text: 'Discard Giant Parathin from play. Place your active Magi on the bottom of your Magi pile face down. Bring in your next Magi with his or her starting energy. Do not search for their starting cards. You keep your Relics and Creatures.',
                cost: 0,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
                        destinationZone: const_1.ZONE_TYPE_MAGI_PILE,
                        target: '$selected',
                        bottom: true,
                    }),
                    select({
                        selector: const_1.SELECTOR_TOP_MAGI_OF_PILE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_MAGI_PILE,
                        destinationZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
                        target: '$selected',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_MAGI_STARTING_ENERGY,
                        target: '$new_card',
                        variable: 'starting_energy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$new_card',
                        amount: '$starting_energy',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Kelthet', const_1.TYPE_CREATURE, const_1.REGION_CALD, 4, {
        powers: [
            {
                name: 'Consume',
                text: 'Choose your Creature. Move all of the chosen Creature\'s energy to Kelthet.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        message: 'Choose your creature to move its energy to Kelthet',
                    }),
                    getPropertyValue({
                        target: '$target',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'creature_energy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$target',
                        target: '$sourceCreature',
                        amount: '$creature_energy',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Staff of Korrits', const_1.TYPE_RELIC, const_1.REGION_UNDERNEATH, 0, {
        triggerEffects: [
            {
                name: 'Korrit Charge',
                text: 'Whenever a Korrit you control Pack Hunts with another Creature, add one energy to that Korrit before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'packHuntAttack',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CREATURE_TYPES,
                            comparator: 'includes',
                            objectTwo: 'Korrit',
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        amount: 1,
                        target: '%source',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Thunder Hyren', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 7, {
        powers: [
            {
                name: 'Shockstorm',
                cost: 6,
                text: 'Discard 2 energy from each non-Arderial Creature.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_ARDERIAL,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
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
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_CREATURES_OF_TYPE,
                        creatureType: 'Hyren',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 2,
                    }),
                ],
            },
        ]
    }),
    new Card_1.default('Baloo Root', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Nourish',
                text: 'Choose a Creature in play. Discard Baloo Root from play. Add one energy to the chosen Creature.',
                cost: 0,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature in play to add 1 energy to.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Book of Life', const_1.TYPE_RELIC, const_1.REGION_NAROOM, 0, {
        powers: [
            {
                name: 'Relearn',
                text: 'Choose a Spell card in your discard. Place it on top of your deck.',
                cost: 3,
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$source',
                        variable: 'relicController',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        message: 'Choose a spell to put on top of your deck',
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DISCARD,
                            zoneOwner: '$relicController',
                            restriction: const_1.RESTRICTION_TYPE,
                            restrictionValue: const_1.TYPE_SPELL,
                            numberOfCards: 1,
                        },
                        variable: 'selectedCard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        target: '$selectedCard',
                        sourceZone: const_1.ZONE_TYPE_DISCARD,
                        destinationZone: const_1.ZONE_TYPE_DECK,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orwin\'s Gaze', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 3, {
        text: 'Take any one card from your discard pile and place it on top of your deck.',
        effects: [
            getPropertyValue({
                property: const_1.PROPERTY_CONTROLLER,
                target: '$source',
                variable: 'spellController',
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                message: 'Choose a card to put on top of your deck',
                promptParams: {
                    zone: const_1.ZONE_TYPE_DISCARD,
                    zoneOwner: '$spellController',
                    numberOfCards: 1,
                },
                variable: 'selectedCard',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                target: '$selectedCard',
                sourceZone: const_1.ZONE_TYPE_DISCARD,
                destinationZone: const_1.ZONE_TYPE_DECK,
            }),
        ],
    }),
    new Card_1.default('Orthea', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
        startingEnergy: 15,
        startingCards: ['Sphor', 'Paralit', 'Corf'],
        energize: 5,
        triggerEffects: [
            {
                name: 'Salvage',
                text: "Whenever an opposing Magi's Spell discards any amount of energy from Orthea, you may add that amount of energy to any one Orothe Creature in play.",
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                        {
                            objectOne: 'spell',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restrictions: [{
                                    type: const_1.RESTRICTION_REGION,
                                    value: const_1.REGION_OROTHE,
                                }],
                        },
                        variable: 'chosenOrotheCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$chosenOrotheCreature',
                        amount: '%amount',
                    }),
                ],
                mayEffect: true,
            },
            {
                name: 'Salvage',
                text: "Whenever a power of opposing Magi's Relic discards any amount of energy from Orthea, you may add that amount of energy to any one Orothe Creature in play.",
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_RELIC,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restrictions: [{
                                    type: const_1.RESTRICTION_REGION,
                                    value: const_1.REGION_OROTHE,
                                }],
                        },
                        variable: 'chosenOrotheCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$chosenOrotheCreature',
                        amount: '%amount',
                    }),
                ],
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Channeler\'s Gloves', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Channeling',
                text: 'Discard two cards from your hand. Add two energy to your Magi.',
                cost: 0,
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: "$source",
                        variable: 'relicController',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$relicController',
                            numberOfCards: 2,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'selectedMagi',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$selectedMagi',
                        amount: 2,
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Deep Hyren', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 6, {
        powers: [
            {
                name: 'Hurricane',
                cost: 6,
                text: 'Choose your Creature. Discard chosen Creature from play. Discard 3 energy from each non-Orothe Creature and Magi in play.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        message: 'Choose your creature to discard it from play.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_OROTHE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: 3,
                    }),
                    select({
                        selector: const_1.SELECTOR_MAGI_NOT_OF_REGION,
                        region: const_1.REGION_OROTHE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$selected',
                        amount: 3,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Magma Hyren', const_1.TYPE_CREATURE, const_1.REGION_CALD, 3, {
        powers: [
            {
                name: 'Fireball',
                cost: 1,
                text: 'Choose a Creature. Discard one energy from the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a creature to discard 1 energy from',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
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
                        promptType: const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                        message: 'Choose a creature to add 2 energy to.',
                        promptParams: {
                            source: '$sourceCreature',
                        }
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Quor', const_1.TYPE_CREATURE, const_1.REGION_CALD, 4, {
        triggerEffects: [
            {
                name: 'Battering ram',
                text: 'When Quor attacks an opposing Creature, discard two energy from that Creature\'s Magi',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_CREATURE,
                            propertyTwo: null,
                        },
                        CONDITION_SOURCE_IS_SELF,
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_ENEMY_MAGI,
                        variable: 'enemyMagi',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$enemyMagi',
                        amount: 2,
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Robe of Vines', const_1.TYPE_RELIC, const_1.REGION_NAROOM, 0, {
        triggerEffects: [
            {
                name: 'Strenghten',
                text: 'Whenever you play a Naroom creature, add one additional energy to it.',
                find: {
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_NAROOM,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Gloves of Crystal', const_1.TYPE_RELIC, const_1.REGION_UNDERNEATH, 0, {
        triggerEffects: [
            {
                name: 'Strenghten',
                text: 'Whenever you play an Underneath Creature, you may move one additional energy from your Magi to that Creature.',
                find: {
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_UNDERNEATH,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
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
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_UNDERNEATH,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CREATURE_TYPES,
                            comparator: 'includes',
                            objectTwo: 'Bisiwog',
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$selected',
                        target: '$creature_created',
                        amount: 1,
                    }),
                ],
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Staff of Hyren', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        triggerEffects: [
            {
                name: 'Strenghten',
                text: 'Whenever you play Hyren creature, add one additional energy to it.',
                find: {
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CREATURE_TYPES,
                            comparator: 'includes',
                            objectTwo: 'Hyren',
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Bisiwog', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 3, {
        staticAbilities: [{
                name: 'Tunneling Attack',
                text: 'While burrowed, Bisiwog may still attack as normal.',
                selector: const_1.SELECTOR_SELF_AND_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operandOne: true,
                    operator: const_1.CALCULATION_SET,
                },
            }],
    }),
    new Card_1.default('Xyx', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 3, {
        powers: [
            {
                name: 'Shock',
                text: 'Choose a Magi. Discard 4 energy from the chosen Magi.',
                cost: 3,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
                        message: 'Choose a Magi to discard 4 energy from.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$targetMagi',
                        amount: 4,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Xyx Elder', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 6, {
        powers: [
            {
                name: 'Shockstorm',
                text: 'Roll one die. Discard energy equal to the dice roll from each non-Xyx Creature in play.',
                cost: 6,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_TYPE,
                        creatureType: 'Xyx',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: '$roll_result',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Ora', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingEnergy: 12,
        energize: 5,
        startingCards: ['Xyx Elder', 'Xyx Minor', 'Shooting Star'],
        triggerEffects: [
            {
                name: 'Strenghten',
                text: 'Whenever you play a Arderial creature, add one additional energy to it.',
                find: {
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_ARDERIAL,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Xyx Minor', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 2, {
        powers: [
            {
                name: 'Gathering Clouds',
                text: 'Choose any one Xyx in play. Add 4 energy to the chosen Xyx.',
                cost: 2,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_CREATURE_TYPE,
                            restrictionValue: 'Xyx',
                        },
                        message: 'Choose a Creature to add 4 energy to',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 4,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Ring of Secrets', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        triggerEffects: [
            {
                name: 'Tinker',
                text: 'Whenever you play a Relic, choose any one Creature in play. Add one enery to the chosen Creature.',
                find: {
                    effectType: const_1.EFFECT_TYPE_PLAY_RELIC,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to add 1 energy to',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Blu', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
        startingEnergy: 14,
        energize: 5,
        startingCards: ['Orathan', 'Orpus', 'Submerge'],
        triggerEffects: [
            {
                name: 'Artifice',
                text: 'When Blu plays a Relic, he may discard one energy. If he does, draw one card.',
                mayEffect: true,
                find: {
                    effectType: const_1.EFFECT_TYPE_PLAY_RELIC,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'blu',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$blu',
                        variable: 'energy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        energy: '$energy',
                        conditions: [
                            {
                                objectOne: 'energy',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '>=',
                                objectTwo: 1,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                amount: 1,
                                target: '$blu',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DRAW,
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Sphor', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 2, {
        triggerEffects: [
            {
                name: 'Scavenge',
                text: 'Each time a Creature you control is discarded from play, add one energy to Sphor.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Lightning', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 2, {
        text: 'Choose any one Creature in play. Add two energy to or discard two energy from the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                message: 'Choose a Creature to add 2 energy to or remove 2 energy from.',
                variable: 'chosenCreature'
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_ALTERNATIVE,
                promptParams: {
                    alternatives: [
                        {
                            name: 'Add energy to creature',
                            value: 'add'
                        },
                        {
                            name: 'Remove energy from creature',
                            value: 'remove'
                        },
                    ],
                },
                variable: 'addRemoveChoice'
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                addRemoveChoice: '$addRemoveChoice',
                conditions: [
                    {
                        objectOne: 'addRemoveChoice',
                        propertyOne: const_1.ACTION_PROPERTY,
                        comparator: '=',
                        objectTwo: 'add',
                        propertyTwo: null,
                    }
                ],
                thenEffects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        amount: 2,
                        target: '$chosenCreature'
                    }),
                ],
                elseEffects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        amount: 2,
                        target: '$chosenCreature'
                    }),
                ]
            }),
        ],
    }),
    new Card_1.default('Storm Ring', const_1.TYPE_RELIC, const_1.REGION_ARDERIAL, 0, {
        triggerEffects: [
            {
                name: 'Thunder Charge',
                text: 'Whenever one of your Creatures attacks, add one energy to that Creature before energy is removed. If that Creature is a hyren, add one additional energy.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%source',
                        amount: 1,
                    }),
                ],
            },
            {
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CREATURE_TYPES,
                            comparator: 'includes',
                            objectTwo: 'Hyren',
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%source',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Eye of the Storm', const_1.TYPE_RELIC, const_1.REGION_ARDERIAL, 0, {
        powers: [
            {
                name: 'Energy Boost',
                text: 'Roll one die. 1 = Discard your hand. 2, 3, 4 or 5 = Do nothing. 6 = Draw five cards, or choose any one opponent. The chosen opponent discards his or her hand.',
                cost: 0,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                        variable: 'roll_result',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 1,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_OWN_CARDS_IN_HAND,
                                variable: 'cardsInHand',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                                sourceZone: const_1.ZONE_TYPE_HAND,
                                destinationZone: const_1.ZONE_TYPE_DISCARD,
                                target: '$cardsInHand',
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 6,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_ALTERNATIVE,
                                promptParams: {
                                    alternatives: [
                                        {
                                            name: 'Draw five cards',
                                            value: 'draw',
                                        },
                                        {
                                            name: 'Make the opponent discard their hand',
                                            value: 'discard',
                                        }
                                    ],
                                },
                                variable: 'actionMode'
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                                actionMode: '$actionMode',
                                conditions: [
                                    {
                                        objectOne: 'actionMode',
                                        propertyOne: const_1.ACTION_PROPERTY,
                                        comparator: '=',
                                        objectTwo: 'draw',
                                        propertyTwo: null,
                                    }
                                ],
                                thenEffects: [
                                    effect({
                                        effectType: const_1.EFFECT_TYPE_DRAW_N_CARDS,
                                        numberOfCards: 5,
                                    }),
                                ],
                                elseEffects: [
                                    select({
                                        selector: const_1.SELECTOR_OPPONENT_ID,
                                        variable: 'opponentId',
                                    }),
                                    select({
                                        selector: const_1.SELECTOR_CARDS_IN_HAND,
                                        zoneOwner: '$opponentId',
                                        variable: 'opponentsHand',
                                    }),
                                    effect({
                                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                                        sourceZone: const_1.ZONE_TYPE_HAND,
                                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                                        target: '$opponentsHand',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Ashgar', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
        startingEnergy: 10,
        energize: 6,
        startingCards: ['Arbolit', 'Quor', 'Flame Geyser'],
        triggerEffects: [
            {
                name: 'Nerve',
                text: 'If a Creature attacks Ashgar directly, draw a card before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_TYPE,
                            comparator: '=',
                            objectTwo: const_1.TYPE_MAGI,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '%self',
                        variable: 'controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                        player: '$controller',
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Updraft', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 1, {
        text: 'Choose your creature. Move its energy onto your Magi. Return chosen Creature into your hand.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                message: 'Select your creature. Its energy will be moved onto your Magi and the creature will return to your hand.',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
                target: '$target',
            }),
        ],
    }),
    new Card_1.default('Greater Vaal', const_1.TYPE_CREATURE, const_1.REGION_CALD, 5, {
        powers: [
            {
                name: 'Immolate',
                cost: 5,
                text: 'Roll two die. Choose a Creature or Magi in play. Discard energy equal to the die rolls total from the chosen Creature or Magi',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                        variable: 'diceOne',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                        variable: 'diceTwo',
                    }),
                    calculate({
                        operandOne: '$diceOne',
                        propertyOne: null,
                        operandTwo: '$diceTwo',
                        propertyTwo: null,
                        operator: const_1.CALCULATION_ADD,
                        variable: 'roll_result',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                        message: 'Choose Creature or Magi to discard ${roll_result} energy from',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                        target: '$target',
                        amount: '$roll_result',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Carnivorous Cave', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, 3, {
        text: 'Discard 1 energy from each Magi and each non-Burrowed Creature in play.',
        effects: [
            select({
                selector: const_1.SELECTOR_MAGI,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                target: '$selected',
                amount: 1,
            }),
            select({
                selector: const_1.SELECTOR_CREATURES_WITHOUT_STATUS,
                status: const_1.STATUS_BURROWED,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                target: '$selected',
                amount: 1,
            }),
        ],
    }),
    new Card_1.default('Flood of Energy', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 2, {
        effects: [
            select({
                selector: const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ENERGIZE,
                target: '$selected',
            }),
        ],
    }),
    new Card_1.default('Grega', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
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
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                        message: 'Choose Creature or Magi to discard ${roll_result} energy from',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                        target: '$target',
                        amount: '$roll_result',
                    }),
                ],
            },
        ]
    }),
    new Card_1.default('Orwin\'s Staff', const_1.TYPE_RELIC, const_1.REGION_NAROOM, 0, {
        powers: [
            {
                name: 'Preordinance',
                cost: 0,
                text: 'Discard Orwin\'s Staff from play and discard two cards from your hand. Search your deck for any one card. Place that card in your hand without showing it to your opponents. Shuffle your deck.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_HAND,
                            zoneOwner: '$player',
                            numberOfCards: 2,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
                        target: '$targetCards',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DECK,
                            zoneOwner: '$player',
                            numberOfCards: 1,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DECK,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                        target: '$targetCards',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Book of Ages', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Lore',
                cost: 2,
                text: 'Draw a card',
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$source',
                        variable: 'controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                        player: '$controller',
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Sinder', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to add 2 energy to.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                ],
            },
        ]
    }),
    new Card_1.default('Arbolit', const_1.TYPE_CREATURE, const_1.REGION_CALD, 1, {
        powers: [
            {
                name: 'Healing Flame',
                cost: 0,
                text: 'Choose a Creature in play. Discard Arbolit from play. Add 2 energy to the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to add 2 energy to. Arbolit will be discarded from play.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Fire Grag', const_1.TYPE_CREATURE, const_1.REGION_CALD, 6, {
        powers: [{
                name: 'Metabolize',
                cost: 3,
                text: 'Choose your Creature and opponent\'s Creature. Discard twice your Creature\'s energy from opponent\'s Creature. Discard your Creature from play.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_OWN_CREATURE,
                        },
                        message: 'Choose your creature',
                        variable: 'yourCreature',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_OPPONENT_CREATURE,
                        },
                        message: 'Choose opponent\'s creature',
                        variable: 'opponentCreature',
                    }),
                    getPropertyValue({
                        target: '$yourCreature',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'creaturePower',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_DOUBLE,
                        operandOne: '$creaturePower',
                        variable: 'doubleEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$opponentCreature',
                        amount: '$doubleEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$yourCreature',
                    }),
                ],
            }],
    }),
    new Card_1.default('Green Stuff', const_1.TYPE_CREATURE, const_1.REGION_BOGRATH, 0, { energize: 1 }),
    new Card_1.default('Giant Carillion', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 8, {
        powers: [
            {
                name: 'Stomp',
                cost: 6,
                text: 'Choose a Creature. Discard chosen Creature from play.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a Creature to discard from play.',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Quor Pup', const_1.TYPE_CREATURE, const_1.REGION_CALD, 2, {
        triggerEffects: [
            {
                name: 'Charge',
                text: 'When Quor Pup attacks, move up to two energy from it to your Magi',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    getPropertyValue({
                        target: '$selected',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'magi_energy',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_MIN,
                        operandOne: '$magi_energy',
                        operandTwo: 2,
                        variable: 'max_tribute',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_NUMBER,
                        message: 'Choose up to ${max_tribute} energy to move to Quor Pup',
                        promptParams: {
                            min: 0,
                            max: '$max_tribute',
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$selected',
                        target: '%self',
                        amount: '$number',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Fire Flow', const_1.TYPE_SPELL, const_1.REGION_CALD, 1, {
        text: 'Choose a Creature. Move up to 4 energy from your Magi to chosen Creature.',
        effects: [
            select({
                selector: const_1.SELECTOR_OWN_MAGI,
            }),
            getPropertyValue({
                target: '$selected',
                property: const_1.PROPERTY_ENERGY_COUNT,
                variable: 'magi_energy',
            }),
            calculate({
                operator: const_1.CALCULATION_MIN,
                operandOne: '$magi_energy',
                operandTwo: 4,
                variable: 'max_amount',
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                message: 'Choose a Creature to move up to ${max_amount} energy from your Magi to it',
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_NUMBER,
                promptParams: {
                    min: 1,
                    max: '$max_amount',
                },
            }),
            select({
                selector: const_1.SELECTOR_OWN_MAGI,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                source: '$selected',
                target: '$target',
                amount: '$number',
            }),
        ],
    }),
    new Card_1.default('Stagadan', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 3, {
        canAttackMagiDirectly: true,
    }),
    new Card_1.default('Fire Ball', const_1.TYPE_SPELL, const_1.REGION_CALD, 2, {
        text: 'Choose a Creature or Magi. Discard 2 energy from chosen Creature or Magi.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                target: '$target',
                amount: '2',
            }),
        ],
    }),
    new Card_1.default('Enrich', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, 1, {
        text: 'Choose any Burrowed Creature in play. Add 3 energy to the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                promptParams: {
                    restriction: const_1.RESTRICTION_STATUS,
                    restrictionValue: const_1.STATUS_BURROWED,
                },
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: 3,
            }),
        ],
    }),
    new Card_1.default('Cloud Narth', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 2, {
        powers: [
            {
                name: 'Healing Rain',
                cost: 0,
                text: 'Choose a Creature or Magi. Move Cloud Narth\'s energy to the chosen Creature or Magi.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$source',
                        variable: 'energyToRestore',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_CREATURE_TYPE,
                            restrictionValue: 'Pharan',
                        },
                        message: 'Choose a Pharan',
                        variable: 'chosenPharan',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$source',
                        variable: 'energyToRestore',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$source',
                        target: '$target',
                        amount: '$energyToRestore',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$chosenPharan',
                        variable: 'pharanEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$chosenPharan',
                        target: '$target',
                        amount: '$pharanEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
                        target: '$target',
                        amount: 3,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Pharan', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 3, {
        powers: [
            {
                name: 'Healing Rain',
                cost: 0,
                text: 'Choose a Creature or Magi. Discard Pharan from play and move its energy to chosen Creature or Magi.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$source',
                        variable: 'energyToRestore',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$source',
                        target: '$target',
                        amount: '$energyToRestore',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Lava Aq', const_1.TYPE_CREATURE, const_1.REGION_CALD, 4, {
        powers: [
            {
                name: 'Firestorm',
                cost: 2,
                text: 'Choose your Creature. Discard the chosen Creature from play. Discard 1 energy from each non-Cald Creature and Magi in play.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_CALD,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: 1,
                    }),
                    select({
                        selector: const_1.SELECTOR_MAGI_NOT_OF_REGION,
                        region: const_1.REGION_CALD,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orish', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 3, {
        powers: [
            {
                name: 'Hypnotize',
                text: 'Choose any one player. The chosen player discards one card at random from his or her hand.',
                cost: 3,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_PLAYER,
                    }),
                    select({
                        selector: const_1.SELECTOR_RANDOM_CARD_IN_HAND,
                        zoneOwner: '$targetPlayer',
                        variable: 'randomCard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_HAND,
                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                        target: '$randomCard',
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Cave Rudwot', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 3, {
        triggerEffects: [
            {
                name: 'Defense',
                text: 'If Cave Rudwot is attacked, add 2 energy to it.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [CONDITION_TARGET_IS_SELF],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 2,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Furok', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 4, {
        triggerEffects: [
            {
                name: 'Retrieve',
                text: 'When a defending Creature removes energy from Furok, place half of that energy, rounded up, on your Magi',
                find: {
                    effectType: const_1.EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    getPropertyValue({
                        target: '%targetAtStart',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'furokEnergy',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_MIN,
                        operandOne: '%amount',
                        operandTwo: '$furokEnergy',
                        variable: 'damageToFurok',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_HALVE_ROUND_UP,
                        operandOne: '$damageToFurok',
                        variable: 'energyToRetrieve',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'ownMagi',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$ownMagi',
                        amount: '$energyToRetrieve',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Lava Balamant', const_1.TYPE_CREATURE, const_1.REGION_CALD, 5, {
        triggerEffects: [{
                name: 'Charge',
                text: 'If Lava Balamant attacks, add one energy to it.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 1,
                    }),
                ],
            }],
    }),
    new Card_1.default('Lightning Hyren', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 5, {
        powers: [
            {
                name: 'Shockstorm',
                cost: 4,
                text: 'Discard one energy from each non-Arderial Creature in play.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_ARDERIAL,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Mushroom Hyren', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 7, {
        powers: [
            {
                name: 'Sanctuary',
                text: 'Choose your Creature in play. Move its energy to your Magi and return the Creature to your hand.',
                cost: 1,
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_OWN_SINGLE_CREATURE,
                        message: 'Select your creature. Its energy will be moved onto your Magi and the creature will return to your hand.',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$target',
                        variable: 'creatureEnergy',
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$target',
                        target: '$selected',
                        amount: '$creatureEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Gorgle\'s Ring', const_1.TYPE_RELIC, const_1.REGION_CALD, 0, {
        powers: [{
                name: 'Wild Fire',
                cost: 0,
                text: 'Roll a die. 1, 2 or 3: Discard 1 energy from each of your Creatures. 4 or 5: Choose any one Creature in play. Discard 2 energy from the chosen Creature. 6: Choose a Magi in play. Discard 4 energy from the chosen Magi.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 3,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_OWN_CREATURES,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                                target: '$selected',
                                amount: 1,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '>=',
                                objectTwo: 4,
                                propertyTwo: null,
                            },
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 5,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 6,
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                target: '$target',
                                amount: 4,
                            }),
                        ],
                    }),
                ],
            }],
    }),
    new Card_1.default('Corf Pearl', const_1.TYPE_RELIC, const_1.REGION_OROTHE, 0, {
        powers: [{
                name: 'Weathercall',
                cost: 0,
                text: 'Roll one die. 1, 2, or 3 = Remove three energy from your Magi. 4 or 5 = Choose any one Creature in play. Discard two energy from the chosen Creature. 6 = Choose any one Creature in play. Add three energy to the chosen Creature.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 3,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_OWN_MAGI,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                target: '$selected',
                                amount: 3,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '>=',
                                objectTwo: 4,
                                propertyTwo: null,
                            },
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 5,
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                                message: 'Choose creature to discard 2 energy from',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 6,
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            prompt({
                                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                                message: 'Choose a creature to add 3 energy to',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 3,
                            }),
                        ],
                    }),
                ],
            }],
    }),
    new Card_1.default('Wellisk Pup', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 2, {
        triggerEffects: [
            {
                name: 'Erratic shield',
                text: 'Whenever Wellisk Pup is attacked, roll one die before energy is removed. 1, 2, 3 or 4: Add 3 energy to Wellisk Pup. 5, 6: Discard Wellisk Pup from play.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '<=',
                                objectTwo: 4,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$sourceCreature',
                                amount: 3,
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        rollResult: '$roll_result',
                        conditions: [
                            {
                                objectOne: 'rollResult',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '>=',
                                objectTwo: 5,
                                propertyTwo: null,
                            }
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                                target: '$sourceCreature',
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Bhatar', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 5, {
        triggerEffects: [{
                name: 'Charge',
                text: 'If Bhatar attacks non-Underneath Creature, add one energy to Bhatar before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '!=',
                            objectTwo: const_1.REGION_UNDERNEATH,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 1,
                    }),
                ],
            }, {
                name: 'Tunneling Charge',
                text: 'If Bhatar attacks Underneath Creature, add three energy to Bhatar before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_UNDERNEATH,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 3,
                    }),
                ],
            }],
    }),
    new Card_1.default('Megathan', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 8, {
        triggerEffects: [
            {
                name: 'Feed',
                text: 'Add one energy to Megathan at the end of any turn in which Megathan defeated one or more Creatures.',
                find: {
                    effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                    conditions: [],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        conditions: [
                            {
                                objectOne: 'self',
                                propertyOne: const_1.PROPERTY_STATUS_DEFEATED_CREATURE,
                                comparator: '=',
                                objectTwo: true,
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$sourceCreature',
                                amount: 1,
                            }),
                        ]
                    })
                ],
            },
        ],
    }),
    new Card_1.default('Shimmer', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingCards: ['Bwill', 'Wellisk', 'Submerge'],
        startingEnergy: 16,
        energize: 5,
        triggerEffects: [{
                name: 'Creature Bond',
                text: 'If there is no energy on Shimmer at the end of your turn, discard one energy from each opposing Creature in play.',
                find: {
                    effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '%self',
                        variable: 'magiEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        magiEnergy: '$magiEnergy',
                        conditions: [
                            {
                                objectOne: 'magiEnergy',
                                propertyOne: const_1.ACTION_PROPERTY,
                                comparator: '=',
                                objectTwo: 0,
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            select({
                                selector: const_1.SELECTOR_ENEMY_CREATURES,
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                                amount: 1,
                                target: '$selected',
                            }),
                        ],
                    }),
                ]
            }],
    }),
    new Card_1.default('Mobis', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
        startingCards: ['Bwill', 'Wellisk', 'Submerge'],
        startingEnergy: 16,
        energize: 5,
        triggerEffects: [
            {
                name: 'Legacy',
                text: 'If Mobis is defeated, add three energy to your next Magi when he or she is revealed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER,
                        delayedTrigger: {
                            name: 'Legacy',
                            text: 'If Mobis is defeated, add three energy to your next Magi when he or she is revealed.',
                            find: {
                                effectType: const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
                                conditions: [
                                    {
                                        objectOne: '%target',
                                        propertyOne: const_1.PROPERTY_CONTROLLER,
                                        comparator: '=',
                                        objectTwo: '$source',
                                        propertyTwo: const_1.PROPERTY_CONTROLLER,
                                    },
                                ],
                            },
                            effects: [
                                effect({
                                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
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
    new Card_1.default('Lava Arboll', const_1.TYPE_CREATURE, const_1.REGION_CALD, 2, {
        powers: [
            {
                name: 'Healing Flame',
                cost: 2,
                text: 'Choose a Creature or Magi in play. Discard Lava Arboll from play. Add 3 energy to the chosen Creature or Magi.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
                        target: '$target',
                        amount: 3,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Magam', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING,
                        }
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Sap of Life', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 3, {
        text: 'Choose a Creature in play with less than its starting energy. Restore that Creature to its starting energy.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                promptParams: {
                    restriction: const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING,
                }
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
                target: '$target',
            }),
        ],
    }),
    new Card_1.default('Pruitt', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 3,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Lasada', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingEnergy: 11,
        energize: 6,
        startingCards: ['Thunder Vashp', 'Xyx', 'Shooting Star'],
        triggerEffects: [
            {
                name: 'Warning',
                text: 'When Lasada is defeated, draw three cards',
                find: {
                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Jaela', const_1.TYPE_MAGI, const_1.REGION_ARDERIAL, null, {
        startingEnergy: 15,
        energize: 5,
        startingCards: ['Xyx Elder', 'Lightning', 'Shooting Star'],
        triggerEffects: [
            {
                name: 'Spite',
                text: 'When Jaela is defeated, discard 1 energy from each Creature in play',
                find: {
                    effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Twee', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 1, {
        triggerEffects: [
            {
                name: 'Regrow',
                text: 'If Twee is put into your discard pile from play, move the first Creature card under Twee into your hand',
                find: {
                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                        {
                            objectOne: 'sourceZone',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: const_1.ZONE_TYPE_IN_PLAY,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'destinationZone',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: const_1.ZONE_TYPE_DISCARD,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    getPropertyValue({
                        target: '%target',
                        property: const_1.PROPERTY_CONTROLLER,
                        variable: 'twee_controller'
                    }),
                    select({
                        selector: const_1.SELECTOR_NTH_CARD_OF_ZONE,
                        zone: const_1.ZONE_TYPE_DISCARD,
                        zoneOwner: '$twee_controller',
                        cardNumber: 2, // It will be a second card, because first is Twee itself (the triggered ability happens after the fact)
                        restrictions: [{
                                type: const_1.RESTRICTION_TYPE,
                                value: const_1.TYPE_CREATURE,
                            }],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DISCARD,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                        target: '$selected',
                    }),
                ],
            }
        ]
    }),
    new Card_1.default('Bwill', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 1, {
        triggerEffects: [
            {
                name: 'Karma',
                text: 'If a Creature attacks and defeats Bwill, discard that Creature from play',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                        {
                            objectOne: 'asAttacker',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '%source',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Mirror Pendant', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [{
                name: 'Auraflection',
                text: 'Choose any one Power on your Magi. Discard energy from your Magi equal to the chosen Power\'s cost, and discard an additional two energy. Play all actions of the chosen Power.',
                cost: 0,
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'ownMagi',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_POWER_ON_MAGI,
                        promptParams: {
                            magi: '$ownMagi',
                        },
                        variable: 'chosenPower',
                    }),
                    getPropertyValue({
                        target: '$chosenPower',
                        property: const_1.PROPERTY_POWER_COST,
                        variable: 'powerCost',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_ADD,
                        operandOne: '$powerCost',
                        operandTwo: 2,
                        variable: 'costPlusTwo',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        ownMagi: '$ownMagi',
                        costPlusTwo: '$costPlusTwo',
                        conditions: [
                            {
                                objectOne: 'ownMagi',
                                propertyOne: const_1.PROPERTY_ENERGY_COUNT,
                                comparator: '>=',
                                objectTwo: 'costPlusTwo',
                                propertyTwo: const_1.ACTION_PROPERTY,
                            },
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                target: '$ownMagi',
                                amount: '$costPlusTwo',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
                                power: '$chosenPower',
                                source: '$ownMagi',
                                setUsage: false,
                            }),
                        ],
                    })
                ],
            }],
    }),
    new Card_1.default('Plith', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 3, {
        triggerEffects: [{
                name: 'Warning',
                text: 'If Plith is attacked, draw one card. If Evu is your Magi when Plith is attacked, draw one additional card.',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                    }),
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                        variable: 'ownMagi',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        ownMagi: '$ownMagi',
                        conditions: [
                            {
                                objectOne: 'ownMagi',
                                propertyOne: const_1.PROPERTY_MAGI_NAME,
                                comparator: '=',
                                objectTwo: 'Evu',
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DRAW,
                            }),
                        ],
                    }),
                ],
            }],
    }),
    new Card_1.default('Evu', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
        startingEnergy: 15,
        energize: 4,
        startingCards: ['Plith', 'Furok', 'Vortex of Knowledge'],
        triggerEffects: [
            {
                name: 'Lore',
                text: 'At the end of each of your turns, draw a card.',
                find: {
                    effectType: const_1.EFFECT_TYPE_END_OF_TURN,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Tryn', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
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
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Eebit', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 2, {
        triggerEffects: [
            {
                name: 'Escape',
                text: 'If Eebit is defeated in attack, return it to its owners hand',
                find: {
                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    conditions: [
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_ID,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_ID,
                        },
                        {
                            objectOne: 'sourceZone',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: const_1.ZONE_TYPE_IN_PLAY,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'destinationZone',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: const_1.ZONE_TYPE_DISCARD,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'attack',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        },
                    ],
                },
                effects: [
                    // This is a hacky way to do this
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        target: '$new_card',
                        sourceZone: const_1.ZONE_TYPE_DISCARD,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orwin', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
        startingEnergy: 16,
        energize: 5,
        startingCards: ['Eebit', 'Leaf Hyren', 'Grow'],
        powers: [
            {
                name: 'Recall',
                cost: 2,
                text: 'Take any one card from your discard pile and place it in your hand. Do not draw any cards during your Draw Step this turn. Cards are only affected by Recall once per game.',
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_CONTROLLER,
                        target: '$source',
                        variable: 'spellController',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DISCARD,
                            zoneOwner: '$spellController',
                            numberOfCards: 1,
                        },
                        variable: 'selectedCard',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                        target: '$selectedCard',
                        sourceZone: const_1.ZONE_TYPE_DISCARD,
                        destinationZone: const_1.ZONE_TYPE_HAND,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER, // Shouldn't this be a delayed replacement effect? static effect till end of turn?
                        delayedTrigger: {
                            find: {
                                effectType: const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
                                conditions: [
                                    {
                                        objectOne: '%player',
                                        propertyOne: const_1.ACTION_PROPERTY,
                                        comparator: '=',
                                        objectTwo: '$source',
                                        propertyTwo: const_1.PROPERTY_CONTROLLER,
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
    new Card_1.default('Brub', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 2, {
        powers: [
            {
                name: 'Scrub',
                text: 'Choose a Korrit in play. If you control that Korrit, move its energy onto Brub. If not, discard the chosen Korrit from play.',
                cost: 0,
                effects: [
                    prompt({
                        message: 'Choose a Korrit in play',
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_CREATURE_TYPE,
                            restrictionValue: 'Korrit',
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        chosenKorrit: '$target',
                        conditions: [
                            {
                                objectOne: 'chosenKorrit',
                                propertyOne: const_1.PROPERTY_CONTROLLER,
                                comparator: '=',
                                objectTwo: 'self',
                                propertyTwo: const_1.PROPERTY_CONTROLLER,
                            },
                        ],
                        thenEffects: [
                            getPropertyValue({
                                target: '$target',
                                property: const_1.PROPERTY_ENERGY_COUNT,
                                variable: 'korritEnergy',
                            }),
                            effect({
                                effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                                source: '$target',
                                target: '$source',
                                amount: '$korritEnergy',
                            }),
                        ],
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        chosenKorrit: '$target',
                        conditions: [
                            {
                                objectOne: 'chosenKorrit',
                                propertyOne: const_1.PROPERTY_CONTROLLER,
                                comparator: '!=',
                                objectTwo: 'self',
                                propertyTwo: const_1.PROPERTY_CONTROLLER,
                            },
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                                target: '$target',
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Balamant Pup', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 4, {
        powers: [
            {
                name: 'Support',
                cost: 2,
                text: 'Choose any one other Creature in play. Add 2 energy to the chosen Creature. Add additional 2 energy if the chosen Creature is a Balamant.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                        message: 'Choose a Creature to add 2 energy to',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                        chosenCreature: '$target',
                        conditions: [
                            {
                                objectOne: 'chosenCreature',
                                propertyOne: const_1.PROPERTY_CREATURE_TYPES,
                                comparator: 'includes',
                                objectTwo: 'Balamant',
                                propertyTwo: null,
                            },
                        ],
                        thenEffects: [
                            effect({
                                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: '$target',
                                amount: 2,
                            }),
                        ],
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Poad', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
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
                        selector: const_1.SELECTOR_OWN_CREATURES,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Typhoon', const_1.TYPE_SPELL, const_1.REGION_OROTHE, 8, {
        text: 'Roll one die. Discard energy equal to the die roll from each non-Orothe Creature in play',
        effects: [
            effect({
                effectType: const_1.EFFECT_TYPE_ROLL_DIE,
            }),
            select({
                selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                region: const_1.REGION_OROTHE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                target: '$selected',
                amount: 2,
            }),
        ],
    }),
    new Card_1.default('Agovo', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 4, {
        powers: [
            {
                name: 'Lore',
                cost: 2,
                text: 'Draw a card',
                effects: [
                    getPropertyValue({
                        target: '$sourceCreature',
                        property: const_1.PROPERTY_CONTROLLER,
                        variable: 'controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                        player: '$controller',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Sea Barl', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 4, {
        powers: [
            {
                name: 'Lore',
                cost: 3,
                text: 'Draw 2 cards',
                effects: [
                    getPropertyValue({
                        target: '$sourceCreature',
                        property: const_1.PROPERTY_CONTROLLER,
                        variable: 'controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                        player: '$controller',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DRAW,
                        player: '$controller',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Vortex of Knowledge', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 1, {
        text: 'You and your opponent each draw two cards.',
        effects: [
            effect({
                effectType: const_1.EFFECT_TYPE_DRAW,
                player: '$player',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DRAW,
                player: '$player',
            }),
            select({
                selector: const_1.SELECTOR_OPPONENT_ID,
                opponentOf: '$player',
                variable: 'opponent',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DRAW,
                player: '$opponent',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DRAW,
                player: '$opponent',
            }),
        ],
    }),
    new Card_1.default('Timber Hyren', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 7, {
        powers: [
            {
                name: 'Tribute',
                cost: 0,
                text: 'Move up to five energy from your Magi to Timber Hyren.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    getPropertyValue({
                        target: '$selected',
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        variable: 'magi_energy',
                    }),
                    calculate({
                        operator: const_1.CALCULATION_MIN,
                        operandOne: '$magi_energy',
                        operandTwo: 5,
                        variable: 'max_tribute',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_NUMBER,
                        promptParams: {
                            min: 1,
                            max: '$max_tribute',
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_MOVE_ENERGY,
                        source: '$selected',
                        target: '$sourceCreature',
                        amount: '$number',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Fire Chogo', const_1.TYPE_CREATURE, const_1.REGION_CALD, 2, {
        powers: [
            {
                name: 'Heat Storm',
                cost: 0,
                text: 'Discard Fire Chogo from play. Discard one energy from each non-Cald Creature in play.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_CALD,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                        amount: 1,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Ormagon', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 10, {
        powers: [
            {
                name: 'Devastate',
                cost: 10,
                text: 'Discard every non-Underneath Creature in play.',
                effects: [
                    select({
                        selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                        region: const_1.REGION_UNDERNEATH,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$selected',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orathan', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 5, {
        triggerEffects: [
            {
                name: 'Engulf',
                text: 'If Orathan attacks a Creature with less than three energy, add two energy to Orathan before energy is removed.',
                find: {
                    effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_ENERGY_COUNT,
                            comparator: '<',
                            objectTwo: 3,
                            propertyTwo: null,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 2,
                    }),
                ],
            }
        ]
    }),
    new Card_1.default('Carillion', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 4, {
        replacementEffects: [
            {
                name: 'Resilience',
                text: 'If Carillion attacks a Creature that starts the attack with less than three energy, Carillion loses no energy in attack.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
                    conditions: [
                        CONDITION_TARGET_IS_SELF,
                        {
                            objectOne: 'sourceAtStart',
                            propertyOne: const_1.PROPERTY_ENERGY_COUNT,
                            comparator: '<',
                            objectTwo: 3,
                            propertyTwo: null,
                        }
                    ],
                },
                replaceWith: effect({
                    effectType: const_1.EFFECT_TYPE_NONE,
                }),
            }
        ],
    }),
    new Card_1.default('Rudwot', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 3, {
        triggerEffects: [
            {
                name: 'Trample',
                text: 'If Rudwot attack a creature that starts the attack with less than three energy, add two energy to Rudwot before energy is removed',
                find: {
                    effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                    conditions: [
                        CONDITION_SOURCE_IS_SELF,
                        {
                            objectOne: 'targetAtStart',
                            propertyOne: const_1.PROPERTY_ENERGY_COUNT,
                            comparator: '<',
                            objectTwo: 3,
                            propertyTwo: null,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 2,
                    }),
                ],
            }
        ],
    }),
    new Card_1.default('Yaki', const_1.TYPE_MAGI, const_1.REGION_NAROOM, null, {
        startingEnergy: 14,
        energize: 5,
        startingCards: ['Arboll', 'Weebo', 'Furok', 'Grow'],
        staticAbilities: [
            {
                name: 'Double strike',
                text: 'Your creatures may attack twice each turn',
                selector: const_1.SELECTOR_OWN_CREATURES,
                property: const_1.PROPERTY_ATTACKS_PER_TURN,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: 2,
                },
            },
        ],
    }),
    new Card_1.default('Orothean Gloves', const_1.TYPE_RELIC, const_1.REGION_OROTHE, 0, {
        staticAbilities: [
            {
                name: 'Empower',
                text: 'Powers on Creatures you control cost one less to a minimum of one',
                selector: const_1.SELECTOR_OWN_CREATURES,
                property: const_1.PROPERTY_POWER_COST,
                modifier: {
                    operator: const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
                    operandOne: 1,
                },
            },
        ],
    }),
    new Card_1.default('Orathan Flyer', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 5, {
        ableToAttack: false,
        energize: 2,
        paymentSource: [const_1.TYPE_CREATURE],
    }),
    new Card_1.default('Fossik', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 10,
        energize: 5,
        startingCards: ['Crystal Arboll', 'Parmalag', 'Bottomless Pit'],
        replacementEffects: [
            {
                name: 'Strengthen',
                text: 'During your Draw Step, you may choose to add three energy to any one Creature, instead of drawing one of your two cards. Use this Effects only once per turn.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DRAW,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'stepEffect',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: true,
                            propertyTwo: null,
                        }
                    ],
                },
                replaceWith: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a creature to add 3 energy to',
                        variable: 'creatureToStrengthen',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        amount: 3,
                        target: '$creatureToStrengthen',
                    }),
                ],
                mayEffect: true,
                oncePerTurn: true,
            },
        ],
    }),
    new Card_1.default('Digging Goggles', const_1.TYPE_RELIC, const_1.REGION_UNDERNEATH, 0, {
        staticAbilities: [
            {
                name: 'Tunnelling Attack',
                text: 'Your Burrowed creatures may attack as normal',
                selector: const_1.SELECTOR_OWN_CREATURES_WITH_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: true,
                },
            },
        ],
    }),
    new Card_1.default('Robes of the Ages', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        staticAbilities: [
            {
                name: 'Ancestral Favor',
                text: 'Your Spells cost one less to a minimum of one',
                selector: const_1.SELECTOR_OWN_SPELLS_IN_HAND,
                property: const_1.PROPERTY_COST,
                modifier: {
                    operator: const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
                    operandOne: 1,
                },
            },
        ],
    }),
    new Card_1.default('Gogor', const_1.TYPE_MAGI, const_1.REGION_UNDERNEATH, null, {
        startingEnergy: 13,
        energize: 5,
        startingCards: ['Digging Goggles', 'Crystal Arboll', 'Cave Rudwot'],
        powers: [{
                name: 'Gravel Storm',
                text: 'Roll one die. Discard energy equal to the die roll from each Creature in play. Gravel Storm does not affect burrowed Creatures.',
                cost: 4,
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    select({
                        selector: const_1.SELECTOR_CREATURES_WITHOUT_STATUS,
                        status: const_1.STATUS_BURROWED,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                        target: '$selected',
                        amount: '$roll_result',
                    }),
                ],
            }],
    }),
    new Card_1.default('Arboll', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 3, {
        powers: [
            {
                name: 'Life Channel',
                cost: 0,
                text: 'Choose a Magi in play. Discard Arboll from play. Add four energy to the chosen Magi.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
                        message: 'Choose a Magi to add 4 energy to',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$targetMagi',
                        amount: 4,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Weebo', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 2, {
        powers: [
            {
                name: 'Vitalize',
                cost: 2,
                text: 'Choose a creature in play with energy less than its starting energy. Restore that creature to its starting energy.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        promptParams: {
                            restriction: const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING,
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Balamant', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 6, {
        powers: [
            {
                name: 'Hunt',
                cost: 2,
                text: 'Choose a Magi in play. Discard 4 energy from the chosen Magi.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$targetMagi',
                        amount: 4,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Diobor', const_1.TYPE_CREATURE, const_1.REGION_CALD, 6, {
        powers: [
            {
                name: 'Fireball',
                cost: 0,
                text: 'Choose a Creature in play. Discard Diobor from play. Discard 2 energy from the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$target',
                        amount: 2,
                    }),
                ],
            },
            {
                name: 'Energy Transfer',
                cost: const_1.COST_X,
                text: 'Add X energy to your Magi',
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_MAGI,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$selected',
                        amount: '$chosen_cost',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Thunderquake', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, const_1.COST_X, {
        text: 'Choose any number of Creatures in play. Discard a total of X energy in any combination from the chosen Creatures. X cannot be more than 10.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
                promptParams: {
                    amount: '$chosen_cost',
                },
                message: 'Distribute damage among any number of creatures'
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
                damageOnCreatures: '$damageOnCreatures',
            })
        ],
        maxCostX: 10,
    }),
    new Card_1.default('Drakan', const_1.TYPE_CREATURE, const_1.REGION_CALD, 6, {
        powers: [
            {
                name: 'Thermal Blast',
                cost: 3,
                text: 'Roll one die. Choose a Creature in play. Discard energy equal to the dice roll from the chosen Creature.',
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ROLL_DIE,
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose creature to discard ${roll_result} energy from',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$target',
                        amount: '$roll_result',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Cave In', const_1.TYPE_SPELL, const_1.REGION_UNDERNEATH, 4, {
        text: 'Discard one energy from each non-Underneath Creature and Magi in play. Then discard one additional energy from each Arderial Creature and Magi.',
        effects: [
            select({
                selector: const_1.SELECTOR_CREATURES_NOT_OF_REGION,
                region: const_1.REGION_UNDERNEATH,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                target: '$selected',
                amount: 1,
            }),
            select({
                selector: const_1.SELECTOR_MAGI_NOT_OF_REGION,
                region: const_1.REGION_UNDERNEATH,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                target: '$selected',
                amount: 1,
            }),
            select({
                selector: const_1.SELECTOR_CREATURES_OF_REGION,
                region: const_1.REGION_ARDERIAL,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
                target: '$selected',
                amount: 1,
            }),
            select({
                selector: const_1.SELECTOR_MAGI_OF_REGION,
                region: const_1.REGION_ARDERIAL,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                target: '$selected',
                amount: 1,
            }),
        ],
    }),
    new Card_1.default('Cave Hyren', const_1.TYPE_CREATURE, const_1.REGION_UNDERNEATH, 5, {
        powers: [
            {
                name: 'Energy Transfer',
                cost: const_1.COST_X,
                text: 'Choose a Creature in play. Add X energy to the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: '$chosen_cost',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Cyclone Vashp', const_1.TYPE_CREATURE, const_1.REGION_ARDERIAL, 4, {
        powers: [
            {
                name: 'Cyclone',
                cost: 1,
                text: 'Choose your Creature and opponent\'s Creature. Discard energy from opponent\'s chosen Creature equal to energy on your chosen Creature. Discard your chosen Creature from play.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_OWN_CREATURE,
                        },
                        message: 'Choose your creature',
                        variable: 'ownCreature',
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                        promptParams: {
                            restriction: const_1.RESTRICTION_OPPONENT_CREATURE,
                        },
                        message: 'Choose opponent\'s creature',
                        variable: 'opponentCreature',
                    }),
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$ownCreature',
                        variable: 'creatureEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$opponentCreature',
                        amount: '$creatureEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: 'ownCreature',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Leaf Hyren', const_1.TYPE_CREATURE, const_1.REGION_NAROOM, 4, {
        powers: [
            {
                name: 'Energy Transfer',
                cost: const_1.COST_X,
                text: 'Choose a Creature. Add X energy to the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$target',
                        amount: '$chosen_cost',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Flame Geyser', const_1.TYPE_SPELL, const_1.REGION_CALD, 7, {
        text: 'Discard 3 energy from each Creature and Magi.',
        effects: [
            select({
                selector: const_1.SELECTOR_CREATURES_AND_MAGI,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                target: '$selected',
                amount: 3,
            }),
        ],
    }),
    new Card_1.default('Syphon Stone', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        powers: [
            {
                name: 'Syphon',
                cost: 0,
                text: 'Choose a Creature. Discard Syphon Stone. Discard 1 energy from the chosen Creature.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                        message: 'Choose a creature to discard 1 energy from',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                        target: '$source',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$target',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Orpus', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 3, {
        replacementEffects: [
            {
                name: 'Relic Guard',
                text: 'If your opponent discards one of your Relics from play, you may discard one energy from Orpus instead of discarding the Relic.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                replaceWith: effect({
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    target: '%self',
                    amount: 1,
                }),
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Relic Mirror', const_1.TYPE_RELIC, const_1.REGION_UNIVERSAL, 0, {
        replacementEffects: [
            {
                name: 'Trick Image',
                text: 'If your opponent discards one of your Relics from play, you may discard Relic Mirror instead.',
                find: {
                    effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                        {
                            objectOne: 'target',
                            propertyOne: const_1.PROPERTY_ID,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_ID,
                        },
                        {
                            objectOne: 'dueToMagiDefeat',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '!=',
                            objectTwo: true,
                            propertyTwo: null,
                        }
                    ],
                },
                replaceWith: effect({
                    effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                    target: '%self',
                }),
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Wellisk', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 3, {
        replacementEffects: [
            {
                name: 'Dream Barrier',
                text: 'Immediately after a Creature is played, you may discard Wellisk from play. If you do so, also discard the Creature played and all energy used to play the Creature.',
                find: {
                    effectType: const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                    conditions: [
                        {
                            objectOne: 'source',
                            propertyOne: const_1.PROPERTY_ID,
                            comparator: '!=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_ID,
                        }
                    ],
                },
                replaceWith: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '%self'
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '%target',
                        source: '%self',
                        attack: false
                    })
                ],
                mayEffect: true,
            },
        ],
    }),
    new Card_1.default('Grow', const_1.TYPE_SPELL, const_1.REGION_NAROOM, 3, {
        text: 'Roll a die. Choose a Creature. Add energy equal to the die roll to the chosen Creature.',
        effects: [
            effect({
                effectType: const_1.EFFECT_TYPE_ROLL_DIE,
            }),
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                message: 'Choose a creature to add ${roll_result} energy to',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: '$roll_result',
            }),
        ],
    }),
    new Card_1.default('Shooting Star', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 1, {
        text: 'Choose an Arderial Creature. Add two energy to the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                promptParams: {
                    restriction: const_1.RESTRICTION_REGION,
                    restrictionValue: const_1.REGION_ARDERIAL,
                },
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: 2,
            }),
        ],
    }),
    new Card_1.default('Storm Cloud', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 5, {
        text: 'Choose a Creature. Discard all but one energy from the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
            }),
            getPropertyValue({
                target: '$target',
                property: const_1.PROPERTY_ENERGY_COUNT,
                variable: 'creatureEnergy',
            }),
            calculate({
                operator: const_1.CALCULATION_SUBTRACT,
                operandOne: '$creatureEnergy',
                operandTwo: 1,
                variable: 'energyToDiscard',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                target: '$target',
                amount: '$energyToDiscard',
            }),
        ],
    }),
    new Card_1.default('Shockwave', const_1.TYPE_SPELL, const_1.REGION_ARDERIAL, 5, {
        text: 'Choose a Creature. Discard chosen Creature from play.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                target: '$target',
            }),
        ],
    }),
    new Card_1.default('Submerge', const_1.TYPE_SPELL, const_1.REGION_OROTHE, 2, {
        text: 'Choose an Orothe Creature. Add 3 energy to the chosen Creature.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
                promptParams: {
                    restriction: const_1.RESTRICTION_REGION,
                    restrictionValue: const_1.REGION_OROTHE,
                },
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: 3,
            }),
        ],
    }),
    new Card_1.default('Coral Hyren', const_1.TYPE_CREATURE, const_1.REGION_OROTHE, 4, {
        triggerEffects: [
            {
                name: 'Spelltap',
                text: 'When you play an Orothe spell, add 1 energy to Coral Hyren',
                find: {
                    effectType: const_1.EFFECT_TYPE_PLAY_SPELL,
                    conditions: [
                        {
                            objectOne: 'card',
                            propertyOne: const_1.PROPERTY_REGION,
                            comparator: '=',
                            objectTwo: const_1.REGION_OROTHE,
                            propertyTwo: null,
                        },
                        {
                            objectOne: 'card',
                            propertyOne: const_1.PROPERTY_CONTROLLER,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        }
                    ],
                },
                effects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '%self',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Flame Control', const_1.TYPE_SPELL, const_1.REGION_CALD, 1, {
        text: 'Rearrange the energy on your creatures as you wish',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                message: 'Rearrange the energy on your creatures as you wish',
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                energyOnCreatures: '$energyOnCreatures',
            }),
        ],
    }),
    new Card_1.default('Flame Hyren', const_1.TYPE_CREATURE, const_1.REGION_CALD, 9, {
        powers: [
            {
                name: 'Energy Transfer',
                text: 'Distribute Flame Hyren\'s energy among any number of creatures. Discard Flame Hyren from play.',
                cost: 0,
                effects: [
                    getPropertyValue({
                        property: const_1.PROPERTY_ENERGY_COUNT,
                        target: '$source',
                        variable: 'flameHyrenEnergy'
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                        message: 'Distribute Flame Hyren\'s energy among any number of creatures. After this Flame Hyren will be discarded.',
                        promptParams: {
                            restriction: const_1.RESTRICTION_EXCEPT_SOURCE,
                            amount: '$flameHyrenEnergy',
                        },
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                        energyOnCreatures: '$energyOnCreatures',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$source',
                    }),
                ],
            },
        ],
    }),
    new Card_1.default('Tidal Wave', const_1.TYPE_SPELL, const_1.REGION_OROTHE, 6, {
        text: 'Choose any one Creature in play. Discard the chosen Creature from play. For an additional four energy you may choose and discard a second Creature from play.',
        effects: [
            prompt({
                promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                target: '$target',
            }),
            select({
                selector: const_1.SELECTOR_OWN_MAGI,
                variable: 'ownMagi'
            }),
            getPropertyValue({
                property: const_1.PROPERTY_ENERGY_COUNT,
                target: '$ownMagi',
                variable: 'magiEnergy'
            }),
            effect({
                effectType: const_1.EFFECT_TYPE_CONDITIONAL,
                magiEnergy: '$magiEnergy',
                conditions: [
                    {
                        objectOne: 'magiEnergy',
                        propertyOne: const_1.ACTION_PROPERTY,
                        comparator: '>=',
                        objectTwo: 4,
                        propertyTwo: null,
                    }
                ],
                thenEffects: [
                    effect({
                        effectType: const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
                        amount: 4,
                    }),
                    prompt({
                        promptType: const_1.PROMPT_TYPE_SINGLE_CREATURE,
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
                ],
            }),
        ],
    }),
    new Card_1.default('Orlon', const_1.TYPE_MAGI, const_1.REGION_OROTHE, null, {
        energize: 6,
        startingEnergy: 10,
        startingCards: ['Abaquist', 'Sea Barl', 'Submerge'],
        staticAbilities: [
            {
                name: 'Anti-Magic (Barls)',
                text: 'Any Barl controlled by Orlon cannot be affected by any opposing Spells.',
                selector: const_1.SELECTOR_OWN_CREATURES_OF_TYPE,
                selectorParameter: 'Barl',
                property: const_1.PROPERTY_PROTECTION,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: {
                        type: const_1.PROTECTION_TYPE_GENERAL,
                        from: [const_1.PROTECTION_FROM_SPELLS],
                    },
                },
            },
            {
                name: 'Anti-Magic (Wellisk)',
                text: 'Any Wellisk controlled by Orlon cannot be affected by any opposing Spells.',
                selector: const_1.SELECTOR_OWN_CREATURES_OF_TYPE,
                selectorParameter: 'Wellisk',
                property: const_1.PROPERTY_PROTECTION,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: {
                        type: const_1.PROTECTION_TYPE_GENERAL,
                        from: [const_1.PROTECTION_FROM_SPELLS],
                    },
                },
            }
        ],
    }),
    new Card_1.default('Gar', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
        energize: 5,
        startingEnergy: 14,
        startingCards: ['Lava Balamant', 'Fireball', 'Magma Armor'],
        triggerEffects: [
            {
                name: 'Strengthen',
                text: 'Before you draw your cards during your Draw Step, add two energy to your Creature with the least energy. If there is a tie, you choose which Creature the energy gets placed on.',
                find: {
                    effectType: const_1.EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
                    conditions: [
                        {
                            objectOne: 'player',
                            propertyOne: const_1.ACTION_PROPERTY,
                            comparator: '=',
                            objectTwo: 'self',
                            propertyTwo: const_1.PROPERTY_CONTROLLER,
                        },
                    ],
                },
                effects: [
                    select({
                        selector: const_1.SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
                        variable: 'creatureWithLeastEnergy',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$creatureWithLeastEnergy',
                        amount: 2,
                    }),
                ]
            },
        ],
    }),
    new Card_1.default('Barak', const_1.TYPE_MAGI, const_1.REGION_CALD, null, {
        energize: 5,
        startingEnergy: 17,
        startingCards: ['Arbolit', 'Lava Balamant', 'Thermal Blast'],
        powers: [
            {
                name: 'Prophecy',
                cost: 0,
                text: 'Look at the top four cards of your deck. Replace them in any order you wish.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
                        promptParams: {
                            zone: const_1.ZONE_TYPE_DECK,
                            zoneOwner: '$player',
                            numberOfCards: 4,
                        },
                        variable: 'rearrangedCards',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                        zone: const_1.ZONE_TYPE_DECK,
                        zoneOwner: '$player',
                        cards: '$rearrangedCards',
                    }),
                ]
            },
        ],
    }),
    new Card_1.default('Orothean Goggles', const_1.TYPE_RELIC, const_1.REGION_OROTHE, 0, {
        powers: [{
                name: 'Foresight',
                cost: 0,
                text: 'Look at the top two cards of your deck. You may discard either or both of these cards, or put them back on top of your deck in any order.',
                effects: [
                    prompt({
                        promptType: const_1.PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
                        promptParams: {
                            sourceZone: const_1.ZONE_TYPE_DECK,
                            sourceZoneOwner: '$player',
                            targetZones: [
                                const_1.ZONE_TYPE_DECK,
                                const_1.ZONE_TYPE_DISCARD,
                            ],
                            numberOfCards: 2,
                        },
                        variable: 'cardsInZones',
                    }),
                    effect({
                        effectType: const_1.EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_DECK,
                        sourceZoneOwner: '$player',
                        cards: '$cardsInZones',
                    }),
                ]
            }],
    }),
];
const byName = (name) => exports.cards.find(card => card.name === name);
exports.byName = byName;
//# sourceMappingURL=cards.js.map