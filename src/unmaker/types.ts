export const UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 1
// Restore value to a previous object (for example, `state.prompt` to false)
export const UNMAKE_RESTORE_VALUE = 2
// Remove element from the new location and restore one on previous location (moving card from hand back into the deck)
export const UNMAKE_MOVE_ELEMENT_BACK = 3
// Only remove the element (undo creating a continuous effect for example)
export const UNMAKE_REMOVE_ELEMENT = 4
export type UnAction = {
    type: number
    creatures: { id: string, energy: number }[]
}

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