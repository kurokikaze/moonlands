import CardInGame from './classes/CardInGame';
import Zone from './classes/Zone';
import { AnyEffectType, PropertyType, RestrictionObjectType, ZoneType } from './types';
/**
 * Context interface containing methods needed by PromptValidator
 * Kept as an interface to avoid circular imports
 */
export interface PromptValidatorContext {
    getZone(type: ZoneType, player?: number | null): Zone;
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null): any;
    getOpponent(player: number): number;
    getMetaValue(value: any, sourceId: string): any;
    checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]): boolean;
    checkAnyCardForRestriction(cards: CardInGame[], restriction: any, restrictionValue: any): boolean;
}
export declare class PromptValidator {
    private context;
    constructor(context: PromptValidatorContext);
    checkPrompts(source: CardInGame, preparedActions: AnyEffectType[], isPower?: boolean, powerCost?: number): boolean;
}
