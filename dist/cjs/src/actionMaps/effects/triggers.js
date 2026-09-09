import CardInGame from "../../classes/CardInGame.js";
import { SELECTOR_CREATURES_OF_PLAYER, SELECTOR_ID, } from "../../const.js";
import { oneOrSeveral } from "../actionMapUtils.js";
// Should rework into continuous effect with duration
export const applyForbidAttackToCreatureEffect = function (action, _transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, target => target.forbidAttacks());
};
export const applyConditionalEffect = function (action, transform) {
    const metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    const self = action.triggerSource || metaData.source || metaData.new_card;
    if (!self) {
        return;
    }
    //   checkCondition(action, self, condition)
    const results = action.conditions.map(condition => this.checkCondition(action, self, condition));
    const enrichAction = (effect) => ({
        source: self,
        player: self.data.controller,
        ...effect,
        generatedBy: action.generatedBy,
    });
    if (results.every(result => result === true)) {
        if (action.thenEffects) {
            const preparedEffects = action.thenEffects
                .map(enrichAction);
            transform(...preparedEffects);
        }
    }
    else {
        if (action.elseEffects) {
            const preparedEffects = action.elseEffects
                .map(enrichAction);
            transform(...preparedEffects);
        }
    }
};
export const applyCreateContinuousEffect = function (action, _transform, _state, seeded_nanoid) {
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
    const continuousEffect = {
        triggerEffects: action.triggerEffects || [],
        staticAbilities,
        expiration: action.expiration,
        player: action.player || 0,
        id,
    };
    this.state.continuousEffects.push(continuousEffect);
    this.clearModifiedCardDataCache();
};
//# sourceMappingURL=triggers.js.map