"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOrSeveral = exports.updateContinuousEffects = void 0;
const const_1 = require("../const");
const updateContinuousEffects = (player) => (effect) => {
    switch (effect.expiration.type) {
        case const_1.EXPIRATION_ANY_TURNS: {
            const turnCount = effect.expiration.turns;
            if (turnCount > 1) {
                return {
                    ...effect,
                    expiration: {
                        type: effect.expiration.type,
                        turns: turnCount - 1,
                    }
                };
            }
            else {
                return null;
            }
        }
        case const_1.EXPIRATION_OPPONENT_TURNS: {
            const turnCount = effect.expiration.turns;
            if (player !== effect.player) {
                if (turnCount > 0) {
                    return {
                        ...effect,
                        expiration: {
                            type: effect.expiration.type,
                            turns: turnCount - 1,
                        }
                    };
                }
                else {
                    return null;
                }
            }
            else {
                return effect;
            }
        }
        case const_1.EXPIRATION_NEVER: {
            return effect;
        }
    }
};
exports.updateContinuousEffects = updateContinuousEffects;
const oneOrSeveral = (targets, callback) => {
    if (targets instanceof Array) {
        if (targets.length > 0) {
            targets.forEach(target => callback(target));
        }
    }
    else {
        callback(targets);
    }
};
exports.oneOrSeveral = oneOrSeveral;
//# sourceMappingURL=actionMapUtils.js.map