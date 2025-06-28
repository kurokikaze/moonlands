"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
class Zone {
    _name;
    _player;
    _type;
    ordered;
    _twister = null;
    cards;
    constructor(name, type, player = null, ordered = false) {
        this._name = name;
        this._player = player;
        this._type = type;
        this.ordered = ordered;
        this.cards = [];
    }
    setPRNG(twister) {
        this._twister = twister;
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
        for (let card of cards) {
            this.cards.push(card);
        }
        return this;
    }
    addToTop(cards) {
        this.cards = [...cards, ...this.cards];
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
    shuffle() {
        this.cards = this._shuffle(this.cards);
    }
    getCardsByRestriction(restrictions, state) {
        return restrictions ? this.cards.filter(state.makeCardFilter(restrictions)) : this.cards;
    }
    _shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            // @ts-ignore
            const randomValue = this._twister ? this._twister.random() : Math.random();
            randomIndex = Math.floor(randomValue * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    empty() {
        this.cards = [];
    }
    serialize(hidden = false) {
        return hidden ? this.cards.map(card => card.serialize(true)) : this.cards.map(card => card.serialize(false));
    }
}
exports.default = Zone;
//# sourceMappingURL=Zone.js.map