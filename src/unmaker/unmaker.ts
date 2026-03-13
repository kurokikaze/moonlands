import CardInGame from '../classes/CardInGame';
import { ACTION_PLAY, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_DRAW, EFFECT_TYPE_EXECUTE_POWER_EFFECTS, EFFECT_TYPE_MAGI_IS_DEFEATED } from '../const';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_PROMPT_ENTERED, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, State, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE, ACTION_PLAYER_WINS, ACTION_POWER, ACTION_RESOLVE_PROMPT, TYPE_MAGI } from '../index'
import { AnyEffectType, PromptTypeType, ZoneType } from '../types'
import { CardFlagsSnapshot, UNMAKE_CALCULATION, UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS, UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_MOVE_ENERGY, UNMAKE_EFFECT_TYPE_PLAYER_WINS, UNMAKE_EFFECT_TYPE_PROMPT_ENTERED, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD, UNMAKE_EFFECT_TYPE_START_OF_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_LOG_ENTRY, UNMAKE_POWER_ACTIVATION, UNMAKE_POWER_PAY, UNMAKE_POWER_USE, UNMAKE_PROMPT_LEAVE, UNMAKE_PROPERTY, UNMAKE_SELECT, UnAction } from './types';

const FLAG_WAS_ATTACKED = 1
const FLAG_HAS_ATTACKED = 2
const FLAG_IS_MAGI = 4

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
    37: 'UNMAKE_EFFECT_TYPE_PLAYER_WINS'
}

export class Unmaker {
    public unActions: UnAction[] = [];

    public dataBlob = new Uint16Array(300)
    public pointer = 0;
    public numberOfUnActions = 0;
    private strings: string[] = []
    private objects: any[] = []

    private historyStack: number[] = [];

    constructor(private state: State) {
        this.state.setOnAction(action => {
            const unAction = this.generateUnAction(action)
            if (unAction) {
                this.unActions.push(unAction)
            }
        }, true)
    }

    /*public setCheckpointOld() {
        this.historyStack.push(this.unActions.length)
    }*/

    public setCheckpoint() {
        this.historyStack.push(this.numberOfUnActions)
    }

