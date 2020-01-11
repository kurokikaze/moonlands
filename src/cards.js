const nanoid = require('nanoid');

const {
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

const cards = [
    new Card('Grega', TYPE_MAGI, REGION_CALD, null, {
        startingEnergy: 10,
        energize: 5,
        startingCards: ['Arbolit', 'Quor Pup', 'Fire Flow'],
    }),
    new Card('Arbolit', TYPE_CREATURE, REGION_CALD, 2),
    new Card('Green Stuff', TYPE_CREATURE, REGION_BOGRATH, 0, {energize: 1}),
    new Card('Quor Pup', TYPE_CREATURE, REGION_CALD, 2),
    new Card('Fire Flow', TYPE_SPELL, REGION_CALD, 1),
    new Card('Yaki', TYPE_MAGI, REGION_NAROOM, null, {
        startingEnergy: 14,
        energize: 5,
        startingCards: ['Arboll', 'Weebo', 'Furok', 'Grow'],
    }),
    new Card('Arboll', TYPE_CREATURE, REGION_NAROOM, 3),
    new Card('Weebo', TYPE_CREATURE, REGION_NAROOM, 2),
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
