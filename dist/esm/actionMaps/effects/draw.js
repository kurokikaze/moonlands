import { ACTION_EFFECT, EFFECT_TYPE_DRAW, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_RESHUFFLE_DISCARD, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, } from "../../const.js";
export var applyDrawNCardsEffect = function (action, transform) {
    var numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
    for (var i = 0; i < numberOfCards; i++) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DRAW,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
export var applyDrawEffect = function (action, transform) {
    var player = this.getMetaValue(action.player, action.generatedBy);
    var deck = this.getZone(ZONE_TYPE_DECK, player);
    var discard = this.getZone(ZONE_TYPE_DISCARD, player);
    if (deck.length > 0) {
        var card = deck.cards[0];
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: card,
            sourceZone: ZONE_TYPE_DECK,
            destinationZone: ZONE_TYPE_HAND,
            bottom: false,
            player: player,
            generatedBy: action.generatedBy,
        });
    }
    else if (discard.length > 0) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_RESHUFFLE_DISCARD,
            player: player,
            generatedBy: action.generatedBy,
        }, action);
    }
};
//# sourceMappingURL=draw.js.map