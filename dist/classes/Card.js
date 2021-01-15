import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, REGION_CALD, REGION_NAROOM, REGION_OROTHE, REGION_ARDERIAL, REGION_UNDERNEATH, REGION_UNIVERSAL, REGION_BOGRATH, } from '../const';
export default class Card {
    constructor(name, type, region, cost, data = {}) {
        if (![TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL].includes(type)) {
            throw new Error(`Unknown card type: "${type}" for card ${name}`);
        }
        if (![
            REGION_CALD,
            REGION_NAROOM,
            REGION_OROTHE,
            REGION_ARDERIAL,
            REGION_UNDERNEATH,
            REGION_UNIVERSAL,
            REGION_BOGRATH,
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
//# sourceMappingURL=Card.js.map