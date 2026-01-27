var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { ACTION_EFFECT, ACTION_GET_PROPERTY_VALUE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, PROPERTY_ENERGIZE, PROPERTY_ENERGY_COUNT, PROPERTY_ENERGY_LOSS_THRESHOLD, SELECTOR_OWN_CREATURES, SELECTOR_OWN_MAGI, TYPE_CREATURE, TYPE_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, } from "../../const.js";
import { oneOrSeveral } from "../actionMapUtils.js";
export var applyReturnCreatureDiscardingEnergyEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
export var applyReturnCreatureReturningEnergyEffect = function (action, transform) {
    var card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        var ownersMagi = this.useSelector(SELECTOR_OWN_MAGI, card.owner)[0];
        transform({
            type: ACTION_GET_PROPERTY_VALUE,
            property: PROPERTY_ENERGY_COUNT,
            target: card,
            variable: 'creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: ownersMagi,
            amount: '$creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
export var applyEnergizeEffect = function (action, transform) {
    var _this = this;
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) {
        var amount = _this.modifyByStaticAbilities(target, PROPERTY_ENERGIZE);
        var type = target.card.type;
        transform({
            type: ACTION_EFFECT,
            effectType: (type == TYPE_CREATURE) ? EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: target,
            source: undefined,
            amount: amount,
            generatedBy: action.generatedBy,
        });
    });
};
export var applyMoveEnergyEffect = function (action, transform, _state) {
    var moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
    var moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
    var moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    var moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
    var amountToMove = this.getMetaValue(action.amount, action.generatedBy);
    if (moveSource.data.energy >= amountToMove) {
        moveSource.removeEnergy(amountToMove);
        moveTarget.addEnergy(amountToMove);
        if (moveSource.data.energy === 0) {
            switch (moveSource.card.type) {
                case TYPE_CREATURE: {
                    // Creature goes to discard
                    transform({
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: ZONE_TYPE_IN_PLAY,
                        destinationZone: ZONE_TYPE_DISCARD,
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
export var applyAddEnergyToCreatureOrMagiEffect = function (action, transform) {
    var addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(addMiltiTarget, function (target) {
        switch (target.card.type) {
            case TYPE_CREATURE:
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                    amount: action.amount,
                    target: target,
                    source: undefined,
                    generatedBy: action.generatedBy,
                });
                break;
            case TYPE_MAGI:
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                    amount: action.amount,
                    target: target,
                    generatedBy: action.generatedBy,
                });
                break;
        }
    });
};
export var applyDiscardEnergyFromCreatureOrMagiEffect = function (action, transform) {
    var discardMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    var source = action.source;
    if (!source) {
        return;
    }
    oneOrSeveral(discardMultiTarget, function (target) {
        switch (target.card.type) {
            case TYPE_CREATURE: {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    source: action.source,
                    variable: action.variable || false,
                    target: target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case TYPE_MAGI: {
                transform(__assign(__assign({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, source: source, amount: action.amount, attack: action.attack || false, spell: action.spell || false, relic: action.relic || false }, (action.variable ? { variable: action.variable } : {})), { target: target, generatedBy: action.generatedBy }));
                break;
            }
        }
    });
};
export var applyDiscardEnergyFromMagiEffect = function (action, transform) {
    var _this = this;
    oneOrSeveral(this.getMetaValue(action.target, action.generatedBy), function (target) {
        var energyToRemove = Math.min(_this.getMetaValue(action.amount, action.generatedBy), target.data.energy);
        target.removeEnergy(energyToRemove);
        if (energyToRemove > 0) {
            transform(__assign(__assign({}, action), { effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI, amount: energyToRemove }));
        }
    });
};
export var applyDiscardEnergyFromCreaturesEffect = function (action, transform) {
    // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
    // No cards use this effect now, but some may later
    // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
    var multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    oneOrSeveral(multiTarget, function (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
            target: target,
            amount: amount,
            power: action.power,
            spell: action.spell,
            source: action.source,
            attack: action.attack,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
export var applyDiscardEnergyFromCreatureEffect = function (action, transform) {
    var _this = this;
    var multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var totalEnergyLost = 0;
    oneOrSeveral(multiTarget, function (target) {
        if (_this.isCardAffectedByEffect(target, action)) {
            var energyToLose = parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10);
            var energyLossThreshold = _this.modifyByStaticAbilities(target, PROPERTY_ENERGY_LOSS_THRESHOLD);
            var energyLostAlready = target.data.energyLostThisTurn;
            if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                var energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
            }
            var energyLost = Math.min(energyToLose, target.data.energy);
            target.removeEnergy(energyLost);
            totalEnergyLost += energyLost;
            if (target.data.energy == 0 && !action.attack) {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    source: action.source,
                    target: target,
                    attack: action.attack,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            // The events transformed later take precedence over the events transformed earlier
            // That's why we transform the energy discarded event here before potentially transforming a discard creature event
            if (energyToLose > 0) {
                transform(__assign(__assign({}, action), { type: ACTION_EFFECT, effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, amount: energyLost }));
            }
        }
    });
    if (action.variable) {
        this.setSpellMetaDataField(action.variable, totalEnergyLost, action.generatedBy);
    }
};
export var applyRemoveEnergyFromCreatureEffect = function (action, transform) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === TYPE_CREATURE) {
        target.removeEnergy(energyToLose);
        if (target.data.energy === 0) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target: target,
                attack: false,
                sourceZone: ZONE_TYPE_IN_PLAY,
                destinationZone: ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            });
        }
    }
    else {
        console.error('Wrong card type');
    }
};
export var applyRemoveEnergyFromMagiEffect = function (action) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === TYPE_MAGI) {
        target.removeEnergy(energyToLose);
    }
};
export var applyRestoreCreatureToStartingEnergyEffect = function (action, transform) {
    var restoreTarget = this.getMetaValue(action.target, action.generatedBy);
    var restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
    if (restoreAmount > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
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
export var applyAddEnergyToCreatureEffect = function (action) {
    var _this = this;
    var addTargets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(addTargets, function (addTarget) {
        if (_this.isCardAffectedByEffect(addTarget, action)) {
            addTarget.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy), 10));
        }
    });
};
export var applyAddEnergyToMagiEffect = function (action) {
    var _this = this;
    var magiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(magiTarget, function (target) { return target.addEnergy(parseInt(_this.getMetaValue(action.amount, action.generatedBy)), 10); });
};
export var applyRearrangeEnergyOnCreaturesEffect = function (action, transform) {
    var energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    var ownCreatures = this.useSelector(SELECTOR_OWN_CREATURES, action.player || 0);
    var totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(function (card) { return card.data.energy; }).reduce(function (a, b) { return a + b; }, 0) : 0;
    var newEnergyTotal = Object.values(energyArrangement).reduce(function (a, b) { return a + b; }, 0);
    // Energy stasis check
    var valid = this.getZone(ZONE_TYPE_IN_PLAY).cards.every(function (card) {
        if (!card.card.data.energyStasis)
            return true;
        if (card.id in energyArrangement) {
            var newEnergy = energyArrangement[card.id];
            return newEnergy === card.data.energy;
        }
        return true;
    });
    if (valid) {
        if (newEnergyTotal === totalEnergyOnCreatures) {
            this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
                if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
                    var newEnergy = energyArrangement[card.id];
                    card.setEnergy(newEnergy);
                    if (card.data.energy === 0) {
                        transform({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: card,
                            sourceZone: ZONE_TYPE_IN_PLAY,
                            destinationZone: ZONE_TYPE_DISCARD,
                            bottom: false,
                            attack: false,
                            generatedBy: action.generatedBy,
                        });
                    }
                }
            });
        }
        else if (this.debug) {
            console.error("Cannot rearrange energy because new total ".concat(newEnergyTotal, " is not equal to old total ").concat(totalEnergyOnCreatures));
        }
    }
    else if (this.debug) {
        console.error('One or more creatures with Energy Stasis is to be affected with energy rearrangement');
    }
};
export var applyDistributeEnergyOnCreaturesEffect = function (action) {
    var energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
        if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
            var energyAmount = energyArrangement[card.id];
            card.addEnergy(energyAmount);
        }
    });
};
export var applyDistributeDamageEffect = function (action, transform) {
    var damageArrangement = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
    this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(function (card) {
        if (card.card.type === TYPE_CREATURE && card.id in damageArrangement) {
            var damageAmount = damageArrangement[card.id];
            var source = action.source;
            if (damageAmount > 0 && source) {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    source: source,
                    target: card,
                    amount: damageAmount,
                    generatedBy: action.generatedBy,
                    player: action.player,
                });
            }
        }
    });
};
//# sourceMappingURL=energy.js.map