"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReshuffleDiscardEffect = exports.applyDiscardCardEffect = exports.applyDiscardCardsEffect = void 0;
const CardInGame_1 = __importDefault(require("../../classes/CardInGame"));
const const_1 = require("../../const");
const actionMapUtils_1 = require("../actionMapUtils");
const applyDiscardCardsEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, target => target && transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
        target,
        generatedBy: action.generatedBy,
        player: action.player,
    }));
};
exports.applyDiscardCardsEffect = applyDiscardCardsEffect;
const applyDiscardCardEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    if (target) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_HAND,
            destinationZone: const_1.ZONE_TYPE_DISCARD,
            bottom: false,
            target,
            generatedBy: action.generatedBy,
        });
    }
};
exports.applyDiscardCardEffect = applyDiscardCardEffect;
const applyReshuffleDiscardEffect = function (action, transform, _state, seeded_nanoid) {
    const player = this.getMetaValue(action.player, action.generatedBy);
    const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
    const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
    const newCards = discard.cards.map(card => new CardInGame_1.default(card.card, card.owner, seeded_nanoid));
    deck.add(newCards);
    deck.shuffle();
    discard.empty();
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_RESHUFFLED,
        cards: newCards.map(({ id }) => id),
        player: player,
        generatedBy: action.generatedBy,
    });
};
exports.applyReshuffleDiscardEffect = applyReshuffleDiscardEffect;
//# sourceMappingURL=discard.js.map