import { State, StateShape } from "..";
import CardInGame from "../classes/CardInGame";
import { ACTION_SELECT, ACTION_EFFECT, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP, EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI, ACTION_ENTER_PROMPT, PROMPT_TYPE_CHOOSE_CARDS, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, NO_PRIORITY, PRIORITY_ATTACK, PRIORITY_CREATURES, PRIORITY_PRS } from "../const";
import { EffectType, AnyEffectType, SelectorTypeType } from "../types";
import { AttackOnlyEffect } from "../types/attack";
type FilterFromUnion<T, U> = T extends U ? T : never;
export type EffectsUnited = EffectType | AttackOnlyEffect;
export type ActionTransformer<T> = (this: State, action: FilterFromUnion<EffectsUnited, {
    effectType: T;
}>, transform: (...args: AnyEffectType[]) => void, state: StateShape) => void;
export type ActionHandlerMap = {
    [K in EffectsUnited['effectType']]: ActionTransformer<K>;
};
type ProtoSelectEffect = {
    type: typeof ACTION_SELECT;
    selector: SelectorTypeType;
    variable: string;
};
type ProtoEnergizeEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_ENERGIZE;
    target: string;
};
type ProtoBeforeDrawEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP;
};
type ProtoDrawEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP;
    numberOfCards: 2;
};
type ProtoMagiFlippedEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_MAGI_FLIPPED;
    target: CardInGame;
};
type ProtoAddStartingEnergyEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI;
    target: string;
};
export type ProtoChooseCardsPrompt = {
    type: typeof ACTION_ENTER_PROMPT;
    promptType: typeof PROMPT_TYPE_CHOOSE_CARDS;
    promptParams: {
        startingCards: string[];
        availableCards: string[];
    };
    variable?: string;
};
type ProtoFindStartingCardsEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_FIND_STARTING_CARDS;
    cards: string;
};
type ProtoDrawRestOfCardsEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_DRAW_REST_OF_CARDS;
    drawnCards: string;
};
export type ProtoEffectType = ProtoSelectEffect | ProtoEnergizeEffect | ProtoBeforeDrawEffect | ProtoDrawEffect | ProtoMagiFlippedEffect | ProtoAddStartingEnergyEffect | ProtoChooseCardsPrompt | ProtoFindStartingCardsEffect | ProtoDrawRestOfCardsEffect;
type PriorityType = typeof NO_PRIORITY | typeof PRIORITY_PRS | typeof PRIORITY_ATTACK | typeof PRIORITY_CREATURES;
export type StepType = {
    name: string;
    priority: PriorityType;
    automatic: boolean;
    effects?: ProtoEffectType[];
};
export {};
