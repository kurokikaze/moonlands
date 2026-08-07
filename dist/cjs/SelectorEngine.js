"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorEngine = void 0;
const const_1 = require("./const");
const CostEngine_1 = require("./CostEngine");
const RestrictionEngine_1 = require("./RestrictionEngine");
const LayeredModificationEngine_1 = require("./LayeredModificationEngine");
// ─── SelectorEngine ───────────────────────────────────────────────────────────
class SelectorEngine extends LayeredModificationEngine_1.LayeredModificationEngine {
    context;
    costEngine;
    restrictionEngine;
    modifiedCardDataCache = new Map();
    constructor(context) {
        super();
        this.context = context;
        this.costEngine = new CostEngine_1.CostEngine({
            getOwnMagi: this.getOwnMagi.bind(this),
            modifyByStaticAbilities: this.modifyByStaticAbilities.bind(this),
        });
        this.restrictionEngine = new RestrictionEngine_1.RestrictionEngine({
            getOwnMagi: this.getOwnMagi.bind(this),
            getOwnCreatures: this.getOwnCreatures.bind(this),
            calculateTotalCost: this.costEngine.calculateTotalCost.bind(this.costEngine),
            modifyByStaticAbilities: this.modifyByStaticAbilities.bind(this),
        });
    }
    getOwnMagi(player) {
        return this.useSelector(const_1.SELECTOR_OWN_MAGI, player);
    }
    getOwnCreatures(player) {
        return this.useSelector(const_1.SELECTOR_OWN_CREATURES, player);
    }
    clearModifiedCardDataCache() {
        this.modifiedCardDataCache.clear();
    }
    // ── Nth / random card helpers ────────────────────────────────────────────
    selectNthCardOfZone(player, zoneType, cardNumber, restrictions) {
        const zoneCards = this.context.getZone(zoneType, player).cards;
        const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        const index = cardNumber - 1; // 1-based indexing, for better card data readability
        if (filteredCards.length < index + 1) {
            return [];
        }
        else {
            return [filteredCards[index]];
        }
    }
    selectRandomCardOfZone(player, zoneType) {
        const zoneCards = this.context.getZone(zoneType, player).cards;
        const twister = this.context.getTwister();
        // @ts-ignore
        const randomValue = twister ? twister.random() : Math.random();
        const index = Math.floor(randomValue * zoneCards.length);
        if (zoneCards.length === 0) {
            return [];
        }
        else {
            return [zoneCards[index]];
        }
    }
    useSelector(selector, player, argument) {
        const { getZone, getOpponent, players } = this.context;
        switch (selector) {
            case const_1.SELECTOR_OWN_CARDS_IN_PLAY: {
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player);
            }
            case const_1.SELECTOR_RELICS: {
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == const_1.TYPE_RELIC);
            }
            case const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                        .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards
                        .filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                ];
            }
            case const_1.SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return [
                    ...getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, players[0]).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                    ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, players[1]).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_ENERGIZE) > 0),
                ];
            }
            case const_1.SELECTOR_OPPONENT_ID:
                return players.find(id => id != argument) || 999;
            case const_1.SELECTOR_CREATURES:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_MAGI:
                return [
                    ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, players[0]).cards,
                    ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, players[1]).cards,
                ].filter(Boolean);
            case const_1.SELECTOR_TOP_MAGI_OF_PILE: {
                const topMagi = getZone(const_1.ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case const_1.SELECTOR_OWN_MAGI:
                return getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, player).cards;
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND:
                return getZone(const_1.ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == const_1.TYPE_SPELL);
            case const_1.SELECTOR_ENEMY_MAGI:
                return getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, getOpponent(player || 0)).cards;
            case const_1.SELECTOR_OWN_CREATURES:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_ENEMY_CREATURES:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) != player && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_OF_REGION:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) == argument && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_NOT_OF_REGION:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_REGION) != argument && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_OF_TYPE:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_CREATURES_NOT_OF_TYPE:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => !card.card.name.split(' ').includes(argument) && card.card.type == const_1.TYPE_CREATURE);
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_CONTROLLER) == player &&
                    card.card.type == const_1.TYPE_CREATURE &&
                    card.card.name.split(' ').includes(argument));
            case const_1.SELECTOR_STATUS:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument));
            case const_1.SELECTOR_CREATURES_WITHOUT_STATUS:
                return getZone(const_1.ZONE_TYPE_IN_PLAY).cards
                    .filter(card => card.card.type == const_1.TYPE_CREATURE)
                    .filter(card => !this.modifyByStaticAbilities(card, const_1.PROPERTY_STATUS, argument));
            default:
                return [];
        }
    }
    useSelectorAny(selector, player, argument) {
        return this.useSelector(selector, player, argument);
    }
    // ── isCardAffectedByStaticAbility ────────────────────────────────────────
    isCardAffectedByStaticAbility(card, staticAbility) {
        const { getZone } = this.context;
        switch (staticAbility.selector) {
            case const_1.SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_SELF_AND_STATUS: {
                return !!('card' in staticAbility &&
                    staticAbility.card &&
                    card.id === staticAbility.card.id &&
                    this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter));
            }
            case const_1.SELECTOR_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id);
            }
            case const_1.SELECTOR_OWN_CREATURES: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(staticAbility?.selectorParameter?.toString() || 'no matches');
            }
            case const_1.SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === const_1.TYPE_CREATURE &&
                    getZone(const_1.ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case const_1.SELECTOR_OWN_MAGI: {
                return card.card.type === const_1.TYPE_MAGI &&
                    getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    (getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)?.card?.id === card.id ?? false);
            }
            case const_1.SELECTOR_STATUS: {
                return !!this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case const_1.SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return !!this.getByProperty(card, const_1.PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case const_1.SELECTOR_OWN_SPELLS_IN_HAND: {
                return getZone(const_1.ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id && card.card.type == const_1.TYPE_SPELL);
            }
            default: {
                console.error(`Unknown static ability selector: ${staticAbility.selector}`);
                return false;
            }
        }
    }
    // ── modifyByStaticAbilities ──────────────────────────────────────────────
    modifyByStaticAbilities(target, property, subProperty = null) {
        if (!target) {
            return null;
        }
        const cached = this.modifiedCardDataCache.get(target.id);
        if (cached) {
            const freshData = {
                ...cached.data,
                energy: target.data.energy,
                attacked: target.data.attacked,
                actionsUsed: target.data.actionsUsed,
                energyLostThisTurn: target.data.energyLostThisTurn,
                defeatedCreature: target.data.defeatedCreature,
                hasAttacked: target.data.hasAttacked,
                wasAttacked: target.data.wasAttacked,
                attachedTo: target.data.attachedTo,
            };
            // @ts-ignore
            return this.getByProperty({ ...cached, data: freshData }, property, subProperty);
        }
        const { getZone, players, getContinuousEffects } = this.context;
        const PLAYER_ONE = players[0];
        const PLAYER_TWO = players[1];
        const gameStaticAbilities = [
            {
                name: 'Burrowed - Energy loss',
                text: 'Your burrowed creatures may not lose more than 2 energy each turn',
                selector: const_1.SELECTOR_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ENERGY_LOSS_THRESHOLD,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: 2,
                },
            },
            {
                name: 'Burrowed - Ability to attack',
                text: 'Your burrowed creatures cannot attack',
                selector: const_1.SELECTOR_STATUS,
                selectorParameter: const_1.STATUS_BURROWED,
                property: const_1.PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operator: const_1.CALCULATION_SET,
                    operandOne: false,
                },
            },
        ];
        const allZonesCards = [
            ...getZone(const_1.ZONE_TYPE_IN_PLAY).cards,
            ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards,
            ...getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards,
        ];
        const continuousStaticAbilities = getContinuousEffects().map(effect => effect.staticAbilities?.map(a => ({ ...a, player: effect.player })) || []).flat();
        const propertyLayers = {
            [const_1.PROPERTY_CONTROLLER]: 0,
            [const_1.PROPERTY_POWER_COST]: 1,
            [const_1.PROPERTY_COST]: 1,
            [const_1.PROPERTY_ENERGIZE]: 2,
            [const_1.PROPERTY_STATUS]: 3,
            [const_1.PROPERTY_ATTACKS_PER_TURN]: 4,
            [const_1.PROPERTY_CAN_ATTACK_MAGI_DIRECTLY]: 5,
            [const_1.PROPERTY_ENERGY_LOSS_THRESHOLD]: 6,
            [const_1.PROPERTY_ABLE_TO_ATTACK]: 7,
            [const_1.PROPERTY_PROTECTION]: 8,
        };
        const zoneAbilities = allZonesCards.reduce((acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
            ...acc,
            ...(cardInPlay.card.data.staticAbilities.map(a => ({ ...a, player: cardInPlay.data.controller, card: cardInPlay })))
        ] : acc, []);
        const staticAbilities = [...gameStaticAbilities, ...zoneAbilities, ...continuousStaticAbilities].sort((a, b) => propertyLayers[a.property] - propertyLayers[b.property]);
        let initialCardData = {
            card: target.card,
            modifiedCard: {
                ...target.card,
                data: {
                    protection: undefined,
                    ...target.card.data,
                    energyLossThreshold: 0,
                    ableToAttack: 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true,
                },
            },
            data: {
                ...target.data,
            },
            id: target.id,
            owner: target.owner,
        };
        const modifiedCardData = staticAbilities.reduce(this.layeredDataReducer.bind(this), initialCardData);
        this.modifiedCardDataCache.set(target.id, modifiedCardData);
        // @ts-ignore
        return this.getByProperty(modifiedCardData, property, subProperty);
    }
    // ── Restriction checkers ─────────────────────────────────────────────────
    makeChecker(restriction, restrictionValue) {
        return this.restrictionEngine.makeChecker(restriction, restrictionValue);
    }
    checkAnyCardForRestriction(cards, restriction, restrictionValue) {
        return this.restrictionEngine.checkAnyCardForRestriction(cards, restriction, restrictionValue);
    }
    checkAnyCardForRestrictions(cards, restrictions) {
        return this.restrictionEngine.checkAnyCardForRestrictions(cards, restrictions);
    }
    checkCardsForRestriction(cards, restriction, restrictionValue) {
        return this.restrictionEngine.checkCardsForRestriction(cards, restriction, restrictionValue);
    }
    makeCardFilter(restrictions = []) {
        return this.restrictionEngine.makeCardFilter(restrictions);
    }
    // ── calculateTotalCost ───────────────────────────────────────────────────
    calculateTotalCost(card) {
        return this.costEngine.calculateTotalCost(card);
    }
}
exports.SelectorEngine = SelectorEngine;
//# sourceMappingURL=SelectorEngine.js.map