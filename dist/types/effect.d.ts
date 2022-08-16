import { AnyEffectType, FindType, StaticAbilityType, TriggerEffectType } from '.';
import { ConditionType, ExpirationObjectType, ZoneType } from './common';
import CardInGame from '../classes/CardInGame';
import { ACTION_EFFECT, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_NONE, EFFECT_TYPE_DRAW, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_DEFEAT_MAGI, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_ATTACK, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_DRAW_N_CARDS, EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES } from '../const';
export declare type EffectTypeType = typeof EFFECT_TYPE_END_OF_TURN | typeof EFFECT_TYPE_ATTACK | typeof EFFECT_TYPE_NONE | typeof EFFECT_TYPE_DRAW | typeof EFFECT_TYPE_ROLL_DIE | typeof EFFECT_TYPE_PLAY_CREATURE | typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP | typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP | typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI | typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER | typeof EFFECT_TYPE_PLAY_RELIC | typeof EFFECT_TYPE_PLAY_SPELL | typeof EFFECT_TYPE_MAGI_IS_DEFEATED | typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY | typeof EFFECT_TYPE_CREATURE_ENTERS_PLAY | typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE | typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY | typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY | typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE | typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI | typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE | typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI | typeof EFFECT_TYPE_ENERGIZE | typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT | typeof EFFECT_TYPE_CONDITIONAL | typeof EFFECT_TYPE_START_OF_TURN | typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES | typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES | typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI | typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY | typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE | typeof EFFECT_TYPE_DEAL_DAMAGE | typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY | typeof EFFECT_TYPE_MOVE_ENERGY | typeof EFFECT_TYPE_CREATURE_ATTACKS | typeof EFFECT_TYPE_BEFORE_DAMAGE | typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND | typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE | typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES | typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER | typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI | typeof EFFECT_TYPE_MAGI_FLIPPED | typeof EFFECT_TYPE_START_STEP;
declare type EffectTypeStillInUse = typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY | typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY | typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY | typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY | typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY | typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND | typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE;
interface ActionEffect {
    type: typeof ACTION_EFFECT;
    generatedBy: string;
    player?: number;
    spell?: boolean;
    triggerSource?: CardInGame;
    triggeredId?: string[];
    replacedBy?: string[];
}
declare type PayingEnergyForPowerEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER;
    target: CardInGame;
    amount: string | number;
};
declare type BeforeDrawCardsInDrawStepType = ActionEffect & {
    effectType: typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP;
};
declare type DrawCardsInDrawStepType = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP;
    numberOfCards: number;
};
declare type NoneEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_NONE;
};
declare type DrawEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW;
    stepEffect?: boolean;
};
declare type DrawRestOfCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_REST_OF_CARDS;
    drawnCards: string;
};
export declare type MoveCardBetwenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES;
    target: string | CardInGame;
    bottom: boolean;
    attack?: boolean;
    sourceZone: ZoneType;
    destinationZone: ZoneType;
};
declare type AttackEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ATTACK;
    source: CardInGame | string;
    target: CardInGame | string;
    additionalAttackers: CardInGame[] | string;
};
declare type MoveCardsBetwenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES;
    target: string | CardInGame[];
    bottom: boolean;
    attack?: boolean;
    sourceZone: ZoneType;
    destinationZone: ZoneType;
};
declare type CardMovedBetweenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES;
    sourceCard: any;
    sourceZone: ZoneType;
    destinationCard: any;
    destinationZone: ZoneType;
};
declare type StartTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_TURN;
    player: number;
};
declare type StartOfTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_OF_TURN;
    player: number;
    generatedBy: string;
};
declare type StartStepEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_STEP;
    player: number;
    step: number;
};
declare type EndOfTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_END_OF_TURN;
    player: number;
};
declare type MagiFlippedEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MAGI_FLIPPED;
    target: string | CardInGame;
};
declare type DiscardEnergyFromCreatureOrMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI;
    target: CardInGame | CardInGame[];
    source?: CardInGame;
    spell?: boolean;
    relic?: boolean;
    power?: boolean;
    amount: number;
    attack: boolean;
};
declare type DiscardEnergyFromCreaturesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES;
    target: string | CardInGame[];
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    amount: number;
};
export declare type DiscardEnergyFromCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    relic?: boolean;
    amount: number;
};
declare type DiscardEnergyFromMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    attack?: boolean;
    relic?: boolean;
    spell?: boolean;
    amount: number;
};
declare type AddStartingEnergyToMagi = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI;
    target: string | CardInGame;
};
declare type FindStartingCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_FIND_STARTING_CARDS;
    cards: string;
};
declare type ReshuffleDiscardEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RESHUFFLE_DISCARD;
    player: number;
};
declare type AddEnergyToCreatureOrMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI;
    target: string | CardInGame | CardInGame[];
    amount: number;
};
declare type AddEnergyToCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE;
    target: CardInGame | CardInGame[];
    source: CardInGame | null;
    amount: number;
};
declare type AddEnergyToMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI;
    target: CardInGame | CardInGame[];
    amount: string | number;
};
declare type PayingEnergyForCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE;
    from: CardInGame;
    amount: number;
    player: number;
};
declare type PlayCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_CREATURE;
    card: CardInGame;
    player: number;
};
declare type CreatureEntersPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CREATURE_ENTERS_PLAY;
    target: string;
};
declare type StartingEnergyOnCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE;
    target: string;
    amount: number;
};
declare type PayingEnergyForRelicEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC;
    from: CardInGame;
    amount: number;
};
declare type PlayRelicEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_RELIC;
    card: CardInGame;
};
declare type RelicEntersPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RELIC_ENTERS_PLAY;
    card: string;
};
declare type PlaySpellEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_SPELL;
    card: CardInGame;
};
declare type PayingEnergyForSpellEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL;
    from: CardInGame;
    amount: number | string;
};
declare type ConditionalEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CONDITIONAL;
    conditions: ConditionType[];
    thenEffects: AnyEffectType[];
    elseEffects?: AnyEffectType[];
};
declare type DelayedTriggerType = {
    name: string;
    find: FindType;
    effects: AnyEffectType[];
};
declare type AddDelayedTriggerEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER;
    delayedTrigger: DelayedTriggerType;
};
declare type EnergizeEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ENERGIZE;
    target: string;
};
declare type RollDieEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ROLL_DIE;
    result?: number;
};
declare type MoveEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_ENERGY;
    source: CardInGame | string;
    target: CardInGame | string;
    amount: string | number;
};
declare type DiscardCreatureOrRelicFromPlay = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC;
    target: CardInGame | string;
};
declare type DefeatMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DEFEAT_MAGI;
    target: CardInGame;
};
declare type MagiIsDefeatedEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MAGI_IS_DEFEATED;
    source: CardInGame | null;
    target: CardInGame;
};
declare type CreateContinuousEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT;
    staticAbilities?: StaticAbilityType[];
    triggerEffects?: TriggerEffectType[];
    expiration: ExpirationObjectType;
};
declare type RearrangeEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
    energyOnCreatures: string | Record<string, number>;
};
declare type DistributeEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    energyOnCreatures: string | Record<string, number>;
};
declare type DistributeDamageEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
    source?: CardInGame;
    damageOnCreatures: string | Record<string, number>;
};
declare type DrawNCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_N_CARDS;
    numberOfCards: number | string;
};
export declare type EffectType = ActionEffect & {
    effectType: EffectTypeStillInUse;
    generatedBy?: string;
    source?: CardInGame;
    target?: CardInGame;
} | MoveCardBetwenZonesEffect | MoveCardsBetwenZonesEffect | NoneEffect | AttackEffect | CardMovedBetweenZonesEffect | BeforeDrawCardsInDrawStepType | DrawCardsInDrawStepType | DrawNCardsEffect | DiscardEnergyFromCreatureOrMagiEffect | DiscardEnergyFromCreaturesEffect | DiscardEnergyFromCreatureEffect | DiscardEnergyFromMagiEffect | PayingEnergyForPowerEffect | StartTurnEffect | StartOfTurnEffect | StartStepEffect | EndOfTurnEffect | DrawEffect | DrawRestOfCardsEffect | MagiFlippedEffect | AddStartingEnergyToMagi | FindStartingCardsEffect | ReshuffleDiscardEffect | AddEnergyToCreatureOrMagiEffect | AddEnergyToCreatureEffect | AddEnergyToMagiEffect | DiscardCreatureOrRelicFromPlay | PayingEnergyForCreatureEffect | PlayCreatureEffect | CreatureEntersPlayEffect | StartingEnergyOnCreatureEffect | PayingEnergyForRelicEffect | PlayRelicEffect | RelicEntersPlayEffect | PlaySpellEffect | PayingEnergyForSpellEffect | ConditionalEffect | AddDelayedTriggerEffect | EnergizeEffect | RollDieEffect | MoveEnergyEffect | MagiIsDefeatedEffect | CreateContinuousEffect | DefeatMagiEffect | RearrangeEnergyEffect | DistributeEnergyEffect | DistributeDamageEffect;
export {};
