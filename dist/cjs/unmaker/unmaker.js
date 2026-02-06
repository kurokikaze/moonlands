"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unmaker = void 0;
const CardInGame_1 = __importDefault(require("../classes/CardInGame"));
const index_1 = require("../index");
const types_1 = require("./types");
class Unmaker {
    state;
    unActions = [];
    historyStack = [];
    constructor(state) {
        this.state = state;
        this.state.setOnAction(action => {
            const unAction = this.generateUnAction(action);
            if (unAction) {
                this.unActions.push(unAction);
            }
        }, true);
    }
    setCheckpoint() {
        this.historyStack.push(this.unActions.length);
    }
    revertToCheckpoint(state) {
        if (this.historyStack.length) {
            const target = this.historyStack.pop();
            if (typeof target !== 'number' || target > this.unActions.length) {
                console.error(`Target: ${target}`);
                console.error(`Actions: ${this.unActions.length}`);
                throw new Error();
            }
            const numberOfSteps = this.unActions.length - target;
            for (let i = 0; i < numberOfSteps; i++) {
                this.applyUnAction(state, this.unActions.pop());
            }
        }
    }
    generateUnAction(action) {
        switch (action.type) {
            case index_1.ACTION_EFFECT: {
                switch (action.effectType) {
                    case index_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        const creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        if (creatures instanceof CardInGame_1.default) {
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                creatures: [{
                                        id: creatures.id,
                                        energy: creatures.data.energy,
                                        energyLostThisTurn: creatures.data.energyLostThisTurn
                                    }]
                            };
                        }
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatures.map(creature => ({ id: creature.id, energy: creature.data.energy, energyLostThisTurn: creature.data.energyLostThisTurn }))
                        };
                    case index_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        const magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        if (magiTargets instanceof CardInGame_1.default) {
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                magi: [{
                                        id: magiTargets.id,
                                        owner: magiTargets.owner,
                                        energy: magiTargets.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                            magi: magiTargets.map(magi => ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }))
                        };
                    case index_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                        const zoneChangingTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
                        if (zoneChangingCard) {
                            const sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy);
                            const destinationZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy);
                            const sourceZone = this.state.getZone(sourceZoneType, sourceZoneType === index_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const position = sourceZone.cards.findIndex(card => card.id === zoneChangingCard.id);
                            // Capture the current spellMetaData values that will be modified
                            const metaDataEntries = [];
                            if (action.generatedBy) {
                                const generatedByMeta = this.state.getSpellMetadata(action.generatedBy);
                                metaDataEntries.push({
                                    spellId: action.generatedBy,
                                    field: 'new_card',
                                    previousValue: generatedByMeta?.new_card,
                                });
                            }
                            const cardIdMeta = this.state.getSpellMetadata(zoneChangingCard.id);
                            metaDataEntries.push({
                                spellId: zoneChangingCard.id,
                                field: 'new_card',
                                previousValue: cardIdMeta?.new_card,
                            });
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
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
                    case index_1.EFFECT_TYPE_DIE_ROLLED: {
                        if (action.generatedBy) {
                            const currentMeta = this.state.getSpellMetadata(action.generatedBy);
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_DIE_ROLLED,
                                spellId: action.generatedBy,
                                previousRollResult: currentMeta?.roll_result,
                            };
                        }
                    }
                    case index_1.EFFECT_TYPE_START_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        const cardFlags = {};
                        const player = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === index_1.TYPE_CREATURE && card.data.controller === player);
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
                        const relics = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === index_1.TYPE_RELIC && card.data.controller === player);
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
                        const activeMagi = this.state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, player)?.card;
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
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_START_TURN,
                            previousTurn: this.state.turn,
                            previousActivePlayer: this.state.state.activePlayer,
                            previousStep: this.state.state.step,
                            previousContinuousEffects: [...this.state.state.continuousEffects],
                            cardFlags,
                        };
                    }
                    case index_1.EFFECT_TYPE_START_OF_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        const cardFlags = {};
                        const player = action.player;
                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === index_1.TYPE_CREATURE && card.data.controller === player);
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
                        const relics = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === index_1.TYPE_RELIC && card.data.controller === player);
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
                        const activeMagi = this.state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, player)?.card;
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
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player,
                            cardFlags,
                        };
                    }
                    case index_1.EFFECT_TYPE_START_STEP: {
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_START_STEP,
                            previousStep: this.state.state.step,
                        };
                    }
                    case index_1.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                        const zone = this.state.getMetaValue(action.zone, action.generatedBy);
                        const zoneOwner = this.state.getMetaValue(action.zoneOwner, action.generatedBy);
                        const zoneContent = this.state.getZone(zone, zoneOwner).cards;
                        const cardsOrder = this.state.getMetaValue(action.cards, action.generatedBy);
                        // Capture the original order of the cards that will be rearranged
                        const previousOrder = [];
                        for (let i = 0; i < cardsOrder.length && i < zoneContent.length; i++) {
                            previousOrder.push(zoneContent[i].id);
                        }
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone,
                            zoneOwner,
                            previousOrder,
                        };
                    }
                    case index_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                            previousLength: this.state.state.continuousEffects.length,
                        };
                    }
                    case index_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                        const creatures = this.state.getMetaValue(action.target, action.generatedBy);
                        if (creatures instanceof CardInGame_1.default) {
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                creatures: [{
                                        id: creatures.id,
                                        energy: creatures.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                            creatures: creatures.map(creature => ({ id: creature.id, energy: creature.data.energy }))
                        };
                    }
                    case index_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                        const magiTargets = this.state.getMetaValue(action.target, action.generatedBy);
                        if (magiTargets instanceof CardInGame_1.default) {
                            return {
                                type: types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                magi: [{
                                        id: magiTargets.id,
                                        owner: magiTargets.owner,
                                        energy: magiTargets.data.energy,
                                    }]
                            };
                        }
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiTargets.map(magi => ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }))
                        };
                    }
                    case index_1.EFFECT_TYPE_BEFORE_DAMAGE: {
                        const source = action.source;
                        const target = action.target;
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE,
                            sourceId: source.id,
                            sourceHasAttacked: source.data.hasAttacked,
                            sourceAttacked: source.data.attacked,
                            targetId: target.id,
                            targetWasAttacked: target.data.wasAttacked,
                        };
                    }
                    case index_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        const source = action.source;
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                            sourceId: source.id,
                            sourceDefeatedCreature: source.data.defeatedCreature,
                        };
                    }
                    case index_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
                        };
                    }
                    case index_1.EFFECT_TYPE_MOVE_ENERGY: {
                        const moveMultiSource = this.state.getMetaValue(action.source, action.generatedBy);
                        const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                        const moveMultiTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_MOVE_ENERGY,
                            sourceId: moveSource.id,
                            targetId: moveTarget.id,
                            sourceEnergy: moveSource.data.energy,
                            sourceEnergyLost: moveSource.data.energyLostThisTurn,
                            targetEnergy: moveTarget.data.energy,
                        };
                    }
                    case index_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                        const creature = this.state.getMetaValue(action.target, action.generatedBy);
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                            creatureId: creature.id,
                            energy: creature.data.energy,
                            energyLost: creature.data.energyLostThisTurn
                        };
                    }
                    case index_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                        const magi = this.state.getMetaValue(action.target, action.generatedBy);
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                            magiId: magi.id,
                            owner: magi.owner,
                            energy: magi.data.energy,
                            energyLost: magi.data.energyLostThisTurn
                        };
                    }
                    case index_1.EFFECT_TYPE_PROMPT_ENTERED: {
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_PROMPT_ENTERED,
                            previousPrompt: this.state.state.prompt,
                            previousPromptMessage: this.state.state.promptMessage,
                            previousPromptPlayer: this.state.state.promptPlayer,
                            previousPromptType: this.state.state.promptType,
                            previousPromptVariable: this.state.state.promptVariable,
                            previousPromptGeneratedBy: this.state.state.promptGeneratedBy,
                            previousPromptParams: { ...this.state.state.promptParams },
                        };
                    }
                    case index_1.EFFECT_TYPE_FIND_STARTING_CARDS: {
                        const currentMeta = this.state.getSpellMetadata(action.generatedBy);
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS,
                            spellId: action.generatedBy,
                            previousFoundCards: currentMeta?.foundCards,
                        };
                    }
                    case index_1.EFFECT_TYPE_RESHUFFLE_DISCARD: {
                        const player = this.state.getMetaValue(action.player, action.generatedBy);
                        const deck = this.state.getZone(index_1.ZONE_TYPE_DECK, player);
                        const discard = this.state.getZone(index_1.ZONE_TYPE_DISCARD, player);
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player,
                            previousDeckCards: [...deck.cards],
                            previousDiscardCards: [...discard.cards],
                        };
                    }
                    case index_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER,
                            previousLength: this.state.state.delayedTriggers.length,
                        };
                    }
                    case index_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                        const energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        const affectedCreatureIds = Object.keys(energyArrangement);
                        const inPlay = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY);
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
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                            creatures,
                        };
                    }
                    case index_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                        const energyArrangement = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy);
                        const affectedCreatureIds = Object.keys(energyArrangement);
                        const inPlay = this.state.getZone(index_1.ZONE_TYPE_IN_PLAY);
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
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                            creatures,
                        };
                    }
                    case index_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                        const targets = this.state.getMetaValue(action.target, action.generatedBy);
                        const creatures = [];
                        if (targets instanceof CardInGame_1.default) {
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
                        return {
                            type: types_1.UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                            creatures,
                        };
                    }
                }
                break;
            }
            case index_1.ACTION_CALCULATE: {
                const generatedBy = action?.generatedBy || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: types_1.UNMAKE_CALCULATION,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case index_1.ACTION_SELECT: {
                const generatedBy = action?.generatedBy || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: types_1.UNMAKE_SELECT,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
            case index_1.ACTION_GET_PROPERTY_VALUE: {
                const generatedBy = action?.generatedBy || 'thegame';
                const previousMetadata = this.state.state.spellMetaData[generatedBy];
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata);
                return {
                    type: types_1.UNMAKE_PROPERTY,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable]
                };
            }
        }
    }
    applyUnAction(state, unaction) {
        switch (unaction.type) {
            case types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy, energyLostThisTurn }) => {
                    let creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                unaction.magi.forEach(({ id, owner, energy }) => {
                    const activeMagi = state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, owner);
                    let magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                const destZone = state.getZone(unaction.destinationZone, unaction.destinationZone === index_1.ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
                const sourceZone = state.getZone(unaction.sourceZone, unaction.sourceZone === index_1.ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner);
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
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                const currentMeta = state.getSpellMetadata(unaction.spellId);
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
            case types_1.UNMAKE_EFFECT_TYPE_START_TURN: {
                state.turn = unaction.previousTurn;
                state.state = {
                    ...state.state,
                    activePlayer: unaction.previousActivePlayer,
                    step: unaction.previousStep,
                    continuousEffects: unaction.previousContinuousEffects,
                };
                // Restore card flags
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(index_1.ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId);
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
            case types_1.UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                // Restore card flags
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(index_1.ZONE_TYPE_IN_PLAY).byId(cardId);
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId);
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
            case types_1.UNMAKE_EFFECT_TYPE_START_STEP: {
                state.state = {
                    ...state.state,
                    step: unaction.previousStep,
                };
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
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
            case types_1.UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                // Remove all continuous effects added after the captured length
                state.state = {
                    ...state.state,
                    continuousEffects: state.state.continuousEffects.slice(0, unaction.previousLength),
                };
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    let creatureCard = inPlay.byId(id);
                    if (creatureCard) {
                        creatureCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                unaction.magi.forEach(({ id, owner, energy }) => {
                    const activeMagi = state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, owner);
                    let magiCard = activeMagi.byId(id);
                    if (magiCard) {
                        magiCard.data.energy = energy;
                    }
                    state.state.log.pop();
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.hasAttacked = unaction.sourceHasAttacked;
                    source.data.attacked = unaction.sourceAttacked;
                }
                const target = inPlay.byId(unaction.targetId);
                if (target) {
                    target.data.wasAttacked = unaction.targetWasAttacked;
                }
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(unaction.sourceId);
                if (source) {
                    source.data.defeatedCreature = unaction.sourceDefeatedCreature;
                }
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                state.state.log.pop();
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                const source = inPlay.byId(unaction.sourceId);
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
            case types_1.UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                const creature = inPlay.byId(unaction.creatureId);
                if (creature) {
                    creature.data.energy = unaction.energy;
                    creature.data.energyLostThisTurn = unaction.energyLost;
                }
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                const activeMagi = state.getZone(index_1.ZONE_TYPE_ACTIVE_MAGI, unaction.owner);
                const magi = activeMagi.byId(unaction.magiId);
                if (magi) {
                    magi.data.energy = unaction.energy;
                    magi.data.energyLostThisTurn = unaction.energyLost;
                }
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                state.state = {
                    ...state.state,
                    prompt: unaction.previousPrompt,
                    promptMessage: unaction.previousPromptMessage,
                    promptPlayer: unaction.previousPromptPlayer,
                    promptType: unaction.previousPromptType,
                    promptVariable: unaction.previousPromptVariable,
                    promptGeneratedBy: unaction.previousPromptGeneratedBy,
                    promptParams: unaction.previousPromptParams,
                };
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
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
            case types_1.UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                const deck = state.getZone(index_1.ZONE_TYPE_DECK, unaction.player);
                const discard = state.getZone(index_1.ZONE_TYPE_DISCARD, unaction.player);
                // Restore deck to its previous state
                deck.cards = [...unaction.previousDeckCards];
                // Restore discard to its previous state
                discard.cards = [...unaction.previousDiscardCards];
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                // Remove all delayed triggers added after the captured length
                state.state = {
                    ...state.state,
                    delayedTriggers: state.state.delayedTriggers.slice(0, unaction.previousLength),
                };
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.energy = energy;
                    }
                });
                break;
            }
            case types_1.UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                const inPlay = state.getZone(index_1.ZONE_TYPE_IN_PLAY);
                unaction.creatures.forEach(({ id, attacked }) => {
                    const creature = inPlay.byId(id);
                    if (creature) {
                        creature.data.attacked = attacked;
                    }
                });
                break;
            }
            case types_1.UNMAKE_SELECT: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
            case types_1.UNMAKE_CALCULATION: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
            case types_1.UNMAKE_PROPERTY: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy);
                }
                else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy);
                }
                break;
            }
        }
    }
}
exports.Unmaker = Unmaker;
//# sourceMappingURL=unmaker.js.map