"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAttachCardToCardEffect = exports.applyPlayAttachedToCreatureEffect = exports.applyStartingEnergyOnCreatureEffect = exports.applyPlayCreatureEffect = exports.applyPlayRelicEffect = void 0;
const const_1 = require("../../const");
const applyPlayRelicEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: const_1.ACTION_GET_PROPERTY_VALUE,
        property: const_1.PROPERTY_ID,
        target: '$new_card',
        variable: 'relic_created',
        generatedBy: action.generatedBy,
    });
};
exports.applyPlayRelicEffect = applyPlayRelicEffect;
const applyPlayCreatureEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: const_1.ACTION_CALCULATE,
        operator: const_1.CALCULATION_SET,
        operandOne: '$new_card',
        variable: 'creature_created',
        generatedBy: action.generatedBy,
    });
};
exports.applyPlayCreatureEffect = applyPlayCreatureEffect;
const applyStartingEnergyOnCreatureEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
        target,
        source: undefined,
        amount: this.getMetaValue(action.amount, action.generatedBy),
        generatedBy: action.generatedBy,
    });
};
exports.applyStartingEnergyOnCreatureEffect = applyStartingEnergyOnCreatureEffect;
const applyPlayAttachedToCreatureEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        target: card,
        generatedBy: action.generatedBy,
        bottom: false,
    }, {
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD,
        target: '$new_card', // We need to attach the new card in play, not the one in hand
        attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
exports.applyPlayAttachedToCreatureEffect = applyPlayAttachedToCreatureEffect;
const applyAttachCardToCardEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    this.attachCard(card.id, attachmentTarget.id);
    this.transformIntoActions({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
        target: card,
        attachmentTarget: action.attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
exports.applyAttachCardToCardEffect = applyAttachCardToCardEffect;
//# sourceMappingURL=playing.js.map