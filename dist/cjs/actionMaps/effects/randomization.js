"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDieRolledEffect = exports.applyRollDieEffect = void 0;
const const_1 = require("../../const");
const applyRollDieEffect = function (action, transform) {
    // @ts-ignore
    const randomValue = this.twister ? this.twister.random() : Math.random();
    const result = action.result ||
        (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DIE_ROLLED,
        result,
        player: action.player,
        generatedBy: action.generatedBy,
    });
};
exports.applyRollDieEffect = applyRollDieEffect;
const applyDieRolledEffect = function (action) {
    this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
};
exports.applyDieRolledEffect = applyDieRolledEffect;
//# sourceMappingURL=randomization.js.map