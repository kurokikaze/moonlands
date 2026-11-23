import CardInGame from './classes/CardInGame.js';
import { PropertyType } from './types/index.js';
export declare const variableCostOffsets: {
    X: number;
    X_PLUS_ONE: number;
    X_PLUS_FOUR: number;
};
export interface CostEngineContext {
    getOwnMagi(player: number): CardInGame[];
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null): any;
}
export declare class CostEngine {
    private context;
    constructor(context: CostEngineContext);
    calculateTotalCost(card: CardInGame): number;
}
