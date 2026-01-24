import {
  EFFECT_TYPE_ADD_DELAYED_TRIGGER,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
  EFFECT_TYPE_AFTER_DAMAGE,
  EFFECT_TYPE_ATTACH_CARD_TO_CARD,
  EFFECT_TYPE_ATTACK,
  EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
  EFFECT_TYPE_BEFORE_DAMAGE,
  EFFECT_TYPE_CONDITIONAL,
  EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
  EFFECT_TYPE_DAMAGE_STEP,
  EFFECT_TYPE_DEAL_DAMAGE,
  EFFECT_TYPE_DEFEAT_MAGI,
  EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
  EFFECT_TYPE_DIE_ROLLED,
  EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
  EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
  EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES,
  EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
  EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
  EFFECT_TYPE_DRAW_N_CARDS,
  EFFECT_TYPE_DRAW_REST_OF_CARDS,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
  EFFECT_TYPE_FIND_STARTING_CARDS,
  EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  EFFECT_TYPE_MAGI_FLIPPED,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
  EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
  EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_PLAY_RELIC,
  EFFECT_TYPE_PROMPT_ENTERED,
  EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
  EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
  EFFECT_TYPE_ROLL_DIE,
  EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_START_STEP,
  EFFECT_TYPE_START_TURN,
} from "../../const";
import { ActionHandlerMap } from "../actionMapTypes";

// Turn and step effects
import {
  applyStartTurnEffect,
  applyStartOfTurnEffect,
  applyStartStepEffect,
  applyDrawCardsInDrawStep,
  applyFindStartingCardsEffect,
  applyDrawRestOfCardsEffect,
  applyMagiFlippedEffect,
  applyAddStartingEnergyToMagiEffect,
  applyAddDelayedTriggerEffect,
} from "./turnAndStep";

// Discard effects
import {
  applyDiscardCardsEffect,
  applyDiscardCardEffect,
  applyReshuffleDiscardEffect,
} from "./discard";

// Draw effects
import {
  applyDrawNCardsEffect,
  applyDrawEffect,
} from "./draw";

// Attack effects
import {
  applyAttackEffect,
  applyBeforeDamageEffect,
  applyDamageStepEffect,
  applyAttackerDealsDamageEffect,
  applyDefenderDealsDamageEffect,
  applyDealDamageEffect,
  applyAfterDamageEffect,
  applyCreatureDefeatsCreatureEffect,
} from "./attack";

// Energy effects
import {
  applyReturnCreatureDiscardingEnergyEffect,
  applyReturnCreatureReturningEnergyEffect,
  applyEnergizeEffect,
  applyMoveEnergyEffect,
  applyAddEnergyToCreatureOrMagiEffect,
  applyDiscardEnergyFromCreatureOrMagiEffect,
  applyDiscardEnergyFromMagiEffect,
  applyDiscardEnergyFromCreaturesEffect,
  applyDiscardEnergyFromCreatureEffect,
  applyRemoveEnergyFromCreatureEffect,
  applyRemoveEnergyFromMagiEffect,
  applyRestoreCreatureToStartingEnergyEffect,
  applyAddEnergyToCreatureEffect,
  applyAddEnergyToMagiEffect,
  applyRearrangeEnergyOnCreaturesEffect,
  applyDistributeEnergyOnCreaturesEffect,
  applyDistributeDamageEffect,
} from "./energy";

// Playing effects
import {
  applyPlayRelicEffect,
  applyPlayCreatureEffect,
  applyStartingEnergyOnCreatureEffect,
  applyPlayAttachedToCreatureEffect,
  applyAttachCardToCardEffect,
} from "./playing";

// Payment effects
import {
  applyPayingEnergyForRelicEffect,
  applyPayingEnergyForSpellEffect,
  applyPayingEnergyForCreatureEffect,
  applyPayingEnergyForPowerEffect,
} from "./payment";

// Trigger effects
import {
  applyForbidAttackToCreatureEffect,
  applyConditionalEffect,
  applyCreateContinuousEffect,
} from "./triggers";

// Zone effects
import {
  applyMoveCardsBetweenZonesEffect,
  applyMoveCardBetweenZonesEffect,
  applyDefeatMagiEffect,
  applyMagiIsDefeatedEffect,
  applyDiscardCreatureOrRelic,
  applyDiscardRelicFromPlayEffect,
  applyDiscardCreatureFromPlayEffect,
  applyRearrangeCardsOfZoneEffect,
  applyDistributeCardsInZonesEffect,
} from "./zones";

// Randomization effects
import {
  applyRollDieEffect,
  applyDieRolledEffect,
} from "./randomization";

// Power effects
import {
  applyExecutePowerEffects,
} from "./powers";

// Prompt effects
import {
  applyPromptEnteredEffect,
} from "./prompt";

// Re-export for backwards compatibility
export { applyDiscardEnergyFromCreatureOrMagiEffect } from "./energy";

