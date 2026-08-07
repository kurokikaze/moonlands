import CardInGame from './classes/CardInGame';
import { PropertyType } from './types';
export interface CostEngineContext {
    getOwnMagi(player: number): CardInGame[];
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null): any;
}
export declare class CostEngine {
    private context;
    constructor(context: CostEngineContext);
    calculateTotalCost(card: CardInGame): number;
}
