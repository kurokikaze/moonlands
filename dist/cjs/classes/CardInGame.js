"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const clone_1 = __importDefault(require("../clone"));
class CardInGame {
    _card;
    id;
    data;
    owner;
    modifiedCard;
    constructor(card, owner, seeded_nanoid = nanoid_1.nanoid) {
        this._card = card;
        this.modifiedCard = (0, clone_1.default)(card);
        this.id = seeded_nanoid();
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
    get card() {
        return this._card;
    }
    addEnergy(amount = 0) {
        this.data.energy += amount;
        return this;
    }
    removeEnergy(amount = 0) {
        const amountToRemove = Math.min(this.data.energy, amount);
        this.data.energy -= amountToRemove;
        this.data.energyLostThisTurn += amountToRemove;
    }
    setEnergy(amount) {
        const amountToRemove = Math.max(this.data.energy - amount, 0);
        this.data.energyLostThisTurn += amountToRemove;
        this.data.energy = amount;
    }
    markAttackDone() {
        this.data.hasAttacked = true;
        this.data.attacked += 1;
    }
    forbidAttacks() {
        this.data.attacked = 100; // Hack, but will work for now
    }
    markAttackReceived() {
        this.data.wasAttacked = true;
    }
    markDefeatedCreature() {
        this.data.defeatedCreature = true;
    }
    // In future, refer to actions by ID, not name
    wasActionUsed(actionName) {
        return this.data.actionsUsed.includes(actionName);
    }
    setActionUsed(actionName) {
        this.data.actionsUsed.push(actionName);
    }
    clearActionsUsed() {
        this.data.actionsUsed = [];
    }
    clearAttackMarkers() {
        this.data.wasAttacked = false;
        this.data.hasAttacked = false;
        this.data.attacked = 0;
        this.data.defeatedCreature = false;
        this.data.energyLostThisTurn = 0;
    }
    copy() {
        const newCard = new CardInGame(this._card, this.owner, () => this.id);
        newCard.data = { ...this.data };
        newCard.id = this.id;
        return newCard;
    }
    serialize(hidden = false) {
        return hidden ? {
            card: null,
            data: {},
            owner: this.owner,
            id: this.id,
        } : {
            card: this.card.name,
            data: this.data,
            owner: this.owner,
            id: this.id,
        };
    }
}
exports.default = CardInGame;
//# sourceMappingURL=CardInGame.js.map