export const actionMap: Partial<ActionHandlerMap> = {
  // Beginning of turn and step
  [EFFECT_TYPE_START_TURN]: applyStartTurnEffect,
  [EFFECT_TYPE_START_OF_TURN]: applyStartOfTurnEffect,
  [EFFECT_TYPE_START_STEP]: applyStartStepEffect,
  [EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP]: applyDrawCardsInDrawStep,
  [EFFECT_TYPE_FIND_STARTING_CARDS]: applyFindStartingCardsEffect,
  [EFFECT_TYPE_DRAW_REST_OF_CARDS]: applyDrawRestOfCardsEffect,
  [EFFECT_TYPE_MAGI_FLIPPED]: applyMagiFlippedEffect,
  [EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI]: applyAddStartingEnergyToMagiEffect,

  // Discarding
  [EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]: applyDiscardCardsEffect,
  [EFFECT_TYPE_DISCARD_CARD_FROM_HAND]: applyDiscardCardEffect,
  [EFFECT_TYPE_RESHUFFLE_DISCARD]: applyReshuffleDiscardEffect,

  // Returning to hand
  [EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY]: applyReturnCreatureDiscardingEnergyEffect,
  [EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY]: applyReturnCreatureReturningEnergyEffect,

  // Drawing cards
  [EFFECT_TYPE_DRAW_N_CARDS]: applyDrawNCardsEffect,
  [EFFECT_TYPE_DRAW]: applyDrawEffect,

  // Attacking
  [EFFECT_TYPE_ATTACK]: applyAttackEffect,
  [EFFECT_TYPE_BEFORE_DAMAGE]: applyBeforeDamageEffect,
  [EFFECT_TYPE_DAMAGE_STEP]: applyDamageStepEffect,
  [EFFECT_TYPE_ATTACKER_DEALS_DAMAGE]: applyAttackerDealsDamageEffect,
  [EFFECT_TYPE_DEFENDER_DEALS_DAMAGE]: applyDefenderDealsDamageEffect,
  [EFFECT_TYPE_DEAL_DAMAGE]: applyDealDamageEffect,
  [EFFECT_TYPE_AFTER_DAMAGE]: applyAfterDamageEffect,
  [EFFECT_TYPE_CREATURE_DEFEATS_CREATURE]: applyCreatureDefeatsCreatureEffect,

  // Randomization
  [EFFECT_TYPE_ROLL_DIE]: applyRollDieEffect,
  [EFFECT_TYPE_DIE_ROLLED]: applyDieRolledEffect,

  // Powers
  [EFFECT_TYPE_EXECUTE_POWER_EFFECTS]: applyExecutePowerEffects,

  [EFFECT_TYPE_ENERGIZE]: applyEnergizeEffect,
  [EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES]: applyMoveCardsBetweenZonesEffect,
  [EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES]: applyMoveCardBetweenZonesEffect,
  [EFFECT_TYPE_DEFEAT_MAGI]: applyDefeatMagiEffect,
  [EFFECT_TYPE_MAGI_IS_DEFEATED]: applyMagiIsDefeatedEffect,
  [EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC]: applyDiscardCreatureOrRelic,
  [EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY]: applyDiscardRelicFromPlayEffect,
  [EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]: applyDiscardCreatureFromPlayEffect,
  [EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE]: applyRearrangeCardsOfZoneEffect,
  [EFFECT_TYPE_ATTACH_CARD_TO_CARD]: applyAttachCardToCardEffect,
  [EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES]: applyDistributeCardsInZonesEffect,

  // Moving energy
  [EFFECT_TYPE_MOVE_ENERGY]: applyMoveEnergyEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI]: applyAddEnergyToCreatureOrMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI]: applyDiscardEnergyFromCreatureOrMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI]: applyDiscardEnergyFromMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES]: applyDiscardEnergyFromCreaturesEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE]: applyDiscardEnergyFromCreatureEffect,
  [EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE]: applyRemoveEnergyFromCreatureEffect,
  [EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI]: applyRemoveEnergyFromMagiEffect,
  [EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY]: applyRestoreCreatureToStartingEnergyEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_CREATURE]: applyAddEnergyToCreatureEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_MAGI]: applyAddEnergyToMagiEffect,
  [EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: applyRearrangeEnergyOnCreaturesEffect,
  [EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: applyDistributeEnergyOnCreaturesEffect,
  [EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: applyDistributeDamageEffect,

  // Playing stuff
  [EFFECT_TYPE_PLAY_RELIC]: applyPlayRelicEffect,
  [EFFECT_TYPE_PLAY_CREATURE]: applyPlayCreatureEffect,
  [EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE]: applyStartingEnergyOnCreatureEffect,
  [EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE]: applyPlayAttachedToCreatureEffect,

  // Paying for stuff
  [EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC]: applyPayingEnergyForRelicEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL]: applyPayingEnergyForSpellEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE]: applyPayingEnergyForCreatureEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_POWER]: applyPayingEnergyForPowerEffect,

  // Delayed triggers, conditional and continuous effects
  [EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE]: applyForbidAttackToCreatureEffect,
  [EFFECT_TYPE_ADD_DELAYED_TRIGGER]: applyAddDelayedTriggerEffect,
  [EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT]: applyCreateContinuousEffect,
  [EFFECT_TYPE_CONDITIONAL]: applyConditionalEffect,

  // Prompt-related stuff
  [EFFECT_TYPE_PROMPT_ENTERED]: applyPromptEnteredEffect,
}
