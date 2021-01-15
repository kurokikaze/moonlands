"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nanoid_1 = __importDefault(require("nanoid"));
var CardInGame = /** @class */ (function () {
    function CardInGame(card, owner) {
        this._card = card;
        this.id = nanoid_1.default();
        this.data = {
            energy: 0,
            controller: owner,
            attacked: 0,
            actionsUsed: [],
            energyLostThisTurn: 0,
            defeatedCreature: false,
            hasAttacked: false,
            wasAttacked: false,
        };
        this.owner = owner;
    }
    Object.defineProperty(CardInGame.prototype, "card", {
        get: function () {
            return this._card;
        },
        enumerable: false,
        configurable: true
    });
    CardInGame.prototype.addEnergy = function (amount) {
        if (amount === void 0) { amount = 0; }
        this.data.energy += amount;
        return this;
    };
    CardInGame.prototype.removeEnergy = function (amount) {
        if (amount === void 0) { amount = 0; }
        var amountToRemove = Math.min(this.data.energy, amount);
        this.data.energy -= amountToRemove;
        this.data.energyLostThisTurn += amountToRemove;
    };
    CardInGame.prototype.markAttackDone = function () {
        this.data.hasAttacked = true;
        this.data.attacked += 1;
    };
    CardInGame.prototype.forbidAttacks = function () {
        this.data.attacked = 100; // Hack, but will work for now
    };
    CardInGame.prototype.markAttackReceived = function () {
        this.data.wasAttacked = true;
    };
    CardInGame.prototype.markDefeatedCreature = function () {
        this.data.defeatedCreature = true;
    };
    // In future, refer to actions by ID, not name
    CardInGame.prototype.wasActionUsed = function (actionName) {
        return this.data.actionsUsed.includes(actionName);
    };
    CardInGame.prototype.setActionUsed = function (actionName) {
        this.data.actionsUsed.push(actionName);
    };
    CardInGame.prototype.clearActionsUsed = function () {
        this.data.actionsUsed = [];
    };
    CardInGame.prototype.clearAttackMarkers = function () {
        this.data.wasAttacked = false;
        this.data.hasAttacked = false;
        this.data.attacked = 0;
        this.data.defeatedCreature = false;
        this.data.energyLostThisTurn = 0;
    };
    CardInGame.prototype.copy = function () {
        var newCard = new CardInGame(this._card, this.owner);
        newCard.data = __assign({}, this.data);
        newCard.id = this.id;
        return newCard;
    };
    CardInGame.prototype.serialize = function (hidden) {
        if (hidden === void 0) { hidden = false; }
        return {
            card: hidden ? null : this.card.name,
            data: hidden ? {} : this.data,
            id: this.id,
        };
    };
    return CardInGame;
}());
exports.default = CardInGame;
//# sourceMappingURL=CardInGame.js.map