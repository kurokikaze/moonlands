import { COST_X, COST_X_PLUS_ONE } from '../const.js';
import { Region, CardType, CardData } from '../types/index.js';
export type CostType = number | typeof COST_X | typeof COST_X_PLUS_ONE | null;
export type ModifiedCardType = {
    name: string;
    data: CardData;
    region: Region;
    cost: CostType;
};
export default class Card {
    name: string;
    type: CardType;
    region: Region;
    cost: CostType;
    data: CardData;
    constructor(name: string, type: CardType, region: Region, cost: CostType, data?: CardData);
    getName(): string;
    getCost(): CostType;
    toJSON(): string;
}