    public outputDebug() {
        console.log(`Objects storage length: ${this.objects.length}`)
        console.log(`Strings storage length: ${this.strings.length}`)
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

    public revertToCheckpoint() {
        if (this.historyStack.length) {
            const target = this.historyStack.pop()
            if (typeof target !== 'number' || target > this.numberOfUnActions) {
                console.error(`Target: ${target}`)
                console.error(`Actions: ${this.numberOfUnActions}`)
                throw new Error()
            }

            const numberOfSteps = this.numberOfUnActions - target;
            for (let i = 0; i < numberOfSteps; i++) {
                this.readAndApplyUnAction(this.state)
            }
        }
    }

    private saveNumber(n: number) {
        this.dataBlob[this.pointer] = n
        this.pointer++
    }

    private saveActionType(t: number) {
        this.saveNumber(t)
        this.numberOfUnActions++
    }

    private readNumber(): number {
        this.pointer--
        return this.dataBlob[this.pointer]
    }

    private saveString(str: string) {
        const strPointer = this.strings.length
        this.strings.push(str)
        this.saveNumber(strPointer)
    }

    private readString(): string {
        const strPointer = this.readNumber()
        const str = this.strings[strPointer]
        if (strPointer == this.strings.length - 1) {
            this.strings.length--
        } else {
            delete this.strings[strPointer]
        }
        return str
    }

    private saveObject(obj: any) {
        const objPointer = this.objects.length
        this.objects.push(obj)
        this.saveNumber(objPointer)
    }

    private readObject<T>(): T {
        const objPointer = this.readNumber()
        const obj = this.objects[objPointer]
        if (objPointer == this.objects.length - 1) {
            this.objects.length--
        } else {
            delete this.objects[objPointer]
        }
        return obj
    }

    public generateUnAction(action: AnyEffectType): UnAction | undefined {
        switch (action.type) {
            case ACTION_RESOLVE_PROMPT: {
                this.saveNumber(this.state.state.promptPlayer as number)
                this.saveObject([...this.state.state.savedActions])
                this.saveObject(this.state.state.promptParams)
                this.saveString(this.state.state.promptMessage as string)
                this.saveString(this.state.state.promptGeneratedBy as string)
                this.saveString(this.state.state.promptType as string)
                this.saveActionType(UNMAKE_PROMPT_LEAVE)
                return {
                    type: UNMAKE_PROMPT_LEAVE,
                    promptType: this.state.state.promptType,
                    promptGeneratedBy: this.state.state.promptGeneratedBy,
                    promptMessage: this.state.state.promptMessage,
                    promptParams: this.state.state.promptParams,
                    savedActions: [...this.state.state.savedActions],
                    player: this.state.state.promptPlayer,
                }
            }
            case ACTION_POWER: {
                this.saveString(action.power.name)
                this.saveString(action.source.id)
                this.saveNumber(action.source.owner)
                this.saveNumber(action.source.card.type == TYPE_MAGI ? 1 : 0)
                this.saveActionType(UNMAKE_POWER_ACTIVATION)
                return {
                    type: UNMAKE_POWER_ACTIVATION,
                    magi: action.source.card.type == TYPE_MAGI,
                    player: action.source.owner,
                    source: action.source.id,
                    power: action.power.name,
                }
            }
            case ACTION_PLAYER_WINS: {
                this.saveActionType(UNMAKE_EFFECT_TYPE_PLAYER_WINS)
                return {
                    type: UNMAKE_EFFECT_TYPE_PLAYER_WINS,
                }
            }
            case ACTION_PLAY: {
                this.saveActionType(UNMAKE_LOG_ENTRY)
                return {
                    type: UNMAKE_LOG_ENTRY,
                }
            }
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DRAW: {
                        this.saveActionType(UNMAKE_LOG_ENTRY)
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        }
                    }
                    case EFFECT_TYPE_CREATURE_ATTACKS: {
                        this.saveActionType(UNMAKE_LOG_ENTRY)
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        }
                    }
                    case EFFECT_TYPE_MAGI_IS_DEFEATED: {
                        this.saveActionType(UNMAKE_LOG_ENTRY)
                        return {
                            type: UNMAKE_LOG_ENTRY,
                        }
                    }
                    case EFFECT_TYPE_BEFORE_DAMAGE: {
                        let flags = 0
                        if (action.target.data.wasAttacked) flags = flags | FLAG_WAS_ATTACKED
                        if (action.source.data.hasAttacked) flags = flags | FLAG_HAS_ATTACKED
                        if (action.target.card.type == TYPE_MAGI) flags = flags | FLAG_IS_MAGI
                        this.saveNumber(flags)
                        this.saveNumber(action.source.data.attacked)
                        this.saveNumber(action.target.owner)
                        this.saveString(action.target.id)
                        this.saveString(action.source.id)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE,
                            sourceId: action.source.id,
                            targetId: action.target.id,
                            targetMagi: action.target.card.type == TYPE_MAGI,
                            targetPlayer: action.target.owner,
                            sourceHasAttacked: action.source.data.hasAttacked,
                            sourceAttacked: action.source.data.attacked,
                            targetWasAttacked: action.target.data.wasAttacked,
                        }
                    }
                    case EFFECT_TYPE_EXECUTE_POWER_EFFECTS: {
                        const source: CardInGame = this.state.getMetaValue(action.source, action.generatedBy)
                        this.saveString(typeof action.power == 'string' ? action.power : action.power.name)
                        this.saveString(source.id)
                        this.saveNumber(source.owner)
                        this.saveNumber(source.card.type == TYPE_MAGI ? 1 : 0)
                        this.saveActionType(UNMAKE_POWER_USE)
                        return {
                            type: UNMAKE_POWER_USE,
                            magi: source.card.type == TYPE_MAGI,
                            player: source.owner,
                            source: source.id,
                            power: typeof action.power == 'string' ? action.power : action.power.name,
                        }
                    }
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        const creatures: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        let creatureArray = []
                        if (creatures instanceof CardInGame) {
                            creatureArray.push({
                                    id: creatures.id,
                                    energy: creatures.data.energy,
                                    energyLostThisTurn: creatures.data.energyLostThisTurn
                                })
                        } else {
                            for (let i = 0; i < creatures.length; i++) {
                                const creature = creatures[i]
                                creatureArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                    energyLostThisTurn: creature.data.energyLostThisTurn
                                })
                            }                            
                        }
                        this.saveObject(creatureArray)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatureArray
                        }
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        const magiTargets: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        let magiArray = []
                        if (magiTargets instanceof CardInGame) {
                            magiArray.push({
                                    id: magiTargets.id,
                                    owner: magiTargets.owner,
                                    energy: magiTargets.data.energy,
                                    energyLost: magiTargets.data.energyLostThisTurn,
                            })
                        } else {
                            for (let i = 0; i < magiTargets.length; i++) {
                                const magi = magiTargets[i]
                                magiArray.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy,
                                    energyLost: magi.data.energyLostThisTurn
                                })
                            }
                        }
                        this.saveObject(magiArray)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI)
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                            magi: magiArray
                        }
                    case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                        const zoneChangingTarget = this.state.getMetaValue(action.target, action.generatedBy)
                        const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget
                        if (zoneChangingCard) {
                            const sourceZoneType = this.state.getMetaValue(action.sourceZone, action.generatedBy)
                            const destinationZoneType = this.state.getMetaValue(action.destinationZone, action.generatedBy)
                            const sourceZone = this.state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner)
                            const position = sourceZone.cards.findIndex(card => card.id === zoneChangingCard.id)

                            // Capture the current spellMetaData values that will be modified
                            const metaDataEntries = []
                            if (action.generatedBy) {
                                const generatedByMeta = this.state.getSpellMetadata(action.generatedBy)
                                metaDataEntries.push({
                                    spellId: action.generatedBy,
                                    field: 'new_card',
                                    previousValue: generatedByMeta?.new_card,
                                })
                            }
                            const cardIdMeta = this.state.getSpellMetadata(zoneChangingCard.id)
                            metaDataEntries.push({
                                spellId: zoneChangingCard.id,
                                field: 'new_card',
                                previousValue: cardIdMeta?.new_card,
                            })

                            this.saveObject(metaDataEntries)
                            this.saveNumber(action.bottom ? 1 : 0)
                            this.saveNumber(position)
                            this.saveString(destinationZoneType)
                            this.saveNumber(zoneChangingCard.owner)
                            this.saveString(sourceZoneType)
                            this.saveObject(zoneChangingCard)
                            this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES)
                            return {
                                type: UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                                card: zoneChangingCard,
                                sourceZone: sourceZoneType,
                                sourceZoneOwner: zoneChangingCard.owner,
                                destinationZone: destinationZoneType,
                                position,
                                bottom: action.bottom || false,
                                metaDataEntries,
                            }
                        }
                    }
                    case EFFECT_TYPE_DIE_ROLLED: {
                        if (action.generatedBy) {
                            const currentMeta = this.state.getSpellMetadata(action.generatedBy)
                            this.saveNumber(currentMeta?.roll_result as number)
                            this.saveString(action.generatedBy)
                            this.saveActionType(UNMAKE_EFFECT_TYPE_DIE_ROLLED)
                            return {
                                type: UNMAKE_EFFECT_TYPE_DIE_ROLLED,
                                spellId: action.generatedBy,
                                previousRollResult: currentMeta?.roll_result,
                            }
                        }
                    }
                    case EFFECT_TYPE_START_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        const cardFlags: Record<string, CardFlagsSnapshot> = {}
                        const player = action.player

                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === player)
                        for (const creature of creatures) {
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: [...creature.data.actionsUsed],
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            }
                        }

                        // Capture relic flags (relics controlled by the player)
                        const relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_RELIC && card.data.controller === player)
                        for (const relic of relics) {
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: [...relic.data.actionsUsed],
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            }
                        }

                        // Capture magi flags
                        const activeMagi = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.card
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: [...activeMagi.data.actionsUsed],
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            }
                        }

                        this.saveObject(cardFlags)
                        this.saveObject([...this.state.state.continuousEffects])
                        this.saveNumber(this.state.state.step as number)
                        this.saveNumber(this.state.state.activePlayer)
                        this.saveNumber(this.state.turn as number)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_TURN)
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_TURN,
                            previousTurn: this.state.turn,
                            previousActivePlayer: this.state.state.activePlayer,
                            previousStep: this.state.state.step,
                            previousContinuousEffects: [...this.state.state.continuousEffects],
                            cardFlags,
                        }
                    }
                    case EFFECT_TYPE_START_OF_TURN: {
                        // Capture card flags for creatures, relics, and magi that will be cleared by START_OF_TURN
                        const cardFlags: Record<string, CardFlagsSnapshot> = {}
                        const player = action.player

                        // Capture creature flags (creatures controlled by the player)
                        const creatures = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === player)
                        for (const creature of creatures) {
                            cardFlags[creature.id] = {
                                id: creature.id,
                                actionsUsed: [...creature.data.actionsUsed],
                                wasAttacked: creature.data.wasAttacked,
                                hasAttacked: creature.data.hasAttacked,
                                attacked: creature.data.attacked,
                                defeatedCreature: creature.data.defeatedCreature,
                                energyLostThisTurn: creature.data.energyLostThisTurn,
                            }
                        }

                        // Capture relic flags (relics controlled by the player)
                        const relics = this.state.getZone(ZONE_TYPE_IN_PLAY).cards
                            .filter(card => card.card.type === TYPE_RELIC && card.data.controller === player)
                        for (const relic of relics) {
                            cardFlags[relic.id] = {
                                id: relic.id,
                                actionsUsed: [...relic.data.actionsUsed],
                                wasAttacked: relic.data.wasAttacked,
                                hasAttacked: relic.data.hasAttacked,
                                attacked: relic.data.attacked,
                                defeatedCreature: relic.data.defeatedCreature,
                                energyLostThisTurn: relic.data.energyLostThisTurn,
                            }
                        }

                        // Capture magi flags
                        const activeMagi = this.state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.card
                        if (activeMagi) {
                            cardFlags[activeMagi.id] = {
                                id: activeMagi.id,
                                actionsUsed: [...activeMagi.data.actionsUsed],
                                wasAttacked: activeMagi.data.wasAttacked,
                                hasAttacked: activeMagi.data.hasAttacked,
                                attacked: activeMagi.data.attacked,
                                defeatedCreature: activeMagi.data.defeatedCreature,
                                energyLostThisTurn: activeMagi.data.energyLostThisTurn,
                            }
                        }

                        this.saveObject(cardFlags)
                        this.saveNumber(player)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_OF_TURN)
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_OF_TURN,
                            player,
                            cardFlags,
                        }
                    }
                    case EFFECT_TYPE_START_STEP: {
                        this.saveNumber(this.state.state.step as number)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_START_STEP)
                        return {
                            type: UNMAKE_EFFECT_TYPE_START_STEP,
                            previousStep: this.state.state.step,
                        }
                    }
                    case EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                        const zone = this.state.getMetaValue(action.zone, action.generatedBy)
                        const zoneOwner = this.state.getMetaValue(action.zoneOwner, action.generatedBy)
                        const zoneContent = this.state.getZone(zone, zoneOwner).cards
                        const cardsOrder: string[] = this.state.getMetaValue(action.cards, action.generatedBy)

                        // Capture the original order of the cards that will be rearranged
                        const previousOrder: string[] = []
                        for (let i = 0; i < cardsOrder.length && i < zoneContent.length; i++) {
                            previousOrder.push(zoneContent[i].id)
                        }

                        this.saveObject(previousOrder)
                        this.saveNumber(zoneOwner)
                        this.saveString(zone)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone,
                            zoneOwner,
                            previousOrder,
                        }
                    }
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        this.saveNumber(this.state.state.continuousEffects.length)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT)
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                            previousLength: this.state.state.continuousEffects.length,
                        }
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                        const creatures: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        const creaturesArray = []
                        if (creatures instanceof CardInGame) {
                            creaturesArray.push({
                                id: creatures.id,
                                energy: creatures.data.energy,
                            })
                        } else {
                            for (let i = 0; i < creatures.length; i++) {
                                const creature = creatures[i]
                                creaturesArray.push({
                                    id: creature.id,
                                    energy: creature.data.energy
                                })
                            }
                        }
                        this.saveObject(creaturesArray)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                            creatures: creaturesArray
                        }
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                        const magiTargets: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        let magiArray = []
                        if (magiTargets instanceof CardInGame) {
                            magiArray.push({
                                id: magiTargets.id,
                                owner: magiTargets.owner,
                                energy: magiTargets.data.energy,
                            })
                        } else {
                            for (let i = 0; i < magiTargets.length; i++) {
                                const magi = magiTargets[i]
                                magiArray.push({
                                    id: magi.id,
                                    owner: magi.owner,
                                    energy: magi.data.energy
                                })
                            }
                        }
                        this.saveObject(magiArray)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI)
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiArray
                        }
                    }
                    case EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                        const source = action.source
                        this.saveNumber(source.data.defeatedCreature ? 1 : 0)
                        this.saveObject(source)
                        this.saveString(source.id)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                            sourceId: source.id,
                            source: source,
                            sourceDefeatedCreature: source.data.defeatedCreature,
                        }
                    }
                    case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY)
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
                        }
                    }
                    case EFFECT_TYPE_MOVE_ENERGY: {
                        const moveMultiSource: CardInGame | CardInGame[] = this.state.getMetaValue(action.source, action.generatedBy);
                        const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
                        const moveMultiTarget = this.state.getMetaValue(action.target, action.generatedBy);
                        const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;

                        this.saveString(moveSource.id)
                        this.saveNumber(moveSource.card.type == TYPE_MAGI ? 1 : 0)
                        this.saveNumber(moveSource.owner)
                        this.saveString(moveTarget.id)
                        this.saveNumber(moveTarget.card.type == TYPE_MAGI ? 1 : 0)
                        this.saveNumber(moveTarget.owner)
                        this.saveNumber(moveSource.data.energy)
                        this.saveNumber(moveSource.data.energyLostThisTurn)
                        this.saveNumber(moveTarget.data.energy)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_MOVE_ENERGY)

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
                        }
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                        const creature: CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        this.saveNumber(creature.data.energyLostThisTurn)
                        this.saveNumber(creature.data.energy)
                        this.saveString(creature.id)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                            creatureId: creature.id,
                            energy: creature.data.energy,
                            energyLost: creature.data.energyLostThisTurn
                        }
                    }
                    case EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                        const magi: CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        this.saveNumber(magi.data.energyLostThisTurn)
                        this.saveNumber(magi.data.energy)
                        this.saveNumber(magi.owner)
                        this.saveString(magi.id)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI)
                        return {
                            type: UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                            magiId: magi.id,
                            owner: magi.owner,
                            energy: magi.data.energy,
                            energyLost: magi.data.energyLostThisTurn
                        }
                    }
                    case EFFECT_TYPE_PROMPT_ENTERED: {
                        this.saveObject({ ...this.state.state.promptParams })
                        this.saveString(this.state.state.promptGeneratedBy as string)
                        this.saveString(this.state.state.promptVariable as string)
                        this.saveString(this.state.state.promptType as string)
                        this.saveNumber(this.state.state.promptPlayer as number)
                        this.saveString(this.state.state.promptMessage as string)
                        this.saveNumber(this.state.state.prompt ? 1 : 0)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_PROMPT_ENTERED)
                        return {
                            type: UNMAKE_EFFECT_TYPE_PROMPT_ENTERED,
                            previousPrompt: this.state.state.prompt,
                            previousPromptMessage: this.state.state.promptMessage,
                            previousPromptPlayer: this.state.state.promptPlayer,
                            previousPromptType: this.state.state.promptType,
                            previousPromptVariable: this.state.state.promptVariable,
                            previousPromptGeneratedBy: this.state.state.promptGeneratedBy,
                            previousPromptParams: { ...this.state.state.promptParams },
                        }
                    }
                    case EFFECT_TYPE_FIND_STARTING_CARDS: {
                        const currentMeta = this.state.getSpellMetadata(action.generatedBy)
                        this.saveObject(currentMeta?.foundCards as unknown as string[] | undefined)
                        this.saveString(action.generatedBy)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS)
                        return {
                            type: UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS,
                            spellId: action.generatedBy,
                            previousFoundCards: currentMeta?.foundCards as unknown as string[] | undefined,
                        }
                    }
                    case EFFECT_TYPE_RESHUFFLE_DISCARD: {
                        const player = this.state.getMetaValue(action.player, action.generatedBy)
                        const deck = this.state.getZone(ZONE_TYPE_DECK, player)
                        const discard = this.state.getZone(ZONE_TYPE_DISCARD, player)
                        this.saveObject([...deck.cards])
                        this.saveObject([...discard.cards])
                        this.saveNumber(player)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD)
                        return {
                            type: UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD,
                            player,
                            previousDeckCards: [...deck.cards],
                            previousDiscardCards: [...discard.cards],
                        }
                    }
                    case EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                        this.saveNumber(this.state.state.delayedTriggers.length)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER)
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER,
                            previousLength: this.state.state.delayedTriggers.length,
                        }
                    }
                    case EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                        const energyArrangement: Record<string, number> = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy)
                        const affectedCreatureIds = Object.keys(energyArrangement)
                        const inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY)
                        const creatures: { id: string, energy: number }[] = []
                        for (const creatureId of affectedCreatureIds) {
                            const creature = inPlay.byId(creatureId)
                            if (creature) {
                                creatures.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                })
                            }
                        }
                        this.saveObject(creatures)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES)
                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
                            creatures,
                        }
                    }
                    case EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                        const energyArrangement: Record<string, number> = this.state.getMetaValue(action.energyOnCreatures, action.generatedBy)
                        const affectedCreatureIds = Object.keys(energyArrangement)
                        const inPlay = this.state.getZone(ZONE_TYPE_IN_PLAY)
                        const creatures: { id: string, energy: number }[] = []
                        for (const creatureId of affectedCreatureIds) {
                            const creature = inPlay.byId(creatureId)
                            if (creature) {
                                creatures.push({
                                    id: creature.id,
                                    energy: creature.data.energy,
                                })
                            }
                        }
                        this.saveObject(creatures)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES)
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
                            creatures,
                        }
                    }
                    case EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                        const targets: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        const creatures: { id: string, attacked: number }[] = []
                        if (targets instanceof CardInGame) {
                            creatures.push({
                                id: targets.id,
                                attacked: targets.data.attacked,
                            })
                        } else if (targets instanceof Array) {
                            for (const target of targets) {
                                creatures.push({
                                    id: target.id,
                                    attacked: target.data.attacked,
                                })
                            }
                        }
                        this.saveObject(creatures)
                        this.saveActionType(UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE)
                        return {
                            type: UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
                            creatures,
                        }
                    }
                }
                break
            }
            case ACTION_CALCULATE: {
                const generatedBy = action?.generatedBy || 'thegame'
                const previousMetadata = this.state.state.spellMetaData[generatedBy]
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata)
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable!])
                this.saveNumber(wasEmpty ? 1 : 0)
                this.saveString(action.variable || '')
                this.saveString(generatedBy)
                this.saveActionType(UNMAKE_CALCULATION)
                return {
                    type: UNMAKE_CALCULATION,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable!]
                }
            }
            case ACTION_SELECT: {
                const generatedBy = action?.generatedBy || 'thegame'
                const previousMetadata = this.state.state.spellMetaData[generatedBy]
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata)
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable!])
                this.saveNumber(wasEmpty ? 1 : 0)
                this.saveString(action.variable || '')
                this.saveString(generatedBy)
                this.saveActionType(UNMAKE_SELECT)
                return {
                    type: UNMAKE_SELECT,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable!]
                }
            }
            case ACTION_GET_PROPERTY_VALUE: {
                const generatedBy = action?.generatedBy || 'thegame'
                const previousMetadata = this.state.state.spellMetaData[generatedBy]
                const wasEmpty = !previousMetadata || !action.variable || !(action.variable in previousMetadata)
                this.saveObject(wasEmpty ? null : previousMetadata[action.variable!])
                this.saveNumber(wasEmpty ? 1 : 0)
                this.saveString(action.variable || '')
                this.saveString(generatedBy)
                this.saveActionType(UNMAKE_PROPERTY)
                return {
                    type: UNMAKE_PROPERTY,
                    generatedBy,
                    variable: action.variable || '',
                    wasEmpty,
                    previousValue: wasEmpty ? null : previousMetadata[action.variable!]
                }
            }
        }
    }

    public readAndApplyUnAction(state: State) {
        const unAction = this.readNumber() as UnAction['type']
        switch(unAction) {
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
            case UNMAKE_LOG_ENTRY:
                state.state.log.length--;
                break;
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS:
                state.unsetWinner();
                break;
            case UNMAKE_PROMPT_LEAVE: {
                const promptType = this.readString() as PromptTypeType
                const promptGeneratedBy = this.readString()
                const promptMessage = this.readString()
                const promptParams = this.readObject<Object>()
                const savedActions = this.readObject<any[]>()
                const promptPlayer = this.readNumber()

                state.state.prompt = true
                state.state.promptType = promptType
                state.state.promptGeneratedBy = promptGeneratedBy
                state.state.promptPlayer = promptPlayer
                state.state.promptMessage = promptMessage
                state.state.promptParams = promptParams
                state.state.savedActions = savedActions

                state.state.log.length--
                break;
            }
            case UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                const prompt = this.readNumber() == 1;
                const promptMessage = this.readString()
                const promptPlayer = this.readNumber()
                const promptType = this.readString() as PromptTypeType
                const promptVariable = this.readString()
                const promptGeneratedBy = this.readString()
                const promptParams = this.readObject<Object>()

                state.state.prompt = prompt
                state.state.promptMessage = promptMessage
                state.state.promptPlayer = promptPlayer
                state.state.promptType = promptType
                state.state.promptVariable = promptVariable
                state.state.promptGeneratedBy = promptGeneratedBy
                state.state.promptParams = promptParams
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                const creatures = this.readObject<{id: string, energy: number}[]>()
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                for (let i = 0; i < creatures.length; i++) {
                    const {id, energy} = creatures[i]
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                    }
                    state.state.log.length--
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                const zoneChangingCard = this.readObject<CardInGame>()
                const sourceZoneType = this.readString() as unknown as ZoneType
                const cardOwner = this.readNumber()
                const destinationZoneType = this.readString() as unknown as ZoneType
                const position = this.readNumber()
                const bottom = this.readNumber() == 1
                const metaDataEntries = this.readObject<{spellId: string, field: string, previousValue: any}[]>()

                const destZone = state.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner)
                const sourceZone = state.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : cardOwner)
                // Remove the new card from destination zone
                if (bottom) {
                    destZone.cards.pop()
                } else {
                    destZone.cards.shift()
                }
                // Re-add original card at its original position in source zone
                sourceZone.cards.splice(position, 0, zoneChangingCard)

                // Restore spellMetaData fields to their previous values
                for (const entry of metaDataEntries) {
                    // const currentMeta = state.getSpellMetadata(entry.spellId)
                    if (entry.previousValue === undefined) {
                        // Field didn't exist before, remove it
                        state.clearSpellMetaDataField(entry.field, entry.spellId)
                    } else {
                        // Restore to previous value
                        state.setSpellMetaDataField(entry.field, entry.previousValue, entry.spellId)
                    }
                }
                if (sourceZoneType === ZONE_TYPE_IN_PLAY || destinationZoneType === ZONE_TYPE_IN_PLAY) {
                    state.clearModifiedCardDataCache()
                }
                break;
            }
            case UNMAKE_POWER_USE: {
                const isMagi = this.readNumber() == 1;
                const owner = this.readNumber();
                const sourceId = this.readString();
                const powerName = this.readString();

                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    target = zone.card
                    if (target && target.id !== sourceId) {
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${sourceId}`)
                    }
                } else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId)
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != powerName)
                }
                break;
            }
            case UNMAKE_POWER_ACTIVATION: {
                const isMagi = this.readNumber() == 1
                const owner = this.readNumber()
                const sourceId = this.readString()
                const powerName = this.readString()
                var target;
                if (isMagi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    target = zone.card
                    if (target && target.id !== sourceId) {
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${sourceId}`)
                    }
                } else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(sourceId)
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != powerName)
                    state.state.log.length--
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                const creatures = this.readObject<{id: string, energy: number, energyLostThisTurn: number}[]>()
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                for (let i = 0; i < creatures.length; i++) {
                    const { id, energy, energyLostThisTurn } = creatures[i]
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn
                    }
                    state.state.log.length--
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                const magi = this.readObject<{id: string, owner: number, energy: number, energyLost: number}[]>()
                for (const { id, owner, energy, energyLost } of magi) {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                        magiCard.data.energyLostThisTurn = energyLost
                    }
                    state.state.log.length--
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
               const generatedBy = this.readString()
               const previousRollResult = this.readNumber()
               if (previousRollResult === undefined) {
                    // Field didn't exist before, remove it
                    state.clearSpellMetaDataField('roll_result', generatedBy)
                } else {
                    // Restore to previous value
                    state.setSpellMetaDataField('roll_result', previousRollResult, generatedBy)
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                const turn = this.readNumber()
                const activePlayer = this.readNumber()
                const step = this.readNumber()
                const continuousEffect = this.readObject<any[]>()
                const cardFlags = this.readObject<Record<string, { wasAttacked: boolean, hasAttacked: boolean, attacked: number, actionsUsed: string[], defeatedCreature: boolean, energyLostThisTurn: number}>>()

                state.turn = turn
                state.state.activePlayer = activePlayer
                state.state.step = step
                state.state.continuousEffects = continuousEffect;
                state.clearModifiedCardDataCache()

                // Restore card flags
                const flagEntries = Object.entries(cardFlags)
                for (let i = 0; i < flagEntries.length; i++) {
                    const [cardId, flags] = flagEntries[i]
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId)
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId)
                            if (card) break
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed]
                        card.data.wasAttacked = flags.wasAttacked
                        card.data.hasAttacked = flags.hasAttacked
                        card.data.attacked = flags.attacked
                        card.data.defeatedCreature = flags.defeatedCreature
                        card.data.energyLostThisTurn = flags.energyLostThisTurn
                    }
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_STEP: {
                state.state.step = this.readNumber()
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                const zone = this.readString() as ZoneType
                const owner = this.readNumber()
                const previousOrder = this.readObject<string[]>()

                const zoneContent = state.getZone(zone, owner).cards
                const cardsToRearrange: Record<string, CardInGame> = {}

                // Build a map of the cards that need to be rearranged
                for (let i = 0; i < previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange[zoneContent[i].id] = zoneContent[i]
                }

                // Restore to the previous order
                const newZoneContent = [
                    ...previousOrder.map(id => cardsToRearrange[id]),
                    ...zoneContent.slice(previousOrder.length),
                ]

                state.getZone(zone, owner).cards = newZoneContent
                break;
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                const sourceId = this.readString()
                const sourceCard = this.readObject<CardInGame>()
                const defeatedCreature = this.readNumber() == 1

                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const source = inPlay.byId(sourceId)
                if (source) {
                    source.data.defeatedCreature = defeatedCreature
                } else {
                    // Sometimes the status changes after the card is moved to the discard (on the original action card)
                    sourceCard.data.defeatedCreature = defeatedCreature;
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                const effectsLength = this.readNumber()
                state.state.continuousEffects = state.state.continuousEffects.slice(0, effectsLength)
                state.clearModifiedCardDataCache()
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                const magiArray = this.readObject<{id: string, owner: number, energy: number}[]>()
                magiArray.forEach(({ id, owner, energy }) => {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                    }
                    state.state.log.length--
                })
                break;
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                const player = this.readNumber()
                const cardFlags = this.readObject<Record<string, {actionsUsed: string[],wasAttacked: boolean, hasAttacked: boolean, attacked: number, defeatedCreature: boolean,energyLostThisTurn:number}>>()
                for (const [cardId, flags] of Object.entries(cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId)
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId)
                            if (card) break
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed]
                        card.data.wasAttacked = flags.wasAttacked
                        card.data.hasAttacked = flags.hasAttacked
                        card.data.attacked = flags.attacked
                        card.data.defeatedCreature = flags.defeatedCreature
                        card.data.energyLostThisTurn = flags.energyLostThisTurn
                    }
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                const sourceId = this.readString()
                const targetId = this.readString()
                const owner = this.readNumber()
                const attacked = this.readNumber()
                const flags = this.readNumber()

                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const source = inPlay.byId(sourceId)
                if (source) {
                    source.data.hasAttacked = (flags & FLAG_HAS_ATTACKED) > 0
                    source.data.attacked = attacked
                }
                let target;
                if (flags & FLAG_IS_MAGI) {
                    target = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner).card
                } else {
                    target = inPlay.byId(targetId);
                }
                if (target) {
                    target.data.wasAttacked = (flags & FLAG_WAS_ATTACKED) > 0
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                const targetEnergy = this.readNumber()
                const sourceEnergyLost = this.readNumber()
                const sourceEnergy = this.readNumber()
                const targetOwner = this.readNumber()
                const targetIsMagi = this.readNumber() == 1
                const targetId = this.readString()
                const sourceOwner = this.readNumber()
                const sourceIsMagi = this.readNumber() == 1
                const sourceId = this.readString()

                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                let source
                if (sourceIsMagi) {
                    source = state.getZone(ZONE_TYPE_ACTIVE_MAGI, sourceOwner).card
                } else {
                    source = inPlay.byId(sourceId);
                }
                if (source) {
                    source.data.energy = sourceEnergy
                    source.data.energyLostThisTurn = sourceEnergyLost
                }
                let target
                if (targetIsMagi) {
                    target
                } else {
                    target = inPlay.byId(targetId)
                }
                if (target) {
                    target.data.energy = targetEnergy
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                const creatureId = this.readString()
                const energy = this.readNumber()
                const energyLost = this.readNumber()

                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const creature = inPlay.byId(creatureId)
                if (creature) {
                    creature.data.energy = energy
                    creature.data.energyLostThisTurn = energyLost
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                const magiId = this.readString()
                const magiOwner = this.readNumber()
                const energy = this.readNumber()
                const energyLost = this.readNumber()
                const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, magiOwner)
                const magi = activeMagi.byId(magiId)
                if (magi) {
                    magi.data.energy = energy
                    magi.data.energyLostThisTurn = energyLost
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                const generatedBy = this.readString()
                const foundCards = this.readObject<string[]|undefined>()
                state.state.log.length--
                if (foundCards === undefined) {
                    state.clearSpellMetaDataField('foundCards', generatedBy)
                } else {
                    // Restore to previous value
                    state.setSpellMetaDataField('foundCards', foundCards, generatedBy)
                }
                break;
            }
            case UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                const player = this.readNumber()
                const discardCards = this.readObject<CardInGame[]>()
                const deckCards = this.readObject<CardInGame[]>()

                const deck = state.getZone(ZONE_TYPE_DECK, player)
                const discard = state.getZone(ZONE_TYPE_DISCARD, player)
                // Restore deck to its previous state
                deck.cards = [...deckCards]
                // Restore discard to its previous state
                discard.cards = [...discardCards]
                break;
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                const triggersLength = this.readNumber()
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, triggersLength)
                break
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const creatures = this.readObject<{id: string, energy: number}[]>()
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.energy = energy
                    }
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const creatures = this.readObject<{id: string, energy: number}[]>()
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.energy = energy
                    }
                })
                break;
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                const creatures = this.readObject<{id: string, attacked: number}[]>()
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                creatures.forEach(({ id, attacked }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.attacked = attacked
                    }
                })
                break;
            }
            case UNMAKE_CALCULATION: {
                const generatedBy = this.readString()
                const variable = this.readString()
                const wasEmpty = this.readNumber() == 1
                const value = this.readObject()
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy)
                } else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy)
                }
                break
            }
            case UNMAKE_SELECT: {
                const generatedBy = this.readString()
                const variable = this.readString()
                const wasEmpty = this.readNumber() == 1
                const value = this.readObject()

                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy)
                } else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy)
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                const generatedBy = this.readString()
                const variable = this.readString()
                const wasEmpty = this.readNumber() == 1
                const value = this.readObject()
                if (wasEmpty) {
                    this.state.clearSpellMetaDataField(variable, generatedBy)
                } else {
                    this.state.setSpellMetaDataField(variable, value, generatedBy)
                }
                break;
            }
        }
        this.numberOfUnActions--
    }

    public applyUnAction(state: State, unaction: UnAction) {
        switch (unaction.type) {
            case UNMAKE_EFFECT_TYPE_PLAYER_WINS: {
                state.unsetWinner()
                break;
            }
            case UNMAKE_POWER_ACTIVATION: {
                var target;
                if (unaction.magi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.player)
                    target = zone.card
                    if (target && target.id !== unaction.source) {
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${unaction.source}`)
                    }
                } else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source)
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != unaction.power)
                    state.state.log.length--
                }
                break;
            }
            case UNMAKE_POWER_USE: {
                var target;
                if (unaction.magi) {
                    var zone = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.player)
                    target = zone.card
                    if (target && target.id !== unaction.source) {
                        console.error(`Unmaking power use but ID doesn't match type and player: ${target.id} != ${unaction.source}`)
                    }
                } else {
                    target = state.getZone(ZONE_TYPE_IN_PLAY).byId(unaction.source)
                }
                if (target) {
                    target.data.actionsUsed = target.data.actionsUsed.filter(action => action != unaction.power)
                }
                break;
            }
            case UNMAKE_PROMPT_LEAVE: {
                state.state.prompt = true
                state.state.promptType = unaction.promptType
                state.state.promptGeneratedBy = unaction.promptGeneratedBy
                state.state.promptPlayer = unaction.player
                state.state.promptMessage = unaction.promptMessage
                state.state.promptParams = unaction.promptParams
                state.state.savedActions = unaction.savedActions

                state.state.log.length--
                break;
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({ id, energy, energyLostThisTurn }) => {
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                        creatureCard.data.energyLostThisTurn = energyLostThisTurn
                    }
                    state.state.log.length--
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                for (const { id, owner, energy, energyLost } of unaction.magi) {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                        magiCard.data.energyLostThisTurn = energyLost
                    }
                    state.state.log.length--
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES: {
                const destZone = state.getZone(unaction.destinationZone, unaction.destinationZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner)
                const sourceZone = state.getZone(unaction.sourceZone, unaction.sourceZone === ZONE_TYPE_IN_PLAY ? null : unaction.sourceZoneOwner)
                // Remove the new card from destination zone
                if (unaction.bottom) {
                    destZone.cards.pop()
                } else {
                    destZone.cards.shift()
                }
                // Re-add original card at its original position in source zone
                sourceZone.cards.splice(unaction.position, 0, unaction.card)

                // Restore spellMetaData fields to their previous values
                for (const entry of unaction.metaDataEntries) {
                    const currentMeta = state.getSpellMetadata(entry.spellId)
                    if (entry.previousValue === undefined) {
                        // Field didn't exist before, remove it
                        state.clearSpellMetaDataField(entry.field, entry.spellId)
                    } else {
                        // Restore to previous value
                        state.setSpellMetaDataField(entry.field, entry.previousValue, entry.spellId)
                    }
                }
                if (unaction.sourceZone === ZONE_TYPE_IN_PLAY || unaction.destinationZone === ZONE_TYPE_IN_PLAY) {
                    state.clearModifiedCardDataCache()
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                // const currentMeta = state.getSpellMetadata(unaction.spellId)
                if (unaction.previousRollResult === undefined) {
                    // Field didn't exist before, remove it
                    state.clearSpellMetaDataField('roll_result', unaction.spellId)
                } else {
                    // Restore to previous value
                    state.setSpellMetaDataField('roll_result', unaction.previousRollResult, unaction.spellId)
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                state.turn = unaction.previousTurn
                state.state.activePlayer = unaction.previousActivePlayer
                state.state.step = unaction.previousStep
                state.state.continuousEffects = unaction.previousContinuousEffects;
                state.clearModifiedCardDataCache()

                // Restore card flags
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId)
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId)
                            if (card) break
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed]
                        card.data.wasAttacked = flags.wasAttacked
                        card.data.hasAttacked = flags.hasAttacked
                        card.data.attacked = flags.attacked
                        card.data.defeatedCreature = flags.defeatedCreature
                        card.data.energyLostThisTurn = flags.energyLostThisTurn
                    }
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_START_OF_TURN: {
                // Restore card flags
                for (const [cardId, flags] of Object.entries(unaction.cardFlags)) {
                    // Try to find the card in play (creatures and relics)
                    let card = state.getZone(ZONE_TYPE_IN_PLAY).byId(cardId)
                    // If not in play, check all players' active magi zones
                    if (!card) {
                        for (const player of state.players) {
                            card = state.getZone(ZONE_TYPE_ACTIVE_MAGI, player)?.byId(cardId)
                            if (card) break
                        }
                    }
                    if (card) {
                        card.data.actionsUsed = [...flags.actionsUsed]
                        card.data.wasAttacked = flags.wasAttacked
                        card.data.hasAttacked = flags.hasAttacked
                        card.data.attacked = flags.attacked
                        card.data.defeatedCreature = flags.defeatedCreature
                        card.data.energyLostThisTurn = flags.energyLostThisTurn
                    }
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_START_STEP: {
                state.state.step = unaction.previousStep;
                break
            }
            case UNMAKE_LOG_ENTRY: {
                state.state.log.length--
                break;
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE: {
                const zoneContent = state.getZone(unaction.zone, unaction.zoneOwner).cards
                const cardsToRearrange: Record<string, CardInGame> = {}

                // Build a map of the cards that need to be rearranged
                for (let i = 0; i < unaction.previousOrder.length && i < zoneContent.length; i++) {
                    cardsToRearrange[zoneContent[i].id] = zoneContent[i]
                }

                // Restore to the previous order
                const newZoneContent = [
                    ...unaction.previousOrder.map(id => cardsToRearrange[id]),
                    ...zoneContent.slice(unaction.previousOrder.length),
                ]

                state.getZone(unaction.zone, unaction.zoneOwner).cards = newZoneContent
                break
            }
            case UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                // Remove all continuous effects added after the captured length
                state.state.continuousEffects = state.state.continuousEffects.slice(0, unaction.previousLength)
                state.clearModifiedCardDataCache()
                break
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({ id, energy }) => {
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                    }
                    state.state.log.length--
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                unaction.magi.forEach(({ id, owner, energy }) => {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                    }
                    state.state.log.length--
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const source = inPlay.byId(unaction.sourceId)
                if (source) {
                    source.data.hasAttacked = unaction.sourceHasAttacked
                    source.data.attacked = unaction.sourceAttacked
                }
                let target;
                if (unaction.targetMagi) {
                    target = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.targetPlayer).card
                } else {
                    target = inPlay.byId(unaction.targetId);
                }
                if (target) {
                    target.data.wasAttacked = unaction.targetWasAttacked
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const source = inPlay.byId(unaction.sourceId)
                if (source) {
                    source.data.defeatedCreature = unaction.sourceDefeatedCreature
                } else {
                    // Sometimes the status changes after the card is moved to the discard (on the original action card)
                    unaction.source.data.defeatedCreature = unaction.sourceDefeatedCreature;
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
                state.state.log.length--
                break
            }
            case UNMAKE_EFFECT_TYPE_MOVE_ENERGY: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                let source
                if (unaction.sourceMagi) {
                    source = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.sourcePlayer).card
                } else {
                    source = inPlay.byId(unaction.sourceId);
                }
                if (source) {
                    source.data.energy = unaction.sourceEnergy
                    source.data.energyLostThisTurn = unaction.sourceEnergyLost
                }
                const target = inPlay.byId(unaction.targetId)
                if (target) {
                    target.data.energy = unaction.targetEnergy
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                const creature = inPlay.byId(unaction.creatureId)
                if (creature) {
                    creature.data.energy = unaction.energy
                    creature.data.energyLostThisTurn = unaction.energyLost
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI: {
                const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, unaction.owner)
                const magi = activeMagi.byId(unaction.magiId)
                if (magi) {
                    magi.data.energy = unaction.energy
                    magi.data.energyLostThisTurn = unaction.energyLost
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_PROMPT_ENTERED: {
                state.state.prompt = unaction.previousPrompt
                state.state.promptMessage = unaction.previousPromptMessage
                state.state.promptPlayer = unaction.previousPromptPlayer
                state.state.promptType = unaction.previousPromptType
                state.state.promptVariable = unaction.previousPromptVariable
                state.state.promptGeneratedBy = unaction.previousPromptGeneratedBy
                state.state.promptParams = unaction.previousPromptParams
                break
            }
            case UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS: {
                state.state.log.length--
                if (unaction.previousFoundCards === undefined) {
                    state.clearSpellMetaDataField('foundCards', unaction.spellId)
                } else {
                    // Restore to previous value
                    state.setSpellMetaDataField('foundCards', unaction.previousFoundCards, unaction.spellId)
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD: {
                const deck = state.getZone(ZONE_TYPE_DECK, unaction.player)
                const discard = state.getZone(ZONE_TYPE_DISCARD, unaction.player)
                // Restore deck to its previous state
                deck.cards = [...unaction.previousDeckCards]
                // Restore discard to its previous state
                discard.cards = [...unaction.previousDiscardCards]
                break
            }
            case UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER: {
                // Remove all delayed triggers added after the captured length
                state.state.delayedTriggers = state.state.delayedTriggers.slice(0, unaction.previousLength)
                break
            }
            case UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.energy = energy
                    }
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({ id, energy }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.energy = energy
                    }
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({ id, attacked }) => {
                    const creature = inPlay.byId(id)
                    if (creature) {
                        creature.data.attacked = attacked
                    }
                })
                break
            }
            case UNMAKE_SELECT: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy)
                } else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy)
                }
                break;
            }
            case UNMAKE_CALCULATION: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy)
                } else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy)
                }
                break;
            }
            case UNMAKE_PROPERTY: {
                if (unaction.wasEmpty) {
                    this.state.clearSpellMetaDataField(unaction.variable, unaction.generatedBy)
                } else {
                    this.state.setSpellMetaDataField(unaction.variable, unaction.previousValue, unaction.generatedBy)
                }
                break;
            }
        }
    }
}