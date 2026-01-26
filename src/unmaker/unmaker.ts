import CardInGame from '../classes/CardInGame';
import { ACTION_EFFECT, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_START_STEP, EFFECT_TYPE_START_TURN, State, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from '../index'
import { AnyEffectType } from '../types'
import { CardFlagsSnapshot, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_START_TURN, UnAction } from './types';
export class Unmaker {
    public unActions: UnAction[] = [];

    private historyStack: number[] = [];
    constructor(private state: State) {
        this.state.setOnAction(action => {
            const unAction = this.generateUnAction(action)
            if (unAction) {
                this.unActions.push(unAction)
            }
        })
    }

    public setCheckpoint() {
        this.historyStack.push(this.unActions.length)
    }

    public revertToCheckpoint(state: State) {
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
    }

    public generateUnAction(action: AnyEffectType): UnAction | undefined {
        switch (action.type) {
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        const creatures: CardInGame[]|CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        if (creatures instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                creatures: [{
                                    id: creatures.id,
                                    energy: creatures.data.energy,
                                }]
                            }

                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatures.map(creature => ({ id: creature.id, energy: creature.data.energy }))
                        }
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                        const magiTargets: CardInGame[]|CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        if (magiTargets instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                magi: [{
                                    id: magiTargets.id,
                                    owner: magiTargets.owner,
                                    energy: magiTargets.data.energy,
                                }]
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                            magi: magiTargets.map(magi => ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }))
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

                        return {
                            type: UNMAKE_EFFECT_TYPE_START_TURN,
                            previousTurn: this.state.turn,
                            previousActivePlayer: this.state.state.activePlayer,
                            previousStep: this.state.state.step,
                            previousContinuousEffects: [...this.state.state.continuousEffects],
                            cardFlags,
                        }
                    }
                    case EFFECT_TYPE_START_STEP: {
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

                        return {
                            type: UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
                            zone,
                            zoneOwner,
                            previousOrder,
                        }
                    }
                    case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
                        return {
                            type: UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
                            previousLength: this.state.state.continuousEffects.length,
                        }
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                        const creatures: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        if (creatures instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                creatures: [{
                                    id: creatures.id,
                                    energy: creatures.data.energy,
                                }]
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                            creatures: creatures.map(creature => ({ id: creature.id, energy: creature.data.energy }))
                        }
                    }
                    case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                        const magiTargets: CardInGame[] | CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        if (magiTargets instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                magi: [{
                                    id: magiTargets.id,
                                    owner: magiTargets.owner,
                                    energy: magiTargets.data.energy,
                                }]
                            }
                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                            magi: magiTargets.map(magi => ({ id: magi.id, owner: magi.owner, energy: magi.data.energy }))
                        }
                    }
                }
            }
        }
    }

    public applyUnAction(state: State, unaction: UnAction) {
        switch (unaction.type) {
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({id, energy}) => {
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                    }
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
                unaction.magi.forEach(({id, owner, energy}) => {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                    }
                    state.state.log.pop()
                })
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
                        const { [entry.field]: _, ...rest } = currentMeta
                        state.setSpellMetadata(rest, entry.spellId)
                    } else {
                        // Restore to previous value
                        state.setSpellMetadata({
                            ...currentMeta,
                            [entry.field]: entry.previousValue,
                        }, entry.spellId)
                    }
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_DIE_ROLLED: {
                const currentMeta = state.getSpellMetadata(unaction.spellId)
                if (unaction.previousRollResult === undefined) {
                    // Field didn't exist before, remove it
                    const { roll_result: _, ...rest } = currentMeta
                    state.setSpellMetadata(rest, unaction.spellId)
                } else {
                    // Restore to previous value
                    state.setSpellMetadata({
                        ...currentMeta,
                        roll_result: unaction.previousRollResult,
                    }, unaction.spellId)
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_START_TURN: {
                state.turn = unaction.previousTurn
                state.state = {
                    ...state.state,
                    activePlayer: unaction.previousActivePlayer,
                    step: unaction.previousStep,
                    continuousEffects: unaction.previousContinuousEffects,
                }

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
                state.state = {
                    ...state.state,
                    step: unaction.previousStep,
                }
                break
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
                state.state = {
                    ...state.state,
                    continuousEffects: state.state.continuousEffects.slice(0, unaction.previousLength),
                }
                break
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
                const inPlay = state.getZone(ZONE_TYPE_IN_PLAY)
                unaction.creatures.forEach(({id, energy}) => {
                    let creatureCard = inPlay.byId(id)
                    if (creatureCard) {
                        creatureCard.data.energy = energy
                    }
                    state.state.log.pop()
                })
                break
            }
            case UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
                unaction.magi.forEach(({id, owner, energy}) => {
                    const activeMagi = state.getZone(ZONE_TYPE_ACTIVE_MAGI, owner)
                    let magiCard = activeMagi.byId(id)
                    if (magiCard) {
                        magiCard.data.energy = energy
                    }
                    state.state.log.pop()
                })
                break
            }
        }
    }
}