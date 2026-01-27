"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCreatureDefeatsCreatureEffect = exports.applyAfterDamageEffect = exports.applyDealDamageEffect = exports.applyDefenderDealsDamageEffect = exports.applyAttackerDealsDamageEffect = exports.applyDamageStepEffect = exports.applyBeforeDamageEffect = exports.applyAttackEffect = void 0;
const const_1 = require("../../const");
const applyAttackEffect = function (action, transform) {
    const source = this.getMetaValue(action.source, action.generatedBy);
    const target = this.getMetaValue(action.target, action.generatedBy);
    const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);
    let attackSequence = [
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            packHuntAttack: false,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
            source: source,
            target: target,
            generatedBy: source.id,
        },
    ];
    if (additionalAttackers) {
        const preparedEffects = additionalAttackers.map((card) => [
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
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
};
exports.applyAttackEffect = applyAttackEffect;
const applyBeforeDamageEffect = function (action, transform, _state) {
    action.source.markAttackDone();
    action.target.markAttackReceived();
};
exports.applyBeforeDamageEffect = applyBeforeDamageEffect;
const applyDamageStepEffect = function (action, transform) {
    // Here we finalize damage amount from both creatures' energy
    const attackSource = action.source;
    const attackTarget = action.target;
    const damageByAttacker = attackSource.data.energy;
    const damageByDefender = (attackTarget.card.type === const_1.TYPE_CREATURE) ?
        attackTarget.data.energy :
        0;
    const attackerDamageActions = [{
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
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
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
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
    const damageActions = (attackTarget.card.type === const_1.TYPE_CREATURE && !action.packHuntAttack) ? [
        ...attackerDamageActions, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
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
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
            source: attackTarget,
            sourceAtStart: action.targetAtStart,
            target: attackSource,
            amount: '$damageDealt',
            targetAtStart: action.sourceAtStart,
            sourceBeforeDamage: attackTarget.copy(),
            targetBeforeDamage: attackSource.copy(),
            generatedBy: attackSource.id,
        }
    ] : attackerDamageActions;
    transform(...damageActions);
};
exports.applyDamageStepEffect = applyDamageStepEffect;
const applyAttackerDealsDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
exports.applyAttackerDealsDamageEffect = applyAttackerDealsDamageEffect;
const applyDefenderDealsDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
exports.applyDefenderDealsDamageEffect = applyDefenderDealsDamageEffect;
const applyDealDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
        target: action.target,
        source: action.source,
        amount: action.amount,
        attack: true,
        variable: 'damageDealt',
        generatedBy: action.generatedBy,
    });
};
exports.applyDealDamageEffect = applyDealDamageEffect;
const applyAfterDamageEffect = function (action, transform) {
    if (action.source.data.energy === 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.target,
            target: action.source,
            attack: true,
            asAttacker: false,
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.source,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
    if (action.target.data.energy === 0 && action.target.card.type === const_1.TYPE_CREATURE) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.source,
            target: action.target,
            attack: true,
            asAttacker: true,
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.target,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyAfterDamageEffect = applyAfterDamageEffect;
const applyCreatureDefeatsCreatureEffect = function (action, transform) {
    if (action.target.data.energy === 0) {
        action.source.markDefeatedCreature();
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
            source: action.source,
            target: action.target,
            attack: true,
            player: action.player || 0,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyCreatureDefeatsCreatureEffect = applyCreatureDefeatsCreatureEffect;
//# sourceMappingURL=attack.js.map