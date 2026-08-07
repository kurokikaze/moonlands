"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictionEngine = void 0;
const const_1 = require("./const");
class RestrictionEngine {
    context;
    constructor(context) {
        this.context = context;
    }
    makeChecker(restriction, restrictionValue) {
        switch (restriction) {
            case const_1.RESTRICTION_CREATURE_NAME:
                return (card) => card.card.name === restrictionValue;
            case const_1.RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return (card) => card.card.name.split(' ').some(type => restrictionValue.includes(type));
                }
                return (card) => card.card.name.split(' ').includes(restrictionValue);
            case const_1.RESTRICTION_TYPE:
                return (card) => card.card.type === restrictionValue;
            case const_1.RESTRICTION_PLAYABLE:
                return (card) => {
                    const magi = this.context.getOwnMagi(card.owner)[0];
                    const cardCost = this.context.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case const_1.RESTRICTION_MAGI_WITHOUT_CREATURES:
                return (card) => {
                    if (card.card.type !== const_1.TYPE_MAGI)
                        return false;
                    const creatures = this.context.getOwnCreatures(card.owner);
                    return creatures instanceof Array && creatures.length === 0;
                };
            case const_1.RESTRICTION_REGION:
                return (card) => card.card.region === restrictionValue;
            case const_1.RESTRICTION_REGION_IS_NOT:
                return (card) => card.card.region !== restrictionValue;
            case const_1.RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return (card) => Boolean(card.card.type === const_1.TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost);
            case const_1.RESTRICTION_ENERGY_LESS_THAN:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.energy < restrictionValue;
            case const_1.RESTRICTION_CREATURE_WAS_ATTACKED:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.wasAttacked === true;
            case const_1.RESTRICTION_OWN_CREATURE:
                return (card) => card.data.controller === restrictionValue;
            case const_1.RESTRICTION_OPPONENT_CREATURE:
                return (card) => card.data.controller !== restrictionValue;
            case const_1.RESTRICTION_STATUS:
                return (card) => this.context.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, restrictionValue);
            case const_1.RESTRICTION_ENERGY_EQUALS:
                return (card) => card.card.type === const_1.TYPE_CREATURE && card.data.energy === restrictionValue;
            default:
                return () => true;
        }
    }
    checkAnyCardForRestriction(cards, restriction, restrictionValue) {
        return cards.some(this.makeChecker(restriction, restrictionValue));
    }
    checkAnyCardForRestrictions(cards, restrictions) {
        return cards.some(this.makeCardFilter(restrictions));
    }
    checkCardsForRestriction(cards, restriction, restrictionValue) {
        return cards.every(this.makeChecker(restriction, restrictionValue));
    }
    makeCardFilter(restrictions = []) {
        const checkers = restrictions.map(({ type, value }) => this.makeChecker(type, value));
        return card => checkers.every(checker => checker(card));
    }
}
exports.RestrictionEngine = RestrictionEngine;
//# sourceMappingURL=RestrictionEngine.js.map