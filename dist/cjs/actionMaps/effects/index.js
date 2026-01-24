"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionMap = exports.applyDiscardEnergyFromCreatureOrMagiEffect = void 0;
const const_1 = require("../../const");
// Turn and step effects
const turnAndStep_1 = require("./turnAndStep");
// Discard effects
const discard_1 = require("./discard");
// Draw effects
const draw_1 = require("./draw");
// Attack effects
const attack_1 = require("./attack");
// Energy effects
const energy_1 = require("./energy");
// Playing effects
const playing_1 = require("./playing");
// Payment effects
const payment_1 = require("./payment");
// Trigger effects
const triggers_1 = require("./triggers");
// Zone effects
const zones_1 = require("./zones");
// Randomization effects
const randomization_1 = require("./randomization");
// Power effects
const powers_1 = require("./powers");
// Prompt effects
const prompt_1 = require("./prompt");
// Re-export for backwards compatibility
var energy_2 = require("./energy");
Object.defineProperty(exports, "applyDiscardEnergyFromCreatureOrMagiEffect", { enumerable: true, get: function () { return energy_2.applyDiscardEnergyFromCreatureOrMagiEffect; } });
exports.actionMap = {
    // Beginning of turn and step
    [const_1.EFFECT_TYPE_START_TURN]: turnAndStep_1.applyStartTurnEffect,
    [const_1.EFFECT_TYPE_START_OF_TURN]: turnAndStep_1.applyStartOfTurnEffect,
    [const_1.EFFECT_TYPE_START_STEP]: turnAndStep_1.applyStartStepEffect,
    [const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP]: turnAndStep_1.applyDrawCardsInDrawStep,
    [const_1.EFFECT_TYPE_FIND_STARTING_CARDS]: turnAndStep_1.applyFindStartingCardsEffect,
    [const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS]: turnAndStep_1.applyDrawRestOfCardsEffect,
    [const_1.EFFECT_TYPE_MAGI_FLIPPED]: turnAndStep_1.applyMagiFlippedEffect,
    [const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI]: turnAndStep_1.applyAddStartingEnergyToMagiEffect,
    // Discarding
    [const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]: discard_1.applyDiscardCardsEffect,
    [const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND]: discard_1.applyDiscardCardEffect,
    [const_1.EFFECT_TYPE_RESHUFFLE_DISCARD]: discard_1.applyReshuffleDiscardEffect,
    // Returning to hand
    [const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY]: energy_1.applyReturnCreatureDiscardingEnergyEffect,
    [const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY]: energy_1.applyReturnCreatureReturningEnergyEffect,
    // Drawing cards
    [const_1.EFFECT_TYPE_DRAW_N_CARDS]: draw_1.applyDrawNCardsEffect,
    [const_1.EFFECT_TYPE_DRAW]: draw_1.applyDrawEffect,
    // Attacking
    [const_1.EFFECT_TYPE_ATTACK]: attack_1.applyAttackEffect,
    [const_1.EFFECT_TYPE_BEFORE_DAMAGE]: attack_1.applyBeforeDamageEffect,
    [const_1.EFFECT_TYPE_DAMAGE_STEP]: attack_1.applyDamageStepEffect,
    [const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE]: attack_1.applyAttackerDealsDamageEffect,
    [const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE]: attack_1.applyDefenderDealsDamageEffect,
    [const_1.EFFECT_TYPE_DEAL_DAMAGE]: attack_1.applyDealDamageEffect,
    [const_1.EFFECT_TYPE_AFTER_DAMAGE]: attack_1.applyAfterDamageEffect,
    [const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE]: attack_1.applyCreatureDefeatsCreatureEffect,
    // Randomization
    [const_1.EFFECT_TYPE_ROLL_DIE]: randomization_1.applyRollDieEffect,
    [const_1.EFFECT_TYPE_DIE_ROLLED]: randomization_1.applyDieRolledEffect,
    // Powers
    [const_1.EFFECT_TYPE_EXECUTE_POWER_EFFECTS]: powers_1.applyExecutePowerEffects,
    [const_1.EFFECT_TYPE_ENERGIZE]: energy_1.applyEnergizeEffect,
    [const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES]: zones_1.applyMoveCardsBetweenZonesEffect,
    [const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES]: zones_1.applyMoveCardBetweenZonesEffect,
    [const_1.EFFECT_TYPE_DEFEAT_MAGI]: zones_1.applyDefeatMagiEffect,
    [const_1.EFFECT_TYPE_MAGI_IS_DEFEATED]: zones_1.applyMagiIsDefeatedEffect,
    [const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC]: zones_1.applyDiscardCreatureOrRelic,
    [const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY]: zones_1.applyDiscardRelicFromPlayEffect,
    [const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]: zones_1.applyDiscardCreatureFromPlayEffect,
    [const_1.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE]: zones_1.applyRearrangeCardsOfZoneEffect,
    [const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD]: playing_1.applyAttachCardToCardEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES]: zones_1.applyDistributeCardsInZonesEffect,
    // Moving energy
    [const_1.EFFECT_TYPE_MOVE_ENERGY]: energy_1.applyMoveEnergyEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI]: energy_1.applyAddEnergyToCreatureOrMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI]: energy_1.applyDiscardEnergyFromCreatureOrMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI]: energy_1.applyDiscardEnergyFromMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES]: energy_1.applyDiscardEnergyFromCreaturesEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE]: energy_1.applyDiscardEnergyFromCreatureEffect,
    [const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE]: energy_1.applyRemoveEnergyFromCreatureEffect,
    [const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI]: energy_1.applyRemoveEnergyFromMagiEffect,
    [const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY]: energy_1.applyRestoreCreatureToStartingEnergyEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE]: energy_1.applyAddEnergyToCreatureEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI]: energy_1.applyAddEnergyToMagiEffect,
    [const_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: energy_1.applyRearrangeEnergyOnCreaturesEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: energy_1.applyDistributeEnergyOnCreaturesEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: energy_1.applyDistributeDamageEffect,
    // Playing stuff
    [const_1.EFFECT_TYPE_PLAY_RELIC]: playing_1.applyPlayRelicEffect,
    [const_1.EFFECT_TYPE_PLAY_CREATURE]: playing_1.applyPlayCreatureEffect,
    [const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE]: playing_1.applyStartingEnergyOnCreatureEffect,
    [const_1.EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE]: playing_1.applyPlayAttachedToCreatureEffect,
    // Paying for stuff
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC]: payment_1.applyPayingEnergyForRelicEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL]: payment_1.applyPayingEnergyForSpellEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE]: payment_1.applyPayingEnergyForCreatureEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER]: payment_1.applyPayingEnergyForPowerEffect,
    // Delayed triggers, conditional and continuous effects
    [const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE]: triggers_1.applyForbidAttackToCreatureEffect,
    [const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER]: turnAndStep_1.applyAddDelayedTriggerEffect,
    [const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT]: triggers_1.applyCreateContinuousEffect,
    [const_1.EFFECT_TYPE_CONDITIONAL]: triggers_1.applyConditionalEffect,
    // Prompt-related stuff
    [const_1.EFFECT_TYPE_PROMPT_ENTERED]: prompt_1.applyPromptEnteredEffect,
};
//# sourceMappingURL=index.js.map