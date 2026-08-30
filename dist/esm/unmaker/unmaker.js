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
import { ACTION_PLAY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_DRAW, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_ATTACH_CARD_TO_CARD } from '../const.js';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE, ACTION_PLAYER_WINS, ACTION_POWER, ACTION_RESOLVE_PROMPT, TYPE_MAGI, DEFAULT_PROMPT_VARIABLE } from '../index.js';
import { UNMAKE_CALCULATION, UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_ENERGY, UNMAKE_EFFECT_TYPE_PLAYER_WINS, UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, UNMAKE_EFFECT_TYPE_START_OF_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_LOG_ENTRY, UNMAKE_POWER_ACTIVATION, UNMAKE_POWER_USE, UNMAKE_PROMPT_LEAVE, UNMAKE_PROPERTY, UNMAKE_SELECT, UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD } from './types.js';
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
    37: 'UNMAKE_EFFECT_TYPE_PLAYER_WINS',
    38: 'UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES',
};
var Unmaker = /** @class */ (function () {
    function Unmaker(state, blobSize) {
        var _this = this;
        this.state = state;
        this.unActions = [];
        this.blobSize = 50000;
        this.dataBlob = new Uint16Array(this.blobSize);
        this.pointer = 0;
        this.numberOfUnActions = 0;
        this.strings = [];
        this.objects = [];
        this.historyStack = [];
        this.prngCheckpoints = [];
        this.actionsUsedCheckpoints = [];
        this.dataTags = [];
        if (blobSize) {
            this.blobSize = blobSize;
            this.dataBlob = new Uint16Array(this.blobSize);
        }
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
        // Snapshot PRNG state so die rolls can be fully reversed
        var twister = this.state.twister;
        this.prngCheckpoints.push(twister ? { mt: __spreadArray([], twister.mt, true), mti: twister.mti } : null);
        // Snapshot actionsUsed for every in-play card and each active magi
        var snapshot = {};
        for (var _i = 0, _a = this.state.getZone(ZONE_TYPE_IN_PLAY).cards; _i < _a.length; _i++) {
            var card = _a[_i];
            snapshot[card.id] = __spreadArray([], card.data.actionsUsed, true);
        }
        for (var _b = 0, _c = this.state.players; _b < _c.length; _b++) {
            var player = _c[_b];
            var magi = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            if (magi) {
                snapshot[magi.id] = __spreadArray([], magi.data.actionsUsed, true);
            }
        }
        this.actionsUsedCheckpoints.push(snapshot);
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
    Unmaker.prototype.getPointer = function () {
        return this.pointer;
    };
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
            // Restore PRNG state to the checkpoint position
            var prngState = this.prngCheckpoints.pop();
            var twister = this.state.twister;
            if (prngState && twister) {
                twister.mt = __spreadArray([], prngState.mt, true);
                twister.mti = prngState.mti;
            }
            // Restore actionsUsed for all in-play cards and active magi
            /*const actionsUsedSnapshot = this.actionsUsedCheckpoints.pop()
            if (actionsUsedSnapshot) {
                for (const card of this.state.getZone(ZONE_TYPE_IN_PLAY).cards) {
                    card.data.actionsUsed = [...(actionsUsedSnapshot[card.id] ?? [])]
                }
                for (const player of this.state.players) {
                    const magi = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card
                    if (magi) {
                        magi.data.actionsUsed = [...(actionsUsedSnapshot[magi.id] ?? [])]
                    }
                }
            }*/
        }
    };
    Unmaker.prototype.saveNumber = function (n, tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error("Data blob overflow: pointer ".concat(this.pointer, " exceeds blob size ").concat(this.blobSize));
        }
        this.dataBlob[this.pointer] = n;
        this.dataTags.push(tag);
        this.pointer++;
    };
    Unmaker.prototype.saveActionType = function (t, _tag) {
        this.saveNumber(t, "UnActionType");
        this.numberOfUnActions++;
    };
    Unmaker.prototype.readNumber = function (expectedTag) {
        var tag = this.dataTags.pop();
        if (tag != expectedTag) {
            throw new Error("Expected tag ".concat(expectedTag, " but found ").concat(tag));
        }
        this.pointer--;
        return this.dataBlob[this.pointer];
    };
    Unmaker.prototype.saveString = function (str, tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error("Data blob overflow: pointer ".concat(this.pointer, " exceeds blob size ").concat(this.blobSize));
        }
        this.dataTags.push(tag);
        var strPointer = this.strings.length;
        this.strings.push(str);
    };
    Unmaker.prototype.readString = function (expectedTag) {
        var tag = this.dataTags.pop();
        if (tag != expectedTag) {
            throw new Error("Expected tag ".concat(expectedTag, " but found ").concat(tag));
        }
        var str = this.strings.pop();
        return str || '';
    };
    Unmaker.prototype.saveObject = function (obj, tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error("Data blob overflow: pointer ".concat(this.pointer, " exceeds blob size ").concat(this.blobSize));
        }
        var objPointer = this.objects.length;
        this.objects.push(obj);
    };
    Unmaker.prototype.readObject = function (expectedTag) {
        var obj = this.objects.pop();
        return obj;
    };
    Unmaker.prototype.hasSpace = function () {
        return this.pointer < this.blobSize - 10;
    };
    Unmaker.prototype.generateUnAction = function (action) {
        var _this = this;
        var _a, _b, _c;
        switch (action.type) {
            case ACTION_RESOLVE_PROMPT: {
                var logCount = this.state.logEngine.shouldCreateLog(action).length;
                var generatedBy = this.state.state.promptGeneratedBy;
                var variable = this.state.state.promptVariable || DEFAULT_PROMPT_VARIABLE[this.state.state.promptType] || 'promptResult';
                var oldMetaData = this.state.getSpellMetadata(generatedBy)[variable];
                this.saveObject(oldMetaData, 'promptOldMetaData');
                this.saveNumber(this.state.state.promptPlayer, 'promptPlayer');
                this.saveObject(__spreadArray([], this.state.state.savedActions, true), 'savedActions');
                this.saveObject(this.state.state.promptParams, 'promptParams');
                this.saveString(this.state.state.promptMessage, 'promptMessage');
                this.saveString(generatedBy, 'promptGeneratedBy');
                this.saveString(this.state.state.promptType, 'promptType');
                this.saveNumber(logCount, 'logCount');
                this.saveActionType(UNMAKE_PROMPT_LEAVE, 'ACTION_RESOLVE_PROMPT');
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
                var logCount = this.state.logEngine.shouldCreateLog(action).length;
                var sourceId = action.source.id;
                var oldMetaData = this.state.getSpellMetadata(sourceId);
                this.saveObject(oldMetaData.sourcePlayer, 'POWER_ACTIVATION/oldMetaDataSourcePlayer');
                this.saveObject(oldMetaData.sourcePower, 'POWER_ACTIVATION/oldMetaDataSourcePower');
                this.saveObject(oldMetaData.sourceCreature, 'POWER_ACTIVATION/oldMetaDataSourceCreature');
                this.saveObject(oldMetaData.source, 'POWER_ACTIVATION/oldMetaDataSource');
                this.saveString(action.power.name, 'POWER_ACTIVATION/powerName');
                this.saveString(action.source.id, 'POWER_ACTIVATION/sourceId');
                this.saveNumber(action.source.owner, 'POWER_ACTIVATION/sourceOwner');
                this.saveNumber(action.source.card.type == TYPE_MAGI ? 1 : 0, 'POWER_ACTIVATION/isMagi');
                this.saveNumber(logCount, 'POWER_ACTIVATION/logCount');
                this.saveActionType(UNMAKE_POWER_ACTIVATION, 'ACTION_POWER');
                return {
                    type: UNMAKE_POWER_ACTIVATION,
                    magi: action.source.card.type == TYPE_MAGI,
                    player: action.source.owner,
                    source: action.source.id,
                    power: action.power.name,
                };
            }
            case ACTION_PLAYER_WINS: {
                this.saveActionType(UNMAKE_EFFECT_TYPE_PLAYER_WINS, 'ACTION_PLAYER_WINS');
                return {
                    type: UNMAKE_EFFECT_TYPE_PLAYER_WINS,
                };
            }
            case ACTION_PLAY: {
                this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                this.saveActionType(UNMAKE_LOG_ENTRY, 'ACTION_PLAY');
                return {
                    type: UNMAKE_LOG_ENTRY,
                };
            }
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DRAW: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_LOG_ENTRY, 'EFFECT_TYPE_DRAW');
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        };
                    }
                    case EFFECT_TYPE_CREATURE_ATTACKS: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_LOG_ENTRY, 'EFFECT_TYPE_CREATURE_ATTACKS');
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        };
                    }
                    case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_LOG_ENTRY, 'EFFECT_TYPE_MAGI_IS_DEFEATED');
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
                        this.saveNumber(flags, 'EFFECT_TYPE_BEFORE_DAMAGE/flags');
                        this.saveNumber(action.source.data.attacked, 'EFFECT_TYPE_BEFORE_DAMAGE/sourceAttacked');
                        this.saveNumber(action.target.owner, 'EFFECT_TYPE_BEFORE_DAMAGE/targetPlayer');
                        this.saveString(action.target.id, 'EFFECT_TYPE_BEFORE_DAMAGE/targetId');
                        this.saveString(action.source.id, 'EFFECT_TYPE_BEFORE_DAMAGE/sourceId');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, 'EFFECT_TYPE_BEFORE_DAMAGE');
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
                        var sourceObject = this.state.getMetaValue(action.source, action.generatedBy);
                        this.saveString(typeof action.power == 'string' ? action.power : action.power.name, 'POWER_USE/power');
                        this.saveString(source.id, 'POWER_USE/sourceId');
                        this.saveNumber(source.owner, 'POWER_USE/sourcePlayer');
                        this.saveNumber(source.card.type == TYPE_MAGI ? 1 : 0, 'POWER_USE/isMagi');
                        this.saveActionType(UNMAKE_POWER_USE, 'POWER_USE');
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
                        else if (creatures instanceof Array) {
                            for (var i = 0; i < creatures.length; i++) {
                                var creature = creatures[i];
                                creatureArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                    energyLostThisTurn: creature.data.energyLostThisTurn
                                });
                            }
                        }
                        this.saveObject(creatureArray, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/creatures');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/logCount');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE');
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
                        else if (magiTargets instanceof Array) {
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
                        this.saveObject(magiArray, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/magi');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/logCount');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI');
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
                            // Uint16Array cannot represent -1; encode "not found" as 0 and real indices as index + 1.
                            var encodedPosition = position + 1;
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
                            this.saveObject(metaDataEntries, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/metaDataEntries');
                            this.saveNumber(action.bottom ? 1 : 0, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/bottom');
                            this.saveNumber(encodedPosition, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/position');
                            this.saveString(destinationZoneType, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/destinationZoneType');
                            this.saveNumber(zoneChangingCard_1.owner, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/cardOwner');
                            this.saveString(sourceZoneType, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/sourceZoneType');
                            this.saveObject(zoneChangingCard_1, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/zoneChangingCard');
                            this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
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
                        break;
                    }
                    case EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                        var targets = this.state.getMetaValue(action.target, action.generatedBy) || [];
                        if (!targets || targets.length === 0)
                            return undefined;
                        var sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy);
                        var destZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy);
                        var zoneOwner = targets[0].owner;
                        var sourceZone_1 = this.state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                        var cardsWithPositions = targets.map(function (card) { return ({
                            card: card,
                            position: sourceZone_1.cards.findIndex(function (c) { return c.id === card.id; }),
                        }); });
                        var metaDataEntries = targets.map(function (card) {
                            var _a;
                            return ({
                                spellId: card.id,
                                field: 'new_card',
                                previousValue: (_a = _this.state.getSpellMetadata(card.id)) === null || _a === void 0 ? void 0 : _a.new_card,
                            });
                        });
                        metaDataEntries.push({
                            spellId: action.generatedBy,
                            field: 'new_cards',
                            previousValue: (_a = this.state.getSpellMetadata(action.generatedBy)) === null || _a === void 0 ? void 0 : _a.new_cards,
                        });
                        this.saveObject(metaDataEntries, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/metaDataEntries');
                        this.saveNumber(action.bottom ? 1 : 0, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/bottom');
                        this.saveString(destZoneType, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/destZoneType');
                        this.saveNumber(zoneOwner, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/zoneOwner');
                        this.saveString(sourceZoneType, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/sourceZoneType');
                        this.saveObject(cardsWithPositions, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/cardsWithPositions');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, 'EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES');
                        return {
                            type: UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
                            cards: cardsWithPositions,
                            sourceZone: sourceZoneType,
                            zoneOwner: zoneOwner,
                            destinationZone: destZoneType,
                            bottom: action.bottom || false,
                            metaDataEntries: metaDataEntries,
                        };
                    }
                    case EFFECT_TYPE_DIE_ROLLED: {
                        if (action.generatedBy) {
                            var currentMeta = this.state.getSpellMetadata(action.generatedBy);
                            this.saveNumber(currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.roll_result, 'EFFECT_TYPE_DIE_ROLLED/rollResult');
                            this.saveString(action.generatedBy, 'EFFECT_TYPE_DIE_ROLLED/spellId');
                            this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_DIE_ROLLED/logCount');
                            this.saveActionType(UNMAKE_EFFECT_TYPE_DIE_ROLLED, 'EFFECT_TYPE_DIE_ROLLED');
                            return {
                                type: UNMAKE_EFFECT_TYPE_DIE_ROLLED,
                                spellId: action.generatedBy,
                                previousRollResult: currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.roll_result,
                            };
                        }
                        break;
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
                        for (var _d = 0, relics_1 = relics; _d < relics_1.length; _d++) {
                            var relic = relics_1[_d];
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
                        var activeMagi = (_b = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_1)) === null || _b === void 0 ? void 0 : _b.card;
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
                        this.saveObject(cardFlags, 'EFFECT_TYPE_START_TURN/cardFlags');
                        this.saveObject(__spreadArray([], this.state.state.continuousEffects, true), 'EFFECT_TYPE_START_TURN/continuousEffects');
                        this.saveNumber(this.state.state.step, 'EFFECT_TYPE_START_TURN/step');
                        this.saveNumber(this.state.state.controllingPlayer, 'EFFECT_TYPE_START_TURN/controllingPlayer');
                        this.saveNumber(this.state.state.activePlayer, 'EFFECT_TYPE_START_TURN/activePlayer');
                        this.saveNumber(this.state.turn, 'EFFECT_TYPE_START_TURN/turn');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_TURN, 'EFFECT_TYPE_START_TURN');
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_TURN,
                            previousTurn: this.state.turn,
                            previousActivePlayer: this.state.state.activePlayer,
                            previousControllingPlayer: this.state.state.controllingPlayer,
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
                        for (var _e = 0, creatures_2 = creatures_4; _e < creatures_2.length; _e++) {
                            var creature = creatures_2[_e];
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
                        for (var _f = 0, relics_2 = relics; _f < relics_2.length; _f++) {
                            var relic = relics_2[_f];
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
                        var activeMagi = (_c = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_2)) === null || _c === void 0 ? void 0 : _c.card;
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
                        this.saveObject(cardFlags, 'EFFECT_TYPE_START_TURN/cardFlags');
                        this.saveNumber(player_2, 'EFFECT_TYPE_START_TURN/player');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_OF_TURN, 'EFFECT_TYPE_START_TURN');
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player: player_2,
                            cardFlags: cardFlags,
                        };
                    }
                    case EFFECT_TYPE_START_STEP: {
                        this.saveNumber(this.state.state.step, 'EFFECT_TYPE_START_STEP/step');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_STEP, 'EFFECT_TYPE_START_STEP');
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
                        if (!cardsOrder)
                            return undefined;
                        // Capture the original order of the cards that will be rearranged
                        var previousOrder = [];
                        for (var i = 0; i < cardsOrder.length && i < zoneContent.length; i++) {
                            previousOrder.push(zoneContent[i].id);
                        }
                        this.saveObject(previousOrder, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/previousOrder');
                        this.saveNumber(zoneOwner, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zoneOwner');
                        this.saveString(zone, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zone');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone: zone,
                            zoneOwner: zoneOwner,
                            previousOrder: previousOrder,
                        };
                    }
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        this.saveNumber(this.state.state.continuousEffects.length, 'EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT/effectsLength');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, 'EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT');
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
                        else if (creatures_5 instanceof Array) {
                            for (var i = 0; i < creatures_5.length; i++) {
                                var creature = creatures_5[i];
                                creaturesArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy
                                });
                            }
                        }
                        this.saveObject(creaturesArray, 'EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/creatures');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/logLength');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, 'EFFECT_TYPE_ADD_ENERGY_TO_CREATURE');
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
                        else if (magiTargets_1 instanceof Array) {
                            for (var i = 0; i < magiTargets_1.length; i++) {
                                var magi = magiTargets_1[i];
                                magiArray_1.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy
                                });
                            }
                        }
                        this.saveObject(magiArray_1, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI/magiArray');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI/logLength');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI');
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiArray_1
                        };
                    }
                    case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        var source = action.source;
                        this.saveNumber(source.data.defeatedCreature ? 1 : 0, 'EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/defeatedCreature');
                        this.saveObject(source, 'EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/source');
                        this.saveString(source.id, 'EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/sourceId');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, 'EFFECT_TYPE_CREATURE_DEFEATS_CREATURE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                            sourceId: source.id,
                            source: source,
                            sourceDefeatedCreature: source.data.defeatedCreature,
                        };
                    }
                    case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, 'EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY');
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
                        };
                    }
                    case EFFECT_TYPE_MOVE_ENERGY: {
                        var moveMultiSource = this.state.getMetaValue(action.source, action.generatedBy);
                        var moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                        var moveMultiTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        var moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                        this.saveString(moveSource.id, 'EFFECT_TYPE_MOVE_ENERGY/sourceId');
                        this.saveNumber(moveSource.card.type == TYPE_MAGI ? 1 : 0, 'EFFECT_TYPE_MOVE_ENERGY/sourceIsMagi');
                        this.saveNumber(moveSource.owner, 'EFFECT_TYPE_MOVE_ENERGY/sourceOwner');
                        this.saveString(moveTarget.id, 'EFFECT_TYPE_MOVE_ENERGY/targetId');
                        this.saveNumber(moveTarget.card.type == TYPE_MAGI ? 1 : 0, 'EFFECT_TYPE_MOVE_ENERGY/targetIsMagi');
                        this.saveNumber(moveTarget.owner, 'EFFECT_TYPE_MOVE_ENERGY/targetOwner');
                        this.saveNumber(moveSource.data.energy, 'EFFECT_TYPE_MOVE_ENERGY/sourceEnergy');
                        this.saveNumber(moveSource.data.energyLostThisTurn, 'EFFECT_TYPE_MOVE_ENERGY/sourceEnergyLost');
                        this.saveNumber(moveTarget.data.energy, 'EFFECT_TYPE_MOVE_ENERGY/moveEnergy');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_ENERGY, 'EFFECT_TYPE_MOVE_ENERGY');
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
                        this.saveNumber(creature.data.energyLostThisTurn, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/energyLostThisTurn');
                        this.saveNumber(creature.data.energy, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureEnergy');
                        this.saveString(creature.id, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureId');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                            creatureId: creature.id,
                            energy: creature.data.energy,
                            energyLost: creature.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                        var magi = this.state.getMetaValue(action.target, action.generatedBy);
                        this.saveNumber(magi.data.energyLostThisTurn, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/energyLost');
                        this.saveNumber(magi.data.energy, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiEnergy');
                        this.saveNumber(magi.owner, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiOwner');
                        this.saveString(magi.id, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiId');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, 'EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                            magiId: magi.id,
                            owner: magi.owner,
                            energy: magi.data.energy,
                            energyLost: magi.data.energyLostThisTurn
                        };
                    }
                    case EFFECT_TYPE_PROMPT_ENTERED: {
                        this.saveObject(__assign({}, this.state.state.promptParams), 'EFFECT_TYPE_PROMPT_ENTERED/promptParams');
                        this.saveString(this.state.state.promptGeneratedBy, 'EFFECT_TYPE_PROMPT_ENTERED/promptGeneratedBy');
                        this.saveString(this.state.state.promptVariable, 'EFFECT_TYPE_PROMPT_ENTERED/promptVariable');
                        this.saveString(this.state.state.promptType, 'EFFECT_TYPE_PROMPT_ENTERED/promptType');
                        this.saveNumber(this.state.state.promptPlayer, 'EFFECT_TYPE_PROMPT_ENTERED/promptPlayer');
                        this.saveString(this.state.state.promptMessage, 'EFFECT_TYPE_PROMPT_ENTERED/promptMessage');
                        this.saveNumber(this.state.state.prompt ? 1 : 0, 'EFFECT_TYPE_PROMPT_ENTERED/prompt');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, 'EFFECT_TYPE_PROMPT_ENTERED');
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
                        this.saveObject(currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.foundCards, 'EFFECT_TYPE_FIND_STARTING_CARDS/foundCards');
                        this.saveString(action.generatedBy, 'EFFECT_TYPE_FIND_STARTING_CARDS/generatedBy');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_FIND_STARTING_CARDS/logLength');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, 'EFFECT_TYPE_FIND_STARTING_CARDS');
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
                        this.saveObject(__spreadArray([], deck.cards, true), 'EFFECT_TYPE_RESHUFFLE_DISCARD/deckCards');
                        this.saveObject(__spreadArray([], discard.cards, true), 'EFFECT_TYPE_RESHUFFLE_DISCARD/discardCards');
                        this.saveNumber(player, 'EFFECT_TYPE_RESHUFFLE_DISCARD/player');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, 'EFFECT_TYPE_RESHUFFLE_DISCARD');
                        return {
                            type: UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player: player,
                            previousDeckCards: __spreadArray([], deck.cards, true),
                            previousDiscardCards: __spreadArray([], discard.cards, true),
                        };
                    }
                    case EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                        this.saveNumber(this.state.state.delayedTriggers.length, 'EFFECT_TYPE_ADD_DELAYED_TRIGGER/length');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, 'EFFECT_TYPE_ADD_DELAYED_TRIGGER');
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
                        for (var _g = 0, affectedCreatureIds_1 = affectedCreatureIds; _g < affectedCreatureIds_1.length; _g++) {
                            var creatureId = affectedCreatureIds_1[_g];
                            var creature = inPlay.byId(creatureId);
                            if (creature) {
                                creatures_6.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                });
                            }
                        }
                        this.saveObject(creatures_6, 'EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, 'EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                            creatures: creatures_6,
                        };
                    }
                    case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                        var inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY);
                        var creatures_7 = [];
                        var energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        if (energyArrangement) {
                            var affectedCreatureIds = Object.keys(energyArrangement);
                            for (var _h = 0, affectedCreatureIds_2 = affectedCreatureIds; _h < affectedCreatureIds_2.length; _h++) {
                                var creatureId = affectedCreatureIds_2[_h];
                                var creature = inPlay.byId(creatureId);
                                if (creature) {
                                    creatures_7.push({
                                        id: creature.id,
                                        energy: creature.data.energy,
                                    });
                                }
                            }
                        }
                        this.saveObject(creatures_7, 'EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, 'EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES');
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
                            for (var _j = 0, targets_1 = targets; _j < targets_1.length; _j++) {
                                var target = targets_1[_j];
                                creatures_8.push({
                                    id: target.id,
                                    attacked: target.data.attacked,
                                });
                            }
                        }
                        this.saveObject(creatures_8, 'EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, 'EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                            creatures: creatures_8,
                        };
                    }
                    case EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                        var target = this.state.getMetaValue(action.target, action.generatedBy);
                        var attachmentTarget = this.state.getMetaValue(action.attachmentTarget, action.generatedBy);
                        this.saveString(target.id, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD/targetId');
                        this.saveString(attachmentTarget.id, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD/attachmentTargetId');
                        this.saveObject(target.data.attachedTo || null, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD/previousAttachment');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD');
                        return {
                            type: UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD,
                            targetId: target.id,
                            attachmentTargetId: attachmentTarget.id,
                            previousAttachment: target.data.attachedTo || null,
                        };
                    }
                }
                break;
            }
            case ACTION_CALCULATE: {
                var generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                var previousMetadata = this.state.state.spellMetaData[generatedBy];
                var wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'CALCULATION/previousValue');
                this.saveNumber(wasEmpty ? 1 : 0, 'CALCULATION/wasEmpty');
                this.saveString(action.variable || '', 'CALCULATION/variable');
                this.saveString(generatedBy, 'CALCULATION/generatedBy');
                this.saveActionType(UNMAKE_CALCULATION, 'CALCULATION');
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
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'SELECT/value');
                this.saveNumber(wasEmpty ? 1 : 0, 'SELECT/wasEmpty');
                this.saveString(action.variable || '', 'SELECT/variable');
                this.saveString(generatedBy, 'SELECT/generatedBy');
                this.saveActionType(UNMAKE_SELECT, 'SELECT');
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
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'GET_PROPERTY_VALUE/previousValue');
                this.saveNumber(wasEmpty ? 1 : 0, 'GET_PROPERTY_VALUE/wasEmpty');
                this.saveString(action.variable || '', 'GET_PROPERTY_VALUE/variable');
                this.saveString(generatedBy, 'GET_PROPERTY_VALUE/generatedBy');
                this.saveActionType(UNMAKE_PROPERTY, 'GET_PROPERTY_VALUE');
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
        var _a, _b, _c, _d;
        var unAction = this.readNumber('UnActionType');
        switch (unAction) {
            // Log entries: 1
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
            case UNMAKE_LOG_ENTRY: {
                var logCount = this.readNumber('logCount');
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS:
                state.unsetWinner();
                break;
            // Log entries: 0 or 1 (1 for single-target and number prompts only)
            case UNMAKE_PROMPT_LEAVE: {
                var logCount = this.readNumber('logCount');
                var promptType = this.readString('promptType');
                var promptGeneratedBy = this.readString('promptGeneratedBy');
                var promptMessage = this.readString('promptMessage');
                var promptParams = this.readObject('promptParams');
                var savedActions = this.readObject('savedActions');
                var promptPlayer = this.readNumber('promptPlayer');
                var oldMetaData = this.readObject('promptOldMetaData');
                state.state.prompt = true;
                state.state.promptType = promptType;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptPlayer = promptPlayer;
                state.state.promptMessage = promptMessage;
                state.state.promptParams = promptParams;
                state.state.savedActions = savedActions;
                var variable = this.state.state.promptVariable || DEFAULT_PROMPT_VARIABLE[promptType] || 'promptResult';
                if (oldMetaData == undefined) {
                    state.clearSpellMetaDataField(variable, promptGeneratedBy);
                }
                else {
                    state.setSpellMetaDataField(variable, oldMetaData, promptGeneratedBy);
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                var prompt = this.readNumber('EFFECT_TYPE_PROMPT_ENTERED/prompt') == 1;
                var promptMessage = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptMessage');
                var promptPlayer = this.readNumber('EFFECT_TYPE_PROMPT_ENTERED/promptPlayer');
                var promptType = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptType');
                var promptVariable = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptVariable');
                var promptGeneratedBy = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptGeneratedBy');
                var promptParams = this.readObject('EFFECT_TYPE_PROMPT_ENTERED/promptParams');
                state.state.prompt = prompt;
                state.state.promptMessage = promptMessage;
                state.state.promptPlayer = promptPlayer;
                // Empty string is used to represent null for promptType, so we convert it back to null here
                state.state.promptType = promptType == '' ? null : promptType;
                state.state.promptVariable = promptVariable;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptParams = promptParams;
                break;
            }
            // Log entries: 0 or target.length (one per creature)
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                var logCount = this.readNumber('EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/logLength');
                var creatures = this.readObject('EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/creatures');
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (var _i = 0, creatures_9 = creatures; _i < creatures_9.length; _i++) {
                    var _e = creatures_9[_i], id = _e.id, energy = _e.energy;
                    var creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                var cardsWithPositions = this.readObject('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/cardsWithPositions');
                var sourceZoneType = this.readString('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/sourceZoneType');
                var zoneOwner = this.readNumber('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/zoneOwner');
                var destZoneType = this.readString('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/destZoneType');
                var bottom = this.readNumber('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/bottom') === 1;
                var metaDataEntries = this.readObject('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/metaDataEntries');
                if (!cardsWithPositions || !metaDataEntries)
                    break;
                var destZone = state.getZone(destZoneType, destZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                var sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                // Remove the newly-created copies from destination (added to top one at a time)
                for (var i = 0; i < cardsWithPositions.length; i++) {
                    var removedCard = bottom ? destZone.cards.pop() : destZone.cards.shift();
                    if (removedCard) {
                        var attachmentTargetId = state.state.attachedTo[removedCard.id];
                        state.detachCard(removedCard.id);
                        if (attachmentTargetId && ((_a = state.state.cardsAttached[attachmentTargetId]) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                            delete state.state.cardsAttached[attachmentTargetId];
                        }
                        state.removeAttachments(removedCard.id);
                    }
                }
                // Re-insert original cards at their original positions (ascending order preserves positions)
                var sortedByPosition = __spreadArray([], cardsWithPositions, true).sort(function (a, b) { return a.position - b.position; });
                for (var _f = 0, sortedByPosition_1 = sortedByPosition; _f < sortedByPosition_1.length; _f++) {
                    var _g = sortedByPosition_1[_f], card = _g.card, position = _g.position;
                    if (position >= 0) {
                        sourceZone.cards.splice(position, 0, card);
                    }
                }
                for (var _h = 0, metaDataEntries_1 = metaDataEntries; _h < metaDataEntries_1.length; _h++) {
                    var entry = metaDataEntries_1[_h];
                    if (entry.previousValue === undefined) {
                        state.clearSpellMetaDataField(entry.field, entry.spellId);
                    }
                    else {
                        state.setSpellMetaDataField(entry.field, entry.previousValue, entry.spellId);
                    }
                }
                if (sourceZoneType === ZONE_TYPE_IN_PLAY || destZoneType === ZONE_TYPE_IN_PLAY) {
                    state.clearModifiedCardDataCache();
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                var zoneChangingCard = this.readObject('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/zoneChangingCard');
                var sourceZoneType = this.readString('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/sourceZoneType');
                var cardOwner = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/cardOwner');
                var destinationZoneType = this.readString('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/destinationZoneType');
                var encodedPosition = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/position');
                var position = encodedPosition - 1;
                var bottom = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/bottom') == 1;
                var metaDataEntries = this.readObject('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/metaDataEntries');
                var destZone = state.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                var sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                // Remove the new card from destination zone
                var removedCard = bottom ? destZone.cards.pop() : destZone.cards.shift();
                if (removedCard) {
                    var attachmentTargetId = state.state.attachedTo[removedCard.id];
                    state.detachCard(removedCard.id);
                    if (attachmentTargetId && ((_b = state.state.cardsAttached[attachmentTargetId]) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                        delete state.state.cardsAttached[attachmentTargetId];
                    }
                    state.removeAttachments(removedCard.id);
                }
                // Re-add original card only if it existed in the declared source zone.
                if (position >= 0) {
                    sourceZone.cards.splice(position, 0, zoneChangingCard);
                }
                // Restore spellMetaData fields to their previous values
                for (var _j = 0, metaDataEntries_2 = metaDataEntries; _j < metaDataEntries_2.length; _j++) {
                    var entry = metaDataEntries_2[_j];
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
                if (sourceZoneType === ZONE_TYPE_IN_PLAY || destinationZoneType === ZONE_TYPE_IN_PLAY) {
                    state.clearModifiedCardDataCache();
                }
                break;
            }
            case UNMAKE_POWER_USE: {
                var isMagi = this.readNumber('POWER_USE/isMagi') == 1;
                var owner = this.readNumber('POWER_USE/sourcePlayer');
                var sourceId = this.readString('POWER_USE/sourceId');
                var powerName_1 = this.readString('POWER_USE/power');
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
            // Log entries: 1
            case UNMAKE_POWER_ACTIVATION: {
                var logCount = this.readNumber('POWER_ACTIVATION/logCount');
                var isMagi = this.readNumber('POWER_ACTIVATION/isMagi') == 1;
                var owner = this.readNumber('POWER_ACTIVATION/sourceOwner');
                var sourceId = this.readString('POWER_ACTIVATION/sourceId');
                var powerName_2 = this.readString('POWER_ACTIVATION/powerName');
                var oldMetadataSource = this.readObject('POWER_ACTIVATION/oldMetaDataSource');
                var oldMetadataSourceCreature = this.readObject('POWER_ACTIVATION/oldMetaDataSourceCreature');
                var oldMetadataPower = this.readObject('POWER_ACTIVATION/oldMetaDataPower');
                var oldMetadataPlayer = this.readObject('POWER_ACTIVATION/oldMetaDataSourcePlayer');
                if (oldMetadataSource == undefined) {
                    state.clearSpellMetaDataField('source', sourceId);
                }
                else {
                    state.setSpellMetaDataField('source', oldMetadataSource, sourceId);
                }
                if (oldMetadataSourceCreature == undefined) {
                    state.clearSpellMetaDataField('sourceCreature', sourceId);
                }
                else {
                    state.setSpellMetaDataField('sourceCreature', oldMetadataSourceCreature, sourceId);
                }
                if (oldMetadataPower == undefined) {
                    state.clearSpellMetaDataField('sourcePower', sourceId);
                }
                else {
                    state.setSpellMetaDataField('sourcePower', oldMetadataPower, sourceId);
                }
                if (oldMetadataPlayer == undefined) {
                    state.clearSpellMetaDataField('player', sourceId);
                }
                else {
                    state.setSpellMetaDataField('player', oldMetadataPlayer, sourceId);
                }
                // Clear the metadata record if it's empty after restoring the previous values
                if (Object.keys(state.getSpellMetadata(sourceId) || {}).length === 0) {
                    delete state.state.spellMetaData[sourceId];
                }
                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    target = zone.card;
                    if (target && target.id !== sourceId) {
                        console.error("Unmaking power activation but ID doesn't match type and player: ".concat(target.id, " != ").concat(sourceId));
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(function (action) { return action != powerName_2; });
                }
                state.state.log.length -= logCount;
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                var logCount = this.readNumber('EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/logCount');
                var creatures = this.readObject('EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/creatures');
                if (!creatures) {
                    state.state.log.length -= logCount;
                    break;
                }
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (var _k = 0, creatures_10 = creatures; _k < creatures_10.length; _k++) {
                    var _l = creatures_10[_k], id = _l.id, energy = _l.energy, energyLostThisTurn = _l.energyLostThisTurn;
                    var creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                var logCount = this.readNumber('EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/logCount');
                var magi = this.readObject('EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/magi');
                if (!magi) {
                    state.state.log.length -= logCount;
                    break;
                }
                for (var _m = 0, magi_1 = magi; _m < magi_1.length; _m++) {
                    var _o = magi_1[_m], id = _o.id, owner = _o.owner, energy = _o.energy, energyLost = _o.energyLost;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                        magiCard.data.energyLostThisTurn = energyLost;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            // Log entries: 1
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                var logCount = this.readNumber('EFFECT_TYPE_DIE_ROLLED/logCount');
                var generatedBy = this.readString('EFFECT_TYPE_DIE_ROLLED/spellId');
                var previousRollResult = this.readNumber('EFFECT_TYPE_DIE_ROLLED/rollResult');
                if (previousRollResult === undefined) {
                    state.clearSpellMetaDataField('roll_result', generatedBy);
                }
                else {
                    state.setSpellMetaDataField('roll_result', previousRollResult, generatedBy);
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                var turn = this.readNumber('EFFECT_TYPE_START_TURN/turn');
                var activePlayer = this.readNumber('EFFECT_TYPE_START_TURN/activePlayer');
                var controllingPlayer = this.readNumber('EFFECT_TYPE_START_TURN/controllingPlayer');
                var step = this.readNumber('EFFECT_TYPE_START_TURN/step');
                var continuousEffect = this.readObject('EFFECT_TYPE_START_TURN/continuousEffects');
                var cardFlags = this.readObject('EFFECT_TYPE_START_TURN/cardFlags');
                if (!cardFlags)
                    break;
                state.turn = turn;
                state.state.activePlayer = activePlayer;
                state.state.controllingPlayer = controllingPlayer;
                state.state.step = step;
                state.state.continuousEffects = continuousEffect;
                state.clearModifiedCardDataCache();
                // Restore card flags
                var flagEntries = Object.entries(cardFlags);
                for (var i = 0; i < flagEntries.length; i++) {
                    var _p = flagEntries[i], cardId = _p[0], flags = _p[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _q = 0, _r = state.players; _q < _r.length; _q++) {
                            var player = _r[_q];
                            card = (_c = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _c === void 0 ? void 0 : _c.byId(cardId);
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
                state.state.step = this.readNumber('EFFECT_TYPE_START_STEP/step');
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                var zone_1 = this.readString('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zone');
                var owner = this.readNumber('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zoneOwner');
                var previousOrder = this.readObject('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/previousOrder');
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
                var sourceId = this.readString('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/sourceId');
                var sourceCard = this.readObject('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/source');
                var defeatedCreature = this.readNumber('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/defeatedCreature') == 1;
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
                var effectsLength = this.readNumber('EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT/effectsLength');
                state.state.continuousEffects = state.state.continuousEffects.slice(0, effectsLength);
                state.clearModifiedCardDataCache();
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                var logCount = this.readNumber('EFFECT_TYPE_ADD_ENERGY_TO_MAGI/logLength');
                var magiArray = this.readObject('EFFECT_TYPE_ADD_ENERGY_TO_MAGI/magiArray');
                if (!magiArray) {
                    state.state.log.length -= logCount;
                    break;
                }
                for (var _s = 0, magiArray_2 = magiArray; _s < magiArray_2.length; _s++) {
                    var _t = magiArray_2[_s], id = _t.id, owner = _t.owner, energy = _t.energy;
                    var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    var magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                var player = this.readNumber('EFFECT_TYPE_START_TURN/player');
                var cardFlags = this.readObject('EFFECT_TYPE_START_TURN/cardFlags');
                for (var _u = 0, _v = Object.entries(cardFlags); _u < _v.length; _u++) {
                    var _w = _v[_u], cardId = _w[0], flags = _w[1];
                    // Try to find the card in play (creatures and relics)
                    var card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (var _x = 0, _y = state.players; _x < _y.length; _x++) {
                            var player_3 = _y[_x];
                            card = (_d = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player_3)) === null || _d === void 0 ? void 0 : _d.byId(cardId);
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
                var sourceId = this.readString('EFFECT_TYPE_BEFORE_DAMAGE/sourceId');
                var targetId = this.readString('EFFECT_TYPE_BEFORE_DAMAGE/targetId');
                var owner = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/targetPlayer');
                var attacked = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/sourceAttacked');
                var flags = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/flags');
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
                var targetEnergy = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/moveEnergy');
                var sourceEnergyLost = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceEnergyLost');
                var sourceEnergy = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceEnergy');
                var targetOwner = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/targetOwner');
                var targetIsMagi = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/targetIsMagi') == 1;
                var targetId = this.readString('EFFECT_TYPE_MOVE_ENERGY/targetId');
                var sourceOwner = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceOwner');
                var sourceIsMagi = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceIsMagi') == 1;
                var sourceId = this.readString('EFFECT_TYPE_MOVE_ENERGY/sourceId');
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
                    target_2 = state.getZone(ZONE_TYPE_ACTIVE_MAGI, targetOwner).card;
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
                var creatureId = this.readString('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureId');
                var energy = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureEnergy');
                var energyLost = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/energyLostThisTurn');
                var inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                var creature = inPlay.byId(creatureId);
                if (creature) {
                    creature.data.energy = energy;
                    creature.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                var magiId = this.readString('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiId');
                var magiOwner = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiOwner');
                var energy = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiEnergy');
                var energyLost = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/energyLost');
                var activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, magiOwner);
                var magi = activeMagi.byId(magiId);
                if (magi) {
                    magi.data.energy = energy;
                    magi.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            // Log entries: 1
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                var logCount = this.readNumber('EFFECT_TYPE_FIND_STARTING_CARDS/logLength');
                var generatedBy = this.readString('EFFECT_TYPE_FIND_STARTING_CARDS/generatedBy');
                var foundCards = this.readObject('EFFECT_TYPE_FIND_STARTING_CARDS/foundCards');
                state.state.log.length -= logCount;
                if (foundCards === undefined) {
                    state.clearSpellMetaDataField('foundCards', generatedBy);
                }
                else {
                    state.setSpellMetaDataField('foundCards', foundCards, generatedBy);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                var player = this.readNumber('EFFECT_TYPE_RESHUFFLE_DISCARD/player');
                var discardCards = this.readObject('EFFECT_TYPE_RESHUFFLE_DISCARD/discardCards');
                var deckCards = this.readObject('EFFECT_TYPE_RESHUFFLE_DISCARD/deckCards');
                var deck = state.getZone(ZONE_TYPE_DECK, player);
                var discard = state.getZone(ZONE_TYPE_DISCARD, player);
                // Restore deck to its previous state
                deck.cards = __spreadArray([], deckCards, true);
                // Restore discard to its previous state
                discard.cards = __spreadArray([], discardCards, true);
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                var triggersLength = this.readNumber('EFFECT_TYPE_ADD_DELAYED_TRIGGER/length');
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, triggersLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                var creatures = this.readObject('EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES/creatures');
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
                var creatures = this.readObject('EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES/creatures');
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
                var creatures = this.readObject('EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE/creatures');
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
                var generatedBy = this.readString('CALCULATION/generatedBy');
                var variable = this.readString('CALCULATION/variable');
                var wasEmpty = this.readNumber('CALCULATION/wasEmpty') == 1;
                var value = this.readObject('CALCULATION/previousValue');
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_SELECT: {
                var generatedBy = this.readString('SELECT/generatedBy');
                var variable = this.readString('SELECT/variable');
                var wasEmpty = this.readNumber('SELECT/wasEmpty') == 1;
                var value = this.readObject('SELECT/value');
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                var generatedBy = this.readString('GET_PROPERTY_VALUE/generatedBy');
                var variable = this.readString('GET_PROPERTY_VALUE/variable');
                var wasEmpty = this.readNumber('GET_PROPERTY_VALUE/wasEmpty') == 1;
                var value = this.readObject('GET_PROPERTY_VALUE/previousValue');
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
                if (unaction.sourceZone === ZONE_TYPE_IN_PLAY || unaction.destinationZone === ZONE_TYPE_IN_PLAY) {
                    state.clearModifiedCardDataCache();
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
                state.state.controllingPlayer = unaction.previousControllingPlayer;
                state.state.step = unaction.previousStep;
                state.state.continuousEffects = unaction.previousContinuousEffects;
                state.clearModifiedCardDataCache();
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
                state.clearModifiedCardDataCache();
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
            case UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                var previousAttachment = this.readObject('EFFECT_TYPE_ATTACH_CARD_TO_CARD/previousAttachment');
                var attachmentTargetId = this.readString('EFFECT_TYPE_ATTACH_CARD_TO_CARD/attachmentTargetId');
                var targetId = this.readString('EFFECT_TYPE_ATTACH_CARD_TO_CARD/targetId');
                this.state.detachCard(targetId);
                if (previousAttachment) {
                    this.state.attachCard(previousAttachment, targetId);
                }
            }
        }
    };
    return Unmaker;
}());
export { Unmaker };
//# sourceMappingURL=unmaker.js.map