import { ACTION_EFFECT, EFFECT_TYPE_DIE_ROLLED, } from "../../const.js";
export const applyRollDieEffect = function (action, transform) {
    // @ts-ignore
    const randomValue = this.twister ? this.twister.random() : Math.random();
    const result = action.result ||
        (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DIE_ROLLED,
        result,
        player: action.player,
        generatedBy: action.generatedBy,
    });
};
export const applyDieRolledEffect = function (action) {
    this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
};
//# sourceMappingURL=randomization.js.map