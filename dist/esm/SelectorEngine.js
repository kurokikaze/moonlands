var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, SELECTOR_CREATURES, SELECTOR_MAGI, SELECTOR_RELICS, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_OWN_SPELLS_IN_HAND, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_CREATURES_OF_TYPE, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_ID, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_SELF_AND_STATUS, SELECTOR_OWN_CREATURES_WITH_STATUS, SELECTOR_OPPONENT_ID, STATUS_BURROWED, PROPERTY_CONTROLLER, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_ENERGY_LOSS_THRESHOLD, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_PROTECTION, CALCULATION_SET, ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_HAND, } from './const.js';
import { CostEngine } from './CostEngine.js';
import { RestrictionEngine } from './RestrictionEngine.js';
import { LayeredModificationEngine } from './LayeredModificationEngine.js';
// ─── SelectorEngine ───────────────────────────────────────────────────────────
var SelectorEngine = /** @class */ (function (_super) {
    __extends(SelectorEngine, _super);
    function SelectorEngine(context) {
        var _this = _super.call(this) || this;
        _this.modifiedCardDataCache = new Map();
        _this.context = context;
        _this.costEngine = new CostEngine({
            getOwnMagi: _this.getOwnMagi.bind(_this),
            modifyByStaticAbilities: _this.modifyByStaticAbilities.bind(_this),
        });
        _this.restrictionEngine = new RestrictionEngine({
            getOwnMagi: _this.getOwnMagi.bind(_this),
            getOwnCreatures: _this.getOwnCreatures.bind(_this),
            calculateTotalCost: _this.costEngine.calculateTotalCost.bind(_this.costEngine),
            modifyByStaticAbilities: _this.modifyByStaticAbilities.bind(_this),
        });
        return _this;
    }
    SelectorEngine.prototype.getOwnMagi = function (player) {
        return this.useSelector(SELECTOR_OWN_MAGI, player);
    };
    SelectorEngine.prototype.getOwnCreatures = function (player) {
        return this.useSelector(SELECTOR_OWN_CREATURES, player);
    };
    SelectorEngine.prototype.clearModifiedCardDataCache = function () {
        this.modifiedCardDataCache.clear();
    };
    // ── Nth / random card helpers ────────────────────────────────────────────
    SelectorEngine.prototype.selectNthCardOfZone = function (player, zoneType, cardNumber, restrictions) {
        var zoneCards = this.context.getZone(zoneType, player).cards;
        var filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
        var index = cardNumber - 1; // 1-based indexing, for better card data readability
        if (filteredCards.length < index + 1) {
            return [];
        }
        else {
            return [filteredCards[index]];
        }
    };
    SelectorEngine.prototype.selectRandomCardOfZone = function (player, zoneType) {
        var zoneCards = this.context.getZone(zoneType, player).cards;
        var twister = this.context.getTwister();
        // @ts-ignore
        var randomValue = twister ? twister.random() : Math.random();
        var index = Math.floor(randomValue * zoneCards.length);
        if (zoneCards.length === 0) {
            return [];
        }
        else {
            return [zoneCards[index]];
        }
    };
    SelectorEngine.prototype.useSelector = function (selector, player, argument) {
        var _this = this;
        var _a = this.context, getZone = _a.getZone, getOpponent = _a.getOpponent, players = _a.players;
        switch (selector) {
            case SELECTOR_OWN_CARDS_IN_PLAY: {
                return getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player; });
            }
            case SELECTOR_RELICS: {
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == TYPE_RELIC; });
            }
            case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray([], getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
                    .filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true);
            }
            case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
                return __spreadArray(__spreadArray(__spreadArray([], getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), getZone(ZONE_TYPE_ACTIVE_MAGI, players[0]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true), getZone(ZONE_TYPE_ACTIVE_MAGI, players[1]).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0; }), true);
            }
            case SELECTOR_OPPONENT_ID:
                return players.find(function (id) { return id != argument; }) || 999;
            case SELECTOR_CREATURES:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.type == TYPE_CREATURE; });
            case SELECTOR_MAGI:
                return __spreadArray(__spreadArray([], getZone(ZONE_TYPE_ACTIVE_MAGI, players[0]).cards, true), getZone(ZONE_TYPE_ACTIVE_MAGI, players[1]).cards, true).filter(Boolean);
            case SELECTOR_TOP_MAGI_OF_PILE: {
                var topMagi = getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
            }
            case SELECTOR_OWN_MAGI:
                return getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
            case SELECTOR_OWN_SPELLS_IN_HAND:
                return getZone(ZONE_TYPE_HAND, player).cards.filter(function (card) { return card.card.type == TYPE_SPELL; });
            case SELECTOR_ENEMY_MAGI:
                return getZone(ZONE_TYPE_ACTIVE_MAGI, getOpponent(player || 0)).cards;
            case SELECTOR_OWN_CREATURES:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && card.card.type == TYPE_CREATURE; });
            case SELECTOR_ENEMY_CREATURES:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) != player && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_OF_REGION:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_REGION) == argument && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_NOT_OF_REGION:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return _this.modifyByStaticAbilities(card, PROPERTY_REGION) != argument && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_OF_TYPE:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE; });
            case SELECTOR_CREATURES_NOT_OF_TYPE:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) { return !card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE; });
            case SELECTOR_OWN_CREATURES_OF_TYPE:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player &&
                        card.card.type == TYPE_CREATURE &&
                        card.card.name.split(' ').includes(argument);
                });
            case SELECTOR_STATUS:
                return getZone(ZONE_TYPE_IN_PLAY).cards.filter(function (card) {
                    return _this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument);
                });
            case SELECTOR_CREATURES_WITHOUT_STATUS:
                return getZone(ZONE_TYPE_IN_PLAY).cards
                    .filter(function (card) { return card.card.type == TYPE_CREATURE; })
                    .filter(function (card) { return !_this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument); });
            default:
                return [];
        }
    };
    SelectorEngine.prototype.useSelectorAny = function (selector, player, argument) {
        return this.useSelector(selector, player, argument);
    };
    // ── isCardAffectedByStaticAbility ────────────────────────────────────────
    SelectorEngine.prototype.isCardAffectedByStaticAbility = function (card, staticAbility) {
        var _a, _b, _c, _d;
        var getZone = this.context.getZone;
        switch (staticAbility.selector) {
            case SELECTOR_ID: {
                return card.id === staticAbility.selectorParameter;
            }
            case SELECTOR_SELF_AND_STATUS: {
                return !!('card' in staticAbility &&
                    staticAbility.card &&
                    card.id === staticAbility.card.id &&
                    this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter));
            }
            case SELECTOR_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    });
            }
            case SELECTOR_OWN_CREATURES: {
                return card.card.type === TYPE_CREATURE &&
                    getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_CREATURES_OF_TYPE: {
                return card.card.type === TYPE_CREATURE &&
                    getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller === staticAbility.player &&
                    card.card.name.split(' ').includes(((_a = staticAbility === null || staticAbility === void 0 ? void 0 : staticAbility.selectorParameter) === null || _a === void 0 ? void 0 : _a.toString()) || 'no matches');
            }
            case SELECTOR_CREATURES_OF_PLAYER: {
                return card.card.type === TYPE_CREATURE &&
                    getZone(ZONE_TYPE_IN_PLAY).cards.some(function (_a) {
                        var id = _a.id;
                        return id === card.id;
                    }) &&
                    card.data.controller == staticAbility.selectorParameter;
            }
            case SELECTOR_OWN_MAGI: {
                return card.card.type === TYPE_MAGI &&
                    getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
                    ((_d = ((_c = (_b = getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.id) === card.id) !== null && _d !== void 0 ? _d : false);
            }
            case SELECTOR_STATUS: {
                return !!this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter);
            }
            case SELECTOR_OWN_CREATURES_WITH_STATUS: {
                return !!this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter) &&
                    card.data.controller === staticAbility.player;
            }
            case SELECTOR_OWN_SPELLS_IN_HAND: {
                return getZone(ZONE_TYPE_HAND, staticAbility.player).cards.some(function (_a) {
                    var id = _a.id;
                    return id === card.id && card.card.type == TYPE_SPELL;
                });
            }
            default: {
                console.error("Unknown static ability selector: ".concat(staticAbility.selector));
                return false;
            }
        }
    };
    // ── modifyByStaticAbilities ──────────────────────────────────────────────
    SelectorEngine.prototype.modifyByStaticAbilities = function (target, property, subProperty) {
        var _a;
        if (subProperty === void 0) { subProperty = null; }
        if (!target) {
            return null;
        }
        var cached = this.modifiedCardDataCache.get(target.id);
        if (cached) {
            var freshData = __assign(__assign({}, cached.data), { energy: target.data.energy, attacked: target.data.attacked, actionsUsed: target.data.actionsUsed, energyLostThisTurn: target.data.energyLostThisTurn, defeatedCreature: target.data.defeatedCreature, hasAttacked: target.data.hasAttacked, wasAttacked: target.data.wasAttacked, attachedTo: target.data.attachedTo });
            // @ts-ignore
            return this.getByProperty(__assign(__assign({}, cached), { data: freshData }), property, subProperty);
        }
        var _b = this.context, getZone = _b.getZone, players = _b.players, getContinuousEffects = _b.getContinuousEffects;
        var PLAYER_ONE = players[0];
        var PLAYER_TWO = players[1];
        var gameStaticAbilities = [
            {
                name: 'Burrowed - Energy loss',
                text: 'Your burrowed creatures may not lose more than 2 energy each turn',
                selector: SELECTOR_STATUS,
                selectorParameter: STATUS_BURROWED,
                property: PROPERTY_ENERGY_LOSS_THRESHOLD,
                modifier: {
                    operator: CALCULATION_SET,
                    operandOne: 2,
                },
            },
            {
                name: 'Burrowed - Ability to attack',
                text: 'Your burrowed creatures cannot attack',
                selector: SELECTOR_STATUS,
                selectorParameter: STATUS_BURROWED,
                property: PROPERTY_ABLE_TO_ATTACK,
                modifier: {
                    operator: CALCULATION_SET,
                    operandOne: false,
                },
            },
        ];
        var allZonesCards = __spreadArray(__spreadArray(__spreadArray([], getZone(ZONE_TYPE_IN_PLAY).cards, true), getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards, true), getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards, true);
        var continuousStaticAbilities = getContinuousEffects().map(function (effect) { var _a; return ((_a = effect.staticAbilities) === null || _a === void 0 ? void 0 : _a.map(function (a) { return (__assign(__assign({}, a), { player: effect.player })); })) || []; }).flat();
        var propertyLayers = (_a = {},
            _a[PROPERTY_CONTROLLER] = 0,
            _a[PROPERTY_POWER_COST] = 1,
            _a[PROPERTY_COST] = 1,
            _a[PROPERTY_ENERGIZE] = 2,
            _a[PROPERTY_STATUS] = 3,
            _a[PROPERTY_ATTACKS_PER_TURN] = 4,
            _a[PROPERTY_CAN_ATTACK_MAGI_DIRECTLY] = 5,
            _a[PROPERTY_ENERGY_LOSS_THRESHOLD] = 6,
            _a[PROPERTY_ABLE_TO_ATTACK] = 7,
            _a[PROPERTY_PROTECTION] = 8,
            _a);
        var zoneAbilities = allZonesCards.reduce(function (acc, cardInPlay) { return cardInPlay.card.data.staticAbilities ? __spreadArray(__spreadArray([], acc, true), (cardInPlay.card.data.staticAbilities.map(function (a) { return (__assign(__assign({}, a), { player: cardInPlay.data.controller, card: cardInPlay })); })), true) : acc; }, []);
        var staticAbilities = __spreadArray(__spreadArray(__spreadArray([], gameStaticAbilities, true), zoneAbilities, true), continuousStaticAbilities, true).sort(function (a, b) { return propertyLayers[a.property] - propertyLayers[b.property]; });
        var initialCardData = {
            card: target.card,
            modifiedCard: __assign(__assign({}, target.card), { data: __assign(__assign({ protection: undefined }, target.card.data), { energyLossThreshold: 0, ableToAttack: 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true }) }),
            data: __assign({}, target.data),
            id: target.id,
            owner: target.owner,
        };
        var modifiedCardData = staticAbilities.reduce(this.layeredDataReducer.bind(this), initialCardData);
        this.modifiedCardDataCache.set(target.id, modifiedCardData);
        // @ts-ignore
        return this.getByProperty(modifiedCardData, property, subProperty);
    };
    // ── Restriction checkers ─────────────────────────────────────────────────
    SelectorEngine.prototype.makeChecker = function (restriction, restrictionValue) {
        return this.restrictionEngine.makeChecker(restriction, restrictionValue);
    };
    SelectorEngine.prototype.checkAnyCardForRestriction = function (cards, restriction, restrictionValue) {
        return this.restrictionEngine.checkAnyCardForRestriction(cards, restriction, restrictionValue);
    };
    SelectorEngine.prototype.checkAnyCardForRestrictions = function (cards, restrictions) {
        return this.restrictionEngine.checkAnyCardForRestrictions(cards, restrictions);
    };
    SelectorEngine.prototype.checkCardsForRestriction = function (cards, restriction, restrictionValue) {
        return this.restrictionEngine.checkCardsForRestriction(cards, restriction, restrictionValue);
    };
    SelectorEngine.prototype.makeCardFilter = function (restrictions) {
        if (restrictions === void 0) { restrictions = []; }
        return this.restrictionEngine.makeCardFilter(restrictions);
    };
    // ── calculateTotalCost ───────────────────────────────────────────────────
    SelectorEngine.prototype.calculateTotalCost = function (card) {
        return this.costEngine.calculateTotalCost(card);
    };
    return SelectorEngine;
}(LayeredModificationEngine));
export { SelectorEngine };
//# sourceMappingURL=SelectorEngine.js.map