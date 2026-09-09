import { TYPE_CREATURE, TYPE_MAGI, RESTRICTION_CREATURE_NAME, RESTRICTION_CREATURE_TYPE, RESTRICTION_TYPE, RESTRICTION_PLAYABLE, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_REGION, RESTRICTION_REGION_IS_NOT, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_STATUS, RESTRICTION_ENERGY_EQUALS, PROPERTY_STATUS, } from './const.js';
export class RestrictionEngine {
    context;
    constructor(context) {
        this.context = context;
    }
    makeChecker(restriction, restrictionValue) {
        switch (restriction) {
            case RESTRICTION_CREATURE_NAME:
                return (card) => card.card.name === restrictionValue;
            case RESTRICTION_CREATURE_TYPE:
                if (restrictionValue instanceof Array) {
                    return (card) => card.card.name.split(' ').some(type => restrictionValue.includes(type));
                }
                return (card) => card.card.name.split(' ').includes(restrictionValue);
            case RESTRICTION_TYPE:
                return (card) => card.card.type === restrictionValue;
            case RESTRICTION_PLAYABLE:
                return (card) => {
                    const magi = this.context.getOwnMagi(card.owner)[0];
                    const cardCost = this.context.calculateTotalCost(card);
                    return magi.data.energy >= cardCost;
                };
            case RESTRICTION_MAGI_WITHOUT_CREATURES:
                return (card) => {
                    if (card.card.type !== TYPE_MAGI)
                        return false;
                    const creatures = this.context.getOwnCreatures(card.owner);
                    return creatures instanceof Array && creatures.length === 0;
                };
            case RESTRICTION_REGION:
                return (card) => card.card.region === restrictionValue;
            case RESTRICTION_REGION_IS_NOT:
                return (card) => card.card.region !== restrictionValue;
            case RESTRICTION_ENERGY_LESS_THAN_STARTING:
                return (card) => Boolean(card.card.type === TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost);
            case RESTRICTION_ENERGY_LESS_THAN:
                return (card) => card.card.type === TYPE_CREATURE && card.data.energy < restrictionValue;
            case RESTRICTION_CREATURE_WAS_ATTACKED:
                return (card) => card.card.type === TYPE_CREATURE && card.data.wasAttacked === true;
            case RESTRICTION_OWN_CREATURE:
                return (card) => card.data.controller === restrictionValue;
            case RESTRICTION_OPPONENT_CREATURE:
                return (card) => card.data.controller !== restrictionValue;
            case RESTRICTION_STATUS:
                return (card) => this.context.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue);
            case RESTRICTION_ENERGY_EQUALS:
                return (card) => card.card.type === TYPE_CREATURE && card.data.energy === restrictionValue;
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
//# sourceMappingURL=RestrictionEngine.js.map