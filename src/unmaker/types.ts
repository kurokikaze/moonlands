import CardInGame from '../classes/CardInGame';
import { PromptParamsType } from '../index';
import { ContinuousEffectType, PromptTypeType, ZoneType } from '../types';

export const UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 1
export const UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = 2
export const UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = 3
// Restore value to a previous object (for example, `state.prompt` to false)
export const UNMAKE_RESTORE_VALUE = 4
// Remove element from the new location and restore one on previous location (moving card from hand back into the deck)
export const UNMAKE_MOVE_ELEMENT_BACK = 5
// Only remove the element (undo creating a continuous effect for example)
export const UNMAKE_REMOVE_ELEMENT = 6
export const UNMAKE_EFFECT_TYPE_DIE_ROLLED = 7
export const UNMAKE_EFFECT_TYPE_START_TURN = 8
export const UNMAKE_EFFECT_TYPE_START_STEP = 9
export const UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE = 10
export const UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT = 11
export const UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 12
export const UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 13
export const UNMAKE_EFFECT_TYPE_START_OF_TURN = 14
export const UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE = 15
export const UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = 16
export const UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = 17
export const UNMAKE_EFFECT_TYPE_MOVE_ENERGY = 18
export const UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE = 19
export const UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI = 20
export const UNMAKE_EFFECT_TYPE_PROMPT_ENTERED = 21
export const UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS = 22
export const UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD = 23

export type SavedMetaDataValue = Record<string, Record<string, any>>

export type UnActionDiscardEnergyFromCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE
    creatures: { id: string, energy: number, energyLostThisTurn: number }[]
}

export type UnActionDiscardEnergyFromMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI
    magi: { id: string, owner: number, energy: number }[]
}

export type MetaDataEntry = {
    spellId: string
    field: string
    previousValue: any
}

export type UnActionMoveCardBetweenZones = {
    type: typeof UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES
    card: CardInGame
    sourceZone: ZoneType
    sourceZoneOwner: number
    destinationZone: ZoneType
    position: number
    bottom: boolean
    metaDataEntries: MetaDataEntry[]
}

export type UnActionDieRolled = {
    type: typeof UNMAKE_EFFECT_TYPE_DIE_ROLLED
    spellId: string
    previousRollResult: any
}

export type CardFlagsSnapshot = {
    id: string
    actionsUsed: string[]
    wasAttacked: boolean
    hasAttacked: boolean
    attacked: number
    defeatedCreature: boolean
    energyLostThisTurn: number
}

export type UnActionStartTurn = {
    type: typeof UNMAKE_EFFECT_TYPE_START_TURN
    previousTurn: number | null
    previousActivePlayer: number
    previousStep: number | null
    previousContinuousEffects: ContinuousEffectType[]
    // Card flags that get cleared by START_OF_TURN
    cardFlags: Record<string, CardFlagsSnapshot>
}

export type UnActionStartStep = {
    type: typeof UNMAKE_EFFECT_TYPE_START_STEP
    previousStep: number | null
}

export type UnActionRearrangeCardsOfZone = {
    type: typeof UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE
    zone: ZoneType
    zoneOwner: number | null
    previousOrder: string[]
}

export type UnActionCreateContinuousEffect = {
    type: typeof UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT
    previousLength: number
}

export type UnActionAddEnergyToCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE
    creatures: { id: string, energy: number }[]
}

export type UnActionAddEnergyToMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI
    magi: { id: string, owner: number, energy: number }[]
}

export type UnActionStartOfTurn = {
    type: typeof UNMAKE_EFFECT_TYPE_START_OF_TURN
    player: number
    // Card flags that get cleared by START_OF_TURN
    cardFlags: Record<string, CardFlagsSnapshot>
}

export type UnActionBeforeDamage = {
    type: typeof UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE
    sourceId: string
    sourceHasAttacked: boolean
    sourceAttacked: number
    targetId: string
    targetWasAttacked: boolean
}

export type UnActionCreatureDefeatsCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE
    sourceId: string
    sourceDefeatedCreature: boolean
}

export type UnActionDiscardCreatureFromPlay = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY
}

export type UnActionMoveEnergy = {
    type: typeof UNMAKE_EFFECT_TYPE_MOVE_ENERGY
    sourceId: string
    sourceEnergy: number
    sourceEnergyLost: number
    targetId: string
    targetEnergy: number
}

export type UnActionRemoveEnergyFromCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE
    creatureId: string
    energy: number
    energyLost: number
}

export type UnActionRemoveEnergyFromMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI
    magiId: string
    owner: number
    energy: number
    energyLost: number
}

export type UnActionPromptEntered = {
    type: typeof UNMAKE_EFFECT_TYPE_PROMPT_ENTERED
    previousPrompt: boolean
    previousPromptMessage: string | undefined
    previousPromptPlayer: number | undefined
    previousPromptType: PromptTypeType | null
    previousPromptVariable: string | undefined
    previousPromptGeneratedBy: string | undefined
    previousPromptParams: PromptParamsType
}

export type UnActionFindStartingCards = {
    type: typeof UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS
    spellId: string
    previousFoundCards: string[] | undefined
}

export type UnActionReshuffleDiscard = {
    type: typeof UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD
    player: number
    previousDeckCards: CardInGame[]
    previousDiscardCards: CardInGame[]
}

export type UnAction = UnActionDiscardEnergyFromCreature | UnActionDiscardEnergyFromMagi | UnActionMoveCardBetweenZones | UnActionDieRolled | UnActionStartTurn | UnActionStartStep | UnActionRearrangeCardsOfZone | UnActionCreateContinuousEffect | UnActionAddEnergyToCreature | UnActionAddEnergyToMagi | UnActionStartOfTurn | UnActionBeforeDamage | UnActionCreatureDefeatsCreature | UnActionDiscardCreatureFromPlay | UnActionMoveEnergy | UnActionRemoveEnergyFromCreature | UnActionRemoveEnergyFromMagi | UnActionPromptEntered | UnActionFindStartingCards | UnActionReshuffleDiscard

export type UnActionRestoreValue = {
    type: typeof UNMAKE_RESTORE_VALUE,
    path: string
    value: any
}

export type UnActionMoveElementBack = {
    type: typeof UNMAKE_MOVE_ELEMENT_BACK
    newPath: string
    newIndex: number
    oldPath: string
    oldIndex: number
    oldElement: any
}

export type UnActionRemoveElement = {
    type: typeof UNMAKE_REMOVE_ELEMENT
    path: string
    index: number
}