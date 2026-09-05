import { SELECTOR_CREATURES, SELECTOR_RELICS, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_CREATURES_OF_TYPE, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_RANDOM_CARD_IN_HAND, SELECTOR_OPPONENT_ID } from './const.js';
import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import { LayeredModificationEngine, CardWithModification, EnrichedStaticAbilityType, GameStaticAbility } from './LayeredModificationEngine.js';
import { SelectorTypeType, PropertyType, RestrictionType, RestrictionObjectType, ContinuousEffectType, ZoneType, Region, MercenneFixed } from './types/index.js';
import { StatusType } from './types/common.js';
export type { CardWithModification, EnrichedStaticAbilityType, GameStaticAbility } from './LayeredModificationEngine.js';
/** Subset of State that SelectorEngine needs. Kept as an interface to avoid a circular import. */
export interface SelectorEngineContext {
    getZone(type: ZoneType, player?: number | null): Zone;
    getOpponent(player: number): number;
    players: number[];
    getContinuousEffects(): ContinuousEffectType[];
    getTwister(): MercenneFixed | null;
}
export declare class SelectorEngine extends LayeredModificationEngine {
    private context;
    private costEngine;
    private restrictionEngine;
    modifiedCardDataCache: Map<string, CardWithModification>;
    constructor(context: SelectorEngineContext);
    private getOwnMagi;
    private getOwnCreatures;
    clearModifiedCardDataCache(): void;
    selectNthCardOfZone(player: number, zoneType: ZoneType, cardNumber: number, restrictions?: RestrictionObjectType[]): CardInGame[];
    selectRandomCardOfZone(player: number, zoneType: ZoneType): CardInGame[];
    useSelector(selector: typeof SELECTOR_STATUS, player: null, argument: StatusType): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS, player: null, argument: StatusType): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE, player: number, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_TYPE, player: null, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE, player: null, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_REGION, player: number, argument: Region): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_REGION, player: number, argument: Region): CardInGame[];
    useSelector(selector: typeof SELECTOR_OPPONENT_ID, player: number | null, argument: number): number;
    useSelector(selector: typeof SELECTOR_TOP_MAGI_OF_PILE, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_MAGI, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_ENEMY_MAGI, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CREATURES, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_PLAYER, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CARDS_IN_PLAY, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_RELICS, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_RANDOM_CARD_IN_HAND, player: null): CardInGame[];
    useSelectorAny(selector: SelectorTypeType, player: number | null, argument?: any): CardInGame[] | number;
    isCardAffectedByStaticAbility(card: CardInGame | CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): boolean;
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null | undefined): any;
    makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean;
    checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]): boolean;
    checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    makeCardFilter(restrictions?: RestrictionObjectType[]): (c: CardInGame) => boolean;
    calculateTotalCost(card: CardInGame): number;
}
