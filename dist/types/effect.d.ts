import { AnyEffectType, FindType, StaticAbilityType, TriggerEffectType } from '.';
import { ConditionType, ExpirationObjectType, ZoneType } from './common';
import CardInGame from '../classes/CardInGame';
import { ACTION_EFFECT, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_NONE, EFFECT_TYPE_DRAW, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_DEFEAT_MAGI, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_ATTACK, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_DRAW_N_CARDS, EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_DISCARD_RESHUFFLED, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_DEFENDER_DAMAGE_DEALT, EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE, EFFECT_TYPE_CARD_ATTACHED_TO_CARD } from '../const';
export type EffectTypeType = typeof EFFECT_TYPE_END_OF_TURN | typeof EFFECT_TYPE_ATTACK | typeof EFFECT_TYPE_NONE | typeof EFFECT_TYPE_DRAW | typeof EFFECT_TYPE_ROLL_DIE | typeof EFFECT_TYPE_PLAY_CREATURE | typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP | typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP | typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI | typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER | typeof EFFECT_TYPE_PLAY_RELIC | typeof EFFECT_TYPE_PLAY_SPELL | typeof EFFECT_TYPE_MAGI_IS_DEFEATED | typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY | typeof EFFECT_TYPE_CREATURE_ENTERS_PLAY | typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE | typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY | typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY | typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE | typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI | typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE | typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI | typeof EFFECT_TYPE_ENERGIZE | typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT | typeof EFFECT_TYPE_DEFENDER_DAMAGE_DEALT | typeof EFFECT_TYPE_CONDITIONAL | typeof EFFECT_TYPE_START_OF_TURN | typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES | typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES | typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI | typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI | typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY | typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE | typeof EFFECT_TYPE_DEAL_DAMAGE | typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY | typeof EFFECT_TYPE_MOVE_ENERGY | typeof EFFECT_TYPE_CREATURE_ATTACKS | typeof EFFECT_TYPE_BEFORE_DAMAGE | typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND | typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE | typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES | typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER | typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI | typeof EFFECT_TYPE_MAGI_FLIPPED | typeof EFFECT_TYPE_EXECUTE_POWER_EFFECTS | typeof EFFECT_TYPE_START_STEP;
interface ActionEffect {
    type: typeof ACTION_EFFECT;
    generatedBy: string;
    player?: number;
    spell?: boolean;
    triggerSource?: CardInGame;
    triggeredId?: string[];
    replacedBy?: string[];
}
type PayingEnergyForPowerEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER;
    target: CardInGame;
    amount: string | number;
};
type BeforeDrawCardsInDrawStepType = ActionEffect & {
    effectType: typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP;
};
type DrawCardsInDrawStepType = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP;
    numberOfCards: number;
};
type NoneEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_NONE;
};
type DrawEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW;
    stepEffect?: boolean;
};
type DrawRestOfCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_REST_OF_CARDS;
    drawnCards: string;
};
export type MoveCardBetwenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES;
    target: string | CardInGame;
    bottom: boolean;
    attack?: boolean;
    sourceZone: ZoneType;
    destinationZone: ZoneType;
};
type AttackEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ATTACK;
    source: CardInGame | string;
    target: CardInGame | string;
    additionalAttackers: CardInGame[] | string;
};
type MoveCardsBetwenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES;
    target: string | CardInGame[];
    bottom: boolean;
    attack?: boolean;
    sourceZone: ZoneType;
    destinationZone: ZoneType;
};
type CardMovedBetweenZonesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES;
    sourceCard: CardInGame;
    sourceZone: ZoneType;
    attack?: boolean;
    destinationCard: CardInGame;
    destinationZone: ZoneType;
};
type StartTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_TURN;
    player: number;
};
type StartOfTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_OF_TURN;
    player: number;
    generatedBy: string;
};
type StartStepEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_START_STEP;
    player: number;
    step: number;
};
type EndOfTurnEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_END_OF_TURN;
    player: number;
};
type MagiFlippedEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MAGI_FLIPPED;
    target: string | CardInGame;
};
type DiscardEnergyFromCreatureOrMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI;
    target: CardInGame | CardInGame[];
    source?: CardInGame;
    spell?: boolean;
    relic?: boolean;
    power?: boolean;
    variable?: string;
    amount: number;
    attack: boolean;
};
type DiscardEnergyFromCreaturesEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES;
    target: string | CardInGame[];
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    amount: number;
};
export type DiscardEnergyFromCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    relic?: boolean;
    variable?: string;
    amount: number;
};
export type EnergyDiscardedFromCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    relic?: boolean;
    variable?: string;
    amount: number;
};
type DiscardEnergyFromMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    attack?: boolean;
    relic?: boolean;
    spell?: boolean;
    variable?: string;
    amount: number;
};
type EnergyDiscardedFromMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    attack?: boolean;
    relic?: boolean;
    spell?: boolean;
    variable?: string;
    amount: number;
};
export type RemoveEnergyFromCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
    target: CardInGame | CardInGame[];
    amount: number;
};
export type RemoveEnergyFromMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI;
    target: CardInGame | CardInGame[];
    amount: number;
};
type AddStartingEnergyToMagi = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI;
    target: string | CardInGame;
};
type FindStartingCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_FIND_STARTING_CARDS;
    cards: string;
};
type ReshuffleDiscardEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RESHUFFLE_DISCARD;
    player: number;
};
type ForbidAttackToCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE;
    target: string | CardInGame;
};
type DiscardReshuffledEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_RESHUFFLED;
    player: number;
    cards: string[];
};
type AddEnergyToCreatureOrMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI;
    target: string | CardInGame | CardInGame[];
    amount: number;
};
type AddEnergyToCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE;
    target: CardInGame | CardInGame[];
    source: CardInGame | undefined;
    power?: boolean;
    amount: number;
};
type AddEnergyToMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI;
    target: CardInGame | CardInGame[];
    amount: string | number;
};
type PayingEnergyForCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE;
    from: CardInGame | string;
    amount: number;
    player: number;
};
type PlayCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_CREATURE;
    card: CardInGame;
    player: number;
};
type CreatureEntersPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CREATURE_ENTERS_PLAY;
    target: string;
};
export type StartingEnergyOnCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE;
    target: string;
    amount: number;
};
type PayingEnergyForRelicEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC;
    from: CardInGame;
    amount: number;
};
type PlayRelicEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_RELIC;
    card: CardInGame;
};
type RelicEntersPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RELIC_ENTERS_PLAY;
    card: string;
};
type PlaySpellEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_SPELL;
    card: CardInGame;
};
type PayingEnergyForSpellEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL;
    from: CardInGame;
    amount: number | string;
};
export type ConditionalEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CONDITIONAL;
    conditions: ConditionType[];
    thenEffects: AnyEffectType[];
    elseEffects?: AnyEffectType[];
};
export type DelayedTriggerType = {
    name: string;
    find: FindType;
    effects: AnyEffectType[];
};
export type EnhancedDelayedTriggerType = DelayedTriggerType & {
    self: CardInGame;
    id: string;
};
type AddDelayedTriggerEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER;
    delayedTrigger: DelayedTriggerType;
};
type EnergizeEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ENERGIZE;
    target: string;
};
type RollDieEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ROLL_DIE;
    result?: number;
};
export type ExecutePowerEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_EXECUTE_POWER_EFFECTS;
    power: string | {
        cost: number | "X";
        name: string;
        effects: AnyEffectType[];
    };
    setUsage?: boolean;
    source: string | CardInGame;
};
export type DieRolledEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DIE_ROLLED;
    result: number;
};
type MoveEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MOVE_ENERGY;
    source: CardInGame | string;
    target: CardInGame | string;
    amount: string | number;
};
type DiscardCreatureOrRelicFromPlay = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC;
    target: CardInGame | string;
};
type DiscardCardsFromHandEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND;
    target: CardInGame | CardInGame[] | string;
};
type DiscardCardFromHandEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_CARD_FROM_HAND;
    target: CardInGame | string;
};
type ReturnCreatureDiscardingEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY;
    target: CardInGame | string;
};
type RestoreCreatureToStartingEnergy = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY;
    source?: CardInGame;
    power?: boolean;
    target: CardInGame | string;
};
type DefeatMagiEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DEFEAT_MAGI;
    target: CardInGame;
    player: number;
};
export type MagiIsDefeatedEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_MAGI_IS_DEFEATED;
    source: CardInGame | null;
    target: CardInGame;
    player: number;
};
export type CreateContinuousEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT;
    staticAbilities?: StaticAbilityType[];
    triggerEffects?: TriggerEffectType[];
    expiration: ExpirationObjectType;
};
type RearrangeEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
    energyOnCreatures: string | Record<string, number>;
};
type DistributeEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    energyOnCreatures: string | Record<string, number>;
};
type DistributeDamageEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
    source?: CardInGame;
    damageOnCreatures: string | Record<string, number>;
};
type DrawNCardsEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DRAW_N_CARDS;
    numberOfCards: number | string;
};
export type DiscardCreatureFromPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY;
    source: CardInGame;
    target: CardInGame | string;
    attack: boolean;
    player: number;
};
type DiscardRelicFromPlayEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY;
    target: CardInGame | string;
    player: number;
};
type ReturnCreatureReturningEnergyEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY;
    target: string | CardInGame;
};
type RearrangeCardsOfZoneEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE;
    zone: ZoneType | string;
    zoneOwner: number | string;
    numberOfCards: number | string;
    cards: string[] | string;
};
type PlayAttachedToCreatureEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE;
    target: CardInGame | string;
    attachmentTarget: CardInGame | string;
};
type AttachCardToCardEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_ATTACH_CARD_TO_CARD;
    target: CardInGame | string;
    attachmentTarget: CardInGame | string;
};
type CardAttachedToCardEffect = ActionEffect & {
    effectType: typeof EFFECT_TYPE_CARD_ATTACHED_TO_CARD;
    target: CardInGame | string;
    attachmentTarget: CardInGame | string;
};
export type EffectType = /* ActionEffect & {
    effectType: EffectTypeStillInUse;
    generatedBy?: string;
    source?: CardInGame;
    power?: boolean;
    target?: CardInGame;
} | */ MoveCardBetwenZonesEffect | MoveCardsBetwenZonesEffect | NoneEffect | AttackEffect | CardMovedBetweenZonesEffect | BeforeDrawCardsInDrawStepType | DrawCardsInDrawStepType | DrawNCardsEffect | DiscardEnergyFromCreatureOrMagiEffect | DiscardEnergyFromCreaturesEffect | DiscardEnergyFromCreatureEffect | EnergyDiscardedFromCreatureEffect | DiscardEnergyFromMagiEffect | EnergyDiscardedFromMagiEffect | RemoveEnergyFromCreatureEffect | RemoveEnergyFromMagiEffect | PayingEnergyForPowerEffect | RestoreCreatureToStartingEnergy | StartTurnEffect | StartOfTurnEffect | StartStepEffect | EndOfTurnEffect | DrawEffect | DrawRestOfCardsEffect | MagiFlippedEffect | AddStartingEnergyToMagi | FindStartingCardsEffect | ReshuffleDiscardEffect | AddEnergyToCreatureOrMagiEffect | AddEnergyToCreatureEffect | AddEnergyToMagiEffect | DiscardCreatureOrRelicFromPlay | PayingEnergyForCreatureEffect | PlayCreatureEffect | DiscardReshuffledEffect | DiscardCardsFromHandEffect | DiscardCardFromHandEffect | CreatureEntersPlayEffect | StartingEnergyOnCreatureEffect | PayingEnergyForRelicEffect | PlayRelicEffect | RelicEntersPlayEffect | PlaySpellEffect | PayingEnergyForSpellEffect | ConditionalEffect | AddDelayedTriggerEffect | EnergizeEffect | RollDieEffect | DieRolledEffect | MoveEnergyEffect | MagiIsDefeatedEffect | CreateContinuousEffect | DefeatMagiEffect | RearrangeEnergyEffect | DistributeEnergyEffect | ForbidAttackToCreatureEffect | DistributeDamageEffect | DiscardRelicFromPlayEffect | ReturnCreatureReturningEnergyEffect | ReturnCreatureDiscardingEnergyEffect | DiscardCreatureFromPlayEffect | RearrangeCardsOfZoneEffect | PlayAttachedToCreatureEffect | AttachCardToCardEffect | CardAttachedToCardEffect | ExecutePowerEffect;
export {};
