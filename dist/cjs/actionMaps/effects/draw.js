"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDrawEffect = exports.applyDrawNCardsEffect = void 0;
const const_1 = require("../../const");
const applyDrawNCardsEffect = function (action, transform) {
    const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
    for (let i = 0; i < numberOfCards; i++) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DRAW,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyDrawNCardsEffect = applyDrawNCardsEffect;
const applyDrawEffect = function (action, transform) {
    const player = this.getMetaValue(action.player, action.generatedBy);
    const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
    const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
    if (deck.length > 0) {
        const card = deck.cards[0];
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: card,
            sourceZone: const_1.ZONE_TYPE_DECK,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            player: player,
            generatedBy: action.generatedBy,
        });
    }
    else if (discard.length > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_RESHUFFLE_DISCARD,
            player: player,
            generatedBy: action.generatedBy,
        }, action);
    }
};
exports.applyDrawEffect = applyDrawEffect;
//# sourceMappingURL=draw.js.map