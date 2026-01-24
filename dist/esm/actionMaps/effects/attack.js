var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ACTION_EFFECT, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_ATTACKER_DAMAGE_DEALT, EFFECT_TYPE_ATTACKER_DEALS_DAMAGE, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, EFFECT_TYPE_DAMAGE_STEP, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_DEFENDER_DAMAGE_DEALT, EFFECT_TYPE_DEFENDER_DEALS_DAMAGE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, TYPE_CREATURE, } from "../../const.js";
export var applyAttackEffect = function (action, transform) {
    var source = this.getMetaValue(action.source, action.generatedBy);
    var target = this.getMetaValue(action.target, action.generatedBy);
    var additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);
    var attackSequence = [
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
        var preparedEffects = additionalAttackers.map(function (card) { return [
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
        ]; }).flat();
        for (var _i = 0, preparedEffects_1 = preparedEffects; _i < preparedEffects_1.length; _i++) {
            var effect = preparedEffects_1[_i];
            attackSequence.push(effect);
        }
    }
    transform.apply(void 0, attackSequence);
};
export var applyBeforeDamageEffect = function (action) {
    action.source.markAttackDone();
    action.target.markAttackReceived();
};
export var applyDamageStepEffect = function (action, transform) {
    // Here we finalize damage amount from both creatures' energy
    var attackSource = action.source;
    var attackTarget = action.target;
    var damageByAttacker = attackSource.data.energy;
    var damageByDefender = (attackTarget.card.type === TYPE_CREATURE) ?
        attackTarget.data.energy :
        0;
    var attackerDamageActions = [{
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
        {
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
    var damageActions = (attackTarget.card.type === TYPE_CREATURE && !action.packHuntAttack) ? __spreadArray(__spreadArray([], attackerDamageActions, true), [
        {
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
        }
    ], false) : attackerDamageActions;
    transform.apply(void 0, damageActions);
};
export var applyAttackerDealsDamageEffect = function (action, transform) {
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
};
export var applyDefenderDealsDamageEffect = function (action, transform) {
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
};
export var applyDealDamageEffect = function (action, transform) {
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
};
export var applyAfterDamageEffect = function (action, transform) {
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
};
export var applyCreatureDefeatsCreatureEffect = function (action, transform) {
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
};
//# sourceMappingURL=attack.js.map