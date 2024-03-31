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
import { match } from 'ts-pattern';
import { CHANGE_TYPE_RESHUFFLE_DISCARD, CHANGE_TYPE_START_STEP, CHANGE_TYPE_START_TURN, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER, EXPIRATION_OPPONENT_TURNS, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD } from './const';
import CardInGame from './classes/CardInGame';
var updateContinuousEffects = function (player) { return function (effect) {
    switch (effect.expiration.type) {
        case EXPIRATION_ANY_TURNS: {
            var turnCount = effect.expiration.turns;
            if (turnCount > 1) {
                return __assign(__assign({}, effect), { expiration: {
                        type: effect.expiration.type,
                        turns: turnCount - 1,
                    } });
            }
            else {
                return null;
            }
        }
        case EXPIRATION_OPPONENT_TURNS: {
            var turnCount = effect.expiration.turns;
            if (player !== effect.player) {
                if (turnCount > 0) {
                    return __assign(__assign({}, effect), { expiration: {
                            type: effect.expiration.type,
                            turns: turnCount - 1,
                        } });
                }
                else {
                    return null;
                }
            }
            else {
                return effect;
            }
        }
        case EXPIRATION_NEVER: {
            return effect;
        }
    }
}; };
export var applyChange = function (changeAction, state) {
    match(changeAction)
        .with({ changeType: CHANGE_TYPE_RESHUFFLE_DISCARD }, function (action) {
        var player = state.getMetaValue(action.player, action.generatedBy);
        var deck = state.getZone(ZONE_TYPE_DECK, player);
        var discard = state.getZone(ZONE_TYPE_DISCARD, player);
        var newCards = discard.cards.map(function (card) { return new CardInGame(card.card, card.owner); });
        deck.add(newCards);
        deck.shuffle();
        discard.empty();
    })
        .with({ changeType: CHANGE_TYPE_START_TURN }, function (action) {
        if (state.turn === null) {
            state.turn = 0;
        }
        else {
            state.turn += 1;
        }
        state.state.continuousEffects = state.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean);
    })
        .with({ changeType: CHANGE_TYPE_START_STEP }, function (action) {
        state.state.step = action.step;
    });
};
//# sourceMappingURL=applyChange.js.map