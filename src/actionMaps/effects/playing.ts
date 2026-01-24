import CardInGame from "../../classes/CardInGame";
import {
  ACTION_CALCULATE,
  ACTION_EFFECT,
  ACTION_GET_PROPERTY_VALUE,
  CALCULATION_SET,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ATTACH_CARD_TO_CARD,
  EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_PLAY_RELIC,
  EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
  PROPERTY_ID,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
} from "../../const";
import { ActionTransformer } from "../actionMapTypes";

export const applyPlayRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_RELIC> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    bottom: false,
    target: action.card,
    player: action.player,
    generatedBy: action.generatedBy,
  }, {
    type: ACTION_GET_PROPERTY_VALUE,
    property: PROPERTY_ID,
    target: '$new_card',
    variable: 'relic_created',
    generatedBy: action.generatedBy,
  });
}

export const applyPlayCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_CREATURE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    bottom: false,
    target: action.card,
    player: action.player,
    generatedBy: action.generatedBy,
  }, {
    type: ACTION_CALCULATE,
    operator: CALCULATION_SET,
    operandOne: '$new_card',
    variable: 'creature_created',
    generatedBy: action.generatedBy,
  });
}

export const applyStartingEnergyOnCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE> = function (action, transform) {
  const target = this.getMetaValue(action.target, action.generatedBy);
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    target,
    source: undefined,
    amount: this.getMetaValue(action.amount, action.generatedBy),
    generatedBy: action.generatedBy,
  });
}

export const applyPlayAttachedToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE> = function (action, transform) {
  const card: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    target: card,
    generatedBy: action.generatedBy,
    bottom: false,
  }, {
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACH_CARD_TO_CARD,
    target: '$new_card',	// We need to attach the new card in play, not the one in hand
    attachmentTarget,
    generatedBy: action.generatedBy,
  })
}

export const applyAttachCardToCardEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACH_CARD_TO_CARD> = function (action, transform) {
  const card = this.getMetaValue(action.target, action.generatedBy);
  const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);

  this.attachCard(card.id, attachmentTarget.id)

  this.transformIntoActions({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
    target: card,
    attachmentTarget: action.attachmentTarget,
    generatedBy: action.generatedBy,
  });
}
