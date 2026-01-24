"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCreateContinuousEffect = exports.applyConditionalEffect = exports.applyForbidAttackToCreatureEffect = void 0;
const CardInGame_1 = __importDefault(require("../../classes/CardInGame"));
const const_1 = require("../../const");
const actionMapUtils_1 = require("../actionMapUtils");
// Should rework into continuous effect with duration
const applyForbidAttackToCreatureEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, target => target.forbidAttacks());
};
exports.applyForbidAttackToCreatureEffect = applyForbidAttackToCreatureEffect;
const applyConditionalEffect = function (action, transform) {
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
exports.applyConditionalEffect = applyConditionalEffect;
const applyCreateContinuousEffect = function (action, _transform, _state, seeded_nanoid) {
    const id = seeded_nanoid();
    const staticAbilities = (action.staticAbilities || []).map(ability => {
        switch (ability.selector) {
            case const_1.SELECTOR_ID: {
                const selectorParameterMetaValue = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                const selectorParameter = (selectorParameterMetaValue instanceof CardInGame_1.default) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                return {
                    ...ability,
                    selectorParameter,
                };
            }
            case const_1.SELECTOR_CREATURES_OF_PLAYER: {
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
    this.state = {
        ...this.state,
        continuousEffects: [
            ...this.state.continuousEffects,
            continuousEffect,
        ],
    };
};
exports.applyCreateContinuousEffect = applyCreateContinuousEffect;
//# sourceMappingURL=triggers.js.map