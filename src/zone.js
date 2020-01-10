const ZONE_TYPE_ACTIVE_MAGI = 'zones/active_magi';
const ZONE_TYPE_MAGI_PILE = 'zones/magi_pile';
const ZONE_TYPE_DEFEATED_MAGI = 'zones/defeated_magi';
const ZONE_TYPE_DECK = 'zones/deck';
const ZONE_TYPE_IN_PLAY = 'zones/in_play';
const ZONE_TYPE_DISCARD = 'zones/discard';
const ZONE_TYPE_HAND = 'zones/hand';

class Zone {
    constructor(name, type, player = null, ordered = false) {
        this._name = name;
        this._player = player;
        this._type = type;
        this.ordered = ordered;

        this.cards = [];
    }

    // Возвращаем карту если она единственная
    // Для зон типа ACTIVE_MAGI
    get card() {
        return this.cards.length == 1 ? this.cards[0] : null;
    }

    get name() {
        return this._name;
    }

    get player() {
        return this._player;
    }

    get type() {
        return this._type;
    }

    get length() {
        return this.cards.length;
    }

    add(cards) {
        this.cards = [...this.cards, ...cards];

        return this;
    }

    byId(id) {
        return this.cards.find(card => card.id === id);
    }

    containsId(id) {
        return this.cards.some(card => card.id === id);
    }

    removeById(id) {
        this.cards = this.cards.filter(card => card.id != id);
    }
}

module.exports = {
    Zone,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_MAGI_PILE,
    ZONE_TYPE_DEFEATED_MAGI,
    ZONE_TYPE_DECK,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_HAND,
};
