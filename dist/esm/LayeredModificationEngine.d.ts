import { PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, PROPERTY_PROTECTION, PROPERTY_CREATURE_NAME, PROPERTY_CONTROLLING_PLAYER, PROPERTY_ABLE_TO_USE_POWERS, STATUS_BURROWED, SELECTOR_STATUS } from './const.js';
import CardInGame, { InGameData } from './classes/CardInGame.js';
import Card, { CostType, ModifiedCardType } from './classes/Card.js';
import { PropertyType, ProtectionType, StaticAbilityType } from './types/index.js';
import { CardType } from './types/common.js';
export type CardWithModification = {
    card: Card;
    data: InGameData;
    modifiedCard: ModifiedCardType;
    id: string;
    owner: number;
};
export type EnrichedStaticAbilityType = StaticAbilityType & {
    player: number;
    card?: CardInGame;
};
export type GameStaticAbility = StaticAbilityType & {
    selector: typeof SELECTOR_STATUS;
};
export declare class LayeredModificationEngine {
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_ATTACK): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_BE_ATTACKED): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ATTACKS_PER_TURN): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGIZE): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGY_COUNT): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_POWER_COST, subProperty: string): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLER): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLING_PLAYER): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_USE_POWERS): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_PROTECTION): ProtectionType | undefined;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_MAGI_NAME): string;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_TYPE): CardType;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_TYPES): string[];
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_NAME): string;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_COST): CostType;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_STATUS, subProperty: typeof STATUS_BURROWED): boolean;
    getByPropertyAny(target: CardInGame | CardWithModification, property: PropertyType, subProperty?: null | typeof STATUS_BURROWED | string): any;
    layeredDataReducer(currentCard: CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): CardWithModification;
    /**
     * Check if a card is affected by a static ability based on its selector
     * Must be implemented by subclass
     */
    protected isCardAffectedByStaticAbility(card: CardWithModification | any, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): boolean;
}
