import { ACTION_EFFECT, EFFECT_TYPE_DIE_ROLLED, } from "../../const.js";
export const applyRollDieEffect = function (action, transform) {
    // @ts-ignore
    const randomValue = this.twister ? this.twister.random() : Math.random();
    const result = action.result ||
        (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);
    transform(Object.assign(Object.assign({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_DIE_ROLLED, result }, (action.variable ? { variable: action.variable } : {})), { player: action.player, generatedBy: action.generatedBy }));
};
export const applyDieRolledEffect = function (action) {
    var _a;
    this.setSpellMetaDataField((_a = action.variable) !== null && _a !== void 0 ? _a : 'roll_result', action.result, action.generatedBy);
};
//# sourceMappingURL=randomization.js.map