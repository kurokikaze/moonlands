var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
var Zone = /** @class */ (function () {
    function Zone(name, type, player, ordered) {
        if (player === void 0) { player = null; }
        if (ordered === void 0) { ordered = false; }
        this._twister = null;
        this._name = name;
        this._player = player;
        this._type = type;
        this.ordered = ordered;
        this.cards = [];
    }
    Zone.prototype.setPRNG = function (twister) {
        this._twister = twister;
    };
    Object.defineProperty(Zone.prototype, "card", {
        // Возвращаем карту если она единственная
        // Для зон типа ACTIVE_MAGI
        get: function () {
            return this.cards.length == 1 ? this.cards[0] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "player", {
        get: function () {
            return this._player;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Zone.prototype, "length", {
        get: function () {
            return this.cards.length;
        },
        enumerable: false,
        configurable: true
    });
    Zone.prototype.add = function (cards) {
        for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card = cards_1[_i];
            this.cards.push(card);
        }
        return this;
    };
    Zone.prototype.addToTop = function (cards) {
        this.cards = __spreadArray(__spreadArray([], cards, true), this.cards, true);
        return this;
    };
    Zone.prototype.byId = function (id) {
        return this.cards.find(function (card) { return card.id === id; });
    };
    Zone.prototype.containsId = function (id) {
        return this.cards.some(function (card) { return card.id === id; });
    };
    Zone.prototype.removeById = function (id) {
        this.cards = this.cards.filter(function (card) { return card.id != id; });
    };
    Zone.prototype.shuffle = function () {
        this.cards = this._shuffle(this.cards);
    };
    Zone.prototype._shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            // @ts-ignore
            var randomValue = this._twister ? this._twister.random() : Math.random();
            randomIndex = Math.floor(randomValue * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    Zone.prototype.empty = function () {
        this.cards = [];
    };
    Zone.prototype.serialize = function (hidden) {
        if (hidden === void 0) { hidden = false; }
        return hidden ? this.cards.map(function (card) { return card.serialize(true); }) : this.cards.map(function (card) { return card.serialize(false); });
    };
    return Zone;
}());
export default Zone;
//# sourceMappingURL=Zone.js.map