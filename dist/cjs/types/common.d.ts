import { STATUS_BURROWED, REGION_UNIVERSAL, TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, REGION_CALD, REGION_NAROOM, REGION_OROTHE, REGION_ARDERIAL, REGION_UNDERNEATH, REGION_BOGRATH, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE, PROMPT_TYPE_NUMBER, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_NUMBER_OF_CREATURES, PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_MAGI_NAME, PROPERTY_COST, PROPERTY_ABLE_TO_ATTACK, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_CONTROLLER, PROPERTY_CREATURE_TYPES, PROPERTY_ENERGIZE, PROPERTY_ENERGY_COUNT, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_ID, PROPERTY_POWER_COST, PROPERTY_REGION, PROPERTY_STATUS, PROPERTY_STATUS_DEFEATED_CREATURE, PROPERTY_STATUS_WAS_ATTACKED, PROPERTY_TYPE, ACTION_PROPERTY, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER, EXPIRATION_OPPONENT_TURNS, EXPIRATION_PLAYER_TURNS, PROPERTY_CAN_BE_ATTACKED, RESTRICTION_CREATURE_TYPE, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_EXCEPT_SOURCE, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_OWN_CREATURE, RESTRICTION_PLAYABLE, RESTRICTION_REGION, RESTRICTION_REGION_IS_NOT, RESTRICTION_STATUS, RESTRICTION_TYPE, RESTRICTION_ENERGY_EQUALS, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, CARD_COUNT, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROPERTY_PROTECTION, PROMPT_TYPE_PLAYER, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROPERTY_CREATURE_NAME, RESTRICTION_CREATURE_NAME, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES } from "../const";
export type ZoneType = typeof ZONE_TYPE_MAGI_PILE | typeof ZONE_TYPE_ACTIVE_MAGI | typeof ZONE_TYPE_DECK | typeof ZONE_TYPE_DEFEATED_MAGI | typeof ZONE_TYPE_DISCARD | typeof ZONE_TYPE_HAND | typeof ZONE_TYPE_IN_PLAY;
export type Region = typeof REGION_CALD | typeof REGION_NAROOM | typeof REGION_OROTHE | typeof REGION_ARDERIAL | typeof REGION_UNDERNEATH | typeof REGION_UNIVERSAL | typeof REGION_BOGRATH;
export type PropertyType = typeof PROPERTY_MAGI_STARTING_ENERGY | typeof PROPERTY_COST | typeof PROPERTY_ABLE_TO_ATTACK | typeof PROPERTY_ATTACKS_PER_TURN | typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY | typeof PROPERTY_CONTROLLER | typeof PROPERTY_CREATURE_TYPES | typeof PROPERTY_CREATURE_NAME | typeof PROPERTY_ENERGIZE | typeof PROPERTY_ENERGY_COUNT | typeof PROPERTY_ENERGY_LOSS_THRESHOLD | typeof PROPERTY_ID | typeof PROPERTY_MAGI_NAME | typeof PROPERTY_POWER_COST | typeof PROPERTY_REGION | typeof PROPERTY_STATUS | typeof PROPERTY_STATUS_DEFEATED_CREATURE | typeof PROPERTY_STATUS_WAS_ATTACKED | typeof PROPERTY_TYPE | typeof PROPERTY_CAN_BE_ATTACKED | typeof PROPERTY_PROTECTION | typeof CARD_COUNT | // Special case of property getter
typeof ACTION_PROPERTY;
export type CardType = typeof TYPE_CREATURE | typeof TYPE_MAGI | typeof TYPE_RELIC | typeof TYPE_SPELL;
export type PromptTypeType = typeof PROMPT_TYPE_NUMBER | typeof PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE | typeof PROMPT_TYPE_CHOOSE_CARDS | typeof PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE | typeof PROMPT_TYPE_NUMBER_OF_CREATURES | typeof PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED | typeof PROMPT_TYPE_OWN_SINGLE_CREATURE | typeof PROMPT_TYPE_RELIC | typeof PROMPT_TYPE_SINGLE_CREATURE | typeof PROMPT_TYPE_SINGLE_CREATURE_FILTERED | typeof PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI | typeof PROMPT_TYPE_MAY_ABILITY | typeof PROMPT_TYPE_MAGI_WITHOUT_CREATURES | typeof PROMPT_TYPE_SINGLE_MAGI | typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES | typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE | typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES | typeof PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES | typeof PROMPT_TYPE_PLAYER | typeof PROMPT_TYPE_ALTERNATIVE | typeof PROMPT_TYPE_POWER_ON_MAGI | typeof PROMPT_TYPE_PAYMENT_SOURCE | typeof PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES | typeof PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE;
export type GenericPromptType = typeof PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE | typeof PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE | typeof PROMPT_TYPE_NUMBER_OF_CREATURES | typeof PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED | typeof PROMPT_TYPE_OWN_SINGLE_CREATURE | typeof PROMPT_TYPE_RELIC | typeof PROMPT_TYPE_SINGLE_CREATURE | typeof PROMPT_TYPE_SINGLE_CREATURE_FILTERED | typeof PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI | typeof PROMPT_TYPE_MAGI_WITHOUT_CREATURES | typeof PROMPT_TYPE_SINGLE_MAGI | typeof PROMPT_TYPE_PLAYER;
export type StatusType = typeof STATUS_BURROWED;
export type ConditionType = {
    objectOne: string;
    propertyOne: PropertyType | null;
    comparator: '<' | '=' | '>' | '<=' | '>=' | '!=' | 'includes';
    objectTwo: string | number | boolean;
    propertyTwo: PropertyType | null;
};
export type ExpirationType = typeof EXPIRATION_OPPONENT_TURNS | typeof EXPIRATION_PLAYER_TURNS | typeof EXPIRATION_ANY_TURNS | typeof EXPIRATION_NEVER;
export type ExpirationObjectType = {
    type: ExpirationType;
    turns: number;
};
export type RestrictionType = typeof RESTRICTION_CREATURE_WAS_ATTACKED | typeof RESTRICTION_OWN_CREATURE | typeof RESTRICTION_OPPONENT_CREATURE | typeof RESTRICTION_ENERGY_LESS_THAN_STARTING | typeof RESTRICTION_REGION | typeof RESTRICTION_REGION_IS_NOT | typeof RESTRICTION_TYPE | typeof RESTRICTION_CREATURE_TYPE | typeof RESTRICTION_CREATURE_NAME | typeof RESTRICTION_PLAYABLE | typeof RESTRICTION_ENERGY_LESS_THAN | typeof RESTRICTION_STATUS | typeof RESTRICTION_MAGI_WITHOUT_CREATURES | typeof RESTRICTION_EXCEPT_SOURCE | typeof RESTRICTION_ENERGY_EQUALS;
export type RestrictionObjectType = {
    type: RestrictionType;
    value: string;
} | {
    type: typeof RESTRICTION_CREATURE_TYPE;
    value: string | string[];
} | {
    type: typeof RESTRICTION_PLAYABLE;
    value?: string;
} | {
    type: typeof RESTRICTION_ENERGY_EQUALS;
    value: number;
};
