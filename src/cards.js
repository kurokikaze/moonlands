const nanoid = require('nanoid');

const {
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

    PROPERTY_ENERGY_COUNT,
    PROPERTY_REGION,
    PROPERTY_COST,
    PROPERTY_ENERGIZE,

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

    SELECTOR_OWN_MAGI,
    SELECTOR_ENEMY_MAGI,
    SELECTOR_CREATURES_OF_REGION,
    SELECTOR_CREATURES_NOT_OF_REGION,
    SELECTOR_OWN_CREATURES,
    SELECTOR_OPPONENT_CREATURES,

    EFFECT_TYPE_ROLL_DIE,
    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,

    PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
    PROMPT_TYPE_NUMBER,

    RESTRICTION_ENERGY_LESS_THAN_STARTING,

    COST_X,
} = require('./const');

class Card {
    constructor(name, type, region, cost, data = {}) {
        this.name = name;
        this.type = type;
        this.region = region;
        this.cost = cost;
        this.data = data;
    }

    getName() {
        return this.name;
    }

    getCost() {
        return this.cost;
    }
}

class CardInGame {
    constructor(card, owner) {
        this._card = card;
        this.id = nanoid();
        this.data = {
            energy: 0,
            controller: owner,
        };
        this.owner = owner;
        this.actionsUsed = [];
    }

    get card() {
        return this._card;
    }

    addEnergy(amount = 0) {
        this.data.energy = this.data.energy + amount;
    }

    removeEnergy(amount = 0) {
        this.data.energy = this.data.energy - amount;
    }

    wasActionUsed(actionName) {
        return this.actionsUsed.includes(actionName);
    }

    setActionUsed(actionName) {
        this.actionsUsed.push(actionName);
    }

    clearActionsUsed() {
        this.actionsUsed = [];
    }
}

const power = (name, effects) => ({
    name,
    effects,
    cost: 0,
});

const effect = (data) => ({
    type: ACTION_EFFECT,
    ...data,
});

const cards = [
    new Card('Water of Life', TYPE_RELIC, REGION_UNIVERSAL, 0, {
        staticAbilities: [{
            selector: SELECTOR_OWN_MAGI,
            property: PROPERTY_ENERGIZE,
            modifier: a => a + 1,
        }],
    }),
    new Card('Grega', TYPE_MAGI, REGION_CALD, null, {
        startingEnergy: 10,
        energize: 5,
        startingCards: ['Arbolit', 'Quor Pup', 'Fire Flow'],
        powers: [
            {
                name: 'Thermal Blast',
                cost: 2,
                effects: [
                    effect({
                        effectType: EFFECT_TYPE_ROLL_DIE,
                    }),
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
                    effect({
                        effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                        target: '$target',
                        amount: '$die_roll',
                    }),
                ],
            },
        ]
    }),
    new Card('Arbolit', TYPE_CREATURE, REGION_CALD, 2, {
        powers: [power(
            'Healing Flame',
            [
                {
                    type: ACTION_ENTER_PROMPT,
                    promptType: PROMPT_TYPE_SINGLE_CREATURE,
                },
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
        )],
    }),
    new Card('Fire Grag', TYPE_CREATURE, REGION_CALD, 6, {
        powers: [{
            name: 'Metabolize',
            cost: 3,
            effects: [
                {
                    type: ACTION_ENTER_PROMPT,
                    promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    variable: 'yourCreature',
                },
                {
                    type: ACTION_ENTER_PROMPT,
                    promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    variable: 'opponentCreature',
                },
                {
                    type: ACTION_GET_PROPERTY_VALUE,
                    target: '$yourCreature',
                    property: PROPERTY_ENERGY_COUNT,
                },
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
    new Card('Quor Pup', TYPE_CREATURE, REGION_CALD, 2),
    new Card('Fire Flow', TYPE_SPELL, REGION_CALD, 1),
    new Card('Pharan', TYPE_CREATURE, REGION_ARDERIAL, 3, {
        powers: [
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
            },
            {
                type: ACTION_GET_PROPERTY_VALUE,
                target: '$yourCreature',
                property: PROPERTY_ENERGY_COUNT,
                variable: 'energyToRestore',
            },
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

    }),
    new Card('Fire Chogo', TYPE_CREATURE, REGION_CALD, 2, {
        powers: [
            power('Heat Storm', [
                {
                    type: ACTION_SELECT,
                    selector: SELECTOR_CREATURES_NOT_OF_REGION,
                    region: REGION_CALD,
                },
                effect({
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    target: '$selected',
                    amount: 1,
                }),
            ]),
        ],
    }),
    new Card('Yaki', TYPE_MAGI, REGION_NAROOM, null, {
        startingEnergy: 14,
        energize: 5,
        startingCards: ['Arboll', 'Weebo', 'Furok', 'Grow'],
    }),
    new Card('Arboll', TYPE_CREATURE, REGION_NAROOM, 3, {
        powers: [
            power('Life Channel', [
                {
                    type: ACTION_ENTER_PROMPT,
                    promptType: PROMPT_TYPE_SINGLE_MAGI,
                },
                effect({
                    effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    target: '$sourceCreature',
                }),
                effect({
                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                    target: '$targetMagi',
                    amount: 4,
                }),
            ]),
        ],
    }),
    new Card('Weebo', TYPE_CREATURE, REGION_NAROOM, 2, {
        powers: [
            {
                name: 'Vitalize',
                cost: 2,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                        targetRestriction: RESTRICTION_ENERGY_LESS_THAN_STARTING,
                    },
                    effect({
                        effectType: EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
                        target: '$target',
                    }),
                ],
            },
        ],
    }),
    new Card('Diobor', TYPE_CREATURE, REGION_CALD, 6, {
        powers: [
            {
                name: 'Fireball',
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
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
                effects: [
                    {
                        type: ACTION_SELECT,
                        selector: SELECTOR_OWN_MAGI,
                    },
                    effect({
                        effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                        target: '$selected',
                        amount: '$number',
                    }),
                ],
            },
        ],
    }),
    new Card('Furok', TYPE_CREATURE, REGION_NAROOM, 4),
    new Card('Grow', TYPE_SPELL, REGION_NAROOM, 3),
]

const byName = name => cards.find(card => card.name === name);

module.exports = {
    Card,
    CardInGame,
    cards,
    byName,
}
