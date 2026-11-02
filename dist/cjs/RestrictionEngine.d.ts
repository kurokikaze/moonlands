import { PROPERTY_STATUS, PROPERTY_CONTROLLER } from './const.js';
import CardInGame from './classes/CardInGame.js';
import { RestrictionObjectType, RestrictionType } from './types/index.js';
export interface RestrictionEngineContext {
    getOwnMagi(player: number): CardInGame[];
    getOwnCreatures(player: number): CardInGame[];
    calculateTotalCost(card: CardInGame): number;
    modifyByStaticAbilities(target: CardInGame, property: typeof PROPERTY_STATUS | typeof PROPERTY_CONTROLLER, subProperty?: string | null): any;
}
export declare class RestrictionEngine {
    private context;
    constructor(context: RestrictionEngineContext);
    makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean;
    checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]): boolean;
    checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    makeCardFilter(restrictions?: RestrictionObjectType[]): (c: CardInGame) => boolean;
}
