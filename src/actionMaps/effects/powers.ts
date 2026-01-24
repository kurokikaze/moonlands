import {
  EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
  PROPERTY_CONTROLLER,
  PROPERTY_POWER_COST,
} from "../../const";
import { AnyEffectType, EnrichedAction } from "../../types";
import { ActionTransformer } from "../actionMapTypes";

export const applyExecutePowerEffects: ActionTransformer<typeof EFFECT_TYPE_EXECUTE_POWER_EFFECTS> = function (action) {
  const power = this.getMetaValue(action.power, action.generatedBy);
  const sourceRaw = this.getMetaValue(action.source, action.generatedBy);
  // Some selectors will give us arrays anyway
  const source = sourceRaw instanceof Array ? sourceRaw[0] : sourceRaw;

  const sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);
  const powerCost = this.modifyByStaticAbilities(source, PROPERTY_POWER_COST, power.name || '');

  const enrichAction = <T>(effect: T): T & EnrichedAction => ({
    source,
    player: sourceController,
    ...effect,
    power: true,
    generatedBy:
      source.id,
  });

  if ('effects' in power && power.effects) {
    const effects = power.effects;
    const preparedActions: AnyEffectType[] = effects.map(enrichAction);

    const allPromptsAreDoable = this.checkPrompts(source, preparedActions, true);

    if (allPromptsAreDoable) {
      const mustSetUsage = !('setUsage' in action) || action.setUsage == true
      if (mustSetUsage && !source.wasActionUsed(power.name)) {
        source.setActionUsed(power.name);
      }

      this.transformIntoActions(...preparedActions);
    }
  }
}
