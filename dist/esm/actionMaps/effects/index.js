var _a;
import { EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_ATTACK, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFEAT_MAGI, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES, EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_DRAW, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_DRAW_N_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY, EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, } from "../../const.js";
// Turn and step effects
import { applyStartTurnEffect, applyStartOfTurnEffect, applyStartStepEffect, applyDrawCardsInDrawStep, applyFindStartingCardsEffect, applyDrawRestOfCardsEffect, applyMagiFlippedEffect, applyAddStartingEnergyToMagiEffect, applyAddDelayedTriggerEffect, } from "./turnAndStep.js";
// Discard effects
import { applyDiscardCardsEffect, applyDiscardCardEffect, applyReshuffleDiscardEffect, } from "./discard.js";
// Draw effects
import { applyDrawNCardsEffect, applyDrawEffect, } from "./draw.js";
// Attack effects
import { applyAttackEffect, applyBeforeDamageEffect, applyDamageStepEffect, applyAttackerDealsDamageEffect, applyDefenderDealsDamageEffect, applyDealDamageEffect, applyAfterDamageEffect, applyCreatureDefeatsCreatureEffect, } from "./attack.js";
// Energy effects
import { applyReturnCreatureDiscardingEnergyEffect, applyReturnCreatureReturningEnergyEffect, applyEnergizeEffect, applyMoveEnergyEffect, applyAddEnergyToCreatureOrMagiEffect, applyDiscardEnergyFromCreatureOrMagiEffect, applyDiscardEnergyFromMagiEffect, applyDiscardEnergyFromCreaturesEffect, applyDiscardEnergyFromCreatureEffect, applyRemoveEnergyFromCreatureEffect, applyRemoveEnergyFromMagiEffect, applyRestoreCreatureToStartingEnergyEffect, applyAddEnergyToCreatureEffect, applyAddEnergyToMagiEffect, applyRearrangeEnergyOnCreaturesEffect, applyDistributeEnergyOnCreaturesEffect, applyDistributeDamageEffect, } from "./energy.js";
// Playing effects
import { applyPlayRelicEffect, applyPlayCreatureEffect, applyStartingEnergyOnCreatureEffect, applyPlayAttachedToCreatureEffect, applyAttachCardToCardEffect, } from "./playing.js";
// Payment effects
import { applyPayingEnergyForRelicEffect, applyPayingEnergyForSpellEffect, applyPayingEnergyForCreatureEffect, applyPayingEnergyForPowerEffect, } from "./payment.js";
// Trigger effects
import { applyForbidAttackToCreatureEffect, applyConditionalEffect, applyCreateContinuousEffect, } from "./triggers.js";
// Zone effects
import { applyMoveCardsBetweenZonesEffect, applyMoveCardBetweenZonesEffect, applyDefeatMagiEffect, applyMagiIsDefeatedEffect, applyDiscardCreatureOrRelic, applyDiscardRelicFromPlayEffect, applyDiscardCreatureFromPlayEffect, applyRearrangeCardsOfZoneEffect, applyDistributeCardsInZonesEffect, } from "./zones.js";
// Randomization effects
import { applyRollDieEffect, applyDieRolledEffect, } from "./randomization.js";
// Power effects
import { applyExecutePowerEffects, } from "./powers.js";
// Prompt effects
import { applyPromptEnteredEffect, } from "./prompt.js";
// Re-export for backwards compatibility
export { applyDiscardEnergyFromCreatureOrMagiEffect } from "./energy.js";
export var actionMap = (_a = {},
    // Beginning of turn and step
    _a[EFFECT_TYPE_START_TURN] = applyStartTurnEffect,
    _a[EFFECT_TYPE_START_OF_TURN] = applyStartOfTurnEffect,
    _a[EFFECT_TYPE_START_STEP] = applyStartStepEffect,
    _a[EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP] = applyDrawCardsInDrawStep,
    _a[EFFECT_TYPE_FIND_STARTING_CARDS] = applyFindStartingCardsEffect,
    _a[EFFECT_TYPE_DRAW_REST_OF_CARDS] = applyDrawRestOfCardsEffect,
    _a[EFFECT_TYPE_MAGI_FLIPPED] = applyMagiFlippedEffect,
    _a[EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI] = applyAddStartingEnergyToMagiEffect,
    // Discarding
    _a[EFFECT_TYPE_DISCARD_CARDS_FROM_HAND] = applyDiscardCardsEffect,
    _a[EFFECT_TYPE_DISCARD_CARD_FROM_HAND] = applyDiscardCardEffect,
    _a[EFFECT_TYPE_RESHUFFLE_DISCARD] = applyReshuffleDiscardEffect,
    // Returning to hand
    _a[EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY] = applyReturnCreatureDiscardingEnergyEffect,
    _a[EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY] = applyReturnCreatureReturningEnergyEffect,
    // Drawing cards
    _a[EFFECT_TYPE_DRAW_N_CARDS] = applyDrawNCardsEffect,
    _a[EFFECT_TYPE_DRAW] = applyDrawEffect,
    // Attacking
    _a[EFFECT_TYPE_ATTACK] = applyAttackEffect,
    _a[EFFECT_TYPE_BEFORE_DAMAGE] = applyBeforeDamageEffect,
    _a[EFFECT_TYPE_DAMAGE_STEP] = applyDamageStepEffect,
    _a[EFFECT_TYPE_ATTACKER_DEALS_DAMAGE] = applyAttackerDealsDamageEffect,
    _a[EFFECT_TYPE_DEFENDER_DEALS_DAMAGE] = applyDefenderDealsDamageEffect,
    _a[EFFECT_TYPE_DEAL_DAMAGE] = applyDealDamageEffect,
    _a[EFFECT_TYPE_AFTER_DAMAGE] = applyAfterDamageEffect,
    _a[EFFECT_TYPE_CREATURE_DEFEATS_CREATURE] = applyCreatureDefeatsCreatureEffect,
    // Randomization
    _a[EFFECT_TYPE_ROLL_DIE] = applyRollDieEffect,
    _a[EFFECT_TYPE_DIE_ROLLED] = applyDieRolledEffect,
    // Powers
    _a[EFFECT_TYPE_EXECUTE_POWER_EFFECTS] = applyExecutePowerEffects,
    _a[EFFECT_TYPE_ENERGIZE] = applyEnergizeEffect,
    _a[EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES] = applyMoveCardsBetweenZonesEffect,
    _a[EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES] = applyMoveCardBetweenZonesEffect,
    _a[EFFECT_TYPE_DEFEAT_MAGI] = applyDefeatMagiEffect,
    _a[EFFECT_TYPE_MAGI_IS_DEFEATED] = applyMagiIsDefeatedEffect,
    _a[EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC] = applyDiscardCreatureOrRelic,
    _a[EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY] = applyDiscardRelicFromPlayEffect,
    _a[EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY] = applyDiscardCreatureFromPlayEffect,
    _a[EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE] = applyRearrangeCardsOfZoneEffect,
    _a[EFFECT_TYPE_ATTACH_CARD_TO_CARD] = applyAttachCardToCardEffect,
    _a[EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES] = applyDistributeCardsInZonesEffect,
    // Moving energy
    _a[EFFECT_TYPE_MOVE_ENERGY] = applyMoveEnergyEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI] = applyAddEnergyToCreatureOrMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI] = applyDiscardEnergyFromCreatureOrMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI] = applyDiscardEnergyFromMagiEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES] = applyDiscardEnergyFromCreaturesEffect,
    _a[EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE] = applyDiscardEnergyFromCreatureEffect,
    _a[EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE] = applyRemoveEnergyFromCreatureEffect,
    _a[EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI] = applyRemoveEnergyFromMagiEffect,
    _a[EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY] = applyRestoreCreatureToStartingEnergyEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_CREATURE] = applyAddEnergyToCreatureEffect,
    _a[EFFECT_TYPE_ADD_ENERGY_TO_MAGI] = applyAddEnergyToMagiEffect,
    _a[EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES] = applyRearrangeEnergyOnCreaturesEffect,
    _a[EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES] = applyDistributeEnergyOnCreaturesEffect,
    _a[EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES] = applyDistributeDamageEffect,
    // Playing stuff
    _a[EFFECT_TYPE_PLAY_RELIC] = applyPlayRelicEffect,
    _a[EFFECT_TYPE_PLAY_CREATURE] = applyPlayCreatureEffect,
    _a[EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE] = applyStartingEnergyOnCreatureEffect,
    _a[EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE] = applyPlayAttachedToCreatureEffect,
    // Paying for stuff
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC] = applyPayingEnergyForRelicEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL] = applyPayingEnergyForSpellEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE] = applyPayingEnergyForCreatureEffect,
    _a[EFFECT_TYPE_PAYING_ENERGY_FOR_POWER] = applyPayingEnergyForPowerEffect,
    // Delayed triggers, conditional and continuous effects
    _a[EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE] = applyForbidAttackToCreatureEffect,
    _a[EFFECT_TYPE_ADD_DELAYED_TRIGGER] = applyAddDelayedTriggerEffect,
    _a[EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT] = applyCreateContinuousEffect,
    _a[EFFECT_TYPE_CONDITIONAL] = applyConditionalEffect,
    // Prompt-related stuff
    _a[EFFECT_TYPE_PROMPT_ENTERED] = applyPromptEnteredEffect,
    _a);
//# sourceMappingURL=index.js.map