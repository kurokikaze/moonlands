"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../const");
var Card = /** @class */ (function () {
    function Card(name, type, region, cost, data) {
        if (data === void 0) { data = {}; }
        if (![const_1.TYPE_CREATURE, const_1.TYPE_MAGI, const_1.TYPE_RELIC, const_1.TYPE_SPELL].includes(type)) {
            throw new Error("Unknown card type: \"" + type + "\" for card " + name);
        }
        if (![
            const_1.REGION_CALD,
            const_1.REGION_NAROOM,
            const_1.REGION_OROTHE,
            const_1.REGION_ARDERIAL,
            const_1.REGION_UNDERNEATH,
            const_1.REGION_UNIVERSAL,
            const_1.REGION_BOGRATH,
        ].includes(region)) {
            throw new Error("Unknown card region: \"" + region + "\" for card " + name);
        }
        this.name = name;
        this.type = type;
        this.region = region;
        this.cost = cost;
        this.data = __assign({ attacksPerTurn: 1, canAttackMagiDirectly: false }, data);
    }
    Card.prototype.getName = function () {
        return this.name;
    };
    Card.prototype.getCost = function () {
        return this.cost;
    };
    return Card;
}());
exports.default = Card;
//# sourceMappingURL=Card.js.map