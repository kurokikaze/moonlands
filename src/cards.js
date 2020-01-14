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
    CALCULATION_MIN,

    PROPERTY_ENERGY_COUNT,
    PROPERTY_REGION,
    PROPERTY_COST,
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

    SELECTOR_OWN_MAGI,
    SELECTOR_ENEMY_MAGI,
    SELECTOR_CREATURES_AND_MAGI,
    SELECTOR_CREATURES_OF_REGION,
    SELECTOR_CREATURES_NOT_OF_REGION,
    SELECTOR_OWN_CREATURES,
    SELECTOR_OPPONENT_CREATURES,
    SELECTOR_MAGI_NOT_OF_REGION,
    SELECTOR_TOP_MAGI_OF_PILE,

    EFFECT_TYPE_ROLL_DIE,
    EFFECT_TYPE_PLAY_CREATURE,
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
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
    EFFECT_TYPE_MOVE_ENERGY,

    PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
    PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_OWN_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
    PROMPT_TYPE_NUMBER,

    RESTRICTION_ENERGY_LESS_THAN_STARTING,

    COST_X,
} = require('./const');

const {
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_MAGI_PILE,
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
} = require('./zone');

class Card {
    constructor(name, type, region, cost, data = {}) {
        this.name = name;
        this.type = type;
        this.region = region;
        this.cost = cost;
        this.data = {
            attacksPerTurn: 1,
            ...data,
        };
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
            attacked: 0,
        };
        this.owner = owner;
        this.actionsUsed = [];
    }

    get card() {
        return this._card;
    }

    addEnergy(amount = 0) {
        this.data.energy += amount;
        return this;
    }

    removeEnergy(amount = 0) {
        this.data.energy = Math.max(this.data.energy - amount, 0);
    }

    markAttackDone() {
        this.data.hasAttacked = true;
        this.data.attacked += 1;
    }

    markAttackReceived() {
        this.data.wasAttacked = true;
    }

    // In future, refer to actions by ID, not name
    wasActionUsed(actionName) {
        return this.actionsUsed.includes(actionName);
    }

    setActionUsed(actionName) {
        this.actionsUsed.push(actionName);
    }

    clearActionsUsed() {
        this.actionsUsed = [];
    }

    clearAttackMarkers() {

    }
}

const power = (name, effects) => ({
    name,
    effects,
    cost: 0,
});

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
 
