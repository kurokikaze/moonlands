import { COST_X, COST_X_PLUS_ONE } from '../const';
import { Region, CardType, CardData } from '../types';
declare type CostType = number | typeof COST_X | typeof COST_X_PLUS_ONE;
export default class Card {
    name: string;
    type: CardType;
    region: any;
    cost: CostType;
    data: CardData;
    constructor(name: string, type: any, region: Region, cost: CostType, data?: CardData);
    getName(): string;
    getCost(): CostType;
    toJSON(): string;
}
export {};
