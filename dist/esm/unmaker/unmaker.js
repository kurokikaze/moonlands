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
import { ACTION_PLAY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_DRAW, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_MAGI_IS_DEFEATED } from '../const.js';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE, ACTION_PLAYER_WINS, ACTION_POWER, ACTION_RESOLVE_PROMPT, TYPE_MAGI } from '../index.js';
import { UNMAKE_CALCULATION, UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_ENERGY, UNMAKE_EFFECT_TYPE_PLAYER_WINS, UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, UNMAKE_EFFECT_TYPE_START_OF_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_LOG_ENTRY, UNMAKE_POWER_ACTIVATION, UNMAKE_POWER_USE, UNMAKE_PROMPT_LEAVE, UNMAKE_PROPERTY, UNMAKE_SELECT } from './types.js';
var FLAG_WAS_ATTACKED = 1;
var FLAG_HAS_ATTACKED = 2;
var FLAG_IS_MAGI = 4;
var actionNames = {
    1: 'UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE',
    2: 'UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI',
    3: 'UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES',
    4: 'UNMAKE_RESTORE_VALUE',
    7: 'UNMAKE_EFFECT_TYPE_DIE_ROLLED',
    8: 'UNMAKE_EFFECT_TYPE_START_TURN',
    9: 'UNMAKE_EFFECT_TYPE_START_STEP',
    10: 'UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE',
    11: 'UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT',
    12: 'UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE',
    13: 'UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI',
    14: 'UNMAKE_EFFECT_TYPE_START_OF_TURN',
    15: 'UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE',
    16: 'UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE',
    17: 'UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY',
    18: 'UNMAKE_EFFECT_TYPE_MOVE_ENERGY',
    19: 'UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE',
    20: 'UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI',
    21: 'UNMAKE_EFFECT_TYPE_PROMPT_ENTERED',
    22: 'UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS',
    23: 'UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD',
    24: 'UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER',
    25: 'UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES',
    26: 'UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES',
    27: 'UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE',
    28: 'UNMAKE_CALCULATION',
    29: 'UNMAKE_SELECT',
    30: 'UNMAKE_PROPERTY',
    31: 'UNMAKE_LOG_ENTRY',
    32: 'UNMAKE_PROMPT_LEAVE',
    33: 'UNMAKE_POWER_USE',
    34: 'UNMAKE_POWER_PAY',
    36: 'UNMAKE_POWER_ACTIVATION',
    37: 'UNMAKE_EFFECT_TYPE_PLAYER_WINS'
};
var Unmaker = /** @class */ (function () {
    function Unmaker(state) {
        var _this = this;
        this.state = state;
        this.unActions = [];
        this.dataBlob = new Uint16Array(300);
        this.pointer = 0;
        this.numberOfUnActions = 0;
        this.strings = [];
        this.objects = [];
        this.historyStack = [];
        this.state.setOnAction(function (action) {
            var unAction = _this.generateUnAction(action);
            if (unAction) {
                _this.unActions.push(unAction);
            }
        }, true);
    }
    /*public setCheckpointOld() {
        this.historyStack.push(this.unActions.length)
    }*/
    Unmaker.prototype.setCheckpoint = function () {
        this.historyStack.push(this.numberOfUnActions);
    };
    Unmaker.prototype.outputDebug = function () {
        console.log("Objects storage length: ".concat(this.objects.length));
        console.log("Strings storage length: ".concat(this.strings.length));
    };
    /*public revertToCheckpointOld(state: State) {
        if (this.historyStack.length) {
            const target = this.historyStack.pop()
            if (typeof target !== 'number' || target > this.unActions.length) {
                console.error(`Target: ${target}`)
                console.error(`Actions: ${this.unActions.length}`)
                throw new Error()
            }

            const numberOfSteps = this.unActions.length - target;
            for (let i = 0; i < numberOfSteps; i++) {
                this.applyUnAction(state, this.unActions.pop()!)
            }
        }
    }*/
    Unmaker.prototype.revertToCheckpoint = function () {
        if (this.historyStack.length) {
            var target = this.historyStack.pop();
            if (typeof target !== 'number' || target > this.numberOfUnActions) {
                console.error("Target: ".concat(target));
                console.error("Actions: ".concat(this.numberOfUnActions));
                throw new Error();
            }
            var numberOfSteps = this.numberOfUnActions - target;
            for (var i = 0; i < numberOfSteps; i++) {
                this.readAndApplyUnAction(this.state);
            }
        }
    };
    Unmaker.prototype.saveNumber = function (n) {
        this.dataBlob[this.pointer] = n;
        this.pointer++;
    };
    Unmaker.prototype.saveActionType = function (t) {
        this.saveNumber(t);
        this.numberOfUnActions++;
    };
    Unmaker.prototype.readNumber = function () {
        this.pointer--;
        return this.dataBlob[this.pointer];
    };
    Unmaker.prototype.saveString = function (str) {
        var strPointer = this.strings.length;
        this.strings.push(str);
        this.saveNumber(strPointer);
    };
    Unmaker.prototype.readString = function () {
        var strPointer = this.readNumber();
        var str = this.strings[strPointer];
        if (strPointer == this.strings.length - 1) {
            this.strings.length--;
        }
        else {
            delete this.strings[strPointer];
        }
        return str;
    };
    Unmaker.prototype.saveObject = function (obj) {
        var objPointer = this.objects.length;
        this.objects.push(obj);
        this.saveNumber(objPointer);
    };
    Unmaker.prototype.readObject = function () {
        var objPointer = this.readNumber();
        var obj = this.objects[objPointer];
        if (objPointer == this.objects.length - 1) {
            this.objects.length--;
        }
        else {
            delete this.objects[objPointer];
        }
        return obj;
    };
    Unmaker.prototype.generateUnAction = function (action) {
        var _a, _b;
        switch (action.type) {
            case ACTION_RESOLVE_PROMPT: {
                this.saveNumber(this.state.state.promptPlayer);
                this.saveObject(__spreadArray([], this.state.state.savedActions, true));
                this.saveObject(this.state.state.promptParams);
                this.saveString(this.state.state.promptMessage);
                this.saveString(this.state.state.promptGeneratedBy);
                this.saveString(this.state.state.promptType);
                this.saveActionType(UNMAKE_PROMPT_LEAVE);
                return {
                    type: UNMAKE_PROMPT_LEAVE,
                    promptType: this.state.state.promptType,
                    promptGeneratedBy: this.state.state.promptGeneratedBy,
                    promptMessage: this.state.state.promptMessage,
                    promptParams: this.state.state.promptParams,
                    savedActions: __spreadArray([], this.state.state.savedActions, true),
                    player: this.state.state.promptPlayer,
                };
            }
            case ACTION_POWER: {
                this.saveString(action.power.name);
                this.saveString(action.source.id);
                this.saveNumber(action.source.owner);
                this.saveNumber(action.source.card.type == TYPE_MAGI ? 1 : 0);
                this.saveActionType(UNMAKE_POWER_ACTIVATION);
                return {
                    type: UNMAKE_POWER_ACTIVATION,
                    magi: action.source.card.type == TYPE_MAGI,
                    player: action.source.owner,
                    source: action.source.id,
                    power: action.power.name,
                };
            }
            case ACTION_PLAYER_WINS: {
                this.saveActionType(UNMAKE_EFFECT_TYPE_PLAYER_WINS);
                return {
                    type: UNMAKE_EFFECT_TYPE_PLAYER_WINS,
                };
            }
            case ACTION_PLAY: {
                this.saveActionType(UNMAKE_LOG_ENTRY);
                return {
                    type: UNMAKE_LOG_ENTRY,
                };
            }
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DRAW: {
                        this.saveActionType(UNMAKE_LOG_ENTRY);
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        };
                    }
                    case EFFECT_TYPE_CREATURE_ATTACKS: {
                        this.saveActionType(UNMAKE_LOG_ENTRY);
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        };
                    }
                    case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                        this.saveActionType(UNMAKE_LOG_ENTRY);
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        };
                    }
                    case EFFECT_TYPE_BEFORE_DAMAGE: {
                        var flags = 0;
                        if (action.target.data.wasAttacked)
                            flags = flags | FLAG_WAS_ATTACKED;
                        if (action.source.data.hasAttacked)
                            flags = flags | FLAG_HAS_ATTACKED;
                        if (action.target.card.type == TYPE_MAGI)
                            flags = flags | FLAG_IS_MAGI;
                        this.saveNumber(flags);
                        this.saveNumber(action.source.data.attacked);
                        this.saveNumber(action.target.owner);
                        this.saveString(action.target.id);
                        this.saveString(action.source.id);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE,
                            sourceId: action.source.id,
                            targetId: action.target.id,
                            targetMagi: action.target.card.type == TYPE_MAGI,
                            targetPlayer: action.target.owner,
                            sourceHasAttacked: action.source.data.hasAttacked,
                            sourceAttacked: action.source.data.attacked,
                            targetWasAttacked: action.target.data.wasAttacked,
                        };
                    }
                    case EFFECT_TYPE_EXECUTE_POWER_EFFECTS: {
                        var source = this.state.getMetaValue(action.source, action.generatedBy);
                        this.saveString(typeof action.power == 'string' ? action.power : action.power.name);
                        this.saveString(source.id);
                        this.saveNumber(source.owner);
                        this.saveNumber(source.card.type == TYPE_MAGI ? 1 : 0);
                        this.saveActionType(UNMAKE_POWER_USE);
                        return {
                            type: UNMAKE_POWER_USE,
                            magi: source.card.type == TYPE_MAGI,
                            player: source.owner,
                            source: source.id,
                            power: typeof action.power == 'string' ? action.power : action.power.name,
                        };
                    }
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        var creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        var creatureArray = [];
                        if (creatures instanceof CardInGame) {
                            creatureArray.push({
                                id: creatures.id,
                                energy: creatures.data.energy,
                                energyLostThisTurn: creatures.data.energyLostThisTurn
                            });
                        }
                        else {
                            for (var i = 0; i < creatures.length; i++) {
                                var creature = creatures[i];
                                creatureArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                    energyLostThisTurn: creature.data.energyLostThisTurn
                                });
                            }
                        }
                        this.saveObject(creatureArray);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatureArray
                        };
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        var magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        var magiArray = [];
                        if (magiTargets instanceof CardInGame) {
                            magiArray.push({
                                id: magiTargets.id,
                                owner: magiTargets.owner,
                                energy: magiTargets.data.energy,
                                energyLost: magiTargets.data.energyLostThisTurn,
                            });
                        }
                        else {
                            for (var i = 0; i < magiTargets.length; i++) {
                                var magi = magiTargets[i];
                                magiArray.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy,
                                    energyLost: magi.data.energyLostThisTurn
                                });
                            }
                        }
                        this.saveObject(magiArray);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI);
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                            magi: magiArray
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
                            this.saveObject(metaDataEntries);
                            this.saveNumber(action.bottom ? 1 : 0);
                            this.saveNumber(position);
                            this.saveString(destinationZoneType);
                            this.saveNumber(zoneChangingCard_1.owner);
                            this.saveString(sourceZoneType);
                            this.saveObject(zoneChangingCard_1);
                            this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES);
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
                            this.saveNumber(currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.roll_result);
                            this.saveString(action.generatedBy);
                            this.saveActionType(UNMAKE_EFFECT_TYPE_DIE_ROLLED);
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
                        this.saveObject(cardFlags);
                        this.saveObject(__spreadArray([], this.state.state.continuousEffects, true));
                        this.saveNumber(this.state.state.step);
                        this.saveNumber(this.state.state.activePlayer);
                        this.saveNumber(this.state.turn);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_TURN);
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
                        this.saveObject(cardFlags);
                        this.saveNumber(player_2);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_OF_TURN);
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player: player_2,
                            cardFlags: cardFlags,
                        };
                    }
                    case EFFECT_TYPE_START_STEP: {
                        this.saveNumber(this.state.state.step);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_STEP);
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
                        this.saveObject(previousOrder);
                        this.saveNumber(zoneOwner);
                        this.saveString(zone);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone: zone,
                            zoneOwner: zoneOwner,
                            previousOrder: previousOrder,
                        };
                    }
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        this.saveNumber(this.state.state.continuousEffects.length);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT);
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                            previousLength: this.state.state.continuousEffects.length,
                        };
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                        var creatures_5 = this.state.getMetaValue(action.target, action.generatedBy);
                        var creaturesArray = [];
                        if (creatures_5 instanceof CardInGame) {
                            creaturesArray.push({
                                id: creatures_5.id,
                                energy: creatures_5.data.energy,
                            });
                        }
                        else {
                            for (var i = 0; i < creatures_5.length; i++) {
                                var creature = creatures_5[i];
                                creaturesArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy
                                });
                            }
                        }
                        this.saveObject(creaturesArray);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                            creatures: creaturesArray
                        };
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                        var magiTargets_1 = this.state.getMetaValue(action.target, action.generatedBy);
                        var magiArray_1 = [];
                        if (magiTargets_1 instanceof CardInGame) {
                            magiArray_1.push({
                                id: magiTargets_1.id,
                                owner: magiTargets_1.owner,
                                energy: magiTargets_1.data.energy,
                            });
                        }
                        else {
                            for (var i = 0; i < magiTargets_1.length; i++) {
                                var magi = magiTargets_1[i];
                                magiArray_1.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy
                                });
                            }
                        }
                        this.saveObject(magiArray_1);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI);
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiArray_1
                        };
                    }
                    case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        var source = action.source;
                        this.saveNumber(source.data.defeatedCreature ? 1 : 0);
                        this.saveObject(source);
                        this.saveString(source.id);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                            sourceId: source.id,
                            source: source,
                            sourceDefeatedCreature: source.data.defeatedCreature,
                        };
                    }
                    case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY);
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
                        };
                    }
                    case EFFECT_TYPE_MOVE_ENERGY: {
                        var moveMultiSource = this.state.getMetaValue(action.source, action.generatedBy);
                        var moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                        var moveMultiTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        var moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                        this.saveString(moveSource.id);
                        this.saveNumber(moveSource.card.type == TYPE_MAGI ? 1 : 0);
                        this.saveNumber(moveSource.owner);
                        this.saveString(moveTarget.id);
                        this.saveNumber(moveTarget.card.type == TYPE_MAGI ? 1 : 0);
                        this.saveNumber(moveTarget.owner);
                        this.saveNumber(moveSource.data.energy);
                        this.saveNumber(moveSource.data.energyLostThisTurn);
                        this.saveNumber(moveTarget.data.energy);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_ENERGY);
                        return {
                            type: UNMAKE_EFFECT_TYPE_MOVE_ENERGY,
                            sourceId: moveSource.id,
                            sourceMagi: moveSource.card.type == TYPE_MAGI,
                            sourcePlayer: moveSource.owner,
                            targetId: moveTarget.id,
                            targetMagi: moveTarget.card.type == TYPE_MAGI,
                            targetPlayer: moveTarget.owner,
                            sourceEnergy: moveSource.data.energy,
                            sourceEnergyLost: moveSource.data.energyLostThisTurn,
                            targetEnergy: moveTarget.data.energy,
                        };
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                        var creature = this.state.getMetaValue(action.target, action.generatedBy);
                        this.saveNumber(creature.data.energyLostThisTurn);
                        this.saveNumber(creature.data.energy);
                        this.saveString(creature.id);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE);
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                            creatureId: creature.id,
                            energy: creature.data.energy,
                            energyLost: creature.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                        var magi = this.state.getMetaValue(action.target, action.generatedBy);
                        this.saveNumber(magi.data.energyLostThisTurn);
                        this.saveNumber(magi.data.energy);
                        this.saveNumber(magi.owner);
                        this.saveString(magi.id);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI);
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                            magiId: magi.id,
                            owner: magi.owner,
                            energy: magi.data.energy,
                            energyLost: magi.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_PROMPT_ENTERED: {
                        this.saveObject(__assign({}, this.state.state.promptParams));
                        this.saveString(this.state.state.promptGeneratedBy);
                        this.saveString(this.state.state.promptVariable);
                        this.saveString(this.state.state.promptType);
                        this.saveNumber(this.state.state.promptPlayer);
                        this.saveString(this.state.state.promptMessage);
                        this.saveNumber(this.state.state.prompt ? 1 : 0);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_PROMPT_ENTERED);
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
                        this.saveObject(currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.foundCards);
                        this.saveString(action.generatedBy);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS);
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
                        this.saveObject(__spreadArray([], deck.cards, true));
                        this.saveObject(__spreadArray([], discard.cards, true));
                        this.saveNumber(player);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD);
                        return {
                            type: UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player: player,
                            previousDeckCards: __spreadArray([], deck.cards, true),
                            previousDiscardCards: __spreadArray([], discard.cards, true),
                        };
                    }
                    case EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                        this.saveNumber(this.state.state.delayedTriggers.length);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER);
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
                        this.saveObject(creatures_6);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES);
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
                        this.saveObject(creatures_7);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES);
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
                        this.saveObject(creatures_8);
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE);
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
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable]);
                this.saveNumber(wasEmpty ? 1 : 0);
                this.saveString(action.variable || '');
                this.saveString(generatedBy);
                this.saveActionType(UNMAKE_CALCULATION);
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
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable]);
                this.saveNumber(wasEmpty ? 1 : 0);
                this.saveString(action.variable || '');
                this.saveString(generatedBy);
                this.saveActionType(UNMAKE_SELECT);
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
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable]);
                this.saveNumber(wasEmpty ? 1 : 0);
                this.saveString(action.variable || '');
                this.saveString(generatedBy);
                this.saveActionType(UNMAKE_PROPERTY);
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
    Unmaker.prototype.readAndApplyUnAction = function (state) {
        var _a, _b;
        var unAction = this.readNumber();
        switch (unAction) {
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
            case UNMAKE_LOG_ENTRY:
                state.state.log.length--;
                break;
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS:
                state.unsetWinner();
                break;
            case UNMAKE_PROMPT_LEAVE: {
                var promptType = this.readString();
                var promptGeneratedBy = this.readString();
                var promptMessage = this.readString();
                var promptParams = this.readObject();
                var savedActions = this.readObject();
                var promptPlayer = this.readNumber();
                state.state.prompt = true;
                state.state.promptType = promptType;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptPlayer = promptPlayer;
                state.state.promptMessage = promptMessage;
                state.state.promptParams = promptParams;
                state.state.savedActions = savedActions;
                state.state.log.length--;
                break;
            }
            case UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                var prompt = this.readNumber() == 1;
                var promptMessage = this.readString();
                var promptPlayer = this.readNumber();
                var promptType = this.readString();
                var promptVariable = this.readString();
                var promptGeneratedBy = this.readString();
                var promptParams = this.readObject();
                state.state.prompt = prompt;
                state.state.promptMessage = promptMessage;
                state.state.promptPlayer = promptPlayer;
                state.state.promptType = promptType;
                state.state.promptVariable = promptVariable;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptParams = promptParams;
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                var creatures = this.readObject();
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (var i = 0; i < creatures.length; i++) {
                    var _c = creatures[i], id = _c.id, energy = _c.energy;
                    var creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                var zoneChangingCard = this.readObject();
                var sourceZoneType = this.readString();
                var cardOwner = this.readNumber();
                var destinationZoneType = this.readString();
                var position = this.readNumber();
                var bottom = this.readNumber() == 1;
                var metaDataEntries = this.readObject();
                var destZone = state.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                var sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                // Remove the new card from destination zone
                if (bottom) {
                    destZone.cards.pop();
                }
                else {
                    destZone.cards.shift();
                }
                // Re-add original card at its original position in source zone
                sourceZone.cards.splice(position, 0, zoneChangingCard);
                // Restore spellMetaData fields to their previous values
                for (var _i = 0, metaDataEntries_1 = metaDataEntries; _i < metaDataEntries_1.length; _i++) {
                    var entry = metaDataEntries_1[_i];
                    // const currentMeta = state.getSpellMetadata(entry.spellId)
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
            case UNMAKE_POWER_USE: {
                var isMagi = this.readNumber() == 1;
                var owner = this.readNumber();
                var sourceId = this.readString();
                var powerName_1 = this.readString();
                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    target = zone.card;
                    if (target && target.id !== sourceId) {
                        console.error("Unmaking power use but ID doesn't match type and player: ".concat(target.id, " != ").concat(sourceId));
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(function (action) { return action != powerName_1; });
                }
                break;
            }
            case UNMAKE_POWER_ACTIVATION: {
                var isMagi = this.readNumber() == 1;
                var owner = this.readNumber();
                var sourceId = this.readString();
                var powerName_2 = this.readString();
                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    target = zone.card;
                    if (target && target.id !== sourceId) {
                        console.error("Unmaking power use but ID doesn't match type and player: ".concat(target.id, " != ").concat(sourceId));
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(function (action) { return action != powerName_2; });
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                var creatures = this.readObject();
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (var i = 0; i < creatures.length; i++) {
                    var _d = creatures[i], id = _d.id, energy = _d.energy, energyLostThisTurn = _d.energyLostThisTurn;
                    var creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                var magi = this.readObject();
                for (var _e = 0, magi_1 = magi; _e < magi_1.length; _e++) {
                    var _f = magi_1[_e], id = _f.id, owner = _f.owner, energy = _f.energy, energyLost = _f.energyLost;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                        magiCard.data.energyLostThisTurn = energyLost;
                    }
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                var generatedBy = this.readString();
                var previousRollResult = this.readNumber();
                if (previousRollResult === undefined) {
                    // Field didn't exist before, remove it
                    state.clearSpellMetaDataField('roll_result', generatedBy);
                }
                else {
                    // Restore to previous value
                    state.setSpellMetaDataField('roll_result', previousRollResult, generatedBy);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                var turn = this.readNumber();
                var activePlayer = this.readNumber();
                var step = this.readNumber();
                var continuousEffect = this.readObject();
                var cardFlags = this.readObject();
                state.turn = turn;
                state.state.activePlayer = activePlayer;
                state.state.step = step;
                state.state.continuousEffects = continuousEffect;
                // Restore card flags
                var flagEntries = Object.entries(cardFlags);
                for (var i = 0; i < flagEntries.length; i++) {
                    var _g = flagEntries[i], cardId = _g[0], flags = _g[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _h = 0, _j = state.players; _h < _j.length; _h++) {
                            var player = _j[_h];
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
            case UNMAKE_EFFECT_TYPE_START_STEP: {
                state.state.step = this.readNumber();
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                var zone_1 = this.readString();
                var owner = this.readNumber();
                var previousOrder = this.readObject();
                var zoneContent = state.getZone(zone_1, owner).cards;
                var cardsToRearrange_1 = {};
                // Build a map of the cards that need to be rearranged
                for (var i = 0; i < previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange_1[zoneContent[i].id] = zoneContent[i];
                }
                // Restore to the previous order
                var newZoneContent = __spreadArray(__spreadArray([], previousOrder.map(function (id) { return cardsToRearrange_1[id]; }), true), zoneContent.slice(previousOrder.length), true);
                state.getZone(zone_1, owner).cards = newZoneContent;
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                var sourceId = this.readString();
                var sourceCard = this.readObject();
                var defeatedCreature = this.readNumber() == 1;
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(sourceId);
                if (source) {
                    source.data.defeatedCreature = defeatedCreature;
                }
                else {
                    // Sometimes the status changes after the card is moved to the discard (on the original action card)
                    sourceCard.data.defeatedCreature = defeatedCreature;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                var effectsLength = this.readNumber();
                state.state.continuousEffects = state.state.continuousEffects.slice(0, effectsLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                var magiArray = this.readObject();
                magiArray.forEach(function (_a) {
                    var id = _a.id, owner = _a.owner, energy = _a.energy;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.length--;
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                var player = this.readNumber();
                var cardFlags = this.readObject();
                for (var _k = 0, _l = Object.entries(cardFlags); _k < _l.length; _k++) {
                    var _m = _l[_k], cardId = _m[0], flags = _m[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _o = 0, _p = state.players; _o < _p.length; _o++) {
                            var player_3 = _p[_o];
                            card = (_b = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_3)) === null || _b === void 0 ? void 0 : _b.byId(cardId);
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
            case UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                var sourceId = this.readString();
                var targetId = this.readString();
                var owner = this.readNumber();
                var attacked = this.readNumber();
                var flags = this.readNumber();
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(sourceId);
                if (source) {
                    source.data.hasAttacked = (flags & FLAG_HAS_ATTACKED) > 0;
                    source.data.attacked = attacked;
                }
                var target_1;
                if (flags & FLAG_IS_MAGI) {
                    target_1 = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner).card;
                }
                else {
                    target_1 = inPlay.byId(targetId);
                }
                if (target_1) {
                    target_1.data.wasAttacked = (flags & FLAG_WAS_ATTACKED) > 0;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                var targetEnergy = this.readNumber();
                var sourceEnergyLost = this.readNumber();
                var sourceEnergy = this.readNumber();
                var targetOwner = this.readNumber();
                var targetIsMagi = this.readNumber() == 1;
                var targetId = this.readString();
                var sourceOwner = this.readNumber();
                var sourceIsMagi = this.readNumber() == 1;
                var sourceId = this.readString();
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = void 0;
                if (sourceIsMagi) {
                    source = state.getZone(ZONE_TYPE_ACTIVE_MAGI, sourceOwner).card;
                }
                else {
                    source = inPlay.byId(sourceId);
                }
                if (source) {
                    source.data.energy = sourceEnergy;
                    source.data.energyLostThisTurn = sourceEnergyLost;
                }
                var target_2;
                if (targetIsMagi) {
                    target_2;
                }
                else {
                    target_2 = inPlay.byId(targetId);
                }
                if (target_2) {
                    target_2.data.energy = targetEnergy;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                var creatureId = this.readString();
                var energy = this.readNumber();
                var energyLost = this.readNumber();
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var creature = inPlay.byId(creatureId);
                if (creature) {
                    creature.data.energy = energy;
                    creature.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                var magiId = this.readString();
                var magiOwner = this.readNumber();
                var energy = this.readNumber();
                var energyLost = this.readNumber();
                var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, magiOwner);
                var magi = activeMagi.byId(magiId);
                if (magi) {
                    magi.data.energy = energy;
                    magi.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                var generatedBy = this.readString();
                var foundCards = this.readObject();
                state.state.log.length--;
                if (foundCards === undefined) {
                    state.clearSpellMetaDataField('foundCards', generatedBy);
                }
                else {
                    // Restore to previous value
                    state.setSpellMetaDataField('foundCards', foundCards, generatedBy);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                var player = this.readNumber();
                var discardCards = this.readObject();
                var deckCards = this.readObject();
                var deck = state.getZone(ZONE_TYPE_DECK, player);
                var discard = state.getZone(ZONE_TYPE_DISCARD, player);
                // Restore deck to its previous state
                deck.cards = __spreadArray([], deckCards, true);
                // Restore discard to its previous state
                discard.cards = __spreadArray([], discardCards, true);
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                var triggersLength = this.readNumber();
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, triggersLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                var creatures = this.readObject();
                var inPlay_1 = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_1.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                var creatures = this.readObject();
                var inPlay_2 = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_2.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                var creatures = this.readObject();
                var inPlay_3 = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(function (_a) {
                    var id = _a.id, attacked = _a.attacked;
                    var creature = inPlay_3.byId(id);
                    if (creature) {
                        creature.data.attacked = attacked;
                    }
                });
                break;
            }
            case UNMAKE_CALCULATION: {
                var generatedBy = this.readString();
                var variable = this.readString();
                var wasEmpty = this.readNumber() == 1;
                var value = this.readObject();
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_SELECT: {
                var generatedBy = this.readString();
                var variable = this.readString();
                var wasEmpty = this.readNumber() == 1;
                var value = this.readObject();
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                var generatedBy = this.readString();
                var variable = this.readString();
                var wasEmpty = this.readNumber() == 1;
                var value = this.readObject();
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
        }
        this.numberOfUnActions--;
    };
    Unmaker.prototype.applyUnAction = function (state, unaction) {
        var _a, _b;
        switch (unaction.type) {
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS: {
                state.unsetWinner();
                break;
            }
            case UNMAKE_POWER_ACTIVATION: {
                var target;
                if (unaction.magi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.player);
                    target = zone.card;
                    if (target && target.id !== unaction.source) {
                        console.error("Unmaking power use but ID doesn't match type and player: ".concat(target.id, " != ").concat(unaction.source));
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(function (action) { return action != unaction.power; });
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_POWER_USE: {
                var target;
                if (unaction.magi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.player);
                    target = zone.card;
                    if (target && target.id !== unaction.source) {
                        console.error("Unmaking power use but ID doesn't match type and player: ".concat(target.id, " != ").concat(unaction.source));
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(function (action) { return action != unaction.power; });
                }
                break;
            }
            case UNMAKE_PROMPT_LEAVE: {
                state.state.prompt = true;
                state.state.promptType = unaction.promptType;
                state.state.promptGeneratedBy = unaction.promptGeneratedBy;
                state.state.promptPlayer = unaction.player;
                state.state.promptMessage = unaction.promptMessage;
                state.state.promptParams = unaction.promptParams;
                state.state.savedActions = unaction.savedActions;
                state.state.log.length--;
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                var inPlay_4 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy, energyLostThisTurn = _a.energyLostThisTurn;
                    var creatureCard = inPlay_4.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                    state.state.log.length--;
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                for (var _i = 0, _c = unaction.magi; _i < _c.length; _i++) {
                    var _d = _c[_i], id = _d.id, owner = _d.owner, energy = _d.energy, energyLost = _d.energyLost;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                        magiCard.data.energyLostThisTurn = energyLost;
                    }
                    state.state.log.length--;
                }
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
                for (var _e = 0, _f = unaction.metaDataEntries; _e < _f.length; _e++) {
                    var entry = _f[_e];
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
                // const currentMeta = state.getSpellMetadata(unaction.spellId)
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
                state.state.activePlayer = unaction.previousActivePlayer;
                state.state.step = unaction.previousStep;
                state.state.continuousEffects = unaction.previousContinuousEffects;
                // Restore card flags
                for (var _g = 0, _h = Object.entries(unaction.cardFlags); _g < _h.length; _g++) {
                    var _j = _h[_g], cardId = _j[0], flags = _j[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _k = 0, _l = state.players; _k < _l.length; _k++) {
                            var player = _l[_k];
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
                for (var _m = 0, _o = Object.entries(unaction.cardFlags); _m < _o.length; _m++) {
                    var _p = _o[_m], cardId = _p[0], flags = _p[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _q = 0, _r = state.players; _q < _r.length; _q++) {
                            var player = _r[_q];
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
                state.state.step = unaction.previousStep;
                break;
            }
            case UNMAKE_LOG_ENTRY: {
                state.state.log.length--;
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                var zoneContent = state.getZone(unaction.zone, unaction.zoneOwner).cards;
                var cardsToRearrange_2 = {};
                // Build a map of the cards that need to be rearranged
                for (var i = 0; i < unaction.previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange_2[zoneContent[i].id] = zoneContent[i];
                }
                // Restore to the previous order
                var newZoneContent = __spreadArray(__spreadArray([], unaction.previousOrder.map(function (id) { return cardsToRearrange_2[id]; }), true), zoneContent.slice(unaction.previousOrder.length), true);
                state.getZone(unaction.zone, unaction.zoneOwner).cards = newZoneContent;
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                // Remove all continuous effects added after the captured length
                state.state.continuousEffects = state.state.continuousEffects.slice(0, unaction.previousLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                var inPlay_5 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creatureCard = inPlay_5.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                    state.state.log.length--;
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
                    state.state.log.length--;
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
                var target_3;
                if (unaction.targetMagi) {
                    target_3 = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.targetPlayer).card;
                }
                else {
                    target_3 = inPlay.byId(unaction.targetId);
                }
                if (target_3) {
                    target_3.data.wasAttacked = unaction.targetWasAttacked;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.defeatedCreature = unaction.sourceDefeatedCreature;
                }
                else {
                    // Sometimes the status changes after the card is moved to the discard (on the original action card)
                    unaction.source.data.defeatedCreature = unaction.sourceDefeatedCreature;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                state.state.log.length--;
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var source = void 0;
                if (unaction.sourceMagi) {
                    source = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.sourcePlayer).card;
                }
                else {
                    source = inPlay.byId(unaction.sourceId);
                }
                if (source) {
                    source.data.energy = unaction.sourceEnergy;
                    source.data.energyLostThisTurn = unaction.sourceEnergyLost;
                }
                var target_4 = inPlay.byId(unaction.targetId);
                if (target_4) {
                    target_4.data.energy = unaction.targetEnergy;
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
                state.state.prompt = unaction.previousPrompt;
                state.state.promptMessage = unaction.previousPromptMessage;
                state.state.promptPlayer = unaction.previousPromptPlayer;
                state.state.promptType = unaction.previousPromptType;
                state.state.promptVariable = unaction.previousPromptVariable;
                state.state.promptGeneratedBy = unaction.previousPromptGeneratedBy;
                state.state.promptParams = unaction.previousPromptParams;
                break;
            }
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                state.state.log.length--;
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
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, unaction.previousLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                var inPlay_6 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_6.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                var inPlay_7 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, energy = _a.energy;
                    var creature = inPlay_7.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                var inPlay_8 = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(function (_a) {
                    var id = _a.id, attacked = _a.attacked;
                    var creature = inPlay_8.byId(id);
                    if (creature) {
                        creature.data.attacked = attacked;
                    }
                });
                break;
            }
            case UNMAKE_SELECT: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
            case UNMAKE_CALCULATION: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
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