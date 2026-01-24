"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDistributeDamageEffect = exports.applyDistributeEnergyOnCreaturesEffect = exports.applyRearrangeEnergyOnCreaturesEffect = exports.applyAddEnergyToMagiEffect = exports.applyAddEnergyToCreatureEffect = exports.applyRestoreCreatureToStartingEnergyEffect = exports.applyRemoveEnergyFromMagiEffect = exports.applyRemoveEnergyFromCreatureEffect = exports.applyDiscardEnergyFromCreatureEffect = exports.applyDiscardEnergyFromCreaturesEffect = exports.applyDiscardEnergyFromMagiEffect = exports.applyDiscardEnergyFromCreatureOrMagiEffect = exports.applyAddEnergyToCreatureOrMagiEffect = exports.applyMoveEnergyEffect = exports.applyEnergizeEffect = exports.applyReturnCreatureReturningEnergyEffect = exports.applyReturnCreatureDiscardingEnergyEffect = void 0;
const const_1 = require("../../const");
const actionMapUtils_1 = require("../actionMapUtils");
const applyReturnCreatureDiscardingEnergyEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyReturnCreatureDiscardingEnergyEffect = applyReturnCreatureDiscardingEnergyEffect;
const applyReturnCreatureReturningEnergyEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        const ownersMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner)[0];
        transform({
            type: const_1.ACTION_GET_PROPERTY_VALUE,
            property: const_1.PROPERTY_ENERGY_COUNT,
            target: card,
            variable: 'creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: ownersMagi,
            amount: '$creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyReturnCreatureReturningEnergyEffect = applyReturnCreatureReturningEnergyEffect;
const applyEnergizeEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, (target) => {
        const amount = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGIZE);
        const type = target.card.type;
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: (type == const_1.TYPE_CREATURE) ? const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target,
            source: undefined,
            amount,
            generatedBy: action.generatedBy,
        });
    });
};
exports.applyEnergizeEffect = applyEnergizeEffect;
const applyMoveEnergyEffect = function (action, transform) {
    const moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
    const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
    const moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
    const amountToMove = this.getMetaValue(action.amount, action.generatedBy);
    if (moveSource.data.energy >= amountToMove) {
        moveSource.removeEnergy(amountToMove);
        moveTarget.addEnergy(amountToMove);
        if (moveSource.data.energy === 0) {
            switch (moveSource.card.type) {
                case const_1.TYPE_CREATURE: {
                    // Creature goes to discard
                    transform({
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                        bottom: false,
                        target: moveSource,
                        player: action.player,
                        generatedBy: action.generatedBy,
                    });
                    break;
                }
            }
        }
    }
};
exports.applyMoveEnergyEffect = applyMoveEnergyEffect;
const applyAddEnergyToCreatureOrMagiEffect = function (action, transform) {
    const addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(addMiltiTarget, (target) => {
        switch (target.card.type) {
            case const_1.TYPE_CREATURE:
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                    amount: action.amount,
                    target,
                    source: undefined,
                    generatedBy: action.generatedBy,
                });
                break;
            case const_1.TYPE_MAGI:
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                    amount: action.amount,
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
        }
    });
};
exports.applyAddEnergyToCreatureOrMagiEffect = applyAddEnergyToCreatureOrMagiEffect;
const applyDiscardEnergyFromCreatureOrMagiEffect = function (action, transform) {
    const discardMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    const source = action.source;
    if (!source) {
        return;
    }
    (0, actionMapUtils_1.oneOrSeveral)(discardMultiTarget, target => {
        switch (target.card.type) {
            case const_1.TYPE_CREATURE: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    source: action.source,
                    variable: action.variable || false,
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case const_1.TYPE_MAGI: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                    source,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    ...(action.variable ? { variable: action.variable } : {}),
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
        }
    });
};
exports.applyDiscardEnergyFromCreatureOrMagiEffect = applyDiscardEnergyFromCreatureOrMagiEffect;
const applyDiscardEnergyFromMagiEffect = function (action, transform) {
    (0, actionMapUtils_1.oneOrSeveral)(this.getMetaValue(action.target, action.generatedBy), target => {
        const energyToRemove = Math.min(this.getMetaValue(action.amount, action.generatedBy), target.data.energy);
        target.removeEnergy(energyToRemove);
        if (energyToRemove > 0) {
            transform({
                ...action,
                effectType: const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
                amount: energyToRemove,
            });
        }
    });
};
exports.applyDiscardEnergyFromMagiEffect = applyDiscardEnergyFromMagiEffect;
const applyDiscardEnergyFromCreaturesEffect = function (action, transform) {
    // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
    // No cards use this effect now, but some may later
    // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    (0, actionMapUtils_1.oneOrSeveral)(multiTarget, target => {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
            target,
            amount,
            power: action.power,
            spell: action.spell,
            source: action.source,
            attack: action.attack,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
exports.applyDiscardEnergyFromCreaturesEffect = applyDiscardEnergyFromCreaturesEffect;
const applyDiscardEnergyFromCreatureEffect = function (action, transform) {
    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var totalEnergyLost = 0;
    (0, actionMapUtils_1.oneOrSeveral)(multiTarget, target => {
        if (this.isCardAffectedByEffect(target, action)) {
            var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
            const energyLossThreshold = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGY_LOSS_THRESHOLD);
            const energyLostAlready = target.data.energyLostThisTurn;
            if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                const energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
            }
            const energyLost = Math.min(energyToLose, target.data.energy);
            target.removeEnergy(energyLost);
            totalEnergyLost += energyLost;
            if (target.data.energy == 0 && !action.attack) {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    source: action.source,
                    target,
                    attack: action.attack,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            // The events transformed later take precedence over the events transformed earlier
            // That's why we transform the energy discarded event here before potentially transforming a discard creature event
            if (energyToLose > 0) {
                transform({
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
                    amount: energyLost,
                });
            }
        }
    });
    if (action.variable) {
        this.setSpellMetaDataField(action.variable, totalEnergyLost, action.generatedBy);
    }
};
exports.applyDiscardEnergyFromCreatureEffect = applyDiscardEnergyFromCreatureEffect;
const applyRemoveEnergyFromCreatureEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === const_1.TYPE_CREATURE) {
        target.removeEnergy(energyToLose);
        if (target.data.energy === 0) {
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target,
                attack: false,
                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                destinationZone: const_1.ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            });
        }
    }
    else {
        console.error('Wrong card type');
    }
};
exports.applyRemoveEnergyFromCreatureEffect = applyRemoveEnergyFromCreatureEffect;
const applyRemoveEnergyFromMagiEffect = function (action) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === const_1.TYPE_MAGI) {
        target.removeEnergy(energyToLose);
    }
};
exports.applyRemoveEnergyFromMagiEffect = applyRemoveEnergyFromMagiEffect;
const applyRestoreCreatureToStartingEnergyEffect = function (action, transform) {
    const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
    const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
    if (restoreAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
            source: action.source || undefined,
            power: action.power || false,
            spell: action.spell || false,
            target: restoreTarget,
            amount: restoreAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyRestoreCreatureToStartingEnergyEffect = applyRestoreCreatureToStartingEnergyEffect;
const applyAddEnergyToCreatureEffect = function (action) {
    const addTargets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(addTargets, addTarget => {
        if (this.isCardAffectedByEffect(addTarget, action)) {
            addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10));
        }
    });
};
exports.applyAddEnergyToCreatureEffect = applyAddEnergyToCreatureEffect;
const applyAddEnergyToMagiEffect = function (action) {
    const magiTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
};
exports.applyAddEnergyToMagiEffect = applyAddEnergyToMagiEffect;
const applyRearrangeEnergyOnCreaturesEffect = function (action, transform) {
    const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    const ownCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, action.player || 0);
    const totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(card => card.data.energy).reduce((a, b) => a + b, 0) : 0;
    const newEnergyTotal = Object.values(energyArrangement).reduce((a, b) => a + b, 0);
    // Energy stasis check
    const valid = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.every(card => {
        if (!card.card.data.energyStasis)
            return true;
        if (card.id in energyArrangement) {
            const newEnergy = energyArrangement[card.id];
            return newEnergy === card.data.energy;
        }
        return true;
    });
    if (valid) {
        if (newEnergyTotal === totalEnergyOnCreatures) {
            this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
                if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement) {
                    const newEnergy = energyArrangement[card.id];
                    card.setEnergy(newEnergy);
                    if (card.data.energy === 0) {
                        transform({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: card,
                            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                            destinationZone: const_1.ZONE_TYPE_DISCARD,
                            bottom: false,
                            attack: false,
                            generatedBy: action.generatedBy,
                        });
                    }
                }
            });
        }
        else if (this.debug) {
            console.error(`Cannot rearrange energy because new total ${newEnergyTotal} is not equal to old total ${totalEnergyOnCreatures}`);
        }
    }
    else if (this.debug) {
        console.error('One or more creatures with Energy Stasis is to be affected with energy rearrangement');
    }
};
exports.applyRearrangeEnergyOnCreaturesEffect = applyRearrangeEnergyOnCreaturesEffect;
const applyDistributeEnergyOnCreaturesEffect = function (action) {
    const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
        if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement) {
            const energyAmount = energyArrangement[card.id];
            card.addEnergy(energyAmount);
        }
    });
};
exports.applyDistributeEnergyOnCreaturesEffect = applyDistributeEnergyOnCreaturesEffect;
const applyDistributeDamageEffect = function (action, transform) {
    const damageArrangement = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
        if (card.card.type === const_1.TYPE_CREATURE && card.id in damageArrangement) {
            const damageAmount = damageArrangement[card.id];
            const source = action.source;
            if (damageAmount > 0 && source) {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    source,
                    target: card,
                    amount: damageAmount,
                    generatedBy: action.generatedBy,
                    player: action.player,
                });
            }
        }
    });
};
exports.applyDistributeDamageEffect = applyDistributeDamageEffect;
//# sourceMappingURL=energy.js.map