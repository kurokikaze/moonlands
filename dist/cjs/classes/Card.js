"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
class Card {
    name;
    type;
    region;
    cost;
    data;
    constructor(name, type, region, cost, data = {}) {
        if (![const_1.TYPE_CREATURE, const_1.TYPE_MAGI, const_1.TYPE_RELIC, const_1.TYPE_SPELL].includes(type)) {
            throw new Error(`Unknown card type: "${type}" for card ${name}`);
        }
        if (![
            const_1.REGION_CALD,
            const_1.REGION_NAROOM,
            const_1.REGION_OROTHE,
            const_1.REGION_ARDERIAL,
            const_1.REGION_UNDERNEATH,
            const_1.REGION_UNIVERSAL,
            const_1.REGION_BOGRATH,
        ].includes(region)) {
            throw new Error(`Unknown card region: "${region}" for card ${name}`);
        }
        this.name = name;
        this.type = type;
        this.region = region;
        this.cost = cost;
        this.data = {
            attacksPerTurn: 1,
            canAttackMagiDirectly: false,
            ableToAttack: true,
            canBeAttacked: true,
            ...data,
        };
    }
    getName() {
        return this.name;
    }
    getCost() {
        return this.cost;
    }
    toJSON() {
        return this.name;
    }
}
exports.default = Card;
//# sourceMappingURL=Card.js.map