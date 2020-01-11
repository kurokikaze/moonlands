const nanoid = require('nanoid');

const {
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_EFFECT,
    ACTION_ENTER_PROMPT,
    ACTION_RESOLVE_PROMPT,
    
    REGION_ARDERIAL,
    REGION_CALD,
    REGION_NAROOM,
    REGION_OROTHE,
    REGION_UNDERNEATH,
    REGION_BOGRATH,

    TYPE_CREATURE,
    TYPE_MAGI,
    TYPE_RELIC,
    TYPE_SPELL,

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

    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
    PROMPT_TYPE_NUMBER,

    RESTRICTION_ENERGY_LESS_THAN_STARTING,
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
    new Card('Grega', TYPE_MAGI, REGION_CALD, null, {
        startingEnergy: 10,
        energize: 5,
        startingCards: ['Arbolit', 'Quor Pup', 'Fire Flow'],
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
    new Card('Green Stuff', TYPE_CREATURE, REGION_BOGRATH, 0, {energize: 1}),
    new Card('Quor Pup', TYPE_CREATURE, REGION_CALD, 2),
    new Card('Fire Flow', TYPE_SPELL, REGION_CALD, 1),
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
