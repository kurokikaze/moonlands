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
import { EXPIRATION_ANY_TURNS, EXPIRATION_OPPONENT_TURNS, EXPIRATION_NEVER } from "../const";
export var updateContinuousEffects = function (player) { return function (effect) {
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
export var oneOrSeveral = function (targets, callback) {
    if (targets instanceof Array) {
        if (targets.length > 0) {
            targets.forEach(function (target) { return callback(target); });
        }
    }
    else {
        callback(targets);
    }
};
//# sourceMappingURL=actionMapUtils.js.map