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
export default class Zone {
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
        this.cards = shuffle(this.cards);
    }
    empty() {
        this.cards = [];
    }
    serialize(hidden = false) {
        return this.cards.map(card => card.serialize(hidden));
    }
}
//# sourceMappingURL=Zone.js.map