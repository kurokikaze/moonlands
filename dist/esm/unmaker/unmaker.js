import CardInGame from '../classes/CardInGame.js';
import { ACTION_PLAY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_DRAW, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY } from '../const.js';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE, ACTION_PLAYER_WINS, ACTION_POWER, ACTION_RESOLVE_PROMPT, TYPE_MAGI, DEFAULT_PROMPT_VARIABLE } from '../index.js';
import { UNMAKE_CALCULATION, UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_ENERGY, UNMAKE_EFFECT_TYPE_PLAYER_WINS, UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, UNMAKE_EFFECT_TYPE_START_OF_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_LOG_ENTRY, UNMAKE_POWER_ACTIVATION, UNMAKE_POWER_USE, UNMAKE_PROMPT_LEAVE, UNMAKE_PROPERTY, UNMAKE_SELECT, UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD } from './types.js';
const FLAG_WAS_ATTACKED = 1;
const FLAG_HAS_ATTACKED = 2;
const FLAG_IS_MAGI = 4;
const actionNames = {
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
    39: 'UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD'
};
export class Unmaker {
    constructor(state, blobSize) {
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
        this.promptStateCheckpoints = [];
        this.dataTags = [];
        if (blobSize) {
            this.blobSize = blobSize;
            this.dataBlob = new Uint16Array(this.blobSize);
        }
        this.state.setOnAction(action => {
            this.generateUnAction(action);
            /*if (unAction) {
                this.unActions.push(unAction)
            }*/
        }, true);
    }
    /*public setCheckpointOld() {
        this.historyStack.push(this.unActions.length)
    }*/
    setCheckpoint() {
        this.historyStack.push(this.numberOfUnActions);
        // Snapshot PRNG state so die rolls can be fully reversed
        const twister = this.state.twister;
        this.prngCheckpoints.push(twister ? { mt: [...twister.mt], mti: twister.mti } : null);
        // Snapshot actionsUsed for every in-play card and each active magi
        const snapshot = {};
        for (const card of this.state.getZone(ZONE_TYPE_IN_PLAY).cards) {
            snapshot[card.id] = [...card.data.actionsUsed];
        }
        for (const player of this.state.players) {
            const magi = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
            if (magi) {
                snapshot[magi.id] = [...magi.data.actionsUsed];
            }
        }
        this.actionsUsedCheckpoints.push(snapshot);
        // Snapshot prompt internals and queued actions to avoid prompt branch leaks after rollback
        this.promptStateCheckpoints.push({
            prompt: this.state.state.prompt,
            promptType: this.state.state.promptType,
            promptMessage: this.state.state.promptMessage,
            promptGeneratedBy: this.state.state.promptGeneratedBy,
            promptVariable: this.state.state.promptVariable,
            promptParams: Object.assign({}, this.state.state.promptParams),
            promptPlayer: this.state.state.promptPlayer,
            actions: [...(this.state.state.actions || [])],
            savedActions: [...(this.state.state.savedActions || [])],
            mayEffectActions: [...(this.state.state.mayEffectActions || [])],
            fallbackActions: [...(this.state.state.fallbackActions || [])],
        });
    }
    outputDebug() {
        console.log(`Objects storage length: ${this.objects.length}`);
        console.log(`Strings storage length: ${this.strings.length}`);
    }
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
    getPointer() {
        return this.pointer;
    }
    revertToCheckpoint() {
        if (this.historyStack.length) {
            const target = this.historyStack.pop();
            if (typeof target !== 'number' || target > this.numberOfUnActions) {
                console.error(`Target: ${target}`);
                console.error(`Actions: ${this.numberOfUnActions}`);
                throw new Error('Invalid checkpoint target');
            }
            const numberOfSteps = this.numberOfUnActions - target;
            for (let i = 0; i < numberOfSteps; i++) {
                this.readAndApplyUnAction(this.state);
            }
            // Restore PRNG state to the checkpoint position
            const prngState = this.prngCheckpoints.pop();
            const twister = this.state.twister;
            if (prngState && twister) {
                twister.mt = [...prngState.mt];
                twister.mti = prngState.mti;
            }
            const promptState = this.promptStateCheckpoints.pop();
            if (promptState) {
                this.state.state.prompt = promptState.prompt;
                this.state.state.promptType = promptState.promptType;
                this.state.state.promptMessage = promptState.promptMessage;
                this.state.state.promptGeneratedBy = promptState.promptGeneratedBy;
                this.state.state.promptVariable = promptState.promptVariable;
                this.state.state.promptParams = Object.assign({}, promptState.promptParams);
                this.state.state.promptPlayer = promptState.promptPlayer;
                this.state.state.actions = [...promptState.actions];
                this.state.state.savedActions = [...promptState.savedActions];
                this.state.state.mayEffectActions = [...promptState.mayEffectActions];
                this.state.state.fallbackActions = [...promptState.fallbackActions];
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
    }
    saveNumber(n, tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error(`Data blob overflow: pointer ${this.pointer} exceeds blob size ${this.blobSize}`);
        }
        this.dataBlob[this.pointer] = n;
        this.dataTags.push(tag);
        this.pointer++;
    }
    saveActionType(t, _tag) {
        this.saveNumber(t, `UnActionType`);
        this.numberOfUnActions++;
    }
    readNumber(expectedTag) {
        const tag = this.dataTags.pop();
        if (tag != expectedTag) {
            throw new Error(`Expected tag ${expectedTag} but found ${tag}`);
        }
        this.pointer--;
        return this.dataBlob[this.pointer];
    }
    saveString(str, tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error(`Data blob overflow: pointer ${this.pointer} exceeds blob size ${this.blobSize}`);
        }
        this.dataTags.push(tag);
        this.strings.push(str);
    }
    readString(expectedTag) {
        const tag = this.dataTags.pop();
        if (tag != expectedTag) {
            throw new Error(`Expected tag ${expectedTag} but found ${tag}`);
        }
        const str = this.strings.pop();
        return str || '';
    }
    saveObject(obj, _tag) {
        if (this.pointer > this.blobSize - 1) {
            throw new Error(`Data blob overflow: pointer ${this.pointer} exceeds blob size ${this.blobSize}`);
        }
        this.objects.push(obj);
    }
    readObject(_expectedTag) {
        const obj = this.objects.pop();
        return obj;
    }
    hasSpace() {
        return this.pointer < this.blobSize - 10;
    }
    generateUnAction(action) {
        var _a, _b, _c;
        switch (action.type) {
            case ACTION_RESOLVE_PROMPT: {
                const logCount = this.state.logEngine.shouldCreateLog(action).length;
                const generatedBy = this.state.state.promptGeneratedBy;
                const variable = this.state.state.promptVariable || DEFAULT_PROMPT_VARIABLE[this.state.state.promptType] || 'promptResult';
                const oldMetaData = this.state.getMetaValue(variable, generatedBy);
                this.saveObject(oldMetaData, 'promptOldMetaData');
                this.saveString(variable, 'promptVariable');
                this.saveNumber(this.state.state.promptPlayer, 'promptPlayer');
                this.saveObject([...this.state.state.savedActions], 'savedActions');
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
                    savedActions: [...this.state.state.savedActions],
                    player: this.state.state.promptPlayer,
                };
            }
            case ACTION_POWER: {
                const logCount = this.state.logEngine.shouldCreateLog(action).length;
                const sourceId = action.source.id;
                const oldMetaData = this.state.getSpellMetadata(sourceId);
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
                        let flags = 0;
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
                        const source = this.state.getMetaValue(action.source, action.generatedBy);
                        const sourceObject = this.state.getMetaValue(action.source, action.generatedBy);
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
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                        const creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        let creatureArray = [];
                        if (creatures instanceof CardInGame) {
                            creatureArray.push({
                                id: creatures.id,
                                energy: creatures.data.energy,
                                energyLostThisTurn: creatures.data.energyLostThisTurn
                            });
                        }
                        else if (creatures instanceof Array) {
                            for (let i = 0; i < creatures.length; i++) {
                                const creature = creatures[i];
                                creatureArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                    energyLostThisTurn: creature.data.energyLostThisTurn
                                });
                            }
                        }
                        this.saveObject(creatureArray, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/creatures');
                        // this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/logCount')
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, 'EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatureArray
                        };
                    }
                    case EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_LOG_ENTRY, 'ACTION_PLAY');
                        break;
                    }
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        const magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        let magiArray = [];
                        if (magiTargets instanceof CardInGame) {
                            magiArray.push({
                                id: magiTargets.id,
                                owner: magiTargets.owner,
                                energy: magiTargets.data.energy,
                                energyLost: magiTargets.data.energyLostThisTurn,
                            });
                        }
                        else if (magiTargets instanceof Array) {
                            for (let i = 0; i < magiTargets.length; i++) {
                                const magi = magiTargets[i];
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
                        const zoneChangingTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                        if (zoneChangingCard) {
                            const sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy);
                            const destinationZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy);
                            const sourceZone = this.state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            if (sourceZone.containsId(zoneChangingCard.id)) {
                                const position = sourceZone.cards.findIndex(card => card.id === zoneChangingCard.id);
                                // Uint16Array cannot represent -1; encode "not found" as 0 and real indices as index + 1.
                                const encodedPosition = position + 1;
                                // Capture the current spellMetaData values that will be modified
                                const metaDataEntries = [];
                                if (action.generatedBy) {
                                    const generatedByMeta = this.state.getSpellMetadata(action.generatedBy);
                                    metaDataEntries.push({
                                        spellId: action.generatedBy,
                                        field: 'new_card',
                                        previousValue: generatedByMeta === null || generatedByMeta === void 0 ? void 0 : generatedByMeta.new_card,
                                    });
                                }
                                const cardIdMeta = this.state.getSpellMetadata(zoneChangingCard.id);
                                metaDataEntries.push({
                                    spellId: zoneChangingCard.id,
                                    field: 'new_card',
                                    previousValue: cardIdMeta === null || cardIdMeta === void 0 ? void 0 : cardIdMeta.new_card,
                                });
                                const attachedCards = zoneChangingCard.id in this.state.state.cardsAttached ? [...this.state.state.cardsAttached[zoneChangingCard.id]] : null;
                                this.saveObject(attachedCards, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/attachedCards');
                                this.saveObject(metaDataEntries, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/metaDataEntries');
                                this.saveNumber(action.bottom ? 1 : 0, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/bottom');
                                this.saveNumber(encodedPosition, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/position');
                                this.saveString(destinationZoneType, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/destinationZoneType');
                                this.saveNumber(zoneChangingCard.owner, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/cardOwner');
                                this.saveString(sourceZoneType, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/sourceZoneType');
                                this.saveObject(zoneChangingCard, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/zoneChangingCard');
                                this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, 'EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
                                return {
                                    type: UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                    card: zoneChangingCard,
                                    sourceZone: sourceZoneType,
                                    sourceZoneOwner: zoneChangingCard.owner,
                                    destinationZone: destinationZoneType,
                                    position,
                                    bottom: action.bottom || false,
                                    metaDataEntries,
                                };
                            }
                        }
                        break;
                    }
                    case EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                        let targets = this.state.getMetaValue(action.target, action.generatedBy) || [];
                        if (!targets || targets.length === 0)
                            return undefined;
                        const sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy);
                        const destZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy);
                        const zoneOwner = targets[0].owner;
                        const sourceZone = this.state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                        targets = targets.filter((card) => sourceZone.containsId(card.id));
                        if (targets.length) {
                            const cardsWithPositions = targets.map((card) => ({
                                card,
                                position: sourceZone.cards.findIndex((c) => c.id === card.id),
                                attachedCards: [...this.state.state.cardsAttached[card.id] || []],
                            }));
                            const metaDataEntries = targets.map((card) => { var _a; return ({
                                spellId: card.id,
                                field: 'new_card',
                                previousValue: (_a = this.state.getSpellMetadata(card.id)) === null || _a === void 0 ? void 0 : _a.new_card,
                            }); });
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
                                zoneOwner,
                                destinationZone: destZoneType,
                                bottom: action.bottom || false,
                                metaDataEntries,
                            };
                        }
                    }
                    case EFFECT_TYPE_DIE_ROLLED: {
                        if (action.generatedBy) {
                            const currentMeta = this.state.getSpellMetadata(action.generatedBy);
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
                        const cardFlags = {};
                        const player = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === player);
                        for (const creature of creatures) {
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: [...creature.data.actionsUsed],
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            };
                        }
                        // Capture relic flags (relics controlled by the player)
                        const relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_RELIC && card.data.controller === player);
                        for (const relic of relics) {
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: [...relic.data.actionsUsed],
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            };
                        }
                        // Capture magi flags
                        const activeMagi = (_b = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _b === void 0 ? void 0 : _b.card;
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: [...activeMagi.data.actionsUsed],
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            };
                        }
                        this.saveObject(cardFlags, 'EFFECT_TYPE_START_TURN/cardFlags');
                        this.saveObject([...this.state.state.continuousEffects], 'EFFECT_TYPE_START_TURN/continuousEffects');
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
                            previousContinuousEffects: [...this.state.state.continuousEffects],
                            cardFlags,
                        };
                    }
                    case EFFECT_TYPE_START_OF_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        const cardFlags = {};
                        const player = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === player);
                        for (const creature of creatures) {
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: [...creature.data.actionsUsed],
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            };
                        }
                        // Capture relic flags (relics controlled by the player)
                        const relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_RELIC && card.data.controller === player);
                        for (const relic of relics) {
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: [...relic.data.actionsUsed],
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            };
                        }
                        // Capture magi flags
                        const activeMagi = (_c = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _c === void 0 ? void 0 : _c.card;
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: [...activeMagi.data.actionsUsed],
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            };
                        }
                        this.saveObject(cardFlags, 'EFFECT_TYPE_START_TURN/cardFlags');
                        this.saveNumber(player, 'EFFECT_TYPE_START_TURN/player');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_OF_TURN, 'EFFECT_TYPE_START_TURN');
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player,
                            cardFlags,
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
                        const zone = this.state.getMetaValue(action.zone, action.generatedBy);
                        const zoneOwner = this.state.getMetaValue(action.zoneOwner, action.generatedBy);
                        const zoneContent = this.state.getZone(zone, zoneOwner).cards;
                        const cardsOrder = this.state.getMetaValue(action.cards, action.generatedBy);
                        if (!cardsOrder)
                            return undefined;
                        // Capture the original order of the cards that will be rearranged
                        const previousOrder = [];
                        for (let i = 0; i < cardsOrder.length && i < zoneContent.length; i++) {
                            previousOrder.push(zoneContent[i].id);
                        }
                        this.saveObject(previousOrder, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/previousOrder');
                        this.saveNumber(zoneOwner, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zoneOwner');
                        this.saveString(zone, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zone');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, 'EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone,
                            zoneOwner,
                            previousOrder,
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
                        const creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        const creaturesArray = [];
                        if (creatures instanceof CardInGame) {
                            creaturesArray.push({
                                id: creatures.id,
                                energy: creatures.data.energy,
                            });
                        }
                        else if (creatures instanceof Array) {
                            for (let i = 0; i < creatures.length; i++) {
                                const creature = creatures[i];
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
                        const magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        let magiArray = [];
                        if (magiTargets instanceof CardInGame) {
                            magiArray.push({
                                id: magiTargets.id,
                                owner: magiTargets.owner,
                                energy: magiTargets.data.energy,
                            });
                        }
                        else if (magiTargets instanceof Array) {
                            for (let i = 0; i < magiTargets.length; i++) {
                                const magi = magiTargets[i];
                                magiArray.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy
                                });
                            }
                        }
                        this.saveObject(magiArray, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI/magiArray');
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI/logLength');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, 'EFFECT_TYPE_ADD_ENERGY_TO_MAGI');
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiArray
                        };
                    }
                    case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        const source = action.source;
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
                    case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
                        this.saveNumber(this.state.logEngine.shouldCreateLog(action).length, 'logCount');
                        this.saveActionType(UNMAKE_LOG_ENTRY, 'EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY');
                        break;
                    }
                    case EFFECT_TYPE_MOVE_ENERGY: {
                        const moveMultiSource = this.state.getMetaValue(action.source, action.generatedBy);
                        const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                        const moveMultiTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                        if (moveSource == null || moveTarget == null) {
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
                        }
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                        const creature = this.state.getMetaValue(action.target, action.generatedBy);
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
                        const magi = this.state.getMetaValue(action.target, action.generatedBy);
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
                        const promptPlayer = this.state.state.promptPlayer;
                        const hasPromptPlayer = typeof promptPlayer === 'number';
                        this.saveObject([...(this.state.state.savedActions || [])], 'EFFECT_TYPE_PROMPT_ENTERED/savedActions');
                        this.saveObject(Object.assign({}, this.state.state.promptParams), 'EFFECT_TYPE_PROMPT_ENTERED/promptParams');
                        this.saveString(this.state.state.promptGeneratedBy, 'EFFECT_TYPE_PROMPT_ENTERED/promptGeneratedBy');
                        this.saveString(this.state.state.promptVariable, 'EFFECT_TYPE_PROMPT_ENTERED/promptVariable');
                        this.saveString(this.state.state.promptType, 'EFFECT_TYPE_PROMPT_ENTERED/promptType');
                        this.saveNumber(hasPromptPlayer ? promptPlayer : 0, 'EFFECT_TYPE_PROMPT_ENTERED/promptPlayer');
                        this.saveNumber(hasPromptPlayer ? 1 : 0, 'EFFECT_TYPE_PROMPT_ENTERED/hasPromptPlayer');
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
                            previousPromptParams: Object.assign({}, this.state.state.promptParams),
                        };
                    }
                    case EFFECT_TYPE_FIND_STARTING_CARDS: {
                        const currentMeta = this.state.getSpellMetadata(action.generatedBy);
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
                        const player = this.state.getMetaValue(action.player, action.generatedBy);
                        const deck = this.state.getZone(ZONE_TYPE_DECK, player);
                        const discard = this.state.getZone(ZONE_TYPE_DISCARD, player);
                        this.saveObject([...deck.cards], 'EFFECT_TYPE_RESHUFFLE_DISCARD/deckCards');
                        this.saveObject([...discard.cards], 'EFFECT_TYPE_RESHUFFLE_DISCARD/discardCards');
                        this.saveNumber(player, 'EFFECT_TYPE_RESHUFFLE_DISCARD/player');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, 'EFFECT_TYPE_RESHUFFLE_DISCARD');
                        return {
                            type: UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player,
                            previousDeckCards: [...deck.cards],
                            previousDiscardCards: [...discard.cards],
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
                        const energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        const affectedCreatureIds = Object.keys(energyArrangement);
                        const inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY);
                        const creatures = [];
                        for (const creatureId of affectedCreatureIds) {
                            const creature = inPlay.byId(creatureId);
                            if (creature) {
                                creatures.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                });
                            }
                        }
                        this.saveObject(creatures, 'EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, 'EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES');
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                            creatures,
                        };
                    }
                    case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                        const inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY);
                        const creatures = [];
                        const energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        if (energyArrangement) {
                            const affectedCreatureIds = Object.keys(energyArrangement);
                            for (const creatureId of affectedCreatureIds) {
                                const creature = inPlay.byId(creatureId);
                                if (creature) {
                                    creatures.push({
                                        id: creature.id,
                                        energy: creature.data.energy,
                                    });
                                }
                            }
                        }
                        this.saveObject(creatures, 'EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, 'EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES');
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                            creatures,
                        };
                    }
                    case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                        const targets = this.state.getMetaValue(action.target, action.generatedBy);
                        const creatures = [];
                        if (targets instanceof CardInGame) {
                            creatures.push({
                                id: targets.id,
                                attacked: targets.data.attacked,
                            });
                        }
                        else if (targets instanceof Array) {
                            for (const target of targets) {
                                creatures.push({
                                    id: target.id,
                                    attacked: target.data.attacked,
                                });
                            }
                        }
                        this.saveObject(creatures, 'EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE/creatures');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, 'EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE');
                        return {
                            type: UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                            creatures,
                        };
                    }
                    case EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                        const target = this.state.getMetaValue(action.target, action.generatedBy);
                        const attachmentTarget = this.state.getMetaValue(action.attachmentTarget, action.generatedBy);
                        this.saveString(target.id, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD/targetId');
                        this.saveObject(target.data.attachedTo || null, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD/previousAttachment');
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD, 'EFFECT_TYPE_ATTACH_CARD_TO_CARD');
                        return {
                            type: UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD,
                            targetId: target.id,
                            previousAttachment: target.data.attachedTo || null,
                        };
                    }
                }
                break;
            }
            case ACTION_CALCULATE: {
                const generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'CALCULATION/previousValue');
                this.saveNumber(wasEmpty ? 1 : 0, 'CALCULATION/wasEmpty');
                this.saveString(action.variable || '', 'CALCULATION/variable');
                this.saveString(generatedBy, 'CALCULATION/generatedBy');
                this.saveActionType(UNMAKE_CALCULATION, 'CALCULATION');
                return {
                    type: UNMAKE_CALCULATION,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case ACTION_SELECT: {
                const generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'SELECT/value');
                this.saveNumber(wasEmpty ? 1 : 0, 'SELECT/wasEmpty');
                this.saveString(action.variable || '', 'SELECT/variable');
                this.saveString(generatedBy, 'SELECT/generatedBy');
                this.saveActionType(UNMAKE_SELECT, 'SELECT');
                return {
                    type: UNMAKE_SELECT,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case ACTION_GET_PROPERTY_VALUE: {
                const generatedBy = (action === null || action === void 0 ? void 0 : action.generatedBy) || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable], 'GET_PROPERTY_VALUE/previousValue');
                this.saveNumber(wasEmpty ? 1 : 0, 'GET_PROPERTY_VALUE/wasEmpty');
                this.saveString(action.variable || '', 'GET_PROPERTY_VALUE/variable');
                this.saveString(generatedBy, 'GET_PROPERTY_VALUE/generatedBy');
                this.saveActionType(UNMAKE_PROPERTY, 'GET_PROPERTY_VALUE');
                return {
                    type: UNMAKE_PROPERTY,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
        }
    }
    readAndApplyUnAction(state) {
        var _a, _b, _c, _d;
        const unAction = this.readNumber('UnActionType');
        switch (unAction) {
            // Log entries: 1
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
            case UNMAKE_LOG_ENTRY: {
                const logCount = this.readNumber('logCount');
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS:
                state.unsetWinner();
                break;
            // Log entries: 0 or 1 (1 for single-target and number prompts only)
            case UNMAKE_PROMPT_LEAVE: {
                const logCount = this.readNumber('logCount');
                const promptType = this.readString('promptType');
                const promptGeneratedBy = this.readString('promptGeneratedBy');
                const promptMessage = this.readString('promptMessage');
                const promptParams = this.readObject('promptParams');
                const savedActions = this.readObject('savedActions');
                const promptPlayer = this.readNumber('promptPlayer');
                const promptVariable = this.readString('promptVariable');
                const oldMetaData = this.readObject('promptOldMetaData');
                state.state.prompt = true;
                state.state.promptType = promptType;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptPlayer = promptPlayer;
                state.state.promptMessage = promptMessage;
                state.state.promptParams = promptParams;
                state.state.promptVariable = promptVariable;
                state.state.savedActions = savedActions;
                const variable = this.state.state.promptVariable || DEFAULT_PROMPT_VARIABLE[promptType] || 'promptResult';
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
                const prompt = this.readNumber('EFFECT_TYPE_PROMPT_ENTERED/prompt') == 1;
                const promptMessage = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptMessage');
                const hasPromptPlayer = this.readNumber('EFFECT_TYPE_PROMPT_ENTERED/hasPromptPlayer') == 1;
                const serializedPromptPlayer = this.readNumber('EFFECT_TYPE_PROMPT_ENTERED/promptPlayer');
                const promptPlayer = hasPromptPlayer ? serializedPromptPlayer : undefined;
                const promptType = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptType');
                const promptVariable = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptVariable');
                const promptGeneratedBy = this.readString('EFFECT_TYPE_PROMPT_ENTERED/promptGeneratedBy');
                const promptParams = this.readObject('EFFECT_TYPE_PROMPT_ENTERED/promptParams');
                const savedActions = this.readObject('EFFECT_TYPE_PROMPT_ENTERED/savedActions');
                state.state.prompt = prompt;
                state.state.promptMessage = promptMessage;
                state.state.promptPlayer = promptPlayer;
                // Empty string is used to represent null for promptType, so we convert it back to null here
                state.state.promptType = promptType == '' ? null : promptType;
                state.state.promptVariable = promptVariable;
                state.state.promptGeneratedBy = promptGeneratedBy;
                state.state.promptParams = promptParams;
                state.state.savedActions = savedActions || [];
                break;
            }
            // Log entries: 0 or target.length (one per creature)
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                const logCount = this.readNumber('EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/logLength');
                const creatures = this.readObject('EFFECT_TYPE_ADD_ENERGY_TO_CREATURE/creatures');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (const { id, energy } of creatures) {
                    const creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES: {
                const cardsWithPositions = this.readObject('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/cardsWithPositions');
                const sourceZoneType = this.readString('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/sourceZoneType');
                const zoneOwner = this.readNumber('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/zoneOwner');
                const destZoneType = this.readString('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/destZoneType');
                const bottom = this.readNumber('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/bottom') === 1;
                const metaDataEntries = this.readObject('EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES/metaDataEntries');
                if (!cardsWithPositions || !metaDataEntries)
                    break;
                const destZone = state.getZone(destZoneType, destZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                const sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
                // Remove the newly-created copies from destination (added to top one at a time)
                for (let i = 0; i < cardsWithPositions.length; i++) {
                    const removedCard = bottom ? destZone.cards.pop() : destZone.cards.shift();
                    if (removedCard) {
                        const attachmentTargetId = state.state.attachedTo[removedCard.id];
                        state.detachCard(removedCard.id);
                        if (attachmentTargetId && ((_a = state.state.cardsAttached[attachmentTargetId]) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                            delete state.state.cardsAttached[attachmentTargetId];
                        }
                        state.removeAttachments(removedCard.id);
                    }
                }
                // Re-insert original cards at their original positions (ascending order preserves positions)
                const sortedByPosition = [...cardsWithPositions].sort((a, b) => a.position - b.position);
                for (const { card, position } of sortedByPosition) {
                    if (position >= 0) {
                        sourceZone.cards.splice(position, 0, card);
                    }
                }
                for (const entry of metaDataEntries) {
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
                const zoneChangingCard = this.readObject('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/zoneChangingCard');
                const sourceZoneType = this.readString('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/sourceZoneType');
                const cardOwner = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/cardOwner');
                const destinationZoneType = this.readString('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/destinationZoneType');
                const encodedPosition = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/position');
                const position = encodedPosition - 1;
                const bottom = this.readNumber('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/bottom') == 1;
                const metaDataEntries = this.readObject('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/metaDataEntries');
                const attachedCards = this.readObject('EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES/attachedCards');
                const destZone = state.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                const sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner);
                // Remove the new card from destination zone
                const removedCard = bottom ? destZone.cards.pop() : destZone.cards.shift();
                if (removedCard) {
                    const attachmentTargetId = state.state.attachedTo[removedCard.id];
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
                if (attachedCards) {
                    for (const attachedCardId of attachedCards) {
                        state.attachCard(attachedCardId, zoneChangingCard.id);
                    }
                }
                // Restore spellMetaData fields to their previous values
                for (const entry of metaDataEntries) {
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
                const isMagi = this.readNumber('POWER_USE/isMagi') == 1;
                const owner = this.readNumber('POWER_USE/sourcePlayer');
                const sourceId = this.readString('POWER_USE/sourceId');
                const powerName = this.readString('POWER_USE/power');
                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    target = zone.card;
                    if (target && target.id !== sourceId) {
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${sourceId}`);
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != powerName);
                }
                break;
            }
            // Log entries: 1
            case UNMAKE_POWER_ACTIVATION: {
                const logCount = this.readNumber('POWER_ACTIVATION/logCount');
                const isMagi = this.readNumber('POWER_ACTIVATION/isMagi') == 1;
                const owner = this.readNumber('POWER_ACTIVATION/sourceOwner');
                const sourceId = this.readString('POWER_ACTIVATION/sourceId');
                const powerName = this.readString('POWER_ACTIVATION/powerName');
                const oldMetadataSource = this.readObject('POWER_ACTIVATION/oldMetaDataSource');
                const oldMetadataSourceCreature = this.readObject('POWER_ACTIVATION/oldMetaDataSourceCreature');
                const oldMetadataPower = this.readObject('POWER_ACTIVATION/oldMetaDataPower');
                const oldMetadataPlayer = this.readObject('POWER_ACTIVATION/oldMetaDataSourcePlayer');
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
                        console.error(`Unmaking power activation but ID doesn't match type and player: ${target.id} != ${sourceId}`);
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != powerName);
                }
                state.state.log.length -= logCount;
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                // const logCount = this.readNumber('EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/logCount')
                const creatures = this.readObject('EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE/creatures');
                // if (!creatures) { state.state.log.length -= logCount; break; }
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                for (const { id, energy, energyLostThisTurn } of creatures) {
                    const creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                }
                // state.state.log.length -= logCount
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                const logCount = this.readNumber('EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/logCount');
                const magi = this.readObject('EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI/magi');
                if (!magi) {
                    state.state.log.length -= logCount;
                    break;
                }
                for (const { id, owner, energy, energyLost } of magi) {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    const magiCard = activeMagi.byId(id);
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
                const logCount = this.readNumber('EFFECT_TYPE_DIE_ROLLED/logCount');
                const generatedBy = this.readString('EFFECT_TYPE_DIE_ROLLED/spellId');
                const previousRollResult = this.readNumber('EFFECT_TYPE_DIE_ROLLED/rollResult');
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
                const turn = this.readNumber('EFFECT_TYPE_START_TURN/turn');
                const activePlayer = this.readNumber('EFFECT_TYPE_START_TURN/activePlayer');
                const controllingPlayer = this.readNumber('EFFECT_TYPE_START_TURN/controllingPlayer');
                const step = this.readNumber('EFFECT_TYPE_START_TURN/step');
                const continuousEffect = this.readObject('EFFECT_TYPE_START_TURN/continuousEffects');
                const cardFlags = this.readObject('EFFECT_TYPE_START_TURN/cardFlags');
                if (!cardFlags)
                    break;
                state.turn = turn;
                state.state.activePlayer = activePlayer;
                state.state.controllingPlayer = controllingPlayer;
                state.state.step = step;
                state.state.continuousEffects = continuousEffect;
                state.clearModifiedCardDataCache();
                // Restore card flags
                const flagEntries = Object.entries(cardFlags);
                for (let i = 0; i < flagEntries.length; i++) {
                    const [cardId, flags] = flagEntries[i];
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = (_c = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _c === void 0 ? void 0 : _c.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed];
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
                const zone = this.readString('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zone');
                const owner = this.readNumber('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/zoneOwner');
                const previousOrder = this.readObject('EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE/previousOrder');
                const zoneContent = state.getZone(zone, owner).cards;
                const cardsToRearrange = {};
                // Build a map of the cards that need to be rearranged
                for (let i = 0; i < previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange[zoneContent[i].id] = zoneContent[i];
                }
                // Restore to the previous order
                const newZoneContent = [
                    ...previousOrder.map(id => cardsToRearrange[id]),
                    ...zoneContent.slice(previousOrder.length),
                ];
                state.getZone(zone, owner).cards = newZoneContent;
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                const sourceId = this.readString('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/sourceId');
                const sourceCard = this.readObject('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/source');
                const defeatedCreature = this.readNumber('EFFECT_TYPE_CREATURE_DEFEATS_CREATURE/defeatedCreature') == 1;
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(sourceId);
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
                const effectsLength = this.readNumber('EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT/effectsLength');
                state.state.continuousEffects = state.state.continuousEffects.slice(0, effectsLength);
                state.clearModifiedCardDataCache();
                break;
            }
            // Log entries: 0 or 1
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                const logCount = this.readNumber('EFFECT_TYPE_ADD_ENERGY_TO_MAGI/logLength');
                const magiArray = this.readObject('EFFECT_TYPE_ADD_ENERGY_TO_MAGI/magiArray');
                if (!magiArray) {
                    state.state.log.length -= logCount;
                    break;
                }
                for (const { id, owner, energy } of magiArray) {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    const magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                }
                state.state.log.length -= logCount;
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                const player = this.readNumber('EFFECT_TYPE_START_TURN/player');
                const cardFlags = this.readObject('EFFECT_TYPE_START_TURN/cardFlags');
                for (const [cardId, flags] of Object.entries(cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = (_d = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _d === void 0 ? void 0 : _d.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed];
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
                const sourceId = this.readString('EFFECT_TYPE_BEFORE_DAMAGE/sourceId');
                const targetId = this.readString('EFFECT_TYPE_BEFORE_DAMAGE/targetId');
                const owner = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/targetPlayer');
                const attacked = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/sourceAttacked');
                const flags = this.readNumber('EFFECT_TYPE_BEFORE_DAMAGE/flags');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(sourceId);
                if (source) {
                    source.data.hasAttacked = (flags & FLAG_HAS_ATTACKED) > 0;
                    source.data.attacked = attacked;
                }
                let target;
                if (flags & FLAG_IS_MAGI) {
                    target = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner).card;
                }
                else {
                    target = inPlay.byId(targetId);
                }
                if (target) {
                    target.data.wasAttacked = (flags & FLAG_WAS_ATTACKED) > 0;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                const targetEnergy = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/moveEnergy');
                const sourceEnergyLost = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceEnergyLost');
                const sourceEnergy = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceEnergy');
                const targetOwner = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/targetOwner');
                const targetIsMagi = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/targetIsMagi') == 1;
                const targetId = this.readString('EFFECT_TYPE_MOVE_ENERGY/targetId');
                const sourceOwner = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceOwner');
                const sourceIsMagi = this.readNumber('EFFECT_TYPE_MOVE_ENERGY/sourceIsMagi') == 1;
                const sourceId = this.readString('EFFECT_TYPE_MOVE_ENERGY/sourceId');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                let source;
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
                let target;
                if (targetIsMagi) {
                    target = state.getZone(ZONE_TYPE_ACTIVE_MAGI, targetOwner).card;
                }
                else {
                    target = inPlay.byId(targetId);
                }
                if (target) {
                    target.data.energy = targetEnergy;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                const creatureId = this.readString('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureId');
                const energy = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/creatureEnergy');
                const energyLost = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE/energyLostThisTurn');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const creature = inPlay.byId(creatureId);
                if (creature) {
                    creature.data.energy = energy;
                    creature.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                const magiId = this.readString('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiId');
                const magiOwner = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiOwner');
                const energy = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/magiEnergy');
                const energyLost = this.readNumber('EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI/energyLost');
                const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, magiOwner);
                const magi = activeMagi.byId(magiId);
                if (magi) {
                    magi.data.energy = energy;
                    magi.data.energyLostThisTurn = energyLost;
                }
                break;
            }
            // Log entries: 1
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                const logCount = this.readNumber('EFFECT_TYPE_FIND_STARTING_CARDS/logLength');
                const generatedBy = this.readString('EFFECT_TYPE_FIND_STARTING_CARDS/generatedBy');
                const foundCards = this.readObject('EFFECT_TYPE_FIND_STARTING_CARDS/foundCards');
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
                const player = this.readNumber('EFFECT_TYPE_RESHUFFLE_DISCARD/player');
                const discardCards = this.readObject('EFFECT_TYPE_RESHUFFLE_DISCARD/discardCards');
                const deckCards = this.readObject('EFFECT_TYPE_RESHUFFLE_DISCARD/deckCards');
                const deck = state.getZone(ZONE_TYPE_DECK, player);
                const discard = state.getZone(ZONE_TYPE_DISCARD, player);
                // Restore deck to its previous state
                deck.cards = [...deckCards];
                // Restore discard to its previous state
                discard.cards = [...discardCards];
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                const triggersLength = this.readNumber('EFFECT_TYPE_ADD_DELAYED_TRIGGER/length');
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, triggersLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const creatures = this.readObject('EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES/creatures');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const creatures = this.readObject('EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES/creatures');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                const creatures = this.readObject('EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE/creatures');
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                creatures.forEach(({ id, attacked }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.attacked = attacked;
                    }
                });
                break;
            }
            case UNMAKE_CALCULATION: {
                const generatedBy = this.readString('CALCULATION/generatedBy');
                const variable = this.readString('CALCULATION/variable');
                const wasEmpty = this.readNumber('CALCULATION/wasEmpty') == 1;
                const value = this.readObject('CALCULATION/previousValue');
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_SELECT: {
                const generatedBy = this.readString('SELECT/generatedBy');
                const variable = this.readString('SELECT/variable');
                const wasEmpty = this.readNumber('SELECT/wasEmpty') == 1;
                const value = this.readObject('SELECT/value');
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                const generatedBy = this.readString('GET_PROPERTY_VALUE/generatedBy');
                const variable = this.readString('GET_PROPERTY_VALUE/variable');
                const wasEmpty = this.readNumber('GET_PROPERTY_VALUE/wasEmpty') == 1;
                const value = this.readObject('GET_PROPERTY_VALUE/previousValue');
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy);
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_ATTACH_CARD_TO_CARD: {
                const previousAttachment = this.readObject('EFFECT_TYPE_ATTACH_CARD_TO_CARD/previousAttachment');
                const targetId = this.readString('EFFECT_TYPE_ATTACH_CARD_TO_CARD/targetId');
                this.state.detachCard(targetId);
                if (previousAttachment) {
                    this.state.attachCard(previousAttachment, targetId);
                }
                break;
            }
        }
        this.numberOfUnActions--;
    }
    applyUnAction(state, unaction) {
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
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${unaction.source}`);
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != unaction.power);
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
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${unaction.source}`);
                    }
                }
                else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source);
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != unaction.power);
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
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy, energyLostThisTurn }) => {
                    let creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                    state.state.log.length--;
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                for (const { id, owner, energy, energyLost } of unaction.magi) {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    let magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                        magiCard.data.energyLostThisTurn = energyLost;
                    }
                    state.state.log.length--;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                const destZone = state.getZone(unaction.destinationZone, unaction.destinationZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
                const sourceZone = state.getZone(unaction.sourceZone, unaction.sourceZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
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
                for (const entry of unaction.metaDataEntries) {
                    const currentMeta = state.getSpellMetadata(entry.spellId);
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
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = (_a = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _a === void 0 ? void 0 : _a.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed];
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
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = (_b = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)) === null || _b === void 0 ? void 0 : _b.byId(cardId);
                            if (card)
                                break;
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed];
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
                const zoneContent = state.getZone(unaction.zone, unaction.zoneOwner).cards;
                const cardsToRearrange = {};
                // Build a map of the cards that need to be rearranged
                for (let i = 0; i < unaction.previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange[zoneContent[i].id] = zoneContent[i];
                }
                // Restore to the previous order
                const newZoneContent = [
                    ...unaction.previousOrder.map(id => cardsToRearrange[id]),
                    ...zoneContent.slice(unaction.previousOrder.length),
                ];
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
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    let creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                    state.state.log.length--;
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                unaction.magi.forEach(({ id, owner, energy }) => {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner);
                    let magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.length--;
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.hasAttacked = unaction.sourceHasAttacked;
                    source.data.attacked = unaction.sourceAttacked;
                }
                let target;
                if (unaction.targetMagi) {
                    target = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.targetPlayer).card;
                }
                else {
                    target = inPlay.byId(unaction.targetId);
                }
                if (target) {
                    target.data.wasAttacked = unaction.targetWasAttacked;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(unaction.sourceId);
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
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                let source;
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
                const target = inPlay.byId(unaction.targetId);
                if (target) {
                    target.data.energy = unaction.targetEnergy;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                const creature = inPlay.byId(unaction.creatureId);
                if (creature) {
                    creature.data.energy = unaction.energy;
                    creature.data.energyLostThisTurn = unaction.energyLost;
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.owner);
                const magi = activeMagi.byId(unaction.magiId);
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
                const deck = state.getZone(ZONE_TYPE_DECK, unaction.player);
                const discard = state.getZone(ZONE_TYPE_DISCARD, unaction.player);
                // Restore deck to its previous state
                deck.cards = [...unaction.previousDeckCards];
                // Restore discard to its previous state
                discard.cards = [...unaction.previousDiscardCards];
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                // Remove all delayed triggers added after the captured length
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, unaction.previousLength);
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, attacked }) => {
                    const creature = inPlay.byId(id);
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
                const previousAttachment = this.readObject('EFFECT_TYPE_ATTACH_CARD_TO_CARD/previousAttachment');
                const targetId = this.readString('EFFECT_TYPE_ATTACH_CARD_TO_CARD/targetId');
                this.state.detachCard(targetId);
                if (previousAttachment) {
                    this.state.attachCard(previousAttachment, targetId);
                }
                break;
            }
        }
    }
}
//# sourceMappingURL=unmaker.js.map