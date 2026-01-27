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
import CardInGame from '../classes/CardInGame.js';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE } from '../index.js';
import { UNMAKE_CALCULATION, UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_ENERGY, UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, UNMAKE_EFFECT_TYPE_START_OF_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_PROPERTY, UNMAKE_SELECT } from './types.js';
var Unmaker = /** @class */ (function () {
    function Unmaker(state) {
        var _this = this;
        this.state = state;
        this.unActions = [];
        this.historyStack = [];
        this.state.setOnAction(function (action) {
            var unAction = _this.generateUnAction(action);
            if (unAction) {
                _this.unActions.push(unAction);
            }
        }, true);
    }
    Unmaker.prototype.setCheckpoint = function () {
        this.historyStack.push(this.unActions.length);
    };
    Unmaker.prototype.revertToCheckpoint = function (state) {
        if (this.historyStack.length) {
            var target = this.historyStack.pop();
            if (typeof target !== 'number' || target > this.unActions.length) {
                console.error("Target: ".concat(target));
                console.error("Actions: ".concat(this.unActions.length));
                throw new Error();
            }
            var numberOfSteps = this.unActions.length - target;
            for (var i = 0; i < numberOfSteps; i++) {
                this.applyUnAction(state, this.unActions.pop());
            }
        }
    };
    Unmaker.prototype.generateUnAction = function (action) {
        var _a, _b;
        switch (action.type) {
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        var creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        if (creatures instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                creatures: [{
                                        id: creatures.id,
                                        energy: creatures.data.energy,
                                        energyLostThisTurn: creatures.data.energyLostThisTurn
                                    }]
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatures.map(function (creature) { return ({ id: creature.id, energy: creature.data.energy, energyLostThisTurn: creature.data.energyLostThisTurn }); })
                        };
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        var magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        if (magiTargets instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                magi: [{
                                        id: magiTargets.id,
                                        owner: magiTargets.owner,
                                        energy: magiTargets.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                            magi: magiTargets.map(function (magi) { return ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }); })
                        };
                    case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                        var zoneChangingTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        var zoneChangingCard_1 = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                        if (zoneChangingCard_1) {
                            var sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy);
                            var destinationZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy);
                            var sourceZone = this.state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard_1.owner);
                            var position = sourceZone.cards.findIndex(function (card) { return card.id === zoneChangingCard_1.id; });
                            // Capture the current spellMetaData values that will be modified
                            var metaDataEntries = [];
                            if (action.generatedBy) {
                                var generatedByMeta = this.state.getSpellMetadata(action.generatedBy);
                                metaDataEntries.push({
                                    spellId: action.generatedBy,
                                    field: 'new_card',
                                    previousValue: generatedByMeta === null || generatedByMeta === void 0 ? void 0 : generatedByMeta.new_card,
                                });
                            }
                            var cardIdMeta = this.state.getSpellMetadata(zoneChangingCard_1.id);
                            metaDataEntries.push({
                                spellId: zoneChangingCard_1.id,
                                field: 'new_card',
                                previousValue: cardIdMeta === null || cardIdMeta === void 0 ? void 0 : cardIdMeta.new_card,
                            });
                            return {
                                type: UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                card: zoneChangingCard_1,
                                sourceZone: sourceZoneType,
                                sourceZoneOwner: zoneChangingCard_1.owner,
                                destinationZone: destinationZoneType,
                                position: position,
                                bottom: action.bottom || false,
                                metaDataEntries: metaDataEntries,
                            };
                        }
                    }
                    case EFFECT_TYPE_DIE_ROLLED: {
                        if (action.generatedBy) {
                            var currentMeta = this.state.getSpellMetadata(action.generatedBy);
                            return {
                                type: UNMAKE_EFFECT_TYPE_DIE_ROLLED,
                                spellId: action.generatedBy,
                                previousRollResult: currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.roll_result,
                            };
                        }
                    }
                    case EFFECT_TYPE_START_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        var cardFlags = {};
                        var player_1 = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        var creatures_3 = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(function (card) { return card.card.type === TYPE_CREATURE && card.data.controller === player_1; });
                        for (var _i = 0, creatures_1 = creatures_3; _i < creatures_1.length; _i++) {
                            var creature = creatures_1[_i];
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: __spreadArray([], creature.data.actionsUsed, true),
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            };
                        }
                        // Capture relic flags (relics controlled by the player)
                        var relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(function (card) { return card.card.type === TYPE_RELIC && card.data.controller === player_1; });
                        for (var _c = 0, relics_1 = relics; _c < relics_1.length; _c++) {
                            var relic = relics_1[_c];
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: __spreadArray([], relic.data.actionsUsed, true),
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            };
                        }
                        // Capture magi flags
                        var activeMagi = (_a = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_1)) === null || _a === void 0 ? void 0 : _a.card;
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: __spreadArray([], activeMagi.data.actionsUsed, true),
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_TURN,
                            previousTurn: this.state.turn,
                            previousActivePlayer: this.state.state.activePlayer,
                            previousStep: this.state.state.step,
                            previousContinuousEffects: __spreadArray([], this.state.state.continuousEffects, true),
                            cardFlags: cardFlags,
                        };
                    }
                    case EFFECT_TYPE_START_OF_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        var cardFlags = {};
                        var player_2 = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        var creatures_4 = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(function (card) { return card.card.type === TYPE_CREATURE && card.data.controller === player_2; });
                        for (var _d = 0, creatures_2 = creatures_4; _d < creatures_2.length; _d++) {
                            var creature = creatures_2[_d];
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: __spreadArray([], creature.data.actionsUsed, true),
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            };
                        }
                        // Capture relic flags (relics controlled by the player)
                        var relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(function (card) { return card.card.type === TYPE_RELIC && card.data.controller === player_2; });
                        for (var _e = 0, relics_2 = relics; _e < relics_2.length; _e++) {
                            var relic = relics_2[_e];
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: __spreadArray([], relic.data.actionsUsed, true),
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            };
                        }
                        // Capture magi flags
                        var activeMagi = (_b = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_2)) === null || _b === void 0 ? void 0 : _b.card;
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: __spreadArray([], activeMagi.data.actionsUsed, true),
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player: player_2,
                            cardFlags: cardFlags,
                        };
                    }
                    case EFFECT_TYPE_START_STEP: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_STEP,
                            previousStep: this.state.state.step,
                        };
                    }
                    case EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                        var zone = this.state.getMetaValue(action.zone, action.generatedBy);
                        var zoneOwner = this.state.getMetaValue(action.zoneOwner, action.generatedBy);
                        var zoneContent = this.state.getZone(zone, zoneOwner).cards;
                        var cardsOrder = this.state.getMetaValue(action.cards, action.generatedBy);
                        // Capture the original order of the cards that will be rearranged
                        var previousOrder = [];
                        for (var i = 0; i < cardsOrder.length && i < zoneContent.length; i++) {
                            previousOrder.push(zoneContent[i].id);
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone: zone,
                            zoneOwner: zoneOwner,
                            previousOrder: previousOrder,
                        };
                    }
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                            previousLength: this.state.state.continuousEffects.length,
                        };
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                        var creatures_5 = this.state.getMetaValue(action.target, action.generatedBy);
                        if (creatures_5 instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                creatures: [{
                                        id: creatures_5.id,
                                        energy: creatures_5.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                            creatures: creatures_5.map(function (creature) { return ({ id: creature.id, energy: creature.data.energy }); })
                        };
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                        var magiTargets_1 = this.state.getMetaValue(action.target, action.generatedBy);
                        if (magiTargets_1 instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                magi: [{
                                        id: magiTargets_1.id,
                                        owner: magiTargets_1.owner,
                                        energy: magiTargets_1.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiTargets_1.map(function (magi) { return ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }); })
                        };
                    }
                    case EFFECT_TYPE_BEFORE_DAMAGE: {
                        var source = action.source;
                        var target = action.target;
                        return {
                            type: UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE,
                            sourceId: source.id,
                            sourceHasAttacked: source.data.hasAttacked,
                            sourceAttacked: source.data.attacked,
                            targetId: target.id,
                            targetWasAttacked: target.data.wasAttacked,
                        };
                    }
                    case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        var source = action.source;
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                            sourceId: source.id,
                            sourceDefeatedCreature: source.data.defeatedCreature,
                        };
                    }
                    case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
                        };
                    }
                    case EFFECT_TYPE_MOVE_ENERGY: {
                        var source = this.state.getMetaValue(action.source, action.generatedBy);
                        var target = this.state.getMetaValue(action.target, action.generatedBy);
                        return {
                            type: UNMAKE_EFFECT_TYPE_MOVE_ENERGY,
                            sourceId: source.id,
                            targetId: target.id,
                            sourceEnergy: source.data.energy,
                            sourceEnergyLost: source.data.energyLostThisTurn,
                            targetEnergy: target.data.energy,
                        };
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                        var creature = this.state.getMetaValue(action.target, action.generatedBy);
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                            creatureId: creature.id,
                            energy: creature.data.energy,
                            energyLost: creature.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                        var magi = this.state.getMetaValue(action.target, action.generatedBy);
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                            magiId: magi.id,
                            owner: magi.owner,
                            energy: magi.data.energy,
                            energyLost: magi.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_PROMPT_ENTERED: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_PROMPT_ENTERED,
                            previousPrompt: this.state.state.prompt,
                            previousPromptMessage: this.state.state.promptMessage,
                            previousPromptPlayer: this.state.state.promptPlayer,
                            previousPromptType: this.state.state.promptType,
                            previousPromptVariable: this.state.state.promptVariable,
                            previousPromptGeneratedBy: this.state.state.promptGeneratedBy,
                            previousPromptParams: __assign({}, this.state.state.promptParams),
                        };
                    }
                    case EFFECT_TYPE_FIND_STARTING_CARDS: {
                        var currentMeta = this.state.getSpellMetadata(action.generatedBy);
                        return {
                            type: UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS,
                            spellId: action.generatedBy,
                            previousFoundCards: currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.foundCards,
                        };
                    }
                    case EFFECT_TYPE_RESHUFFLE_DISCARD: {
                        var player = this.state.getMetaValue(action.player, action.generatedBy);
                        var deck = this.state.getZone(ZONE_TYPE_DECK, player);
                        var discard = this.state.getZone(ZONE_TYPE_DISCARD, player);
                        return {
                            type: UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player: player,
                            previousDeckCards: __spreadArray([], deck.cards, true),
                            previousDiscardCards: __spreadArray([], discard.cards, true),
                        };
                    }
                    case EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER,
                            previousLength: this.state.state.delayedTriggers.length,
                        };
                    }
                    case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                        var energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        var affectedCreatureIds = Object.keys(energyArrangement);
                        var inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY);
                        var creatures_6 = [];
                        for (var _f = 0, affectedCreatureIds_1 = affectedCreatureIds; _f < affectedCreatureIds_1.length; _f++) {
                            var creatureId = affectedCreatureIds_1[_f];
                            var creature = inPlay.byId(creatureId);
                            if (creature) {
                                creatures_6.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                });
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                            creatures: creatures_6,
                        };
                    }
                    case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                        var energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        var affectedCreatureIds = Object.keys(energyArrangement);
                        var inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY);
                        var creatures_7 = [];
                        for (var _g = 0, affectedCreatureIds_2 = affectedCreatureIds; _g < affectedCreatureIds_2.length; _g++) {
                            var creatureId = affectedCreatureIds_2[_g];
                            var creature = inPlay.byId(creatureId);
                            if (creature) {
                                creatures_7.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                });
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                            creatures: creatures_7,
                        };
                    }
                    case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                        var targets = this.state.getMetaValue(action.target, action.generatedBy);
                        var creatures_8 = [];
                        if (targets instanceof CardInGame) {
                            creatures_8.push({
                                id: targets.id,
                                attacked: targets.data.attacked,
                            });
                        }
                        else if (targets instanceof Array) {
                            for (var _h = 0, targets_1 = targets; _h < targets_1.length; _h++) {
                                var target = targets_1[_h];
                                creatures_8.push({
                                    id: target.id,
                                    attacked: target.data.attacked,
                                });
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                            creatures: creatures_8,
                        };
                    }
                }
                break;
            }
            case ACTION_CALCULATE: {
                var generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                var previousMetadata = this.state.state.spellMetaData[generatedBy];
                var wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: UNMAKE_CALCULATION,
                    generatedBy: generatedBy,
                    variable: action.variable || '',
                    wasEmpty: wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case ACTION_SELECT: {
                var generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                var previousMetadata = this.state.state.spellMetaData[generatedBy];
                var wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: UNMAKE_SELECT,
                    generatedBy: generatedBy,
                    variable: action.variable || '',
                    wasEmpty: wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case ACTION_GET_PROPERTY_VALUE: {
                var generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                var previousMetadata = this.state.state.spellMetaData[generatedBy];
                var wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: UNMAKE_PROPERTY,
                    generatedBy: generatedBy,
                    variable: action.variable || '',
                    wasEmpty: wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
        }
    };
    Unmaker.prototype.applyUnAction = function (state, unaction) {
        var _a, _b;
        switch (unaction.type) {
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                var inPlay_1 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy, energyLostThisTurn = _a.energyLostThisTurn;
                    var creatureCard = inPlay_1.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                unaction.magi.forEach(function (_a) {
                    var id = _a.id, owner = _a.owner, energy = _a.energy;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                var destZone = state.getZone(unaction.destinationZone, unaction.destinationZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
                var sourceZone = state.getZone(unaction.sourceZone, unaction.sourceZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
                // Remove the new card from destination zone
                if (unaction.bottom) {
                    destZone.cards.pop();
                }
                else {
                    destZone.cards.shift();
                }
                // Re-add original card at its original position in source zone
                sourceZone.cards.splice(unaction.position, 0, unaction.card);
                // Restore spellMetaData fields to their previous values
                for (var _i = 0, _c = unaction.metaDataEntries; _i < _c.length; _i++) {
                    var entry = _c[_i];
                    var currentMeta = state.getSpellMetadata(entry.spellId);
                    if (entry.previousValue === undefined) {
                        // Field didn't exist before, remove it
                        state.clearSpellMetaDataField(entry.field, entry.spellId);
                    }
                    else {
                        // Restore to previous value
                        state.setSpellMetaDataField(entry.field, entry.previousValue, entry.spellId);
                    }
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                var currentMeta = state.getSpellMetadata(unaction.spellId);
                if (unaction.previousRollResult === undefined) {
                    // Field didn't exist before, remove it
                    state.clearSpellMetaDataField('roll_result', unaction.spellId);
                }
                else {
                    // Restore to previous value
                    state.setSpellMetaDataField('roll_result', unaction.previousRollResult, unaction.spellId);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                state.turn = unaction.previousTurn;
                state.state = __assign(__assign({}, state.state), { activePlayer: unaction.previousActivePlayer, step: unaction.previousStep, continuousEffects: unaction.previousContinuousEffects });
                // Restore card flags
                for (var _d = 0, _e = Object.entries(unaction.cardFlags); _d < _e.length; _d++) {
                    var _f = _e[_d], cardId = _f[0], flags = _f[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _g = 0, _h = state.players; _g < _h.length; _g++) {
                            var player = _h[_g];
                            card = (_a = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _a === void 0 ? void 0 : _a.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = __spreadArray([], flags.actionsUsed, true);
                        card.data.wasAttacked = flags.wasAttacked;
                        card.data.hasAttacked = flags.hasAttacked;
                        card.data.attacked = flags.attacked;
                        card.data.defeatedCreature = flags.defeatedCreature;
                        card.data.energyLostThisTurn = flags.energyLostThisTurn;
                    }
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                // Restore card flags
                for (var _j = 0, _k = Object.entries(unaction.cardFlags); _j < _k.length; _j++) {
                    var _l = _k[_j], cardId = _l[0], flags = _l[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _m = 0, _o = state.players; _m < _o.length; _m++) {
                            var player = _o[_m];
                            card = (_b = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _b === void 0 ? void 0 : _b.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = __spreadArray([], flags.actionsUsed, true);
                        card.data.wasAttacked = flags.wasAttacked;
                        card.data.hasAttacked = flags.hasAttacked;
                        card.data.attacked = flags.attacked;
                        card.data.defeatedCreature = flags.defeatedCreature;
                        card.data.energyLostThisTurn = flags.energyLostThisTurn;
                    }
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_STEP: {
                state.state = __assign(__assign({}, state.state), { step: unaction.previousStep });
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                var zoneContent = state.getZone(unaction.zone, unaction.zoneOwner).cards;
                var cardsToRearrange_1 = {};
                // Build a map of the cards that need to be rearranged
                for (var i = 0; i < unaction.previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange_1[zoneContent[i].id] = zoneContent[i];
                }
                // Restore to the previous order
                var newZoneContent = __spreadArray(__spreadArray([], unaction.previousOrder.map(function (id) { return cardsToRearrange_1[id]; }), true), zoneContent.slice(unaction.previousOrder.length), true);
                state.getZone(unaction.zone, unaction.zoneOwner).cards = newZoneContent;
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                // Remove all continuous effects added after the captured length
                state.state = __assign(__assign({}, state.state), { continuousEffects: state.state.continuousEffects.slice(0, unaction.previousLength) });
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                var inPlay_2 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creatureCard = inPlay_2.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                unaction.magi.forEach(function (_a) {
                    var id = _a.id, owner = _a.owner, energy = _a.energy;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.hasAttacked = unaction.sourceHasAttacked;
                    source.data.attacked = unaction.sourceAttacked;
                }
                var target = inPlay.byId(unaction.targetId);
                if (target) {
                    target.data.wasAttacked = unaction.targetWasAttacked;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.defeatedCreature = unaction.sourceDefeatedCreature;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                state.state.log.pop();
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.energy = unaction.sourceEnergy;
                    source.data.energyLostThisTurn = unaction.sourceEnergyLost;
                }
                var target = inPlay.byId(unaction.targetId);
                if (target) {
                    target.data.energy = unaction.targetEnergy;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var creature = inPlay.byId(unaction.creatureId);
                if (creature) {
                    creature.data.energy = unaction.energy;
                    creature.data.energyLostThisTurn = unaction.energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.owner);
                var magi = activeMagi.byId(unaction.magiId);
                if (magi) {
                    magi.data.energy = unaction.energy;
                    magi.data.energyLostThisTurn = unaction.energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                state.state = __assign(__assign({}, state.state), { prompt: unaction.previousPrompt, promptMessage: unaction.previousPromptMessage, promptPlayer: unaction.previousPromptPlayer, promptType: unaction.previousPromptType, promptVariable: unaction.previousPromptVariable, promptGeneratedBy: unaction.previousPromptGeneratedBy, promptParams: unaction.previousPromptParams });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                state.state.log.pop();
                if (unaction.previousFoundCards === undefined) {
                    state.clearSpellMetaDataField('foundCards', unaction.spellId);
                }
                else {
                    // Restore to previous value
                    state.setSpellMetaDataField('foundCards', unaction.previousFoundCards, unaction.spellId);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                var deck = state.getZone(ZONE_TYPE_DECK, unaction.player);
                var discard = state.getZone(ZONE_TYPE_DISCARD, unaction.player);
                // Restore deck to its previous state
                deck.cards = __spreadArray([], unaction.previousDeckCards, true);
                // Restore discard to its previous state
                discard.cards = __spreadArray([], unaction.previousDiscardCards, true);
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                // Remove all delayed triggers added after the captured length
                state.state = __assign(__assign({}, state.state), { delayedTriggers: state.state.delayedTriggers.slice(0, unaction.previousLength) });
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                var inPlay_3 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_3.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                var inPlay_4 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_4.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                var inPlay_5 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, attacked = _a.attacked;
                    var creature = inPlay_5.byId(id);
                    if (creature) {
                        creature.data.attacked = attacked;
                    }
                });
                break;
            }
            case UNMAKE_SELECT: {
                console.log("Unmake select");
                if (unaction.wasEmpty) {
                    console.log("Value ".concat(unaction.variable, " was empty, resetting"));
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    console.log("Value ".concat(unaction.variable, " was set, restoring"));
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
        }
    };
    return Unmaker;
}());
export { Unmaker };
//# sourceMappingURL=unmaker.js.map