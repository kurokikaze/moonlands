import {
  ACTION_EFFECT,
  EFFECT_TYPE_DIE_ROLLED,
  EFFECT_TYPE_ROLL_DIE,
} from "../../const";
import { ActionTransformer } from "../actionMapTypes";

export const applyRollDieEffect: ActionTransformer<typeof EFFECT_TYPE_ROLL_DIE> = function (action, transform) {
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
}

export const applyDieRolledEffect: ActionTransformer<typeof EFFECT_TYPE_DIE_ROLLED> = function (action) {
  this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
}
