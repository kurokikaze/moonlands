import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
  EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  PROPERTY_CONTROLLER,
  TYPE_CREATURE,
  TYPE_MAGI,
} from "../../const";
import { ActionTransformer } from "../actionMapTypes";

export const applyPayingEnergyForRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
      target: payingTarget,
      amount: payingAmount,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

export const applyPayingEnergyForSpellEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
      target: payingTarget,
      amount: payingAmount,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

export const applyPayingEnergyForCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    if (payingTarget instanceof CardInGame) {
      if (this.modifyByStaticAbilities(payingTarget, PROPERTY_CONTROLLER) == action.player) {
        const correctEffectType = payingTarget.card.type === TYPE_MAGI ? EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI : EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
        transform({
          type: ACTION_EFFECT,
          effectType: correctEffectType,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
      } else {
        throw new Error('Trying to pay for the creature from non-controlled Orathan');
      }
    }
  }
}

export const applyPayingEnergyForPowerEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    switch (payingTarget.card.type) {
      case TYPE_CREATURE: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
        break;
      }
      case TYPE_MAGI: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
        break;
      }
    }
  }
}