const cards = [
    new Card('Alaban', TYPE_CREATURE, REGION_ARDERIAL, 6, {
        powers: [
            {
                name: 'Undream',
                cost: 5,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
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
            selector: SELECTOR_OWN_MAGI,
            property: PROPERTY_ENERGIZE,
            modifier: a => a + 1,
        }],
    }),
    new Card('Thermal Blast', TYPE_SPELL, REGION_CALD, 3, {
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
    new Card('Giant Parathin', TYPE_CREATURE, REGION_OROTHE, 10, {
        powers: [
            power('Intercharge', [
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
            ]),
        ],
    }),
    new Card('Kelthet', TYPE_CREATURE, REGION_CALD, 4, {
        powers: [
            {
                name: 'Consume',
                cost: 1,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    },
                    {
                        type: ACTION_GET_PROPERTY_VALUE,
                        target: '$target',
                        property: PROPERTY_ENERGY_COUNT,
                        variable: 'creature_energy',
                    },
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
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    },
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
                        amount: '$roll_result',
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
    new Card('Great Carillion', TYPE_CREATURE, REGION_NAROOM, 8, {
        powers: [
            {
                name: 'Stomp',
                cost: 6,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
                    effect({
                        effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),                    
                ],
            },
        ],
    }),
    new Card('Quor Pup', TYPE_CREATURE, REGION_CALD, 2),
    new Card('Fire Flow', TYPE_SPELL, REGION_CALD, 1, {
        effects: [
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_SINGLE_CREATURE,
            },
            {
                type: ACTION_SELECT,
                selector: SELECTOR_OWN_MAGI,
            },
            {
                type: ACTION_GET_PROPERTY_VALUE,
                target: '$selected',
                property: PROPERTY_ENERGY_COUNT,
                variable: 'magi_energy',
            },
            {
                type: ACTION_CALCULATE,
                operator: CALCULATION_MIN,
                operandOne: '$magi_energy',
                operandTwo: 4,
                variable: 'max_amount',
            },
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_NUMBER,
                min: 1,
                max: '$max_amount',
            },
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
    new Card('Fire Ball', TYPE_SPELL, REGION_CALD, 2, {
       effects: [
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
            },
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
                effects: [
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
            },
        ],
    }),
    new Card ('Lava Aq', TYPE_CREATURE, REGION_CALD, 4, {
        powers: [
            {
                name: 'Firestorm',
                cost: 2,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_OWN_SINGLE_CREATURE,
                    },
                    effect({
                        effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$target',
                    }),
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
                    {
                        type: ACTION_SELECT,
                        selector: SELECTOR_MAGI_NOT_OF_REGION,
                        region: REGION_CALD,
                    },
                    effect({
                        effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                        target: '$selected',
                        amount: 1,
                    }),                    
                ],
            },
        ],
    }),
    new Card('Lava Arboll', TYPE_CREATURE, REGION_CALD, 2, {
        powers: [
            {
                name: 'Healing Flame',
                cost: 2,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
                    },
                    effect({
                        effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                        target: '$sourceCreature',
                    }),
                    effect({
                        effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
                        target: '$target',
                        amount: 3,
                    })
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
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
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
    new Card('Pruitt', TYPE_MAGI, REGION_NAROOM, null, {
        startingEnergy: 15,
        energize: 5,
        startingCards: ['Vinoc', 'Carillion', 'Grow'],
        powers: [
            {
                name: 'Refresh',
                cost: 2,
                effects: [
                    {
                        type: ACTION_SELECT,
                        selector: SELECTOR_OWN_MAGI,
                    },
                    {
                        type: ACTION_GET_PROPERTY_VALUE,
                        target: '$selected',
                        property: PROPERTY_ENERGY_COUNT,
                        variable: 'magi_energy',
                    },
                    {
                        type: ACTION_CALCULATE,
                        operator: CALCULATION_MIN,
                        operandOne: '$magi_energy',
                        operandTwo: 7,
                        variable: 'max_tribute',
                    },
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_NUMBER,
                        min: 1,
                        max: '$max_tribute',
                    },
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
                name: "Heroes' Feast",
                cost: 2,
                effects: [
                    {
                        type: ACTION_SELECT,
                        selector: SELECTOR_OWN_CREATURES,
                    },
                    effect({
                        effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),
                ],
            },
        ],
    }),
    new Card('Timber Hyren', TYPE_CREATURE, REGION_NAROOM, 7, {
        powers: [
            power('Tribute', [
                    {
                        type: ACTION_SELECT,
                        selector: SELECTOR_OWN_CREATURES,
                    },
                    effect({
                        effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                        target: '$selected',
                        amount: 1,
                    }),

            ]),
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
                    effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    target: '$sourceCreature',
                    amount: 1,
                }),
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
        staticAbilities: [
            {
                selector: SELECTOR_OWN_CREATURES,
                property: PROPERTY_ATTACKS_PER_TURN,
                modifier: a => 2,
            },
        ],
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
    new Card('Balamant', TYPE_CREATURE, REGION_NAROOM, 6, {
        powers: [
            {
                name: 'Hunt',
                cost: 2,
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_MAGI,
                    },
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
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
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
                effects: [
                    {
                        type: ACTION_ENTER_PROMPT,
                        promptType: PROMPT_TYPE_SINGLE_CREATURE,
                    },
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
        effects: [
            {
                type: ACTION_SELECT,
                selector: SELECTOR_CREATURES_AND_MAGI,
            },
            effect({
                effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                target: '$selected',
            }),
        ],
    }),
    new Card('Syphon Stone', TYPE_RELIC, REGION_UNIVERSAL, 0, {
        powers: [
            power('Syphon', [
                {
                    type: ACTION_ENTER_PROMPT,
                    promptType: PROMPT_TYPE_SINGLE_CREATURE,
                },
                effect({
                    effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                    target: '$source',
                }),
                effect({
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    target: '$target',
                }),
            ]),
        ],
    }),
    new Card('Grow', TYPE_SPELL, REGION_NAROOM, 3, {
        effects: [
            effect({
                effectType: EFFECT_TYPE_ROLL_DIE,
            }),
            {
                type: ACTION_ENTER_PROMPT,
                promptType: PROMPT_TYPE_SINGLE_CREATURE,
            },
            effect({
                effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                target: '$target',
                amount: '$roll_result',
            }),
        ],
    }),
]

const byName = name => cards.find(card => card.name === name);

module.exports = {
    Card,
    CardInGame,
    cards,
    byName,
}
