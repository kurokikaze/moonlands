import { ACTION_ATTACK, ACTION_EFFECT, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE } from "../const";
import CardInGame from "../classes/CardInGame";
interface AttackEffectAction {
    type: typeof ACTION_EFFECT;
    packHuntAttack?: boolean;
    generatedBy: string;
    replacedBy?: string[];
    player?: number;
}
declare type AttackType = {
    type: typeof ACTION_ATTACK;
    source: CardInGame | string;
    target: CardInGame | string;
    sourceAtStart: CardInGame;
    targetAtStart: CardInGame;
    additionalAttackers: CardInGame[];
    generatedBy?: string;
    replacedBy?: string[];
};
declare type CreatureAttacksEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_ATTACKS;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
};
export declare type BeforeDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_BEFORE_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
};
declare type DamageStepEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DAMAGE_STEP;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    packHuntAttack: boolean;
};
declare type AfterDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_AFTER_DAMAGE;
    source: CardInGame;
    target: CardInGame;
};
export declare type AttackerDealsDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_ATTACKER_DEALS_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
    amount: number;
};
export declare type DefenderDealsDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    amount: number;
    targetAtStart: CardInGame;
    sourceBeforeDamage: CardInGame;
    targetBeforeDamage: CardInGame;
};
declare type DealDamageEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_DEAL_DAMAGE;
    source: CardInGame;
    sourceAtStart: CardInGame;
    target: CardInGame;
    targetAtStart: CardInGame;
    amount: number;
    attack: boolean;
};
declare type CreatureDefeatsCreatureEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE;
    source: CardInGame;
    target: CardInGame;
    attack: boolean;
};
declare type CreatureIsDefeatedEffect = AttackEffectAction & {
    effectType: typeof EFFECT_TYPE_CREATURE_IS_DEFEATED;
    target: CardInGame;
    attack: boolean;
};
export declare type AttackEffect = AttackType | CreatureAttacksEffect | BeforeDamageEffect | DamageStepEffect | AfterDamageEffect | AttackerDealsDamageEffect | DefenderDealsDamageEffect | DealDamageEffect | CreatureDefeatsCreatureEffect | CreatureIsDefeatedEffect;
export {};
