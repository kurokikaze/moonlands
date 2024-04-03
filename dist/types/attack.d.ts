import { ACTION_ATTACK, ACTION_EFFECT, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_ATTACKER_DAMAGE_DEALT, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFENDER_DAMAGE_DEALT, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE } from "../const";
import CardInGame from "../classes/CardInGame";
interface AttackEffectAction {
    type: typeof ACTION_EFFECT;
    packHuntAttack?: boolean;
    generatedBy: string;
    replacedBy?: string[];
    player?: number;
}
type AttackType = {
    type: typeof ACTION_ATTACK;
    source: CardInGame | string;
    target: CardInGame | string;
    sourceAtStart: CardInGame;
    targetAtStart: CardInGame;
    additionalAttackers: CardInGame[];
    generatedBy?: string;
    replacedBy?: string[];
};
type CreatureAttacksEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_ATTACKS;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
};
export type BeforeDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_BEFORE_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
};
type DamageStepEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DAMAGE_STEP;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    packHuntAttack: boolean;
};
type AfterDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_AFTER_DAMAGE;
    source: CardInGame;
    target: CardInGame;
};
export type AttackerDealsDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_ATTACKER_DEALS_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
    amount: number;
};
export type AttackerDamageDealtEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_ATTACKER_DAMAGE_DEALT;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
    amount: number | string;
};
export type DefenderDealsDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    amount: number;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
};
export type DefenderDamageDealt = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DEFENDER_DAMAGE_DEALT;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    amount: number | string;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
};
type DealDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DEAL_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    amount: number;
    attack: boolean;
};
type CreatureDefeatsCreatureEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE;
    source: CardInGame;
    target: CardInGame;
    attack: boolean;
};
type CreatureIsDefeatedEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_IS_DEFEATED;
    target: CardInGame;
    attack: boolean;
};
export type AttackEffect = AttackType | CreatureAttacksEffect | BeforeDamageEffect | DamageStepEffect | AfterDamageEffect | AttackerDealsDamageEffect | AttackerDamageDealtEffect | DefenderDealsDamageEffect | DefenderDamageDealt | DealDamageEffect | CreatureDefeatsCreatureEffect | CreatureIsDefeatedEffect;
export {};
