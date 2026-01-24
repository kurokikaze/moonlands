"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPayingEnergyForPowerEffect = exports.applyPayingEnergyForCreatureEffect = exports.applyPayingEnergyForSpellEffect = exports.applyPayingEnergyForRelicEffect = void 0;
const CardInGame_1 = __importDefault(require("../../classes/CardInGame"));
const const_1 = require("../../const");
const applyPayingEnergyForRelicEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyPayingEnergyForRelicEffect = applyPayingEnergyForRelicEffect;
const applyPayingEnergyForSpellEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyPayingEnergyForSpellEffect = applyPayingEnergyForSpellEffect;
const applyPayingEnergyForCreatureEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        if (payingTarget instanceof CardInGame_1.default) {
            if (this.modifyByStaticAbilities(payingTarget, const_1.PROPERTY_CONTROLLER) == action.player) {
                const correctEffectType = payingTarget.card.type === const_1.TYPE_MAGI ? const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI : const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: correctEffectType,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            else {
                throw new Error('Trying to pay for the creature from non-controlled Orathan');
            }
        }
    }
};
exports.applyPayingEnergyForCreatureEffect = applyPayingEnergyForCreatureEffect;
const applyPayingEnergyForPowerEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.target, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        switch (payingTarget.card.type) {
            case const_1.TYPE_CREATURE: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case const_1.TYPE_MAGI: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
        }
    }
};
exports.applyPayingEnergyForPowerEffect = applyPayingEnergyForPowerEffect;
//# sourceMappingURL=payment.js.map