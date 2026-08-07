import { TYPE_CREATURE, TYPE_MAGI, RESTRICTION_CREATURE_NAME, RESTRICTION_CREATURE_TYPE, RESTRICTION_TYPE, RESTRICTION_PLAYABLE, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_REGION, RESTRICTION_REGION_IS_NOT, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_STATUS, RESTRICTION_ENERGY_EQUALS, PROPERTY_STATUS, } from './const.js';
var RestrictionEngine = /** @class */ (function () {
    function RestrictionEngine(context) {
        this.context = context;
    }
    RestrictionEngine.prototype.makeChecker = function (restriction, restrictionValue) {
        var _this = this;
        switch (restriction) {
            case RESTRICTION_CREATURE_NAME:
                return function (card) { return card.card.name === restrictionValue; };
            case RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return function (card) { return card.card.name.split(' ').some(function (type) { return restrictionValue.includes(type); }); };
                }
                return function (card) { return card.card.name.split(' ').includes(restrictionValue); };
            case RESTRICTION_TYPE:
                return function (card) { return card.card.type === restrictionValue; };
            case RESTRICTION_PLAYABLE:
                return function (card) {
                    var magi = _this.context.getOwnMagi(card.owner)[0];
                    var cardCost = _this.context.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case RESTRICTION_MAGI_WITHOUT_CREATURES:
                return function (card) {
                    if (card.card.type !== TYPE_MAGI)
                        return false;
                    var creatures = _this.context.getOwnCreatures(card.owner);
                    return creatures instanceof Array && creatures.length === 0;
                };
            case RESTRICTION_REGION:
                return function (card) { return card.card.region === restrictionValue; };
            case RESTRICTION_REGION_IS_NOT:
                return function (card) { return card.card.region !== restrictionValue; };
            case RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return function (card) { return Boolean(card.card.type === TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost); };
            case RESTRICTION_ENERGY_LESS_THAN:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.energy < restrictionValue; };
            case RESTRICTION_CREATURE_WAS_ATTACKED:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.wasAttacked === true; };
            case RESTRICTION_OWN_CREATURE:
                return function (card) { return card.data.controller === restrictionValue; };
            case RESTRICTION_OPPONENT_CREATURE:
                return function (card) { return card.data.controller !== restrictionValue; };
            case RESTRICTION_STATUS:
                return function (card) { return _this.context.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue); };
            case RESTRICTION_ENERGY_EQUALS:
                return function (card) { return card.card.type === TYPE_CREATURE && card.data.energy === restrictionValue; };
            default:
                return function () { return true; };
        }
    };
    RestrictionEngine.prototype.checkAnyCardForRestriction = function (cards, restriction, restrictionValue) {
        return cards.some(this.makeChecker(restriction, restrictionValue));
    };
    RestrictionEngine.prototype.checkAnyCardForRestrictions = function (cards, restrictions) {
        return cards.some(this.makeCardFilter(restrictions));
    };
    RestrictionEngine.prototype.checkCardsForRestriction = function (cards, restriction, restrictionValue) {
        return cards.every(this.makeChecker(restriction, restrictionValue));
    };
    RestrictionEngine.prototype.makeCardFilter = function (restrictions) {
        var _this = this;
        if (restrictions === void 0) { restrictions = []; }
        var checkers = restrictions.map(function (_a) {
            var type = _a.type, value = _a.value;
            return _this.makeChecker(type, value);
        });
        return function (card) { return checkers.every(function (checker) { return checker(card); }); };
    };
    return RestrictionEngine;
}());
export { RestrictionEngine };
//# sourceMappingURL=RestrictionEngine.js.map