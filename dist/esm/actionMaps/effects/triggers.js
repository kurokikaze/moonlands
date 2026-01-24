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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import CardInGame from "../../classes/CardInGame.js";
import { SELECTOR_CREATURES_OF_PLAYER, SELECTOR_ID, } from "../../const.js";
import { oneOrSeveral } from "../actionMapUtils.js";
// Should rework into continuous effect with duration
export var applyForbidAttackToCreatureEffect = function (action, transform) {
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) { return target.forbidAttacks(); });
};
export var applyConditionalEffect = function (action, transform) {
    var _this = this;
    var metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    var self = action.triggerSource || metaData.source || metaData.new_card;
    if (!self) {
        return;
    }
    //   checkCondition(action, self, condition)
    var results = action.conditions.map(function (condition) {
        return _this.checkCondition(action, self, condition);
    });
    var enrichAction = function (effect) { return (__assign(__assign({ source: self, player: self.data.controller }, effect), { generatedBy: action.generatedBy })); };
    if (results.every(function (result) { return result === true; })) {
        if (action.thenEffects) {
            var preparedEffects = action.thenEffects
                .map(enrichAction);
            transform.apply(void 0, preparedEffects);
        }
    }
    else {
        if (action.elseEffects) {
            var preparedEffects = action.elseEffects
                .map(enrichAction);
            transform.apply(void 0, preparedEffects);
        }
    }
};
export var applyCreateContinuousEffect = function (action, _transform, _state, seeded_nanoid) {
    var _this = this;
    var id = seeded_nanoid();
    var staticAbilities = (action.staticAbilities || []).map(function (ability) {
        switch (ability.selector) {
            case SELECTOR_ID: {
                var selectorParameterMetaValue = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                var selectorParameter = (selectorParameterMetaValue instanceof CardInGame) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                return __assign(__assign({}, ability), { selectorParameter: selectorParameter });
            }
            case SELECTOR_CREATURES_OF_PLAYER: {
                var selectorParameter = _this.getMetaValue(ability.selectorParameter, action.generatedBy);
                return __assign(__assign({}, ability), { selectorParameter: selectorParameter });
            }
            default: {
                return ability;
            }
        }
    }).map(function (ability) {
        var _a;
        var operandOne = _this.getMetaValue((_a = ability.modifier) === null || _a === void 0 ? void 0 : _a.operandOne, action.generatedBy);
        return __assign(__assign({}, ability), { modifier: {
                operator: ability.modifier.operator,
                operandOne: operandOne,
            } });
    });
    var continuousEffect = {
        triggerEffects: action.triggerEffects || [],
        staticAbilities: staticAbilities,
        expiration: action.expiration,
        player: action.player || 0,
        id: id,
    };
    this.state = __assign(__assign({}, this.state), { continuousEffects: __spreadArray(__spreadArray([], this.state.continuousEffects, true), [
            continuousEffect,
        ], false) });
};
//# sourceMappingURL=triggers.js.map