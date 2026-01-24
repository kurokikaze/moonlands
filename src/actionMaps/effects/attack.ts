import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  EFFECT_TYPE_AFTER_DAMAGE,
  EFFECT_TYPE_ATTACK,
  EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
  EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
  EFFECT_TYPE_BEFORE_DAMAGE,
  EFFECT_TYPE_CREATURE_ATTACKS,
  EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
  EFFECT_TYPE_CREATURE_IS_DEFEATED,
  EFFECT_TYPE_DAMAGE_STEP,
  EFFECT_TYPE_DEAL_DAMAGE,
  EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
  EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  TYPE_CREATURE,
} from "../../const";
import { AnyEffectType } from "../../types";
import { ActionTransformer } from "../actionMapTypes";
import { AttackerDamageDealtEffect, AttackerDealsDamageEffect, BeforeDamageEffect } from "../../types/attack";

export const applyAttackEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACK> = function (action, transform) {
  const source = this.getMetaValue(action.source, action.generatedBy);
  const target = this.getMetaValue(action.target, action.generatedBy);
  const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);

  let attackSequence: AnyEffectType[] = [
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_ATTACKS,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_BEFORE_DAMAGE,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DAMAGE_STEP,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      packHuntAttack: false,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_AFTER_DAMAGE,
      source: source,
      target: target,
      generatedBy: source.id,
    },
  ];

  if (additionalAttackers) {
    const preparedEffects: AnyEffectType[] = additionalAttackers.map((card: CardInGame): AnyEffectType[] => [
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_CREATURE_ATTACKS,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_BEFORE_DAMAGE,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DAMAGE_STEP,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_AFTER_DAMAGE,
        source: card,
        packHuntAttack: true,
        target: target,
        generatedBy: source.id,
      },
    ]).flat();

    for (let effect of preparedEffects) {
      attackSequence.push(effect);
    }
  }

  transform(...attackSequence);
}

export const applyBeforeDamageEffect: ActionTransformer<typeof EFFECT_TYPE_BEFORE_DAMAGE> = function (action: BeforeDamageEffect) {
  action.source.markAttackDone();
  action.target.markAttackReceived();
}

export const applyDamageStepEffect: ActionTransformer<typeof EFFECT_TYPE_DAMAGE_STEP> = function (action, transform) {
  // Here we finalize damage amount from both creatures' energy
  const attackSource = action.source;
  const attackTarget = action.target;

  const damageByAttacker = attackSource.data.energy;
  const damageByDefender = (attackTarget.card.type === TYPE_CREATURE) ?
    attackTarget.data.energy :
    0
    ;

  const attackerDamageActions: [AttackerDealsDamageEffect, AttackerDamageDealtEffect] = [{	// from source to target
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
    source: attackSource,
    sourceAtStart: action.sourceAtStart,
    target: attackTarget,
    targetAtStart: action.targetAtStart,
    sourceBeforeDamage: attackSource.copy(),
    targetBeforeDamage: attackTarget.copy(),
    amount: damageByAttacker,
    generatedBy: attackSource.id,
  },
  {	// from source to target
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
    source: attackSource,
    sourceAtStart: action.sourceAtStart,
    target: attackTarget,
    targetAtStart: action.targetAtStart,
    sourceBeforeDamage: attackSource.copy(),
    targetBeforeDamage: attackTarget.copy(),
    amount: '$damageDealt',
    generatedBy: attackSource.id,
  }
  ];

  const damageActions: AnyEffectType[] = (attackTarget.card.type === TYPE_CREATURE && !action.packHuntAttack) ? [
    ...attackerDamageActions, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
      source: attackTarget,
      sourceAtStart: action.targetAtStart,
      target: attackSource,
      amount: damageByDefender,
      targetAtStart: action.sourceAtStart,
      sourceBeforeDamage: attackTarget.copy(),
      targetBeforeDamage: attackSource.copy(),
      generatedBy: attackSource.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
      source: attackTarget,
      sourceAtStart: action.targetAtStart,
      target: attackSource,
      amount: '$damageDealt',
      targetAtStart: action.sourceAtStart,
      sourceBeforeDamage: attackTarget.copy(),
      targetBeforeDamage: attackSource.copy(),
      generatedBy: attackSource.id,
    }] : attackerDamageActions;

  transform(...damageActions);
}

export const applyAttackerDealsDamageEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACKER_DEALS_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DEAL_DAMAGE,
    source: action.source,
    sourceAtStart: action.sourceAtStart,
    target: action.target,
    targetAtStart: action.targetAtStart,
    amount: action.amount,
    attack: true,
    generatedBy: action.generatedBy,
  });
}

export const applyDefenderDealsDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DEAL_DAMAGE,
    source: action.source,
    sourceAtStart: action.sourceAtStart,
    target: action.target,
    targetAtStart: action.targetAtStart,
    amount: action.amount,
    attack: true,
    generatedBy: action.generatedBy,
  });
}

export const applyDealDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DEAL_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
    target: action.target,
    source: action.source,
    amount: action.amount,
    attack: true,
    variable: 'damageDealt',
    generatedBy: action.generatedBy,
  });
}

export const applyAfterDamageEffect: ActionTransformer<typeof EFFECT_TYPE_AFTER_DAMAGE> = function (action, transform) {
  if (action.source.data.energy === 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
      source: action.target,
      target: action.source,
      attack: true,
      asAttacker: false,
      generatedBy: action.generatedBy,
    }, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
      target: action.source,
      attack: true,
      generatedBy: action.generatedBy,
    });
  }
  if (action.target.data.energy === 0 && action.target.card.type === TYPE_CREATURE) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
      source: action.source,
      target: action.target,
      attack: true,
      asAttacker: true,
      generatedBy: action.generatedBy,
    }, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
      target: action.target,
      attack: true,
      generatedBy: action.generatedBy,
    });
  }
}

export const applyCreatureDefeatsCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE> = function (action, transform) {
  if (action.target.data.energy === 0) {
    action.source.markDefeatedCreature();
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
      source: action.source,
      target: action.target,
      attack: true,
      player: action.player || 0,
      generatedBy: action.generatedBy,
    });
  }
}
