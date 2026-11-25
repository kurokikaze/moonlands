import CardInGame from "../../classes/CardInGame.js";
import {
  EFFECT_TYPE_CONDITIONAL,
  EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  EXPIRATION_DURING_PLAYER_TURNS,
  SELECTOR_CREATURES_OF_PLAYER,
  SELECTOR_ID,
} from "../../const.js";
import { ContinuousEffectType, EnrichedAction } from "../../types/index.js";
import { oneOrSeveral } from "../actionMapUtils.js";
import { ActionTransformer } from "../actionMapTypes.js";

// Should rework into continuous effect with duration
export const applyForbidAttackToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE> = function (action, _transform) {
  const targets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(targets, target => this.forbidAttacks(target));
}

export const applyConditionalEffect: ActionTransformer<typeof EFFECT_TYPE_CONDITIONAL> = function (action, transform) {
  const metaData: { source?: CardInGame, new_card?: CardInGame } = this.getSpellMetadata(action.generatedBy);
  // "new_card" fallback is for "defeated" triggers
  const self = action.triggerSource || metaData.source || metaData.new_card;

  //   checkCondition(action, self, condition)
  const results = action.conditions.map(condition =>
    this.checkCondition(action, self, condition),
  );

  const enrichAction = <T>(effect: T): T & EnrichedAction => ({
    source: self,
    player: action.player ?? self?.data.controller,
    ...effect,
    generatedBy: action.generatedBy,
  });

  const effects = results.every(result => result === true) ? action.thenEffects : action.elseEffects;
  if (!effects) return;
  const preparedEffects = effects.map(enrichAction);
  const player = this.getMetaValue<number>(action.player ?? self?.data.controller ?? 0, action.generatedBy)
    ?? self?.data.controller ?? 0;
  // Validate only the selected branch, after its condition (e.g. a die roll) is
  // known. An impossible choice fizzles this branch, including dependent effects,
  // without blocking the rest of the queue or reusing an older metadata target.
  if (this.promptValidator.checkPrompts(self, preparedEffects, false, 0, player, action.generatedBy)) {
    transform(...preparedEffects);
  }
}

export const applyCreateContinuousEffect: ActionTransformer<typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT> = function (action, _transform, _state, seeded_nanoid) {
  const id = seeded_nanoid();

  const staticAbilities = (action.staticAbilities || []).map(ability => {
    switch (ability.selector) {
      case SELECTOR_ID: {
        const selectorParameterMetaValue = this.getMetaValue(ability.selectorParameter, action.generatedBy);

        const selectorParameter = (selectorParameterMetaValue instanceof CardInGame) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
        return {
          ...ability,
          selectorParameter,
        };
      }
      case SELECTOR_CREATURES_OF_PLAYER: {
        const selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
        return {
          ...ability,
          selectorParameter,
        };
      }
      default: {
        return ability;
      }
    }
  }).map(ability => {
    const operandOne = this.getMetaValue(ability.modifier?.operandOne, action.generatedBy);
    return {
      ...ability,
      modifier: {
        operator: ability.modifier.operator,
        operandOne,
      },
    };
  });

  const continuousEffect: ContinuousEffectType = {
    triggerEffects: action.triggerEffects || [],
    ...(action.replacementEffects && {
      replacementEffects: action.replacementEffects.map(replacement => ({
        ...replacement,
        find: {
          ...replacement.find,
          conditions: replacement.find.conditions.map(condition => ({
            ...condition,
            objectOne: this.getMetaValue(condition.objectOne, action.generatedBy),
            objectTwo: this.getMetaValue(condition.objectTwo, action.generatedBy),
          })),
        },
      })),
    }),
    staticAbilities,
    expiration: action.expiration.type === EXPIRATION_DURING_PLAYER_TURNS && action.turnPlayer !== undefined
      ? { ...action.expiration, turnPlayer: this.getMetaValue<number>(action.turnPlayer, action.generatedBy) }
      : action.expiration,
    player: action.player || 0,
    id,
  };

  const source = this.getMetaValue(action.source, action.generatedBy) ||
    action.triggerSource || this.getSpellMetadata(action.generatedBy || '').source;
  if (source instanceof CardInGame) {
    continuousEffect.self = source;
    if (action.discardSourceOnExpiration) continuousEffect.discardSourceId = source.id;
  }

  this.addContinuousEffect(continuousEffect);
}
